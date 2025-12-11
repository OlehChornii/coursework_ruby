// client/src/pages/User/Adoptions.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adoptionAPI } from '../../services/api';

const Adoptions = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adoptionAPI.getApplications();
      setApplications(response.data || []);
    } catch (err) {
      console.error('Fetch applications error', err);
      setError('Не вдалося завантажити заявки. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelApplication = async (id) => {
    const ok = window.confirm('Ви впевнені, що хочете скасувати заявку?');
    if (!ok) return;

    const prev = [...applications];
    setApplications(prev.filter(a => a.id !== id));

    try {
      await adoptionAPI.cancelApplication(id);
    } catch (err) {
      console.error('Cancel error', err);
      alert('Помилка скасування заявки. Спробуйте ще раз.');
      setApplications(prev);
    }
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

  const getStatusConfig = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('pending') || s.includes('очікує')) {
      return { 
        text: 'Очікує розгляду', 
        color: '#F77F00',
        bg: '#FFF3CD',
        icon: '⏳'
      };
    }
    if (s.includes('approved') || s.includes('схвалено')) {
      return { 
        text: 'Схвалено', 
        color: '#06A77D',
        bg: '#D4EDDA',
        icon: '✓'
      };
    }
    if (s.includes('rejected') || s.includes('відхилено')) {
      return { 
        text: 'Відхилено', 
        color: '#E63946',
        bg: '#F8D7DA',
        icon: '✗'
      };
    }
    if (s.includes('cancel') || s.includes('скасовано')) {
      return { 
        text: 'Скасовано', 
        color: '#666',
        bg: '#E2E3E5',
        icon: '○'
      };
    }
    return { 
      text: status || 'Невідомо', 
      color: '#666',
      bg: '#F0F0F0',
      icon: '•'
    };
  };

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    cancelled: applications.filter(a => a.status === 'cancelled').length
  };

  const filteredApps = applications.filter(app => filter === 'all' || app.status === filter);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>
            <span style={styles.titleIcon}>🐾</span>
            Мої заявки на всиновлення
          </h1>
          <p style={styles.subtitle}>
            {applications.length > 0 ? (
              <>
                Всього заявок: <strong>{applications.length}</strong>
              </>
            ) : (
              'Історія ваших заявок на всиновлення'
            )}
          </p>
        </div>

        <div style={styles.headerActions}>
          <button style={styles.secondaryBtn} onClick={() => navigate('/adopt')}>
            <span style={styles.btnIcon}>🔍</span>
            Тварини
          </button>
          <button style={styles.refreshBtn} onClick={fetchApplications}>
            <span style={styles.btnIcon}>↻</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingCard}>
          <div style={styles.spinner} />
          <div style={styles.loadingText}>Завантаження заявок…</div>
        </div>
      ) : error ? (
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>
          <div style={styles.errorText}>{error}</div>
          <button style={styles.primaryBtn} onClick={fetchApplications}>
            <span style={styles.btnIcon}>↻</span>
            Спробувати знову
          </button>
        </div>
      ) : (
        <>
          {applications.length > 0 && (
            <div style={styles.filtersCard}>
              <FilterBtn 
                text="Всі" 
                count={counts.all}
                icon="📋"
                active={filter === 'all'} 
                onClick={() => setFilter('all')} 
              />
              <FilterBtn 
                text="Очікують" 
                count={counts.pending}
                icon="⏳"
                active={filter === 'pending'} 
                onClick={() => setFilter('pending')} 
              />
              <FilterBtn 
                text="Схвалені" 
                count={counts.approved}
                icon="✓"
                active={filter === 'approved'} 
                onClick={() => setFilter('approved')} 
              />
              <FilterBtn 
                text="Відхилені" 
                count={counts.rejected}
                icon="✗"
                active={filter === 'rejected'} 
                onClick={() => setFilter('rejected')} 
              />
              <FilterBtn 
                text="Скасовані" 
                count={counts.cancelled}
                icon="○"
                active={filter === 'cancelled'} 
                onClick={() => setFilter('cancelled')} 
              />
            </div>
          )}

          {filteredApps.length === 0 ? (
            <div style={styles.emptyCard}>
              <div style={styles.emptyIcon}>
                {filter === 'all' ? '🐾' : '🔍'}
              </div>
              <h3 style={styles.emptyTitle}>
                {filter === 'all' 
                  ? 'У вас поки немає заявок' 
                  : 'Немає заявок у цій категорії'}
              </h3>
              <p style={styles.emptyText}>
                {filter === 'all'
                  ? 'Перегляньте наших улюбленців та подайте заявку на всиновлення'
                  : 'Спробуйте змінити фільтр або перегляньте всі заявки'}
              </p>
              <div style={styles.emptyActions}>
                {filter === 'all' ? (
                  <button style={styles.primaryBtn} onClick={() => navigate('/adopt')}>
                    <span style={styles.btnIcon}>🐶</span>
                    Переглянути тварин
                  </button>
                ) : (
                  <button style={styles.secondaryBtn} onClick={() => setFilter('all')}>
                    Показати всі заявки
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={styles.grid}>
              {filteredApps.map(app => {
                const status = getStatusConfig(app.status);
                return (
                  <div key={app.id} style={styles.card}>
                    <div style={{
                      ...styles.statusBar,
                      backgroundColor: status.color
                    }} />

                    <div style={styles.cardContent}>
                      <div style={styles.imageWrapper}>
                        {app.pet_image_url ? (
                          <img 
                            src={app.pet_image_url} 
                            alt={app.pet_name} 
                            style={styles.petImage} 
                          />
                        ) : (
                          <div style={styles.noImage}>
                            <span style={styles.noImageIcon}>🐶</span>
                          </div>
                        )}
                        
                        <div style={{
                          ...styles.imageBadge,
                          backgroundColor: status.bg,
                          color: status.color
                        }}>
                          <span style={styles.badgeIcon}>{status.icon}</span>
                          {status.text}
                        </div>
                      </div>

                      <div style={styles.petInfo}>
                        <h3 style={styles.petName}>
                          {app.pet_name || 'Тварина без імені'}
                        </h3>

                        <div style={styles.infoGrid}>
                          <div style={styles.infoItem}>
                            <span style={styles.infoIcon}>🏷️</span>
                            <div style={styles.infoContent}>
                              <span style={styles.infoLabel}>Порода</span>
                              <span style={styles.infoValue}>
                                {app.pet_breed || 'Не вказано'}
                              </span>
                            </div>
                          </div>

                          <div style={styles.infoItem}>
                            <span style={styles.infoIcon}>🏠</span>
                            <div style={styles.infoContent}>
                              <span style={styles.infoLabel}>Притулок</span>
                              <span style={styles.infoValue}>
                                {app.shelter_name || 'Не вказано'}
                              </span>
                            </div>
                          </div>

                          <div style={styles.infoItem}>
                            <span style={styles.infoIcon}>📅</span>
                            <div style={styles.infoContent}>
                              <span style={styles.infoLabel}>Дата подання</span>
                              <span style={styles.infoValue}>
                                {formatDate(app.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {app.admin_notes && (
                        <div style={styles.notesSection}>
                          <div style={styles.notesHeader}>
                            <span style={styles.notesIcon}>💬</span>
                            <span style={styles.notesTitle}>Коментар адміністратора</span>
                          </div>
                          <p style={styles.notesText}>{app.admin_notes}</p>
                        </div>
                      )}

                      <div style={styles.cardActions}>
                        <button
                          style={styles.detailBtn}
                          onClick={() => navigate(`/adoptions/${app.id}`)}
                        >
                          <span style={styles.btnIcon}>📄</span>
                          Детальніше
                        </button>

                        {app.status === 'pending' && (
                          <button
                            style={styles.cancelBtn}
                            onClick={() => handleCancelApplication(app.id)}
                          >
                            <span style={styles.btnIcon}>✗</span>
                            Скасувати
                          </button>
                        )}

                        {app.status === 'approved' && (
                          <button
                            style={styles.contactBtn}
                            onClick={() => {
                              if (app.shelter_id) navigate(`/shelters/${app.shelter_id}`);
                              else if (app.shelter_email) window.location.href = `mailto:${app.shelter_email}`;
                              else alert('Контакт притулку недоступний');
                            }}
                          >
                            <span style={styles.btnIcon}>📞</span>
                            Зв'язатися
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredApps.length > 0 && filter !== 'all' && (
            <div style={styles.resultsInfo}>
              Показано {filteredApps.length} з {applications.length} заявок
            </div>
          )}
        </>
      )}
    </div>
  );
};

const FilterBtn = ({ text, count, icon, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      ...styles.filterBtn,
      ...(active ? styles.filterBtnActive : {})
    }}
  >
    <span style={styles.filterIcon}>{icon}</span>
    <span>{text}</span>
    {count > 0 && (
      <span style={{
        ...styles.filterCount,
        ...(active ? styles.filterCountActive : {})
      }}>
        {count}
      </span>
    )}
  </button>
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
  headerActions: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center'
  },

  primaryBtn: {
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
  secondaryBtn: {
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
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    background: 'white',
    color: '#23322F',
    border: '2px solid #E2E3E5',
    borderRadius: '10px',
    fontSize: '1.4rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  btnIcon: {
    fontSize: '1.1rem'
  },

  loadingCard: {
    background: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
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
    border: '1px solid #F0F0F0',
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

  filtersCard: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
    padding: '1rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0'
  },
  filterBtn: {
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
  filterBtnActive: {
    background: '#EDF1D6',
    color: '#23322F',
    borderColor: '#9DC08B'
  },
  filterIcon: {
    fontSize: '1rem'
  },
  filterCount: {
    background: '#E2E3E5',
    color: '#666',
    padding: '0.15rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '700',
    minWidth: '20px',
    textAlign: 'center'
  },
  filterCountActive: {
    background: '#609966',
    color: 'white'
  },

  emptyCard: {
    background: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
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

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem'
  },

  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column'
  },
  statusBar: {
    height: '4px',
    width: '100%'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },

  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    background: '#F5F5F5'
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
    fontSize: '4rem',
    opacity: 0.5
  },
  imageBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.9rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  badgeIcon: {
    fontSize: '1rem'
  },

  petInfo: {
    padding: '1.25rem'
  },
  petName: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#23322F',
    margin: '0 0 1rem 0'
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  },
  infoIcon: {
    fontSize: '1.2rem',
    marginTop: '0.1rem'
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
    flex: 1
  },
  infoLabel: {
    fontSize: '0.75rem',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600'
  },
  infoValue: {
    fontSize: '0.9rem',
    color: '#23322F',
    fontWeight: '500'
  },

  notesSection: {
    padding: '1rem 1.25rem',
    background: '#FFFBF0',
    borderTop: '1px solid #F5EDD7',
    borderBottom: '1px solid #F5EDD7'
  },
  notesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  notesIcon: {
    fontSize: '1.1rem'
  },
  notesTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#8B6914',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  notesText: {
    fontSize: '0.9rem',
    color: '#6B5910',
    lineHeight: '1.5',
    margin: 0
  },

  cardActions: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1.25rem',
    borderTop: '1px solid #F5F5F5',
    marginTop: 'auto'
  },
  detailBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    background: '#23322F',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(35,50,47,0.2)'
  },
  cancelBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    background: '#E63946',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(230,57,70,0.2)'
  },
  contactBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    background: '#06A77D',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(6,167,125,0.2)'
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

export default Adoptions;