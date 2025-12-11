// client/src/pages/Payment/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_address: '',
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      navigate('/cart');
      return;
    }
    setCart(savedCart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Будь ласка, увійдіть в акаунт');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const items = cart.map(item => ({
        pet_id: item.id,
        name: item.name,
        price: item.price,
        description: `${item.category} - ${item.breed}`,
      }));

      const response = await paymentsAPI.createSession({
        items,
        shipping_address: formData.shipping_address,
      });

      window.location.href = response.data.url;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Помилка при створенні платежу. Спробуйте ще раз.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/cart')} style={styles.backButton}>
          <span style={styles.backIcon}>←</span>
          Назад до кошика
        </button>
      </div>

      <div style={styles.progressBar}>
        <div style={styles.step}>
          <div style={{...styles.stepCircle, ...styles.stepCompleted}}>
            <span style={styles.stepIcon}>✓</span>
          </div>
          <span style={styles.stepLabel}>Кошик</span>
        </div>
        <div style={styles.stepLine}></div>
        <div style={styles.step}>
          <div style={{...styles.stepCircle, ...styles.stepActive}}>
            <span style={styles.stepNumber}>2</span>
          </div>
          <span style={styles.stepLabel}>Оформлення</span>
        </div>
        <div style={{...styles.stepLine, ...styles.stepLineInactive}}></div>
        <div style={styles.step}>
          <div style={styles.stepCircle}>
            <span style={styles.stepNumber}>3</span>
          </div>
          <span style={styles.stepLabel}>Оплата</span>
        </div>
      </div>

      <h1 style={styles.title}>
        <span style={styles.titleIcon}>📋</span>
        Оформлення замовлення
      </h1>

      <div style={styles.contentGrid}>
        <div style={styles.formSection}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  <span style={styles.cardIcon}>📍</span>
                  Адреса доставки
                </h2>
              </div>
              <div style={styles.cardBody}>
                <textarea
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({ shipping_address: e.target.value })}
                  placeholder="Введіть повну адресу доставки...

