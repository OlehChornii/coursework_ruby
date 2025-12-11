// client/src/pages/User/Profile.jsx
import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await usersAPI.getProfile();
      setUser(response.data);
      setFormData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        phone: response.data.phone || '',
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersAPI.updateProfile(formData);
      alert('Профіль оновлено!');
      fetchProfile();
    } catch (error) {
      console.error(error);
      alert('Помилка оновлення профілю');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div style={styles.container}>
        <div style={styles.centerBox}>
          <div style={styles.spinner} aria-hidden />
          <div style={{ marginTop: 12, color: '#40513B' }}>Завантаження...</div>
        </div>
      </div>
    );

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Мій профіль</h1>

      <div style={styles.layout}>
        <div style={styles.profileBox}>
          <div style={styles.headerRow}>
            <div style={styles.avatarWrap}>
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.first_name + ' ' + (user.last_name || '')
                )}&background=9DC08B&color=fff`}
                alt="avatar"
                style={styles.avatar}
              />
            </div>

            <div style={styles.userInfo}>
              <div style={styles.nameRow}>
                <h2 style={styles.name}>{user.first_name || 'Користувач'} {user.last_name || ''}</h2>
                <span style={{ ...styles.badge, ...(user.role === 'admin' ? styles.adminBadge : {}) }}>{user.role}</span>
              </div>
              <div style={styles.email}>{user.email}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Ім'я</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Прізвище</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroupFull}>
                <label style={styles.label}>Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={styles.input}
                  placeholder="+380 67 123 4567"
                />
              </div>

              <div style={styles.formGroupFull}>
                <label style={styles.label}>Email</label>
                <input type="email" value={user.email} disabled style={styles.inputDisabled} />
              </div>
            </div>

            <div style={styles.actionsRow}>
              <button type="submit" style={{ ...styles.submitButton, opacity: saving ? 0.8 : 1 }} disabled={saving}>
                {saving ? 'Збереження...' : 'Зберегти зміни'}
              </button>

              <button type="button" style={styles.ghostButton} onClick={() => fetchProfile()}>
                Скасувати
              </button>
            </div>
          </form>
        </div>

        <div style={styles.actionsColumn}>
          <div style={styles.card}>
            <div>
              <div style={styles.cardTitle}>Мої замовлення</div>
              <div style={styles.cardSubtitle}>Історія покупок і статуси</div>
            </div>
            <button style={styles.primary} onClick={() => navigate('/user/orders')}>
              Оглянути
            </button>
          </div>

          <div style={styles.card}>
            <div>
              <div style={styles.cardTitle}>Мої заявки</div>
              <div style={styles.cardSubtitle}>Статус заявок на усиновлення</div>
            </div>
            <button style={styles.primary} onClick={() => navigate('/user/adoptions')}>
              Оглянути
            </button>
          </div>

          {user.role === 'admin' && (
            <div style={styles.card}>
              <div>
                <div style={styles.cardTitle}>Адмін панель</div>
                <div style={styles.cardSubtitle}>Керування сайтом</div>
              </div>
              <button style={styles.primary} onClick={() => navigate('/admin')}>
                Оглянути
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem 1rem',
    minHeight: '80vh',
  },

  centerBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40vh',
    color: '#40513B',
  },

  spinner: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: '4px solid rgba(0,0,0,0.05)',
    borderTop: '4px solid #609966',
    animation: 'spin 1s linear infinite',
  },

  pageTitle: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontWeight: '700',
    fontSize: '1.9rem',
    color: '#40513B',
  },

  layout: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },

  profileBox: {
    flex: '1 1 560px',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 6px 30px rgba(64, 81, 59, 0.06)',
    border: '1px solid rgba(157, 192, 139, 0.4)',
  },

  headerRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '1.25rem',
  },

  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 16,
    overflow: 'hidden',
    flexShrink: 0,
    boxShadow: '0 6px 14px rgba(96,153,102,0.12)',
    border: '2px solid #e8f2e6',
  },

  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  userInfo: {
    flex: 1,
  },

  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },

  name: {
    margin: 0,
    fontSize: '1.25rem',
    color: '#23322F',
    fontWeight: 700,
  },

  badge: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
    borderRadius: 8,
    background: '#E6EDEA',
    color: '#40513B',
    textTransform: 'capitalize',
  },

  adminBadge: {
    background: '#609966',
    color: '#fff',
  },

  email: {
    marginTop: 6,
    color: '#6b746c',
    fontSize: '0.95rem',
  },

  form: { width: '100%' },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '0.6rem',
  },

  formGroup: { marginBottom: '0.5rem' },
  formGroupFull: { gridColumn: '1 / -1', marginBottom: '0.5rem' },

  label: {
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: 600,
    color: '#40513B',
    fontSize: '0.95rem',
  },

  input: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid rgba(157, 192, 139, 0.6)',
    borderRadius: '10px',
    fontSize: '0.98rem',
    transition: 'box-shadow 0.18s, transform 0.12s',
    outline: 'none',
  },

  inputDisabled: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f7f7f7',
    cursor: 'not-allowed',
  },

  actionsRow: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem',
  },

  submitButton: {
    padding: '0.9rem 1.1rem',
    backgroundColor: '#609966',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(96,153,102,0.18)',
    flex: 1,
  },

  ghostButton: {
    padding: '0.9rem 1.1rem',
    background: 'transparent',
    border: '2px solid rgba(96,153,102,0.12)',
    borderRadius: '12px',
    cursor: 'pointer',
    flex: '0 0 160px',
    fontWeight: 600,
  },

  actionsColumn: {
    flex: '0 0 320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  card: {
    background: '#fff',
    padding: '1.25rem',
    borderRadius: '14px',
    boxShadow: '0 8px 26px rgba(64, 81, 59, 0.06)',
    border: '1px solid rgba(157, 192, 139, 0.25)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: '1.03rem',
    fontWeight: 700,
    color: '#23322F',
  },

  cardSubtitle: {
    color: '#6b746c',
    fontSize: '0.85rem',
    marginTop: 6,
  },

  primary: {
    background: '#609966',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 700,
  },

  secondary: {
    background: 'transparent',
    color: '#40513B',
    border: '2px solid rgba(96,153,102,0.12)',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 700,
  },
};

export default Profile;