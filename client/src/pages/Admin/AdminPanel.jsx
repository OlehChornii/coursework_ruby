// client/src/pages/Admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, adoptionAPI } from '../../services/api';

const AdminPanel = () => {
  const [pendingPets, setPendingPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const [petsRes, appsRes] = await Promise.all([
        adminAPI.getPendingPets(),
        adoptionAPI.getAllApplications(),
      ]);
      setPendingPets(petsRes.data);
      setApplications(appsRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppStatus = async (id, status) => {
    try {
      await adoptionAPI.updateStatus(id, status, adminNotes);
      alert(`Заявку ${status === 'approved' ? 'схвалено' : 'відхилено'}!`);
      setSelectedApp(null);
      setAdminNotes('');
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Помилка');
    }
  };

  const handleApprovePet = async (id) => {
    try {
      await adminAPI.approvePet(id);
      alert('Оголошення схвалено!');
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Помилка');
    }
  };

  const handleRejectPet = async (id) => {
    try {
      await adminAPI.rejectPet(id);
      alert('Оголошення відхилено!');
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Помилка');
    }
  };

  if (loading) return <div style={styles.container}>Завантаження...</div>;

  return (
    <div style={styles.container}>
      <h1>Панель адміністратора</h1>

      <section style={styles.quickActions}>
        <Link to="/admin/dashboard" style={styles.actionCard}>
          <div style={styles.actionIcon}>📊</div>
          <h3>Аналітика</h3>
          <p>Графіки та статистика</p>
        </Link>
        
        <div style={styles.actionCard}>
          <div style={styles.actionIcon}>📝</div>
          <h3>Модерація</h3>
          <p>{pendingPets.length} оголошень</p>
        </div>
        
        <div style={styles.actionCard}>
          <div style={styles.actionIcon}>📋</div>
          <h3>Заявки</h3>
          <p>{applications.filter(a => a.status === 'pending').length} нових</p>
        </div>
      </section>

      <section style={styles.section}>
        <h2>Оголошення на модерації ({pendingPets.length})</h2>
        <div style={styles.adminGrid}>
          {pendingPets.map(pet => (
            <div key={pet.id} style={styles.adminCard}>
              <h3>{pet.name}</h3>
              <p>Порода: {pet.breed}</p>
              <p>Ціна: {pet.price} грн</p>
              <p>Власник: {pet.first_name} {pet.last_name}</p>
              <div style={styles.adminActions}>
                <button onClick={() => handleApprovePet(pet.id)} style={styles.approveBtn}>
                  ✓ Схвалити
                </button>
                <button onClick={() => handleRejectPet(pet.id)} style={styles.rejectBtn}>
                  ✗ Відхилити
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2>Заявки на всиновлення ({applications.filter(a => a.status === 'pending').length} нових)</h2>
        <div style={styles.tabs}>
          {['pending', 'approved', 'rejected'].map(status => (
            <button key={status} style={styles.tab}>
              {status === 'pending' ? 'Очікують' : status === 'approved' ? 'Схвалені' : 'Відхилені'}
            </button>
          ))}
        </div>
        <div style={styles.adminGrid}>
          {applications.filter(app => app.status === 'pending').map(app => (
            <div key={app.id} style={styles.adminCard}>
              <h3>{app.pet_name}</h3>
              <p><strong>Користувач:</strong> {app.first_name} {app.last_name}</p>
              <p><strong>Email:</strong> {app.email}</p>
              <p><strong>Телефон:</strong> {app.phone || 'Не вказано'}</p>
              <p><strong>Дата:</strong> {new Date(app.created_at).toLocaleDateString('uk-UA')}</p>
              <button 
                onClick={() => setSelectedApp(app)}
                style={styles.viewBtn}
              >
                Переглянути повністю
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedApp && (
        <div style={styles.modal} onClick={() => setSelectedApp(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Заявка на всиновлення</h2>
            <div style={styles.modalBody}>
              <p><strong>Тварина:</strong> {selectedApp.pet_name}</p>
              <p><strong>Користувач:</strong> {selectedApp.first_name} {selectedApp.last_name}</p>
              <p><strong>Email:</strong> {selectedApp.email}</p>
              <p><strong>Телефон:</strong> {selectedApp.phone || 'Не вказано'}</p>
              <div style={styles.messageBox}>
                <strong>Повідомлення:</strong>
                <p>{selectedApp.message}</p>
              </div>
              <label style={styles.label}>Коментар адміністратора (необов'язково):</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                style={styles.textarea}
                rows="4"
                placeholder="Додайте коментар для користувача..."
              />
            </div>
            <div style={styles.modalActions}>
              <button 
                onClick={() => handleUpdateAppStatus(selectedApp.id, 'approved')}
                style={styles.approveBtn}
              >
                ✓ Схвалити
              </button>
              <button 
                onClick={() => handleUpdateAppStatus(selectedApp.id, 'rejected')}
                style={styles.rejectBtn}
              >
                ✗ Відхилити
              </button>
              <button 
                onClick={() => { setSelectedApp(null); setAdminNotes(''); }}
                style={styles.cancelBtn}
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { 
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '2rem 1rem',
    backgroundColor: '#EDF1D6',
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(64, 81, 59, 0.1)',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#40513B',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '2px solid transparent',
  },
  actionIcon: {
    fontSize: '3rem',
    marginBottom: '0.75rem'
  },
  section: { 
    marginTop: '3rem',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(64, 81, 59, 0.1)',
  },
  tabs: { 
    display: 'flex', 
    gap: '0.75rem', 
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#9DC08B',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  adminGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem'
  },
  adminCard: {
    backgroundColor: '#EDF1D6',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(64, 81, 59, 0.1)',
    border: '2px solid #9DC08B',
  },
  adminActions: { 
    display: 'flex', 
    gap: '0.75rem', 
    marginTop: '1rem' 
  },
  approveBtn: {
    flex: 1,
    padding: '0.85rem',
    backgroundColor: '#609966',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  rejectBtn: {
    flex: 1,
    padding: '0.85rem',
    backgroundColor: '#A0522D',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  viewBtn: {
    width: '100%',
    marginTop: '1rem',
    padding: '0.85rem',
    backgroundColor: '#9DC08B',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(64, 81, 59, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 8px 32px rgba(64, 81, 59, 0.3)',
  },
  modalBody: { 
    marginTop: '1.5rem',
    color: '#40513B',
  },
  messageBox: {
    marginTop: '1rem',
    padding: '1.25rem',
    backgroundColor: '#EDF1D6',
    borderRadius: '8px',
    lineHeight: '1.6',
    border: '2px solid #9DC08B',
  },
  label: {
    display: 'block',
    marginTop: '1rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#40513B',
  },
  textarea: {
    width: '100%',
    padding: '0.85rem',
    border: '2px solid #9DC08B',
    borderRadius: '8px',
    resize: 'vertical',
    fontSize: '1rem',
    fontFamily: 'inherit',
  },
  modalActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '2rem'
  },
  cancelBtn: {
    flex: 1,
    padding: '0.85rem',
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  }
};

export default AdminPanel;