Приклад:
м. Київ, вул. Хрещатик, буд. 1, кв. 10"
                  style={styles.textarea}
                  rows="5"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  <span style={styles.cardIcon}>💳</span>
                  Спосіб оплати
                </h2>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.paymentMethod}>
                  <div style={styles.stripeCard}>
                    <div style={styles.stripeLogo}>
                      <div style={styles.stripeIcon}>Stripe</div>
                    </div>
                    <div style={styles.stripeInfo}>
                      <div style={styles.stripeTitle}>Оплата карткою</div>
                      <div style={styles.stripeSubtitle}>
                        Visa, Mastercard, American Express
                      </div>
                    </div>
                    <div style={styles.stripeCheck}>✓</div>
                  </div>
                </div>

                <div style={styles.securityFeatures}>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>🔒</span>
                    <span style={styles.featureText}>256-bit SSL шифрування</span>
                  </div>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>✓</span>
                    <span style={styles.featureText}>PCI DSS сертифіковано</span>
                  </div>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>⚡</span>
                    <span style={styles.featureText}>Миттєве підтвердження</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.infoAlert}>
              <div style={styles.alertIcon}>ℹ️</div>
              <div style={styles.alertContent}>
                <div style={styles.alertTitle}>Що далі?</div>
                <ul style={styles.alertList}>
                  <li>Після натискання кнопки ви будете перенаправлені на безпечну сторінку оплати Stripe</li>
                  <li>Введіть дані вашої картки та підтвердіть платіж</li>
                  <li>Після успішної оплати ви отримаєте підтвердження на email</li>
                </ul>
              </div>
            </div>

            <button 
              type="submit" 
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonLoading : {})
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={styles.buttonSpinner}></span>
                  Обробка...
                </>
              ) : (
                <>
                  <span style={styles.buttonIcon}>→</span>
                  Перейти до оплати
                </>
              )}
            </button>
          </form>
        </div>

        <div style={styles.summarySection}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryHeader}>
              <h2 style={styles.summaryTitle}>
                <span style={styles.summaryIcon}>🛒</span>
                Ваше замовлення
              </h2>
            </div>

            <div style={styles.summaryBody}>
              <div style={styles.itemsList}>
                {cart.map((item, index) => (
                  <div key={item.id} style={styles.summaryItem}>
                    <div style={styles.itemLeft}>
                      <div style={styles.itemNumber}>{index + 1}</div>
                      <div style={styles.itemDetails}>
                        <div style={styles.itemName}>{item.name}</div>
                        <div style={styles.itemMeta}>
                          {item.category} • {item.breed}
                        </div>
                      </div>
                    </div>
                    <div style={styles.itemPrice}>
                      {parseFloat(item.price).toFixed(2)} ₴
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.totalsSection}>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Підсумок</span>
                  <span style={styles.totalValue}>
                    {getTotalPrice().toFixed(2)} ₴
                  </span>
                </div>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Доставка</span>
                  <span style={styles.totalValueFree}>Безкоштовно</span>
                </div>

                <div style={styles.totalDivider}></div>

                <div style={styles.totalRowFinal}>
                  <span style={styles.totalLabelFinal}>Всього до оплати</span>
                  <span style={styles.totalValueFinal}>
                    {getTotalPrice().toFixed(2)} ₴
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.trustSection}>
            <div style={styles.trustBadge}>
              <span style={styles.trustIcon}>🔒</span>
              <div style={styles.trustText}>
                <div style={styles.trustTitle}>100% захищені платежі</div>
                <div style={styles.trustSubtitle}>SSL сертифікат</div>
              </div>
            </div>
            
            <div style={styles.trustBadge}>
              <span style={styles.trustIcon}>↩</span>
              <div style={styles.trustText}>
                <div style={styles.trustTitle}>Легке повернення</div>
                <div style={styles.trustSubtitle}>14 днів гарантія</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    color: '#23322F'
  },

  header: {
    marginBottom: '1.5rem'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'white',
    color: '#23322F',
    border: '2px solid #E2E3E5',
    padding: '0.65rem 1.25rem',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  backIcon: {
    fontSize: '1.2rem'
  },

  progressBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
    padding: '1.5rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0'
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  stepCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#F0F0F0',
    color: '#999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease'
  },
  stepCompleted: {
    background: '#06A77D',
    color: 'white'
  },
  stepActive: {
    background: '#609966',
    color: 'white',
    boxShadow: '0 0 0 4px rgba(96,153,102,0.2)'
  },
  stepIcon: {
    fontSize: '1.3rem'
  },
  stepNumber: {
    fontSize: '1.1rem'
  },
  stepLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#666'
  },
  stepLine: {
    width: '80px',
    height: '3px',
    background: '#06A77D',
    margin: '0 1rem'
  },
  stepLineInactive: {
    background: '#E0E0E0'
  },

  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#23322F',
    margin: '0 0 2rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  titleIcon: {
    fontSize: '2rem'
  },

  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
    alignItems: 'start'
  },

  formSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },

  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    overflow: 'hidden'
  },
  cardHeader: {
    padding: '1.25rem 1.5rem',
    borderBottom: '2px solid #F5F5F5'
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#23322F',
    margin: 0
  },
  cardIcon: {
    fontSize: '1.3rem'
  },
  cardBody: {
    padding: '1.5rem'
  },

  textarea: {
    width: '100%',
    padding: '1rem',
    border: '2px solid #E2E3E5',
    borderRadius: '8px',
    fontSize: '0.95rem',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.6',
    transition: 'border-color 0.2s ease'
  },

  paymentMethod: {
    marginBottom: '1.5rem'
  },
  stripeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem',
    background: '#F8F9FA',
    border: '2px solid #609966',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  stripeLogo: {
    width: '48px',
    height: '48px',
    background: '#635BFF',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  stripeIcon: {
    color: 'white',
    fontWeight: '700',
    fontSize: '0.75rem'
  },
  stripeInfo: {
    flex: 1
  },
  stripeTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#23322F',
    marginBottom: '0.25rem'
  },
  stripeSubtitle: {
    fontSize: '0.85rem',
    color: '#666'
  },
  stripeCheck: {
    width: '32px',
    height: '32px',
    background: '#609966',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: '700',
    flexShrink: 0
  },

  securityFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem',
    color: '#666'
  },
  featureIcon: {
    fontSize: '1.1rem'
  },
  featureText: {
    fontWeight: '500'
  },

  infoAlert: {
    display: 'flex',
    gap: '1rem',
    padding: '1.25rem',
    background: '#E3F2FD',
    border: '2px solid #90CAF9',
    borderRadius: '10px'
  },
  alertIcon: {
    fontSize: '1.5rem',
    flexShrink: 0
  },
  alertContent: {
    flex: 1
  },
  alertTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: '0.5rem'
  },
  alertList: {
    margin: 0,
    paddingLeft: '1.25rem',
    fontSize: '0.85rem',
    color: '#1976D2',
    lineHeight: '1.6'
  },

  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '1.25rem',
    background: '#609966',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(96,153,102,0.3)'
  },
  submitButtonLoading: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  buttonIcon: {
    fontSize: '1.3rem'
  },
  buttonSpinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },

  summarySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    position: 'sticky',
    top: '2rem'
  },
  summaryCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    border: '1px solid #F0F0F0',
    overflow: 'hidden'
  },
  summaryHeader: {
    padding: '1.25rem 1.5rem',
    borderBottom: '2px solid #F5F5F5'
  },
  summaryTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#23322F',
    margin: 0
  },
  summaryIcon: {
    fontSize: '1.3rem'
  },
  summaryBody: {
    padding: '1.5rem'
  },

  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1rem',
    background: '#F8F9FA',
    borderRadius: '8px',
    gap: '1rem'
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    flex: 1
  },
  itemNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    background: '#609966',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: '700',
    flexShrink: 0
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#23322F',
    marginBottom: '0.25rem'
  },
  itemMeta: {
    fontSize: '0.8rem',
    color: '#666'
  },
  itemPrice: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#609966',
    flexShrink: 0
  },

  totalsSection: {
    paddingTop: '1rem',
    borderTop: '2px solid #E0E0E0'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0'
  },
  totalLabel: {
    fontSize: '0.95rem',
    color: '#666',
    fontWeight: '500'
  },
  totalValue: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#23322F'
  },
  totalValueFree: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#06A77D'
  },
  totalDivider: {
    height: '2px',
    background: '#E0E0E0',
    margin: '1rem 0'
  },
  totalRowFinal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0'
  },
  totalLabelFinal: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#23322F'
  },
  totalValueFinal: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#609966'
  },

  trustSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  trustBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'white',
    border: '1px solid #F0F0F0',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
  },
  trustIcon: {
    fontSize: '2rem',
    flexShrink: 0
  },
  trustText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem'
  },
  trustTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#23322F'
  },
  trustSubtitle: {
    fontSize: '0.8rem',
    color: '#999'
  }
};

export default Checkout;