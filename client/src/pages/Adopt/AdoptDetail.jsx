// client/src/pages/Adopt/AdoptDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petsAPI, adoptionAPI } from '../../services/api';

const AdoptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [formData, setFormData] = useState({ message: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const fetchData = async () => {
    try {
      const [petRes, appRes] = await Promise.all([
        petsAPI.getById(id),
        adoptionAPI.checkExistingApplication(id).catch(() => ({ data: null }))
      ]);
      
      setPet(petRes.data);
      setExistingApplication(appRes.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Помилка завантаження даних');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Будь ласка, увійдіть в акаунт');
      navigate('/login');
      return;
    }

    if (pet.status !== 'available') {
      alert('Ця тварина більше не доступна для всиновлення');
      return;
    }

    setSubmitting(true);
    try {
      await adoptionAPI.createApplication({
        pet_id: pet.id,
        shelter_id: pet.shelter_id,
        message: formData.message,
      });
      alert('Заявку надіслано успішно!');
      navigate('/user/adoptions');
    } catch (error) {
      console.error(error);
      if (error.response?.data?.error === 'Ви вже подали заявку на цю тварину') {
        alert('Ви вже подали заявку на всиновлення цієї тварини');
      } else {
        alert('Помилка при надсиланні заявки');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={styles.container}>Завантаження...</div>;
  if (!pet) return <div style={styles.container}>Тварину не знайдено</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        ← Назад
      </button>

      <div style={styles.content}>
        <div style={styles.petSection}>
          {pet.image_url && (
            <img src={pet.image_url} alt={pet.name} style={styles.petImage} />
          )}
          <div style={styles.petInfo}>
            <h1>{pet.name}</h1>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Порода:</span>
                <span>{pet.breed}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Вік:</span>
                <span>{pet.age_months} місяців</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Стать:</span>
                <span>{pet.gender}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Притулок:</span>
                <span 
                  onClick={() => navigate(`/shelters/${pet.shelter_id}`)}
                  style={styles.shelterLink}
                >
                  {pet.shelter_name}
                </span>
              </div>
            </div>
            <div style={styles.description}>
              <h3>Опис</h3>
              <p>{pet.description || 'Опис відсутній'}</p>
            </div>
            
            {pet.status !== 'available' && (
              <div style={styles.unavailableNotice}>
                ⚠️ Ця тварина більше не доступна для всиновлення
              </div>
            )}
          </div>
        </div>

        <div style={styles.formSection}>
          {existingApplication ? (
            <div style={styles.existingApp}>
              <h2>Ви вже подали заявку</h2>
              <p>Статус: <strong>{existingApplication.status}</strong></p>
              <p>Дата: {new Date(existingApplication.created_at).toLocaleDateString('uk-UA')}</p>
              <button 
                onClick={() => navigate(`/adoptions/${existingApplication.id}`)}
                style={styles.viewAppBtn}
              >
                Переглянути заявку
              </button>
            </div>
          ) : (
            <>
              <h2>Заявка на всиновлення</h2>
              <form onSubmit={handleSubmit}>
                <label style={styles.label}>
                  Розкажіть про себе та чому ви хочете всиновити {pet.name}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ message: e.target.value })}
                  placeholder="Опишіть ваші умови утримання, досвід з тваринами, чому ви обрали саме цю тварину..."
                  style={styles.textarea}
                  rows="8"
                  required
                  disabled={pet.status !== 'available'}
                />
                
                <div style={styles.formFooter}>
                  <p style={styles.note}>
                    ℹ️ Після подання заявки адміністратор притулку розгляне її та зв'яжеться з вами
                  </p>
                  <button 
                    type="submit" 
                    style={{
                      ...styles.submitButton,
                      ...(pet.status !== 'available' || submitting ? styles.disabledButton : {})
                    }}
                    disabled={pet.status !== 'available' || submitting}
                  >
                    {submitting ? 'Надсилання...' : 'Надіслати заявку'}
                  </button>
                </div>
              </form>
            </>
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
    padding: '2rem 1rem',
  },
  backButton: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#9DC08B',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '2rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '2rem'
  },
  petSection: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(64, 81, 59, 0.1)',
  },
  petImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '1.5rem'
  },
  petInfo: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1.5rem',
    color: '#40513B',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    padding: '1rem',
    backgroundColor: '#EDF1D6',
    borderRadius: '8px',
  },
  infoLabel: {
    fontSize: '0.85rem',
    color: '#609966',
    fontWeight: 'bold'
  },
  shelterLink: {
    color: '#609966',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: '600',
  },
  description: {
    padding: '1.5rem',
    backgroundColor: '#EDF1D6',
    borderRadius: '12px',
    lineHeight: '1.6',
    border: '2px solid #9DC08B',
  },
  unavailableNotice: {
    padding: '1rem',
    backgroundColor: '#FFE5B4',
    borderRadius: '8px',
    color: '#8B4513',
    fontWeight: 'bold',
    border: '2px solid #DEB887',
  },
  formSection: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(64, 81, 59, 0.1)',
    height: 'fit-content',
    position: 'sticky',
    top: '2rem'
  },
  existingApp: {
    textAlign: 'center',
    padding: '2rem',
    color: '#40513B',
  },
  viewAppBtn: {
    marginTop: '1rem',
    padding: '0.85rem 1.5rem',
    backgroundColor: '#609966',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  label: {
    display: 'block',
    marginBottom: '0.75rem',
    fontWeight: 'bold',
    color: '#40513B'
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    border: '2px solid #9DC08B',
    borderRadius: '12px',
    fontSize: '1rem',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s'
  },
  formFooter: {
    marginTop: '1.5rem'
  },
  note: {
    fontSize: '0.9rem',
    color: '#609966',
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: '#EDF1D6',
    borderRadius: '8px',
    border: '2px solid #9DC08B',
  },
  submitButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#609966',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(96, 153, 102, 0.3)',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
    opacity: 0.6,
  }
};

export default AdoptDetail;
