// client/src/pages/Payment/CheckoutSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../../services/api';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [orderId, setOrderId] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [checkingReceipt, setCheckingReceipt] = useState(false);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        const res = await paymentsAPI.verifySession(sessionId);
        const paymentStatus = res.data?.paymentStatus || res.data?.order?.payment_status;
        const fetchedOrder = res.data?.order || res.data;
        const id = fetchedOrder?.id || res.data?.orderId || res.data?.order?.id;
        
        if (id) setOrderId(id);
        
        if (paymentStatus === 'paid') {
          localStorage.removeItem('cart');
          setStatus('success');
          if (id) fetchReceipt(id);
        } else {
          setStatus('failed');
        }
      } catch (err) {
        console.error('Verification error', err);
        setStatus('error');
      }
    };

    const fetchReceipt = async (id) => {
      try {
        setCheckingReceipt(true);
        const r = await paymentsAPI.getReceipt(id);
        if (r.data?.receipt_url) {
          setReceiptUrl(r.data.receipt_url);
        }
      } catch (err) {
        console.warn('Receipt fetch failed', err);
      } finally {
        setCheckingReceipt(false);
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleRetryReceipt = async () => {
    if (!orderId) return;
    setCheckingReceipt(true);
    try {
      const r = await paymentsAPI.getReceipt(orderId);
      if (r.data?.receipt_url) {
        setReceiptUrl(r.data.receipt_url);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setCheckingReceipt(false);
    }
  };

  if (status === 'verifying') {
    return (
      <div style={checkoutSuccessStyles.container}>
        <div style={checkoutSuccessStyles.loadingCard}>
          <div style={checkoutSuccessStyles.spinner}></div>
          <h2 style={checkoutSuccessStyles.loadingTitle}>Перевірка платежу...</h2>
          <p style={checkoutSuccessStyles.loadingText}>Будь ласка, зачекайте</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={checkoutSuccessStyles.container}>
        <div style={checkoutSuccessStyles.successCard}>
          <div style={checkoutSuccessStyles.successAnimation}>
            <div style={checkoutSuccessStyles.checkmarkCircle}>
              <div style={checkoutSuccessStyles.checkmark}>✓</div>
            </div>
          </div>

          <h1 style={checkoutSuccessStyles.title}>Оплата успішна!</h1>
          <p style={checkoutSuccessStyles.subtitle}>
            Ваше замовлення підтверджено. Кошик очищено.
          </p>

          <div style={checkoutSuccessStyles.receiptCard}>
            <div style={checkoutSuccessStyles.receiptHeader}>
              <span style={checkoutSuccessStyles.receiptIcon}>🧾</span>
              <h3 style={checkoutSuccessStyles.receiptTitle}>Фіскальний чек</h3>
            </div>

            {checkingReceipt ? (
              <div style={checkoutSuccessStyles.receiptLoading}>
                <div style={checkoutSuccessStyles.smallSpinner}></div>
                <span>Перевіряємо чек...</span>
              </div>
            ) : receiptUrl ? (
              <div style={checkoutSuccessStyles.receiptAvailable}>
                <div style={checkoutSuccessStyles.receiptSuccess}>✓ Чек доступний</div>
                <a 
                  href={receiptUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={checkoutSuccessStyles.receiptLink}
                >
                  <span style={checkoutSuccessStyles.linkIcon}>🔗</span>
                  Відкрити чек у новій вкладці
                </a>
              </div>
            ) : (
              <div style={checkoutSuccessStyles.receiptPending}>
                <p style={checkoutSuccessStyles.receiptText}>
                  Чек ще не доступний. Він з'явиться протягом кількох хвилин.
                </p>
                <button 
                  onClick={handleRetryReceipt}
                  style={checkoutSuccessStyles.retryButton}
                  disabled={checkingReceipt}
                >
                  <span style={checkoutSuccessStyles.btnIcon}>↻</span>
                  Перевірити ще раз
                </button>
              </div>
            )}
          </div>

          <div style={checkoutSuccessStyles.actions}>
            <button 
              onClick={() => navigate('/user/orders')} 
              style={checkoutSuccessStyles.primaryButton}
            >
              <span style={checkoutSuccessStyles.btnIcon}>📦</span>
              Переглянути замовлення
            </button>
            <button 
              onClick={() => navigate('/')} 
              style={checkoutSuccessStyles.secondaryButton}
            >
              <span style={checkoutSuccessStyles.btnIcon}>🏠</span>
              На головну
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div style={checkoutSuccessStyles.container}>
        <div style={checkoutSuccessStyles.failedCard}>
          <div style={checkoutSuccessStyles.failedIcon}>⏳</div>
          <h1 style={checkoutSuccessStyles.failedTitle}>Платіж не підтверджено</h1>
          <p style={checkoutSuccessStyles.failedText}>
            Можливо, платіж ще обробляється. Спробуйте оновити сторінку через кілька секунд 
            або перевірте розділ «Мої замовлення».
          </p>
          <div style={checkoutSuccessStyles.actions}>
            <button 
              onClick={() => window.location.reload()}
              style={checkoutSuccessStyles.primaryButton}
            >
              <span style={checkoutSuccessStyles.btnIcon}>↻</span>
              Перевірити ще раз
            </button>
            <button 
              onClick={() => navigate('/user/orders')}
              style={checkoutSuccessStyles.secondaryButton}
            >
              <span style={checkoutSuccessStyles.btnIcon}>📦</span>
              Мої замовлення
            </button>
            <button 
              onClick={() => navigate('/')}
              style={checkoutSuccessStyles.linkButton}
            >
              На головну →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={checkoutSuccessStyles.container}>
      <div style={checkoutSuccessStyles.errorCard}>
        <div style={checkoutSuccessStyles.errorIcon}>❌</div>
        <h1 style={checkoutSuccessStyles.errorTitle}>Сталася помилка</h1>
        <p style={checkoutSuccessStyles.errorText}>
          Не вдалося перевірити платіж. Якщо гроші списані — напишіть у підтримку 
          або перевірте вашу пошту.
        </p>
        <div style={checkoutSuccessStyles.supportBox}>
          <span style={checkoutSuccessStyles.supportIcon}>📧</span>
          <div style={checkoutSuccessStyles.supportText}>
            <strong>Потрібна допомога?</strong>
            <p>Зв'яжіться з нашою підтримкою: support@example.com</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/')}
          style={checkoutSuccessStyles.primaryButton}
        >
          <span style={checkoutSuccessStyles.btnIcon}>🏠</span>
          Повернутися на головну
        </button>
      </div>
    </div>
  );
};

const checkoutSuccessStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: 'linear-gradient(135deg, #EDF1D6 0%, #9DC08B 100%)'
  },
  loadingCard: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center'
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '5px solid #F0F0F0',
    borderTop: '5px solid #609966',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1.5rem'
  },
  smallSpinner: {
    width: '24px',
    height: '24px',
    border: '3px solid #F0F0F0',
    borderTop: '3px solid #609966',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#23322F',
    margin: '0 0 0.5rem 0'
  },
  loadingText: {
    color: '#666',
    margin: 0
  },
  successCard: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    maxWidth: '650px',
    width: '100%',
    textAlign: 'center'
  },
  successAnimation: {
    marginBottom: '2rem'
  },
  checkmarkCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #06A77D 0%, #9DC08B 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    animation: 'scaleIn 0.5s ease',
    boxShadow: '0 4px 20px rgba(6,167,125,0.3)'
  },
  checkmark: {
    color: 'white',
    fontSize: '3.5rem',
    fontWeight: '700',
    animation: 'fadeIn 0.6s ease 0.3s forwards',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '700',
    color: '#23322F',
    margin: '0 0 0.5rem 0'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '2rem'
  },
  receiptCard: {
    background: '#F8F9FA',
    border: '2px solid #E9ECEF',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    textAlign: 'left'
  },
  receiptHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #E0E0E0'
  },
  receiptIcon: {
    fontSize: '1.5rem'
  },
  receiptTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#23322F',
    margin: 0
  },
  receiptLoading: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: '#E3F2FD',
    borderRadius: '8px',
    color: '#1976D2'
  },
  receiptAvailable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  receiptSuccess: {
    color: '#06A77D',
    fontWeight: '600',
    fontSize: '0.95rem'
  },
  receiptLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#609966',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    padding: '0.75rem 1.25rem',
    background: '#EDF1D6',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  },
  linkIcon: {
    fontSize: '1.1rem'
  },
  receiptPending: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  receiptText: {
    fontSize: '0.95rem',
    color: '#666',
    margin: 0
  },
  retryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    background: 'white',
    color: '#609966',
    border: '2px solid #609966',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    alignSelf: 'flex-start'
  },
  failedCard: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center'
  },
  failedIcon: {
    fontSize: '5rem',
    marginBottom: '1rem',
    animation: 'pulse 2s ease infinite'
  },
  failedTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#F77F00',
    margin: '0 0 1rem 0'
  },
  failedText: {
    fontSize: '1.05rem',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '2rem'
  },
  errorCard: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center'
  },
  errorIcon: {
    fontSize: '5rem',
    marginBottom: '1rem'
  },
  errorTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#E63946',
    margin: '0 0 1rem 0'
  },
  errorText: {
    fontSize: '1.05rem',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '2rem'
  },
  supportBox: {
    display: 'flex',
    gap: '1rem',
    background: '#FFF3CD',
    border: '2px solid #FFCA28',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    textAlign: 'left'
  },
  supportIcon: {
    fontSize: '2rem',
    flexShrink: 0
  },
  supportText: {
    flex: 1
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'stretch'
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    background: '#609966',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(96,153,102,0.3)'
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    background: 'white',
    color: '#609966',
    border: '2px solid #609966',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#609966',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0.5rem',
    textDecoration: 'underline'
  },
  btnIcon: {
    fontSize: '1.2rem'
  }
};

export default CheckoutSuccess;