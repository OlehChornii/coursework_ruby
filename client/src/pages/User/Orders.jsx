// client/src/pages/User/Orders.jsx
import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ordersAPI.getUserOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      setError('Не вдалося завантажити замовлення. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString('uk-UA', {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  const getStatusInfo = (status) => {
    const s = (status || '').toLowerCase();
    
    if (s.includes('pending') || s.includes('очікує')) {
      return { 
        style: styles.badgePending, 
        icon: '⏳', 
        label: 'Очікується',
        color: '#F77F00'
      };
    }
    if (s.includes('processing') || s.includes('обробляється')) {
      return { 
        style: styles.badgeProcessing, 
        icon: '⚙️', 
        label: 'Обробляється',
        color: '#3498DB'
      };
    }
    if (s.includes('paid') || s.includes('оплачено')) {
      return { 
        style: styles.badgePaid, 
        icon: '✓', 
        label: 'Оплачено',
        color: '#06A77D'
      };
    }
    if (s.includes('shipped') || s.includes('відправ')) {
      return { 
        style: styles.badgeShipped, 
        icon: '🚚', 
        label: 'Відправлено',
        color: '#609966'
      };
    }
    if (s.includes('delivered') || s.includes('доставлено')) {
      return { 
        style: styles.badgeDelivered, 
        icon: '📦', 
        label: 'Доставлено',
        color: '#06A77D'
      };
    }
    if (s.includes('cancel') || s.includes('відмін')) {
      return { 
        style: styles.badgeCancel, 
        icon: '✗', 
        label: 'Скасовано',
        color: '#E63946'
      };
    }
    
    return { 
      style: styles.badgeNeutral, 
      icon: '•', 
      label: status || 'Невідомо',
      color: '#666'
    };
  };

  const getPaymentStatusInfo = (status) => {
    const s = (status || '').toLowerCase();
    
    if (s.includes('paid') || s.includes('оплачено')) {
      return { icon: '✓', color: '#06A77D', label: 'Оплачено' };
    }
    if (s.includes('pending') || s.includes('очікує')) {
      return { icon: '⏳', color: '#F77F00', label: 'Очікується' };
    }
    if (s.includes('failed') || s.includes('помилка')) {
      return { icon: '✗', color: '#E63946', label: 'Помилка' };
    }
    
    return { icon: '•', color: '#666', label: status || '—' };
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    const statusInfo = getStatusInfo(order.status);
    const paymentInfo = getPaymentStatusInfo(order.payment_status);
    
    if (filter === 'pending') {
      return statusInfo.label === 'Очікується' || paymentInfo.label === 'Очікується';
    }
    if (filter === 'paid') {
      return paymentInfo.label === 'Оплачено';
    }
    if (filter === 'cancelled') {
      return statusInfo.label === 'Скасовано';
    }
    
    return true;
  });

  const getFilterCounts = () => {
    const counts = {
      all: orders.length,
      pending: 0,
      paid: 0,
      cancelled: 0
    };

    orders.forEach(order => {
      const statusInfo = getStatusInfo(order.status);
      const paymentInfo = getPaymentStatusInfo(order.payment_status);
      
      if (statusInfo.label === 'Очікується' || paymentInfo.label === 'Очікується') {
        counts.pending++;
      }
      if (paymentInfo.label === 'Оплачено') {
        counts.paid++;
      }
      if (statusInfo.label === 'Скасовано') {
        counts.cancelled++;
      }
    });

    return counts;
  };

  const filterCounts = getFilterCounts();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Мої замовлення</h1>
          <p style={styles.subtitle}>
            {orders.length > 0 ? (
              <>
                <span style={styles.subtitleIcon}>📋</span>
                Всього замовлень: <strong>{orders.length}</strong>
              </>
            ) : (
              'Історія ваших покупок'
            )}
          </p>
        </div>

        <div style={styles.headerActions}>
          <button style={styles.backButton} onClick={() => navigate('/user/profile')}>
            <span style={styles.buttonIcon}>←</span> Профіль
          </button>
        </div>
      </div>

      {!loading && !error && orders.length > 0 && (
        <div style={styles.filterBar}>
          <button
            style={{
              ...styles.filterButton,
              ...(filter === 'all' ? styles.filterButtonActive : {})
            }}
            onClick={() => setFilter('all')}
          >
            Всі
            <span style={styles.filterCount}>{filterCounts.all}</span>
          </button>
          
          <button
            style={{
              ...styles.filterButton,
              ...(filter === 'pending' ? styles.filterButtonActive : {})
            }}
            onClick={() => setFilter('pending')}
          >
            <span style={styles.filterIcon}>⏳</span>
            Очікується
            {filterCounts.pending > 0 && (
              <span style={styles.filterCount}>{filterCounts.pending}</span>
            )}
          </button>
          
          <button
            style={{
              ...styles.filterButton,
              ...(filter === 'paid' ? styles.filterButtonActive : {})
            }}
            onClick={() => setFilter('paid')}
          >
            <span style={styles.filterIcon}>✓</span>
            Оплачені
            {filterCounts.paid > 0 && (
              <span style={styles.filterCount}>{filterCounts.paid}</span>
            )}
          </button>
          
          <button
            style={{
              ...styles.filterButton,
              ...(filter === 'cancelled' ? styles.filterButtonActive : {})
            }}
            onClick={() => setFilter('cancelled')}
          >
            <span style={styles.filterIcon}>✗</span>
            Скасовані
            {filterCounts.cancelled > 0 && (
              <span style={styles.filterCount}>{filterCounts.cancelled}</span>
            )}
          </button>
        </div>
      )}

      {loading ? (
        <div style={styles.loadingCard}>
          <div style={styles.spinner} aria-hidden />
          <div style={styles.loadingText}>Завантаження замовлень…</div>
        </div>
      ) : error ? (
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>
          <div style={styles.errorText}>{error}</div>
          <button style={styles.primaryButton} onClick={fetchOrders}>
            <span style={styles.buttonIcon}>↻</span>
            Спробувати знову
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>
            {filter === 'all' ? '🛒' : '🔍'}
          </div>
          <h3 style={styles.emptyTitle}>
            {filter === 'all' 
              ? 'У вас поки що немає замовлень' 
              : 'Замовлень не знайдено'}
          </h3>
          <p style={styles.emptyText}>
            {filter === 'all'
              ? 'Перегляньте каталог і додайте перший товар до кошика'
              : 'Спробуйте змінити фільтр або перегляньте всі замовлення'}
          </p>
          <div style={styles.emptyActions}>
            {filter === 'all' ? (
              <button style={styles.primaryButton} onClick={() => navigate('/')}>
                <span style={styles.buttonIcon}>🏪</span>
                До каталогу
              </button>
            ) : (
              <button style={styles.secondaryButton} onClick={() => setFilter('all')}>
                Показати всі замовлення
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={styles.list}>
          {filteredOrders.map(order => {
            const itemsCount = Array.isArray(order.items)
              ? order.items.length
              : Array.isArray(order.products)
                ? order.products.length
                : order.items_count || order.products_count || 0;

            const statusInfo = getStatusInfo(order.status);
            const paymentInfo = getPaymentStatusInfo(order.payment_status);

            return (
              <div 
                key={order.id} 
                style={styles.card}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div style={{
                  ...styles.statusBar,
                  backgroundColor: statusInfo.color
                }} />

                <div style={styles.cardContent}>
                  <div style={styles.cardLeft}>
                    <div style={styles.orderHeader}>
                      <div style={styles.orderNumber}>
                        <span style={styles.hashIcon}>#</span>
                        {order.id}
                      </div>
                      <div style={statusInfo.style}>
                        <span style={styles.badgeIcon}>{statusInfo.icon}</span>
                        {statusInfo.label}
                      </div>
                    </div>

                    <div style={styles.orderMeta}>
                      <div style={styles.metaItem}>
                        <span style={styles.metaIcon}>🕒</span>
                        <span style={styles.metaText}>{formatDate(order.created_at)}</span>
                      </div>

                      <div style={styles.metaItem}>
                        <span style={{
                          ...styles.paymentIcon,
                          color: paymentInfo.color
                        }}>
                          {paymentInfo.icon}
                        </span>
                        <span style={styles.metaText}>
                          <strong>{paymentInfo.label}</strong>
                        </span>
                      </div>

                      <div style={styles.metaItem}>
                        <span style={styles.metaIcon}>📦</span>
                        <span style={styles.metaText}>
                          {itemsCount} {itemsCount === 1 ? 'товар' : itemsCount < 5 ? 'товари' : 'товарів'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.cardRight}>
                    <div style={styles.priceSection}>
                      <div style={styles.priceLabel}>Сума</div>
                      <div style={styles.priceAmount}>
                        {Number(order.total_price || 0).toFixed(2)} ₴
                      </div>
                    </div>

                    <button
                      style={styles.detailsButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${order.id}`);
                      }}
                    >
                      <span>Деталі</span>
                      <span style={styles.arrowIcon}>→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && filteredOrders.length > 0 && filter !== 'all' && (
        <div style={styles.resultsInfo}>
          Показано {filteredOrders.length} з {orders.length} замовлень
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    color: '#23322F',
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
    flex: 1
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#23322F',
    margin: 0,
    marginBottom: '0.5rem'
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#666',
    fontSize: '0.95rem',
    margin: 0
  },
  subtitleIcon: {
    fontSize: '1.1rem'
  },
  headerActions: {
    display: 'flex',
    gap: '0.5rem'
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
  buttonIcon: {
    fontSize: '1.1rem'
  },

  filterBar: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    padding: '1rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0'
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    background: 'transparent',
    border: '2px solid transparent',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap'
  },
  filterButtonActive: {
    background: '#EDF1D6',
    color: '#23322F',
    borderColor: '#9DC08B'
  },
  filterIcon: {
    fontSize: '1rem'
  },
  filterCount: {
    background: '#609966',
    color: 'white',
    padding: '0.15rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '700',
    minWidth: '20px',
    textAlign: 'center'
  },

  loadingCard: {
    background: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #F0F0F0',
    borderTop: '4px solid #609966',
    borderRadius: '50%',
    margin: '0 auto 1rem',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#666',
    fontSize: '1rem'
  },

  errorCard: {
    background: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center'
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  errorText: {
    color: '#E63946',
    fontSize: '1rem',
    marginBottom: '1.5rem',
    lineHeight: '1.6'
  },

  emptyCard: {
    background: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: 0.6
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#23322F',
    margin: '0 0 0.75rem 0'
  },
  emptyText: {
    color: '#666',
    fontSize: '1rem',
    lineHeight: '1.6',
    maxWidth: '500px',
    margin: '0 auto 1.5rem'
  },
  emptyActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  statusBar: {
    height: '4px',
    width: '100%',
    opacity: 0.8
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  cardLeft: {
    flex: '1 1 400px',
    minWidth: 0
  },
  cardRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.75rem',
    minWidth: '180px'
  },

  orderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.75rem',
    flexWrap: 'wrap'
  },
  orderNumber: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#23322F'
  },
  hashIcon: {
    color: '#9DC08B',
    marginRight: '0.25rem'
  },

  badgeNeutral: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    background: '#F0F0F0',
    color: '#666',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  badgePending: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    background: '#FFF3CD',
    color: '#856404',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  badgeProcessing: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    background: '#D1ECF1',
    color: '#0C5460',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  badgePaid: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    background: '#D4EDDA',
    color: '#155724',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  badgeShipped: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    background: '#EDF1D6',
    color: '#23322F',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  badgeDelivered: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    background: '#D4EDDA',
    color: '#155724',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  badgeCancel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    background: '#F8D7DA',
    color: '#721C24',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  badgeIcon: {
    fontSize: '0.95rem'
  },

  orderMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    color: '#666',
    fontSize: '0.9rem'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  metaIcon: {
    fontSize: '1rem'
  },
  metaText: {
    lineHeight: '1.4'
  },
  paymentIcon: {
    fontSize: '1.1rem',
    fontWeight: '700'
  },

  priceSection: {
    textAlign: 'right'
  },
  priceLabel: {
    fontSize: '0.8rem',
    color: '#999',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600'
  },
  priceAmount: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#609966'
  },

  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#609966',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(96,153,102,0.3)'
  },
  secondaryButton: {
    display: 'inline-flex',
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
    transition: 'all 0.2s ease'
  },
  detailsButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#23322F',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(35,50,47,0.2)'
  },
  arrowIcon: {
    fontSize: '1.1rem',
    transition: 'transform 0.2s ease'
  },

  resultsInfo: {
    textAlign: 'center',
    color: '#999',
    fontSize: '0.9rem',
    marginTop: '1.5rem',
    padding: '1rem',
    background: 'white',
    borderRadius: '8px',
    border: '1px dashed #E2E3E5'
  }
};

export default Orders;