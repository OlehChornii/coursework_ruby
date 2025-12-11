// client/src/pages/Payment/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  };

  const removeFromCart = (id) => {
    setRemovingId(id);
    
    setTimeout(() => {
      const updatedCart = cart.filter(item => item.id !== id);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setRemovingId(null);
    }, 300);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price || 0), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Кошик порожній');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>🛒</div>
          <h2 style={styles.emptyTitle}>Ваш кошик порожній</h2>
          <p style={styles.emptyText}>
            Додайте улюбленців до кошика, щоб продовжити процес всиновлення
          </p>
          <button onClick={() => navigate('/')} style={styles.shopButton}>
            <span style={styles.btnIcon}>🏪</span>
            Перейти до каталогу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>
            <span style={styles.titleIcon}>🛒</span>
            Кошик
          </h1>
          <p style={styles.subtitle}>
            {cart.length} {cart.length === 1 ? 'товар' : cart.length < 5 ? 'товари' : 'товарів'} у кошику
          </p>
        </div>
        <button onClick={() => navigate('/')} style={styles.continueButton}>
          <span style={styles.btnIcon}>←</span>
          Продовжити покупки
        </button>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.itemsSection}>
          <div style={styles.itemsHeader}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>📦</span>
              Товари
            </h2>
            <div style={styles.itemsCount}>
              {cart.length} {cart.length === 1 ? 'позиція' : cart.length < 5 ? 'позиції' : 'позицій'}
            </div>
          </div>

          <div style={styles.itemsList}>
            {cart.map((item, index) => (
              <div 
                key={item.id} 
                style={{
                  ...styles.itemCard,
                  ...(removingId === item.id ? styles.itemCardRemoving : {}),
                  animationDelay: `${index * 0.1}s`
                }}
                className="item-card"
              >
                <div style={styles.itemImageWrapper}>
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      style={styles.itemImage} 
                    />
                  ) : (
                    <div style={styles.imagePlaceholder}>
                      <span style={styles.placeholderIcon}>🐾</span>
                    </div>
                  )}
                </div>

                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  
                  {item.breed && (
                    <div style={styles.itemMeta}>
                      <span style={styles.metaIcon}>🏷️</span>
                      <span style={styles.metaText}>{item.breed}</span>
                    </div>
                  )}
                  
                  {item.age_months && (
                    <div style={styles.itemMeta}>
                      <span style={styles.metaIcon}>🎂</span>
                      <span style={styles.metaText}>{item.age_months} міс.</span>
                    </div>
                  )}
                </div>

                <div style={styles.itemActions}>
                  <div style={styles.priceSection}>
                    <div style={styles.priceLabel}>Ціна</div>
                    <div style={styles.priceValue}>
                      {parseFloat(item.price).toFixed(2)} ₴
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={styles.removeButton}
                    disabled={removingId === item.id}
                  >
                    <span style={styles.removeIcon}>🗑️</span>
                    <span>Видалити</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.summarySection}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryHeader}>
              <h2 style={styles.summaryTitle}>
                <span style={styles.summaryIcon}>📋</span>
                Підсумок
              </h2>
            </div>

            <div style={styles.summaryBody}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Товарів</span>
                <span style={styles.summaryValueSecondary}>{cart.length}</span>
              </div>

              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Підсумок</span>
                <span style={styles.summaryValueSecondary}>
                  {getTotalPrice().toFixed(2)} ₴
                </span>
              </div>

              <div style={styles.summaryDivider}></div>

              <div style={styles.summaryTotal}>
                <span style={styles.totalLabel}>Разом</span>
                <span style={styles.totalValue}>
                  {getTotalPrice().toFixed(2)} ₴
                </span>
              </div>

              <button onClick={handleCheckout} style={styles.checkoutButton}>
                <span style={styles.checkoutIcon}>✓</span>
                Оформити замовлення
              </button>

              <div style={styles.infoBox}>
                <span style={styles.infoIcon}>ℹ️</span>
                <span style={styles.infoText}>
                  Підтвердивши замовлення, ви розпочнете процес всиновлення
                </span>
              </div>
            </div>
          </div>

          <div style={styles.securityBadge}>
            <span style={styles.securityIcon}>🔒</span>
            <div style={styles.securityText}>
              <div style={styles.securityTitle}>Безпечна оплата</div>
              <div style={styles.securitySubtitle}>Ваші дані захищені</div>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  headerLeft: {
    flex: 1,
    minWidth: '250px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#23322F',
    margin: 0,
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  titleIcon: {
    fontSize: '2rem'
  },
  subtitle: {
    color: '#666',
    fontSize: '0.95rem',
    margin: 0
  },
  continueButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'white',
    color: '#23322F',
    border: '2px solid #E2E3E5',
    padding: '0.7rem 1.4rem',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  btnIcon: {
    fontSize: '1.1rem'
  },

  emptyCard: {
    background: 'white',
    padding: '4rem 2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
    opacity: 0.5
  },
  emptyTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#23322F',
    margin: '0 0 0.75rem 0'
  },
  emptyText: {
    color: '#666',
    fontSize: '1rem',
    lineHeight: '1.6',
    maxWidth: '500px',
    margin: '0 auto 2rem'
  },
  shopButton: {
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
    boxShadow: '0 2px 6px rgba(96,153,102,0.3)'
  },

  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
    alignItems: 'start'
  },

  itemsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  itemsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#23322F',
    margin: 0
  },
  sectionIcon: {
    fontSize: '1.5rem'
  },
  itemsCount: {
    background: '#EDF1D6',
    color: '#23322F',
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },

  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  itemCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1.5rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    transition: 'all 0.3s ease',
    animation: 'slideIn 0.4s ease forwards',
  },
  itemCardRemoving: {
    opacity: 0,
    transform: 'translateX(-20px)',
    pointerEvents: 'none'
  },

  itemImageWrapper: {
    width: '120px',
    height: '120px',
    flexShrink: 0,
    borderRadius: '10px',
    overflow: 'hidden'
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    background: '#EDF1D6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderIcon: {
    fontSize: '3rem',
    opacity: 0.5
  },

  itemInfo: {
    flex: 1,
    minWidth: 0
  },
  itemName: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#23322F',
    margin: '0 0 0.75rem 0'
  },
  itemMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
    color: '#666',
    fontSize: '0.9rem'
  },
  metaIcon: {
    fontSize: '1rem'
  },
  metaText: {
    fontWeight: '500'
  },

  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '1rem',
    minWidth: '140px'
  },
  priceSection: {
    textAlign: 'right'
  },
  priceLabel: {
    fontSize: '0.75rem',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
    marginBottom: '0.25rem'
  },
  priceValue: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#609966'
  },
  removeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    background: 'white',
    color: '#E63946',
    border: '2px solid #E63946',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  removeIcon: {
    fontSize: '1rem'
  },

  summarySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
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
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #F5F5F5'
  },
  summaryLabel: {
    fontSize: '0.95rem',
    color: '#666',
    fontWeight: '500'
  },
  summaryValueSecondary: {
    fontSize: '0.95rem',
    color: '#23322F',
    fontWeight: '600'
  },
  summaryDivider: {
    height: '2px',
    background: '#E0E0E0',
    margin: '1rem 0'
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    marginBottom: '1.5rem'
  },
  totalLabel: {
    fontSize: '1.1rem',
    color: '#23322F',
    fontWeight: '700'
  },
  totalValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#609966'
  },

  checkoutButton: {
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
    boxShadow: '0 4px 12px rgba(96,153,102,0.3)',
    marginBottom: '1rem'
  },
  checkoutIcon: {
    fontSize: '1.3rem'
  },

  infoBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem',
    background: '#F8F9FA',
    borderRadius: '8px',
    border: '1px solid #E9ECEF'
  },
  infoIcon: {
    fontSize: '1.2rem',
    flexShrink: 0
  },
  infoText: {
    fontSize: '0.85rem',
    color: '#666',
    lineHeight: '1.5'
  },

  securityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.25rem',
    background: 'white',
    borderRadius: '10px',
    border: '1px solid #F0F0F0',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
  },
  securityIcon: {
    fontSize: '2rem'
  },
  securityText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem'
  },
  securityTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#23322F'
  },
  securitySubtitle: {
    fontSize: '0.8rem',
    color: '#999'
  }
};

export default Cart;