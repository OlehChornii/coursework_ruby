// client/src/pages/Adopt/BreederDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { breedersAPI, petsAPI } from '../../services/api';
import PetCard from '../../components/PetCard';

const BreederDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [breeder, setBreeder] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petsLoading, setPetsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchBreeder();
    fetchBreederPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBreeder = async () => {
    try {
      const response = await breedersAPI.getById(id);
      setBreeder(response.data);
    } catch (error) {
      console.error('Error fetching breeder:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBreederPets = async () => {
    try {
      const response = await petsAPI.getAll({ breeder_id: id });

      const payload = response && response.data;
      if (Array.isArray(payload)) {
        setPets(payload);
      } else if (payload && Array.isArray(payload.pets)) {
        setPets(payload.pets);
      } else if (payload && Array.isArray(payload.data)) {
        setPets(payload.data);
      } else if (payload && payload.results && Array.isArray(payload.results)) {
        setPets(payload.results);
      } else {
        console.warn('Unexpected pets API response shape:', payload);
        setPets([]);
      }
    } catch (error) {
      console.error('Error fetching breeder pets:', error);
      setPets([]);
    } finally {
      setPetsLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinnerWrapper}>
          <div style={styles.spinner}></div>
          <div style={styles.spinnerInner}></div>
        </div>
        <p style={styles.loadingText}>Завантаження інформації про розвідника...</p>
      </div>
    );
  }

  if (!breeder) {
    return (
      <div style={styles.notFoundContainer}>
        <div style={styles.notFoundContent}>
          <div style={styles.notFoundIcon}>🏢</div>
          <h2 style={styles.notFoundTitle}>Розвідника не знайдено</h2>
          <p style={styles.notFoundMessage}>
            На жаль, ми не змогли знайти розвідника, якого ви шукаєте
          </p>
          <button onClick={() => navigate('/breeders')} style={styles.backButton}>
            ← Повернутися до списку розвідників
          </button>
        </div>
      </div>
    );
  }

  const petsArray = Array.isArray(pets) ? pets : [];
  const breederImageSrc = "/images/breeder-placeholder.jpg";

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButtonTop}>
        ← Назад
      </button>

      <div style={styles.hero}>
        <div style={styles.heroBackground}></div>
        
        <div style={styles.heroContent}>
          <div style={styles.avatarContainer}>
            {breederImageSrc && !imageError ? (
              <img
                src={breederImageSrc}
                alt={breeder.business_name}
                style={styles.avatar}
                onError={() => setImageError(true)}
              />
            ) : (
              <div style={styles.avatarPlaceholder}>
                <span style={styles.avatarIcon}>🏢</span>
              </div>
            )}
            {breeder.license_verified && (
              <div style={styles.verifiedBadge}>
                ✓ Верифікований
              </div>
            )}
          </div>

          <div style={styles.headerInfo}>
            <div style={styles.titleRow}>
              <h1 style={styles.title}>{breeder.business_name}</h1>
              {breeder.license_verified && (
                <div style={styles.verifiedChip}>
                  <span style={styles.checkIcon}>✓</span>
                  Ліцензований
                </div>
              )}
            </div>
            
            <p style={styles.subtitle}>
              {breeder.description?.slice(0, 180) || 'Професійний розвідник породистих тварин'}
              {breeder.description && breeder.description.length > 180 && '...'}
            </p>

            <div style={styles.metaInfo}>
              {breeder.license_number && (
                <div style={styles.metaItem}>
                  <span style={styles.metaIcon}>📋</span>
                  <div>
                    <div style={styles.metaLabel}>Ліцензія</div>
                    <div style={styles.metaValue}>{breeder.license_number}</div>
                  </div>
                </div>
              )}
              {breeder.experience_years && (
                <div style={styles.metaItem}>
                  <span style={styles.metaIcon}>⭐</span>
                  <div>
                    <div style={styles.metaLabel}>Досвід</div>
                    <div style={styles.metaValue}>{breeder.experience_years}+ років</div>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.quickStats}>
              <div style={styles.statItem}>
                <span style={styles.statIcon}>🐾</span>
                <div style={styles.statInfo}>
                  <span style={styles.statNumber}>{petsArray.length}</span>
                  <span style={styles.statLabel}>Тварин</span>
                </div>
              </div>
              {breeder.total_sales && (
                <div style={styles.statItem}>
                  <span style={styles.statIcon}>🏆</span>
                  <div style={styles.statInfo}>
                    <span style={styles.statNumber}>{breeder.total_sales}+</span>
                    <span style={styles.statLabel}>Продажів</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.actionsBar}>
        {breeder.phone && (
          <a href={`tel:${breeder.phone}`} style={styles.actionButton}>
            <span style={styles.actionIcon}>📞</span>
            Зателефонувати
          </a>
        )}
        {breeder.email && (
          <a href={`mailto:${breeder.email}`} style={{...styles.actionButton, ...styles.actionButtonSecondary}}>
            <span style={styles.actionIcon}>✉️</span>
            Написати email
          </a>
        )}
        {breeder.website && (
          <a 
            href={breeder.website.startsWith('http') ? breeder.website : `https://${breeder.website}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{...styles.actionButton, ...styles.actionButtonSecondary}}
          >
            <span style={styles.actionIcon}>🌐</span>
            Відвідати сайт
          </a>
        )}
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>📋</span>
            <h3 style={styles.cardTitle}>Інформація про розвідника</h3>
          </div>
          <div style={styles.cardContent}>
            {breeder.license_number && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>🎫</span>
                <div style={styles.contactText}>
                  <strong>Номер ліцензії</strong>
                  <p>{breeder.license_number}</p>
                </div>
              </div>
            )}
            {breeder.address && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📍</span>
                <div style={styles.contactText}>
                  <strong>Адреса</strong>
                  <p>{breeder.address}</p>
                </div>
              </div>
            )}
            {breeder.phone && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📞</span>
                <div style={styles.contactText}>
                  <strong>Телефон</strong>
                  <p>{breeder.phone}</p>
                </div>
              </div>
            )}
            {breeder.email && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>✉️</span>
                <div style={styles.contactText}>
                  <strong>Email</strong>
                  <p>{breeder.email}</p>
                </div>
              </div>
            )}
            {breeder.website && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>🌐</span>
                <div style={styles.contactText}>
                  <strong>Вебсайт</strong>
                  <p>
                    <a 
                      href={breeder.website.startsWith('http') ? breeder.website : `https://${breeder.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={styles.websiteLink}
                    >
                      {breeder.website}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{...styles.card, ...styles.cardWide}}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>ℹ️</span>
            <h3 style={styles.cardTitle}>Про бізнес</h3>
          </div>
          <div style={styles.cardContent}>
            <p style={styles.aboutText}>
              {breeder.description || 'Професійний розвідник породистих тварин з багаторічним досвідом. Ми піклуємось про здоров\'я та благополуччя кожної тварини.'}
            </p>
            
            {breeder.specializations && (
              <div style={styles.specializationsBlock}>
                <h4 style={styles.specializationsTitle}>Спеціалізація</h4>
                <div style={styles.specializationsList}>
                  {breeder.specializations.split(',').map((spec, idx) => (
                    <div key={idx} style={styles.specializationItem}>
                      <span style={styles.starIcon}>⭐</span>
                      {spec.trim()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {breeder.certifications && (
              <div style={styles.certificationsBlock}>
                <h4 style={styles.certificationsTitle}>
                  <span style={styles.certIcon}>🏆</span>
                  Сертифікати та нагороди
                </h4>
                <div style={styles.certificationsList}>
                  {breeder.certifications.split(',').map((cert, idx) => (
                    <div key={idx} style={styles.certificationItem}>
                      <span style={styles.checkmarkIcon}>✓</span>
                      {cert.trim()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {breeder.breeding_philosophy && (
              <div style={styles.philosophyBlock}>
                <h4 style={styles.philosophyTitle}>Філософія розведення</h4>
                <p style={styles.philosophyText}>{breeder.breeding_philosophy}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.petsSection}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>🐾</span>
              Тварини розвідника
            </h2>
            <p style={styles.sectionSubtitle}>
              Доступні для покупки
            </p>
          </div>
          {petsArray.length > 0 && (
            <div style={styles.petCount}>
              {petsArray.length} {petsArray.length === 1 ? 'тварина' : petsArray.length < 5 ? 'тварини' : 'тварин'}
            </div>
          )}
        </div>

        {petsLoading ? (
          <div style={styles.petsLoading}>
            <div style={styles.smallSpinner}></div>
            <p>Завантаження тварин...</p>
          </div>
        ) : petsArray.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🐾</div>
            <h3 style={styles.emptyTitle}>Немає доступних тварин</h3>
            <p style={styles.emptyText}>
              Наразі у цього розвідника немає тварин в продажу.
              Зв'яжіться з розвідником для отримання додаткової інформації.
            </p>
          </div>
        ) : (
          <div style={styles.petsGrid}>
            {petsArray.map((pet, index) => (
              <div
                key={pet.id}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
                className="pet-card-wrapper"
              >
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1.5rem 4rem',
    minHeight: '100vh',
  },

  backButtonTop: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    marginBottom: '2rem',
    backgroundColor: '#FFFFFF',
    color: '#609966',
    border: '2px solid #609966',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(35, 50, 47, 0.08)',
  },

  hero: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    overflow: 'hidden',
    marginBottom: '2rem',
    boxShadow: '0 8px 32px rgba(35, 50, 47, 0.1)',
  },

  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '200px',
    opacity: 0.1,
  },

  heroContent: {
    position: 'relative',
    display: 'flex',
    gap: '2.5rem',
    padding: '3rem',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },

  avatarContainer: {
    position: 'relative',
    flexShrink: 0,
  },

  avatar: {
    width: '200px',
    height: '200px',
    borderRadius: '20px',
    objectFit: 'cover',
    border: '4px solid #FFFFFF',
    boxShadow: '0 12px 40px rgba(35, 50, 47, 0.15)',
  },

  avatarPlaceholder: {
    width: '200px',
    height: '200px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #EDF1D6 0%, #9DC08B 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid #FFFFFF',
    boxShadow: '0 12px 40px rgba(35, 50, 47, 0.15)',
  },

  avatarIcon: {
    fontSize: '5rem',
    opacity: 0.4,
  },

  verifiedBadge: {
    position: 'absolute',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#27ae60',
    color: '#FFFFFF',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(39, 174, 96, 0.4)',
  },

  headerInfo: {
    flex: 1,
    minWidth: '300px',
  },

  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },

  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#23322F',
    letterSpacing: '-0.5px',
    lineHeight: 1.2,
  },

  verifiedChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(39, 174, 96, 0.15)',
    color: '#27ae60',
    borderRadius: '50px',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: '2px solid rgba(39, 174, 96, 0.3)',
  },

  checkIcon: {
    fontSize: '1.1rem',
    fontWeight: '700',
  },

  subtitle: {
    fontSize: '1.15rem',
    color: 'rgba(35, 50, 47, 0.7)',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  },

  metaInfo: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },

  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(157, 192, 139, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(157, 192, 139, 0.2)',
  },

  metaIcon: {
    fontSize: '1.5rem',
  },

  metaLabel: {
    fontSize: '0.8rem',
    color: 'rgba(35, 50, 47, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  metaValue: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#23322F',
    marginTop: '0.15rem',
  },

  quickStats: {
    display: 'flex',
    gap: '2rem',
    marginTop: '1.5rem',
  },

  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },

  statIcon: {
    fontSize: '2rem',
  },

  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },

  statNumber: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#609966',
    lineHeight: 1,
  },

  statLabel: {
    fontSize: '0.875rem',
    color: 'rgba(35, 50, 47, 0.6)',
    marginTop: '0.25rem',
  },

  actionsBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2.5rem',
    flexWrap: 'wrap',
  },

  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    backgroundColor: '#609966',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(96, 153, 102, 0.3)',
  },

  actionButtonSecondary: {
    backgroundColor: '#FFFFFF',
    color: '#609966',
    border: '2px solid #609966',
    boxShadow: '0 2px 8px rgba(35, 50, 47, 0.08)',
  },

  actionIcon: {
    fontSize: '1.2rem',
  },

  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(35, 50, 47, 0.08)',
    border: '1px solid rgba(157, 192, 139, 0.15)',
  },

  cardWide: {
    gridColumn: 'span 2',
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid rgba(157, 192, 139, 0.2)',
  },

  cardIcon: {
    fontSize: '1.5rem',
  },

  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#23322F',
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },

  contactItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(157, 192, 139, 0.05)',
    borderRadius: '12px',
  },

  contactIcon: {
    fontSize: '1.5rem',
    flexShrink: 0,
  },

  contactText: {
    flex: 1,
  },

  websiteLink: {
    color: '#609966',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(96, 153, 102, 0.3)',
    transition: 'all 0.3s ease',
  },

  aboutText: {
    fontSize: '1.05rem',
    lineHeight: 1.8,
    color: 'rgba(35, 50, 47, 0.8)',
    marginBottom: '1.5rem',
  },

  specializationsBlock: {
    marginTop: '1.5rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(157, 192, 139, 0.08)',
    borderRadius: '12px',
  },

  specializationsTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#609966',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  specializationsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '0.75rem',
  },

  specializationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '500',
  },

  starIcon: {
    fontSize: '1.1rem',
  },

  certificationsBlock: {
    marginTop: '1.5rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(96, 153, 102, 0.08)',
    borderRadius: '12px',
    borderLeft: '4px solid #609966',
  },

  certificationsTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#609966',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  certIcon: {
    fontSize: '1.3rem',
  },

  certificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },

  certificationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.95rem',
    color: 'rgba(35, 50, 47, 0.8)',
  },

  checkmarkIcon: {
    color: '#609966',
    fontWeight: '700',
    fontSize: '1.2rem',
  },

  philosophyBlock: {
    marginTop: '1.5rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(157, 192, 139, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(157, 192, 139, 0.2)',
  },

  philosophyTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#23322F',
    marginBottom: '0.75rem',
  },

  philosophyText: {
    fontSize: '1rem',
    lineHeight: 1.7,
    color: 'rgba(35, 50, 47, 0.8)',
    fontStyle: 'italic',
  },

  petsSection: {
    marginTop: '3rem',
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },

  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#23322F',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },

  sectionIcon: {
    fontSize: '2rem',
  },

  sectionSubtitle: {
    fontSize: '1rem',
    color: 'rgba(35, 50, 47, 0.6)',
  },

  petCount: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(157, 192, 139, 0.15)',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#609966',
  },

  petsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  },

  petsLoading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '3rem',
    color: 'rgba(35, 50, 47, 0.6)',
  },

  smallSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(157, 192, 139, 0.2)',
    borderTop: '3px solid #609966',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    boxShadow: '0 4px 16px rgba(35, 50, 47, 0.06)',
  },

  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
    opacity: 0.5,
  },

  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#23322F',
    marginBottom: '1rem',
  },

  emptyText: {
    fontSize: '1.05rem',
    color: 'rgba(35, 50, 47, 0.7)',
    lineHeight: 1.6,
    maxWidth: '500px',
    margin: '0 auto',
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '2rem',
  },

  spinnerWrapper: {
    position: 'relative',
    width: '80px',
    height: '80px',
  },

  spinner: {
    position: 'absolute',
    width: '80px',
    height: '80px',
    border: '4px solid rgba(157, 192, 139, 0.2)',
    borderTop: '4px solid #609966',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  spinnerInner: {
    position: 'absolute',
    width: '60px',
    height: '60px',
    top: '10px',
    left: '10px',
    border: '3px solid rgba(157, 192, 139, 0.1)',
    borderBottom: '3px solid #9DC08B',
    borderRadius: '50%',
    animation: 'spin 1.5s linear infinite reverse',
  },

  loadingText: {
    fontSize: '1.125rem',
    color: 'rgba(35, 50, 47, 0.7)',
    fontWeight: '500',
  },

  notFoundContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
  },

  notFoundContent: {
    maxWidth: '500px',
    backgroundColor: '#FFFFFF',
    padding: '3rem',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(35, 50, 47, 0.1)',
    border: '2px solid rgba(157, 192, 139, 0.2)',
  },

  notFoundIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
  },

  notFoundTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#23322F',
    marginBottom: '1rem',
  },

  notFoundMessage: {
    fontSize: '1.1rem',
    color: 'rgba(35, 50, 47, 0.7)',
    marginBottom: '2rem',
    lineHeight: 1.6,
  },

  backButton: {
    padding: '0.875rem 2rem',
    backgroundColor: '#609966',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(96, 153, 102, 0.3)',
  },
};

export default BreederDetail;
