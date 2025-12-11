// client/src/pages/Others/OtherDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petsAPI } from '../../services/api';

const formatAge = (months) => {
  if (months == null) return 'Невідомо';
  const yrs = Math.floor(months / 12);
  const m = months % 12;
  if (yrs === 0) return `${m} міс.`;
  if (m === 0) return `${yrs} р.`;
  return `${yrs} р. ${m} міс.`;
};

const Toast = ({ text, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={styles.toast} role="status" aria-live="polite">
      {text}
    </div>
  );
};

const OtherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await petsAPI.getById(id);
        setPet(response.data);
      } catch (error) {
        console.error('Error fetching pet:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  useEffect(() => {
    if (!pet) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setInCart(cart.some(item => item.id === pet.id));
  }, [pet]);

  const showToast = (msg) => setToast(msg);

  const addToCart = () => {
    if (!pet) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === pet.id);

    if (!existingItem) {
      cart.push({
        id: pet.id,
        name: pet.name,
        price: pet.price,
        image_url: pet.image_url || (pet.images && pet.images[0]) || '',
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      setInCart(true);
      showToast('✅ Додано до кошика');
    } else {
      setInCart(true);
      showToast('ℹ️ Товар вже в кошику');
    }
  };

  const handlePrimary = () => {
    if (inCart) navigate('/cart');
    else addToCart();
  };

  if (loading) return <div style={styles.loading}>Завантаження...</div>;
  if (!pet) return <div style={styles.loading}>Тварину не знайдено</div>;

  const gallery = (pet.images && pet.images.length) ? pet.images : (pet.image_urls && pet.image_urls.length) ? pet.image_urls : (pet.image_url ? [pet.image_url] : []);
  const mainImage = gallery[galleryIndex] || null;

  const showShelter = !!pet.is_for_adoption;
  const sourceId = showShelter ? pet.shelter_id : pet.breeder_id;
  const sourceName = showShelter ? pet.shelter_name : pet.business_name;
  const sourceLabel = showShelter ? 'Притулок' : 'Розвідник';
  const sourceNavigate = () => {
    if (!sourceId) return;
    navigate(showShelter ? `/shelters/${sourceId}` : `/breeders/${sourceId}`);
  };

  return (
    <div style={styles.pageWrap}>
      <style>{`
        @media (max-width: 880px) {
          .od-card { flex-direction: column; padding: 1.2rem; }
          .od-image { height: 320px; }
          .od-info { padding: 1rem; }
          .od-title { font-size: 1.8rem; }
        }
      `}</style>

      <button aria-label="Назад" onClick={() => navigate(-1)} style={styles.back}>
        ← Назад
      </button>

      <div className="od-card" style={styles.card}>
        <div className="od-image" style={styles.imageColumn}>
          {mainImage ? (
            <div style={styles.imageWrapper}>
              <img src={mainImage} alt={pet.name} style={styles.mainImage} />
              {gallery.length > 1 && (
                <div style={styles.thumbRow} role="list">
                  {gallery.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryIndex(idx)}
                      aria-label={`Вибрати зображення ${idx + 1}`}
                      style={{
                        ...styles.thumb,
                        boxShadow: idx === galleryIndex ? '0 6px 18px rgba(96,153,102,0.35)' : '0 3px 10px rgba(0,0,0,0.08)',
                        transform: idx === galleryIndex ? 'scale(1.03)' : 'scale(1)',
                        borderColor: idx === galleryIndex ? '#609966' : 'transparent',
                      }}
                    >
                      <img src={src} alt={`${pet.name} ${idx + 1}`} style={styles.thumbImg} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={styles.placeholder}>🐾</div>
          )}
        </div>

        <div className="od-info" style={{ ...styles.infoColumn, minHeight: 420 }}>
          <div style={styles.headerRow}>
            <h1 className="od-title" style={styles.title}>{pet.name}</h1>
            <div style={styles.priceWrap}>
              {pet.is_for_adoption ? (
                <div style={styles.adoptionPill}>💙 Всиновлення</div>
              ) : (
                <div style={styles.pricePill}>
                  <span style={styles.priceNumber}>{pet.price ?? '—'}</span>
                  <span style={styles.priceCurrency}> грн</span>
                </div>
              )}
            </div>
          </div>

          <div style={styles.badgesRow}>
            <span style={styles.statusBadge}>{pet.status === 'available' ? 'Доступний' : 'Зарезервовано'}</span>
            {pet.gender && <span style={styles.infoBadge}>{pet.gender === 'male' ? 'Самець ♂' : 'Самка ♀'}</span>}
            {pet.breed && <span style={styles.infoBadge}>{pet.breed}</span>}
            <span style={styles.ageBadge}>{formatAge(pet.age_months)}</span>
          </div>

          <div
            style={{
              ...styles.cardSmall,
              cursor: sourceId ? 'pointer' : 'default',
            }}
            onClick={() => { if (sourceId) sourceNavigate(); }}
            role={sourceId ? 'button' : undefined}
            tabIndex={sourceId ? 0 : undefined}
            onKeyDown={(e) => { if (sourceId && (e.key === 'Enter' || e.key === ' ')) sourceNavigate(); }}
            aria-label={sourceId ? `${sourceLabel}: ${sourceName}` : `${sourceLabel} не вказано`}
          >
            <div style={styles.row}>
              <div style={styles.metaLabel}>{sourceLabel}</div>
              <div style={{ ...styles.metaValue, color: sourceId ? '#2E6C3E' : '#000' }}>
                {sourceName || '—'}
              </div>
            </div>
          </div>

          <div style={{ ...styles.desc, flex: 1 }}>
            <h3 style={styles.descTitle}>Опис</h3>
            <p style={styles.descText}>{pet.description || 'Опис відсутній.'}</p>
          </div>

          <div style={styles.actions}>
            {pet.status === 'available' && !pet.is_for_adoption && (
              <button
                onClick={handlePrimary}
                style={{
                  ...styles.primaryBtn,
                  background: inCart
                    ? 'linear-gradient(180deg,#4C8F53,#3E7A42)'
                    : 'linear-gradient(180deg,#5BA36A,#4F8F56)'
                }}
                aria-label={inCart ? 'Перейти до кошику' : 'Додати до кошика'}
              >
                {inCart ? 'Перейти до кошику' : '🛒 Додати до кошика'}
              </button>
            )}

            {pet.is_for_adoption && (
              <button onClick={() => navigate(`/adopt/${pet.id}`)} style={styles.ghostBtn} aria-label="Подати заявку на всиновлення">
                💙 Подати заявку
              </button>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast text={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

const styles = {
  pageWrap: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '28px 18px',
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    color: '#233226',
  },
  back: {
    background: 'linear-gradient(180deg,#F3F7F0,#EAF0E3)',
    border: '1px solid rgba(64,81,59,0.08)',
    padding: '8px 12px',
    borderRadius: 10,
    cursor: 'pointer',
    marginBottom: 18,
    fontWeight: 600,
    boxShadow: '0 2px 6px rgba(64,81,59,0.06)',
  },

  card: {
    display: 'flex',
    gap: 22,
    background: 'linear-gradient(180deg, #FFFFFF, #FBFDF8)',
    borderRadius: 18,
    padding: 22,
    boxShadow: '0 18px 40px rgba(15, 23, 12, 0.08)',
    alignItems: 'flex-start',
  },

  imageColumn: {
    flex: '0 0 48%',
    minWidth: 320,
  },
  imageWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    background: '#f6f8f3',
  },
  mainImage: {
    display: 'block',
    width: '100%',
    height: 420,
    objectFit: 'cover',
  },
  placeholder: {
    height: 420,
    borderRadius: 14,
    backgroundColor: '#EDF1D6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '6.5rem',
    border: '2px dashed #CFE0BD',
  },

  thumbRow: {
    display: 'flex',
    gap: 10,
    padding: 12,
    background: 'rgba(246,248,241,0.8)',
    justifyContent: 'center',
  },
  thumb: {
    width: 64,
    height: 48,
    padding: 3,
    borderRadius: 8,
    cursor: 'pointer',
    border: '2px solid transparent',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
    background: '#fff',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 6,
  },

  infoColumn: {
    flex: '1 1 52%',
    padding: '6px 2px',
    display: 'flex',
    flexDirection: 'column',
  },

  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'start',
  },

  title: {
    fontSize: 28,
    margin: 0,
    fontWeight: 800,
    color: '#213325',
  },

  priceWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  pricePill: {
    background: 'linear-gradient(180deg,#EAF6EC,#DFF0E1)',
    borderRadius: 12,
    padding: '8px 12px',
    fontWeight: 800,
    color: '#2F5D38',
    display: 'flex',
    alignItems: 'baseline',
    boxShadow: '0 6px 18px rgba(96,153,102,0.08)',
  },
  priceNumber: { fontSize: 20 },
  priceCurrency: { fontSize: 12, marginLeft: 6 },

  adoptionPill: {
    background: 'linear-gradient(180deg,#F6FBFF,#EAF6FF)',
    padding: '8px 12px',
    borderRadius: 12,
    fontWeight: 800,
    color: '#2F6A8A',
  },

  badgesRow: {
    display: 'flex',
    gap: 10,
    marginTop: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  statusBadge: {
    backgroundColor: '#609966',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 13,
  },

  infoBadge: {
    background: 'rgba(96,153,102,0.08)',
    padding: '6px 10px',
    borderRadius: 10,
    color: '#40513B',
    fontWeight: 600,
    fontSize: 13,
  },

  ageBadge: {
    background: 'rgba(64,81,59,0.06)',
    padding: '6px 10px',
    borderRadius: 10,
    color: '#40513B',
    fontWeight: 600,
    fontSize: 13,
  },

  cardSmall: {
    marginTop: 14,
    background: '#fff',
    borderRadius: 12,
    padding: 12,
    border: '1px solid rgba(96,153,102,0.06)',
    boxShadow: '0 6px 18px rgba(20,30,18,0.02)',
  },

  row: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', alignItems: 'center' },
  metaLabel: { color: '#6B7A64', fontSize: 13 },
  metaValue: { fontWeight: 700 },

  desc: { marginTop: 16, lineHeight: 1.5 },
  descTitle: { margin: '0 0 8px 0', fontSize: 16 },
  descText: { margin: 0, color: '#3E4B3B' },

  actions: { display: 'flex', gap: 12, marginTop: 18 },

  primaryBtn: {
    flex: '1 1 auto',
    background: 'linear-gradient(180deg,#5BA36A,#4F8F56)',
    color: '#fff',
    border: 'none',
    padding: '18px 24px',
    borderRadius: 12,
    fontWeight: 800,
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 12px 28px rgba(79,143,86,0.18)',
    transition: 'transform 0.14s ease',
  },

  ghostBtn: {
    flex: '1 1 auto',
    background: 'transparent',
    border: '2px solid #9DC08B',
    padding: '18px 24px',
    borderRadius: 12,
    fontWeight: 800,
    fontSize: '1.1rem',
    color: '#40513B',
    cursor: 'pointer',
    transition: 'transform 0.14s ease',
  },

  toast: {
    position: 'fixed',
    right: 22,
    bottom: 22,
    background: 'linear-gradient(180deg,#FFFFFF,#F3FFF4)',
    padding: '12px 16px',
    borderRadius: 12,
    boxShadow: '0 14px 36px rgba(20,30,18,0.12)',
    fontWeight: 700,
  },

  loading: { textAlign: 'center', padding: 40, fontSize: 18 },
};

export default OtherDetail;