// client/src/pages/Reviews.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Марія Петренко',
      avatar: '👩',
      rating: 5,
      date: '2024-11-15',
      text: 'Чудова платформа! Завдяки PetMarket я знайшла свою кицьку Мурку. Весь процес був дуже простим та прозорим. Рекомендую всім!',
      verified: true
    },
    {
      id: 2,
      author: 'Іван Коваленко',
      avatar: '👨',
      rating: 5,
      date: '2024-11-10',
      text: 'Найкраще рішення для пошуку домашньої тварини. Велика база порід, докладна інформація про кожну тварину. Дуже задоволений!',
      verified: true
    },
    {
      id: 3,
      author: 'Олена Соколова',
      avatar: '👩',
      rating: 4,
      date: '2024-11-05',
      text: 'Дуже гарний сайт. Все зрозуміло та логічно організовано. Було б чудово, якби було більше фільтрів за крiter іями пошуку.',
      verified: true
    },
    {
      id: 4,
      author: 'Петро Данилович',
      avatar: '👨',
      rating: 5,
      date: '2024-10-28',
      text: 'Допомогли мені знайти ідеального щеня! Підтримка була чудова, все питання вирішилися швидко. Дякую PetMarket!',
      verified: true
    },
    {
      id: 5,
      author: 'Анна Викторівна',
      avatar: '👩',
      rating: 5,
      date: '2024-10-20',
      text: 'Вперше встав с таким зручним сайтом про тварин. Інформація завжди актуальна, статті дуже корисні. Рекомендую!',
      verified: true
    },
    {
      id: 6,
      author: 'Сергій Миколайович',
      avatar: '👨',
      rating: 4,
      date: '2024-10-15',
      text: 'Хороший сервис, зручно шукати улюбленців. Єдиний мінус - іноді повільно завантажується. Але в цілому дуже задоволений.',
      verified: false
    }
  ]);

  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    text: ''
  });

  const [showForm, setShowForm] = useState(false);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.author.trim() && newReview.text.trim()) {
      const review = {
        id: reviews.length + 1,
        ...newReview,
        avatar: newReview.author.charAt(0) === 'М' || newReview.author.charAt(0) === 'О' || newReview.author.charAt(0) === 'А' ? '👩' : '👨',
        date: new Date().toISOString().split('T')[0],
        verified: false
      };
      setReviews([review, ...reviews]);
      setNewReview({ author: '', rating: 5, text: '' });
      setShowForm(false);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Відгуки про PetMarket</h1>
          <p style={styles.heroSubtitle}>
            Дізнайтеся, що кажуть наші користувачі про нашу платформу
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{averageRating}</div>
            <div style={styles.statLabel}>Середня оцінка</div>
            <div style={styles.statStars}>{renderStars(Math.round(averageRating))}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{totalReviews}</div>
            <div style={styles.statLabel}>Всього відгуків</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{Math.round((reviews.filter(r => r.rating >= 4).length / totalReviews) * 100)}%</div>
            <div style={styles.statLabel}>Задоволених клієнтів</div>
          </div>
        </div>
      </section>

      {/* Add Review Button */}
      <section style={styles.addReviewSection}>
        <button 
          style={styles.addReviewButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Закрити' : '+ Додати відгук'}
        </button>
      </section>

      {/* Review Form */}
      {showForm && (
        <section style={styles.formSection}>
          <form onSubmit={handleSubmitReview} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Ваше ім'я:</label>
              <input
                type="text"
                value={newReview.author}
                onChange={(e) => setNewReview({...newReview, author: e.target.value})}
                placeholder="Введіть ваше ім'я"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Оцінка:</label>
              <div style={styles.ratingInput}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({...newReview, rating: star})}
                    style={{
                      ...styles.starButton,
                      color: star <= newReview.rating ? '#FFD700' : '#DDD'
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Ваш відгук:</label>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                placeholder="Поділіться своїм враженням про сайт..."
                style={styles.textarea}
                rows="6"
                required
              />
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.submitButton}>
                📤 Надіслати відгук
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                style={styles.cancelButton}
              >
                Скасувати
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Reviews List */}
      <section style={styles.reviewsSection}>
        <h2 style={styles.sectionTitle}>Всі відгуки</h2>
        <div style={styles.reviewsList}>
          {reviews.map((review) => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div style={styles.reviewAuthorInfo}>
                  <div style={styles.authorAvatar}>{review.avatar}</div>
                  <div style={styles.authorDetails}>
                    <div style={styles.authorName}>
                      {review.author}
                      {review.verified && <span style={styles.verifiedBadge}>✓</span>}
                    </div>
                    <div style={styles.reviewDate}>{new Date(review.date).toLocaleDateString('uk-UA')}</div>
                  </div>
                </div>
                <div style={styles.reviewRating}>{renderStars(review.rating)}</div>
              </div>
              <p style={styles.reviewText}>{review.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation Links */}
      <section style={styles.navSection}>
        <Link to="/about" style={styles.navLink}>
          ← Повернутися на сторінку "Про нас"
        </Link>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  hero: {
    textAlign: 'center',
    marginBottom: '60px',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    color: 'white',
  },
  heroContent: {},
  heroTitle: {
    fontSize: '3em',
    margin: '0 0 20px 0',
    fontWeight: 'bold',
  },
  heroSubtitle: {
    fontSize: '1.3em',
    margin: 0,
    opacity: 0.9,
  },
  statsSection: {
    marginBottom: '60px',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  statNumber: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    color: '#667eea',
    margin: '10px 0',
  },
  statLabel: {
    fontSize: '1em',
    color: '#666',
    marginBottom: '10px',
  },
  statStars: {
    fontSize: '1.5em',
    letterSpacing: '2px',
  },
  addReviewSection: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  addReviewButton: {
    padding: '14px 32px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
  },
  formSection: {
    backgroundColor: '#f8f9fa',
    padding: '40px',
    borderRadius: '12px',
    marginBottom: '40px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  form: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    fontSize: '1em',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '1em',
    border: '2px solid #ddd',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '1em',
    border: '2px solid #ddd',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'border-color 0.3s ease',
  },
  ratingInput: {
    display: 'flex',
    gap: '10px',
    fontSize: '2em',
  },
  starButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '2em',
    padding: '5px',
    transition: 'transform 0.2s ease',
  },
  formActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  },
  submitButton: {
    padding: '12px 32px',
    fontSize: '1em',
    fontWeight: 'bold',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  cancelButton: {
    padding: '12px 32px',
    fontSize: '1em',
    fontWeight: 'bold',
    backgroundColor: '#ddd',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  reviewsSection: {
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '2em',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
  },
  reviewsList: {
    display: 'grid',
    gap: '20px',
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  reviewAuthorInfo: {
    display: 'flex',
    gap: '15px',
    flex: 1,
  },
  authorAvatar: {
    fontSize: '2.5em',
    minWidth: '50px',
    textAlign: 'center',
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: '1.1em',
    fontWeight: 'bold',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  verifiedBadge: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.8em',
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: '0.9em',
    color: '#999',
    marginTop: '5px',
  },
  reviewRating: {
    fontSize: '1.3em',
    letterSpacing: '2px',
  },
  reviewText: {
    fontSize: '1em',
    color: '#555',
    lineHeight: '1.6',
    margin: 0,
  },
  navSection: {
    textAlign: 'center',
    padding: '40px 20px',
    borderTop: '1px solid #ddd',
  },
  navLink: {
    fontSize: '1.1em',
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s ease',
  },
};

export default Reviews;
