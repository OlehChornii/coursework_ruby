// client/src/pages/User/AdoptionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adoptionAPI } from '../../services/api';

const AdoptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
    // eslint-disable-next-line
  }, [id]);

  const fetchApplication = async () => {
    setLoading(true);
    try {
      const response = await adoptionAPI.getApplicationById(id);
      setApplication(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Помилка завантаження заявки');
      navigate('/user/adoptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Ви впевнені, що хочете скасувати заявку?')) return;

    try {
      await adoptionAPI.cancelApplication(id);
      alert('Заявку скасовано');
      navigate('/user/adoptions');
    } catch (error) {
      console.error('Error:', error);
      alert('Помилка скасування заявки');
    }
  };

  const getStatusInfo = (status) => {
    const info = {
      pending: {
        color: '#F77F00',
        bg: '#FFF3CD',
        icon: '⏳',
        text: 'Очікує розгляду',
        description: 'Ваша заявка надіслана та очікує розгляду адміністратором притулку.'
      },
      approved: {
        color: '#06A77D',
        bg: '#D4EDDA',
        icon: '✓',
        text: 'Схвалено',
        description: 'Вітаємо! Вашу заявку схвалено. Зв\'яжіться з притулком для завершення процесу всиновлення.'
      },
      rejected: {
        color: '#E63946',
        bg: '#F8D7DA',
        icon: '✗',
        text: 'Відхилено',
        description: 'На жаль, вашу заявку відхилено. Ви можете подати заявку на іншу тварину.'
      },
      cancelled: {
        color: '#666',
        bg: '#E2E3E5',
        icon: '○',
        text: 'Скасовано',
        description: 'Ви скасували цю заявку.'
      }
    };
    return info[status] || info.pending;
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString('uk-UA', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <button onClick={() => navigate('/user/adoptions')} style={styles.backButton}>
          <span style={styles.backIcon}>←</span> Назад
        </button>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Завантаження заявки...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div style={styles.container}>
        <button onClick={() => navigate('/user/adoptions')} style={styles.backButton}>
          <span style={styles.backIcon}>←</span> Назад
        </button>
        <div style={styles.notFoundCard}>
          <div style={styles.notFoundIcon}>🔍</div>
          <h2 style={styles.notFoundTitle}>Заявку не знайдено</h2>
          <p style={styles.notFoundText}>Можливо, вона була видалена або не існує</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(application.status);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/user/adoptions')} style={styles.backButton}>
          <span style={styles.backIcon}>←</span> Назад до заявок
        </button>
        
        <div style={styles.headerRight}>
          <button 
            onClick={() => navigate(`/adopt/${application.pet_id}`)} 
            style={styles.viewPetBtn}
          >
            <span style={styles.btnIcon}>🐾</span>
            Профіль тварини
          </button>
        </div>
      </div>

      <div style={{
        ...styles.statusBanner,
        borderColor: statusInfo.color,
        backgroundColor: statusInfo.bg
      }}>
        <div style={styles.statusLeft}>
          <div style={{
            ...styles.statusIconWrapper,
            backgroundColor: statusInfo.color
          }}>
            <span style={styles.statusIcon}>{statusInfo.icon}</span>
          </div>
          <div style={styles.statusContent}>
            <div style={styles.statusLabel}>Статус заявки</div>
            <div style={{
              ...styles.statusText,
              color: statusInfo.color
            }}>
              {statusInfo.text}
            </div>
          </div>
        </div>
        <div style={styles.statusDescription}>
          {statusInfo.description}
        </div>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.leftColumn}>
          <div style={styles.imageCard}>
            {application.pet_image_url ? (
              <img 
                src={application.pet_image_url} 
                alt={application.pet_name} 
                style={styles.petImage} 
              />
            ) : (
              <div style={styles.noImage}>
                <span style={styles.noImageIcon}>🐾</span>
              </div>
            )}
            
            <div style={styles.imageOverlay}>
              <h2 style={styles.petName}>{application.pet_name || 'Тварина'}</h2>
              {application.pet_breed && (
                <div style={styles.petBreed}>{application.pet_breed}</div>
              )}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <span style={styles.cardIcon}>🐕</span>
                Інформація про тварину
              </h3>
            </div>
            <div style={styles.cardBody}>
              <InfoRow 
                icon="🏷️" 
                label="Порода" 
                value={application.pet_breed || 'Не вказано'} 
              />
              <InfoRow 
                icon="🎂" 
                label="Вік" 
                value={application.pet_age_months ? `${application.pet_age_months} міс.` : 'Не вказано'} 
              />
              <InfoRow 
                icon="⚧" 
                label="Стать" 
                value={application.pet_gender || 'Не вказано'} 
              />
              
              {application.pet_description && (
                <div style={styles.descriptionSection}>
                  <div style={styles.descriptionLabel}>
                    <span style={styles.descriptionIcon}>📝</span>
                    Опис
                  </div>
                  <p style={styles.descriptionText}>
                    {application.pet_description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {application.admin_notes && (
            <div style={styles.adminNotesCard}>
              <div style={styles.adminNotesHeader}>
                <span style={styles.adminNotesIcon}>💬</span>
                <span style={styles.adminNotesTitle}>Коментар адміністратора</span>
              </div>
              <div style={styles.adminNotesContent}>
                {application.admin_notes}
              </div>
            </div>
          )}
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <span style={styles.cardIcon}>📋</span>
                Деталі заявки
              </h3>
            </div>
            <div style={styles.cardBody}>
              <InfoRow 
                icon="📅" 
                label="Дата подання" 
                value={formatDate(application.created_at)} 
              />
              <InfoRow 
                icon="🏠" 
                label="Притулок" 
                value={application.shelter_name || 'Не вказано'} 
              />
              {application.shelter_phone && (
                <InfoRow 
                  icon="📞" 
                  label="Телефон" 
                  value={
                    <a href={`tel:${application.shelter_phone}`} style={styles.link}>
                      {application.shelter_phone}
                    </a>
                  } 
                />
              )}
              {application.shelter_email && (
                <InfoRow 
                  icon="✉️" 
                  label="Email" 
                  value={
                    <a href={`mailto:${application.shelter_email}`} style={styles.link}>
                      {application.shelter_email}
                    </a>
                  } 
                />
              )}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <span style={styles.cardIcon}>💭</span>
                Ваше повідомлення
              </h3>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.messageBox}>
                {application.message || 'Повідомлення не надано'}
              </div>
            </div>
          </div>

          <div style={styles.actionsCard}>
            {application.status === 'pending' && (
              <button onClick={handleCancel} style={styles.cancelButton}>
                <span style={styles.btnIcon}>✗</span>
                Скасувати заявку
              </button>
            )}

            {application.status === 'approved' && (
              <button 
                onClick={() => {
                  if (application.shelter_id) navigate(`/shelters/${application.shelter_id}`);
                  else if (application.shelter_email) window.location.href = `mailto:${application.shelter_email}`;
                  else alert('Контакт притулку недоступний');
                }} 
                style={styles.contactButton}
              >
                <span style={styles.btnIcon}>📞</span>
                Зв'язатися з притулком
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div style={styles.infoRow}>
    <div style={styles.infoLeft}>
      <span style={styles.infoIcon}>{icon}</span>
      <span style={styles.infoLabel}>{label}</span>
    </div>
    <div style={styles.infoValue}>{value}</div>
  </div>
);

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
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  headerRight: {
    display: 'flex',
    gap: '0.75rem'
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
  viewPetBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#609966',
    color: 'white',
    border: 'none',
    padding: '0.65rem 1.25rem',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(96,153,102,0.3)'
  },
  btnIcon: {
    fontSize: '1.1rem'
  },

  statusBanner: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '2px solid',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  statusLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statusIconWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  statusIcon: {
    fontSize: '2rem'
  },
  statusContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  statusLabel: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statusText: {
    fontSize: '1.5rem',
    fontWeight: '700'
  },
  statusDescription: {
    flex: 1,
    minWidth: '300px',
    color: '#666',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    textAlign: 'right'
  },

  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '1.5rem',
    alignItems: 'start'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    position: 'sticky',
    top: '2rem'
  },

  imageCard: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#F5F5F5',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    height: '400px'
  },
  petImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#EDF1D6'
  },
  noImageIcon: {
    fontSize: '6rem',
    opacity: 0.4
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    padding: '2rem 1.5rem 1.5rem',
    color: 'white'
  },
  petName: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
    color: 'white'
  },
  petBreed: {
    fontSize: '1.1rem',
    opacity: 0.9
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
    padding: '1.25rem 1.5rem'
  },

  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #F5F5F5'
  },
  infoLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  infoIcon: {
    fontSize: '1.2rem'
  },
  infoLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500'
  },
  infoValue: {
    fontSize: '0.95rem',
    color: '#23322F',
    fontWeight: '600',
    textAlign: 'right'
  },

  descriptionSection: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '2px solid #F5F5F5'
  },
  descriptionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#23322F',
    marginBottom: '0.75rem'
  },
  descriptionIcon: {
    fontSize: '1.1rem'
  },
  descriptionText: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.6',
    margin: 0,
    whiteSpace: 'pre-wrap'
  },

  adminNotesCard: {
    background: '#FFFBF0',
    border: '2px solid #F5EDD7',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  adminNotesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    background: '#FFF8E1',
    borderBottom: '1px solid #F5EDD7'
  },
  adminNotesIcon: {
    fontSize: '1.3rem'
  },
  adminNotesTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#8B6914',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  adminNotesContent: {
    padding: '1.25rem',
    fontSize: '0.95rem',
    color: '#6B5910',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap'
  },

  messageBox: {
    background: '#F8F9FA',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    color: '#23322F',
    lineHeight: '1.6',
    minHeight: '100px',
    whiteSpace: 'pre-wrap',
    border: '1px solid #E9ECEF'
  },

  actionsCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '1rem',
    background: '#E63946',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(230,57,70,0.3)'
  },
  contactButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '1rem',
    background: '#06A77D',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(6,167,125,0.3)'
  },

  link: {
    color: '#609966',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'opacity 0.2s ease'
  },

  loadingCard: {
    background: 'white',
    padding: '4rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    textAlign: 'center'
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid #F0F0F0',
    borderTop: '4px solid #609966',
    borderRadius: '50%',
    margin: '0 auto 1.5rem',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#666',
    fontSize: '1.1rem',
    margin: 0
  },

  notFoundCard: {
    background: 'white',
    padding: '4rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    textAlign: 'center'
  },
  notFoundIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: 0.5
  },
  notFoundTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#23322F',
    margin: '0 0 0.75rem 0'
  },
  notFoundText: {
    color: '#666',
    fontSize: '1rem',
    margin: 0
  }
};

export default AdoptionDetail;