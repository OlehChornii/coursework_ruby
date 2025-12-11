// client/src/pages/Payment/CheckoutCancel.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutCancel = () => {
  const navigate = useNavigate();

  const handleClearCart = () => {
    localStorage.removeItem('cart');
    navigate('/');
  };

  return (
    <div style={checkoutCancelStyles.container}>
      <div style={checkoutCancelStyles.card}>
        <div style={checkoutCancelStyles.iconWrapper}>
          <div style={checkoutCancelStyles.icon}>🔙</div>
        </div>
        
        <h1 style={checkoutCancelStyles.title}>Оплату скасовано</h1>
        <p style={checkoutCancelStyles.subtitle}>
          Ви повернулися зі сторінки оплати
        </p>

        <div style={checkoutCancelStyles.infoBox}>
          <div style={checkoutCancelStyles.infoIcon}>💡</div>
          <div style={checkoutCancelStyles.infoContent}>
            <p style={checkoutCancelStyles.infoText}>
              Не хвилюйтеся! Ваші товари безпечно збережені в кошику. 
              Ви можете продовжити покупки або повернутися до оформлення замовлення пізніше.
            </p>
          </div>
        </div>

        <div style={checkoutCancelStyles.actions}>
          <button 
            onClick={() => navigate('/cart')} 
            style={checkoutCancelStyles.primaryButton}
          >
            <span style={checkoutCancelStyles.btnIcon}>🛒</span>
            Перейти до кошика
          </button>
          <button 
            onClick={() => navigate('/')} 
            style={checkoutCancelStyles.secondaryButton}
          >
            <span style={checkoutCancelStyles.btnIcon}>🏠</span>
            Продовжити покупки
          </button>
          <button 
            onClick={handleClearCart} 
            style={checkoutCancelStyles.dangerButton}
          >
            <span style={checkoutCancelStyles.btnIcon}>🗑️</span>
            Очистити кошик
          </button>
        </div>
      </div>
    </div>
  );
};

const checkoutCancelStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: 'linear-gradient(135deg, #F5F7FA 0%, #E9ECEF 100%)'
  },
  card: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center'
  },
  iconWrapper: {
    marginBottom: '1.5rem'
  },
  icon: {
    fontSize: '5rem',
    animation: 'bounce 0.6s ease'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#23322F',
    margin: '0 0 0.5rem 0'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '2rem'
  },
  infoBox: {
    display: 'flex',
    gap: '1rem',
    background: '#E3F2FD',
    border: '2px solid #90CAF9',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    textAlign: 'left'
  },
  infoIcon: {
    fontSize: '2rem',
    flexShrink: 0
  },
  infoContent: {
    flex: 1
  },
  infoText: {
    fontSize: '0.95rem',
    color: '#1976D2',
    lineHeight: '1.6',
    margin: 0
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
  dangerButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'transparent',
    color: '#E63946',
    border: '2px solid transparent',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  btnIcon: {
    fontSize: '1.2rem'
  }
};

export default CheckoutCancel;