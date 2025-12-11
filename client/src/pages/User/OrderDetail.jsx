// client/src/pages/User/OrderDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI, paymentsAPI } from '../../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [receipt, setReceipt] = useState({ loading: false, url: null, message: null });

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ordersAPI.getById(id);
      setOrder(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch order', err);
      setError('Не вдалося завантажити замовлення. Перевірте ідентифікатор або спробуйте пізніше.');
      setLoading(false);
    }
  };

  const fetchReceipt = async () => {
    if (!order?.id) return;
    setReceipt({ loading: true, url: null, message: null });
    try {
      const r = await paymentsAPI.getReceipt(order.id);
      if (r.data?.receipt_url) {
        setReceipt({ loading: false, url: r.data.receipt_url, message: null });
      } else {
        setReceipt({ loading: false, url: null, message: r.data?.message || 'Чек ще не доступний' });
      }
    } catch (err) {
      console.warn('Receipt fetch error', err);
      setReceipt({ loading: false, url: null, message: 'Не вдалося отримати чек' });
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'pending': { bg: '#FFF3CD', text: '#856404', label: 'Очікується' },
      'processing': { bg: '#D1ECF1', text: '#0C5460', label: 'Обробляється' },
      'shipped': { bg: '#D4EDDA', text: '#155724', label: 'Відправлено' },
      'delivered': { bg: '#D4EDDA', text: '#155724', label: 'Доставлено' },
      'cancelled': { bg: '#F8D7DA', text: '#721C24', label: 'Скасовано' }
    };
    return statusMap[status?.toLowerCase()] || { bg: '#E2E3E5', text: '#383D41', label: status };
  };

  const getPaymentStatusColor = (status) => {
    const statusMap = {
      'paid': { bg: '#D4EDDA', text: '#155724', icon: '✓', label: 'Оплачено' },
      'pending': { bg: '#FFF3CD', text: '#856404', icon: '⏳', label: 'Очікується' },
      'failed': { bg: '#F8D7DA', text: '#721C24', icon: '✗', label: 'Помилка' },
      'refunded': { bg: '#D1ECF1', text: '#0C5460', icon: '↩', label: 'Повернено' }
    };
    return statusMap[status?.toLowerCase()] || { bg: '#E2E3E5', text: '#383D41', icon: '•', label: status };
  };

  const renderItems = (items) => {
    if (!items || items.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📦</div>
          <em>Немає товарів</em>
        </div>
      );
    }
    return items.map((it, idx) => (
      <div key={it.pet_id || idx} style={styles.itemRow}>
        <div style={styles.itemLeft}>
          <div style={styles.itemNumber}>{idx + 1}</div>
          <div style={styles.itemInfo}>
            <div style={styles.itemName}>{it.pet_name || `Тварина #${it.pet_id}`}</div>
            <div style={styles.itemMeta}>
              {it.pet_category && <span style={styles.metaBadge}>{it.pet_category}</span>}
              {it.pet_breed && <span style={styles.itemBreed}>{it.pet_breed}</span>}
            </div>
          </div>
        </div>
        <div style={styles.itemPrice}>{Number(it.price).toFixed(2)} ₴</div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Завантаження замовлення…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>
          <div style={styles.errorText}>{error}</div>
          <button style={styles.primaryButton} onClick={() => navigate('/user/orders')}>
            ← Повернутися до списку замовлень
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusColor(order.status);
  const paymentInfo = getPaymentStatusColor(order.payment_status);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Замовлення #{order.id}</h1>
          <div style={styles.timestamp}>
            <span style={styles.timestampIcon}>🕒</span>
            {new Date(order.created_at).toLocaleString('uk-UA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        <button style={styles.backButton} onClick={() => navigate('/user/orders')}>
          <span style={styles.backIcon}>←</span> Назад
        </button>
      </div>

      <div style={styles.statusGrid}>
        <div style={styles.statusCard}>
          <div style={styles.statusLabel}>Статус замовлення</div>
          <div style={{
            ...styles.statusBadge,
            backgroundColor: statusInfo.bg,
            color: statusInfo.text
          }}>
            {statusInfo.label}
          </div>
        </div>

        <div style={styles.statusCard}>
          <div style={styles.statusLabel}>Статус оплати</div>
          <div style={{
            ...styles.statusBadge,
            backgroundColor: paymentInfo.bg,
            color: paymentInfo.text
          }}>
            <span style={styles.paymentIcon}>{paymentInfo.icon}</span>
            {paymentInfo.label}
          </div>
        </div>

        <div style={styles.statusCard}>
          <div style={styles.statusLabel}>Загальна сума</div>
          <div style={styles.totalPrice}>{Number(order.total_price).toFixed(2)} ₴</div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>
            <span style={styles.cardIcon}>📦</span>
            Товари
          </h2>
          <div style={styles.itemCount}>
            {Array.isArray(order.items) ? order.items.length : 0} {order.items?.length === 1 ? 'товар' : 'товарів'}
          </div>
        </div>
        <div style={styles.itemsList}>
          {renderItems(order.items || [])}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>
            <span style={styles.cardIcon}>📍</span>
            Адреса доставки
          </h2>
        </div>
        <div style={styles.addressContent}>
          {order.shipping_address ? (
            <p style={styles.addressText}>{order.shipping_address}</p>
          ) : (
            <p style={styles.noAddress}>Адреса не вказана</p>
          )}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>
            <span style={styles.cardIcon}>🧾</span>
            Фіскальний чек
          </h2>
        </div>
        <div style={styles.receiptContent}>
          <div style={styles.receiptActions}>
            <button
              style={{
                ...styles.receiptButton,
                ...(receipt.loading && styles.receiptButtonLoading)
              }}
              onClick={() => fetchReceipt()}
              disabled={receipt.loading}
            >
              {receipt.loading ? (
                <>
                  <span style={styles.buttonSpinner}></span>
                  Завантаження…
                </>
              ) : (
                <>
                  <span style={styles.buttonIcon}>📄</span>
                  Отримати чек
                </>
              )}
            </button>

            {receipt.message && (
              <div style={styles.receiptMessage}>
                <span style={styles.infoIcon}>ℹ️</span>
                {receipt.message}
              </div>
            )}
          </div>

          {receipt.url && (
            <div style={styles.receiptPreview}>
              <a 
                href={receipt.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.receiptLink}
              >
                <span style={styles.linkIcon}>🔗</span>
                Відкрити чек у новій вкладці
              </a>

              <div style={styles.iframeWrapper}>
                <iframe
                  src={receipt.url}
                  title="receipt"
                  style={styles.iframe}
                />
              </div>
            </div>
          )}
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
  timestamp: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#666',
    fontSize: '0.95rem'
  },
  timestampIcon: {
    fontSize: '1.1rem'
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
  
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statusCard: {
    background: 'white',
    padding: '1.25rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0'
  },
  statusLabel: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '0.75rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.95rem',
    fontWeight: '600'
  },
  paymentIcon: {
    fontSize: '1rem'
  },
  totalPrice: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#609966',
    marginTop: '0.25rem'
  },
  
  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    marginBottom: '1.5rem',
    overflow: 'hidden'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderBottom: '2px solid #F5F5F5'
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#23322F',
    margin: 0
  },
  cardIcon: {
    fontSize: '1.5rem'
  },
  itemCount: {
    background: '#EDF1D6',
    color: '#23322F',
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  
  itemsList: {
    padding: '0.5rem 0'
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #F7F7F7',
    transition: 'background 0.2s ease'
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1
  },
  itemNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#EDF1D6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: '#23322F',
    fontSize: '0.9rem',
    flexShrink: 0
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontWeight: '600',
    fontSize: '1rem',
    color: '#23322F',
    marginBottom: '0.35rem'
  },
  itemMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  metaBadge: {
    background: '#F0F0F0',
    color: '#666',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '500'
  },
  itemBreed: {
    color: '#666',
    fontSize: '0.85rem'
  },
  itemPrice: {
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#609966',
    flexShrink: 0,
    marginLeft: '1rem'
  },
  
  addressContent: {
    padding: '1.25rem 1.5rem'
  },
  addressText: {
    fontSize: '1rem',
    color: '#23322F',
    lineHeight: '1.6',
    margin: 0
  },
  noAddress: {
    color: '#999',
    fontStyle: 'italic',
    margin: 0
  },
  
  receiptContent: {
    padding: '1.25rem 1.5rem'
  },
  receiptActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  receiptButton: {
    display: 'flex',
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
  receiptButtonLoading: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  buttonIcon: {
    fontSize: '1.1rem'
  },
  buttonSpinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.8s linear infinite'
  },
  receiptMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#666',
    fontSize: '0.9rem',
    background: '#F8F9FA',
    padding: '0.6rem 1rem',
    borderRadius: '8px'
  },
  infoIcon: {
    fontSize: '1rem'
  },
  receiptPreview: {
    marginTop: '1.5rem'
  },
  receiptLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#609966',
    fontSize: '0.95rem',
    fontWeight: '600',
    textDecoration: 'none',
    padding: '0.5rem 0',
    transition: 'opacity 0.2s ease'
  },
  linkIcon: {
    fontSize: '1rem'
  },
  iframeWrapper: {
    marginTop: '1rem',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '2px solid #F0F0F0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  iframe: {
    width: '100%',
    height: '600px',
    border: 'none',
    display: 'block'
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
    fontSize: '1rem',
    margin: 0
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
  primaryButton: {
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
  
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#999'
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
    opacity: 0.5
  }
};

export default OrderDetail;