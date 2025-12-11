// client/src/pages/Payment/PaymentCancel.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div style={cancelStyles.container}>
      <div style={cancelStyles.card}>
        <div style={cancelStyles.iconWrapper}>
          <div style={cancelStyles.icon}>⚠️</div>
        </div>
        
        <h1 style={cancelStyles.title}>Оплату скасовано</h1>
        <p style={cancelStyles.subtitle}>
          Ви скасували процес оплати
        </p>

        <div style={cancelStyles.infoBox}>
          <div style={cancelStyles.infoHeader}>
            <span style={cancelStyles.infoIcon}>ℹ️</span>
            <strong style={cancelStyles.infoTitle}>Що сталося?</strong>
          </div>
          <p style={cancelStyles.infoText}>
            Оплата була перервана або скасована. Жодні кошти не були списані з вашої картки. 
            Ваше замовлення не було створено, але товари залишилися в кошику.
          </p>
        </div>

        <div style={cancelStyles.actions}>
          <button 
            onClick={() => navigate('/checkout')} 
            style={cancelStyles.primaryButton}
          >
            <span style={cancelStyles.btnIcon}>↻</span>
            Спробувати знову
          </button>
          <button 
            onClick={() => navigate('/cart')} 
            style={cancelStyles.secondaryButton}
          >
            <span style={cancelStyles.btnIcon}>🛒</span>
            До кошика
          </button>
          <button 
            onClick={() => navigate('/')} 
            style={cancelStyles.linkButton}
          >
            На головну →
          </button>
        </div>
      </div>
    </div>
  );
};

const cancelStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: 'linear-gradient(135deg, #FFE5E5 0%, #FFF0E6 100%)'
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
    animation: 'shake 0.5s ease'
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
    background: '#FFF3CD',
    border: '2px solid #FFCA28',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    textAlign: 'left'
  },
  infoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  },
  infoIcon: {
    fontSize: '1.5rem'
  },
  infoTitle: {
    fontSize: '1rem',
    color: '#856404'
  },
  infoText: {
    fontSize: '0.95rem',
    color: '#856404',
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

export default PaymentCancel;