// client/src/pages/Payment/PaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentsAPI } from '../../services/api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyPayment = async () => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('Невірний ідентифікатор сесії');
      setLoading(false);
      return;
    }

    try {
      const response = await paymentsAPI.verifySession(sessionId);
      setOrderData(response.data.order);
      localStorage.removeItem('cart');
    } catch (err) {
      console.error('Payment verification error:', err);
      setError('Помилка перевірки платежу');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={successStyles.container}>
        <div style={successStyles.loadingCard}>
          <div style={successStyles.spinner}></div>
          <h2 style={successStyles.loadingTitle}>Перевірка платежу...</h2>
          <p style={successStyles.loadingText}>Будь ласка, зачекайте</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={successStyles.container}>
        <div style={successStyles.errorCard}>
          <div style={successStyles.errorIcon}>❌</div>
          <h1 style={successStyles.errorTitle}>Помилка</h1>
          <p style={successStyles.errorText}>{error}</p>
          <button onClick={() => navigate('/')} style={successStyles.primaryButton}>
            <span style={successStyles.btnIcon}>🏠</span>
            На головну
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={successStyles.container}>
      <div style={successStyles.successCard}>
        <div style={successStyles.successAnimation}>
          <div style={successStyles.checkmarkCircle}>
            <div style={successStyles.checkmark}>✓</div>
          </div>
        </div>

        <h1 style={successStyles.title}>Оплата успішна!</h1>
        <p style={successStyles.subtitle}>Дякуємо за ваше замовлення</p>

        {orderData && (
          <div style={successStyles.orderCard}>
            <div style={successStyles.orderHeader}>
              <span style={successStyles.orderIcon}>📋</span>
              <h3 style={successStyles.orderTitle}>Деталі замовлення</h3>
            </div>
            <div style={successStyles.orderBody}>
              <div style={successStyles.orderRow}>
                <span style={successStyles.orderLabel}>Номер замовлення</span>
                <strong style={successStyles.orderValue}>#{orderData.id}</strong>
              </div>
              <div style={successStyles.orderRow}>
                <span style={successStyles.orderLabel}>Сума</span>
                <strong style={successStyles.orderValuePrice}>
                  {parseFloat(orderData.total_price).toFixed(2)} ₴
                </strong>
              </div>
              {orderData.shipping_address && (
                <div style={successStyles.orderRow}>
                  <span style={successStyles.orderLabel}>Адреса доставки</span>
                  <span style={successStyles.orderAddress}>
                    {orderData.shipping_address}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={successStyles.stepsCard}>
          <div style={successStyles.stepsHeader}>
            <span style={successStyles.stepsIcon}>📌</span>
            <h3 style={successStyles.stepsTitle}>Що далі?</h3>
          </div>
          <div style={successStyles.stepsList}>
            <div style={successStyles.stepItem}>
              <span style={successStyles.stepIcon}>📧</span>
              <span style={successStyles.stepText}>
                Ви отримаєте підтвердження на email
              </span>
            </div>
            <div style={successStyles.stepItem}>
              <span style={successStyles.stepIcon}>📞</span>
              <span style={successStyles.stepText}>
                Ми зв'яжемося з вами для узгодження доставки
              </span>
            </div>
            <div style={successStyles.stepItem}>
              <span style={successStyles.stepIcon}>📄</span>
              <span style={successStyles.stepText}>
                Підготуємо всі необхідні документи
              </span>
            </div>
          </div>
        </div>

        <div style={successStyles.actions}>
          <button 
            onClick={() => navigate('/user/orders')} 
            style={successStyles.primaryButton}
          >
            <span style={successStyles.btnIcon}>📦</span>
            Переглянути замовлення
          </button>
          <button 
            onClick={() => navigate('/')} 
            style={successStyles.secondaryButton}
          >
            <span style={successStyles.btnIcon}>🏠</span>
            На головну
          </button>
        </div>
      </div>
    </div>
  );
};

const successStyles = {
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
  errorCard: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    maxWidth: '500px',
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
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '2rem'
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
  orderCard: {
    background: '#F8F9FA',
    border: '2px solid #E9ECEF',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    textAlign: 'left'
  },
  orderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #E0E0E0'
  },
  orderIcon: {
    fontSize: '1.5rem'
  },
  orderTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#23322F',
    margin: 0
  },
  orderBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  orderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem'
  },
  orderLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500'
  },
  orderValue: {
    fontSize: '1rem',
    color: '#23322F',
    fontWeight: '700'
  },
  orderValuePrice: {
    fontSize: '1.25rem',
    color: '#609966',
    fontWeight: '800'
  },
  orderAddress: {
    fontSize: '0.9rem',
    color: '#23322F',
    textAlign: 'right',
    maxWidth: '60%'
  },
  stepsCard: {
    background: '#E3F2FD',
    border: '2px solid #90CAF9',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    textAlign: 'left'
  },
  stepsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  stepsIcon: {
    fontSize: '1.5rem'
  },
  stepsTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1565C0',
    margin: 0
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  stepItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  },
  stepIcon: {
    fontSize: '1.3rem',
    flexShrink: 0
  },
  stepText: {
    fontSize: '0.95rem',
    color: '#1976D2',
    lineHeight: '1.5'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
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
    display: 'inline-flex',
    alignItems: 'center',
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
  btnIcon: {
    fontSize: '1.2rem'
  }
};

export default PaymentSuccess;
