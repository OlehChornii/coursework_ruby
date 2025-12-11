// client/src/pages/Dogs/DogsArticles.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI } from '../../services/api';

const DogsArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await articlesAPI.getAll('dog');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${article.first_name} ${article.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>
            <span style={styles.icon}>📚</span>
            Статті про собак
          </h1>
          <p style={styles.subtitle}>
            Цікаві історії, корисні поради та все, що варто знати про наших пухнастих друзів
          </p>
        </div>
        
        <div style={styles.searchBar}>
          <div style={styles.searchInputWrapper}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Пошук статей, авторів, тем..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={styles.clearButton}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinnerWrapper}>
            <div style={styles.spinner}></div>
            <div style={styles.spinnerInner}></div>
          </div>
          <p style={styles.loadingText}>Завантаження статей...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <h3 style={styles.emptyTitle}>
            {searchTerm ? 'Нічого не знайдено' : 'Поки що немає статей'}
          </h3>
          <p style={styles.emptyText}>
            {searchTerm 
              ? 'Спробуйте змінити пошуковий запит або очистити фільтри'
              : 'Статті з\'являться найближчим часом'
            }
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={styles.resetButton}
            >
              Скинути пошук
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={styles.resultsBar}>
            <span style={styles.resultsCount}>
              Знайдено статей: <strong>{filteredArticles.length}</strong>
            </span>
          </div>

          <div style={styles.articleGrid}>
            {filteredArticles.map((article, index) => (
              <Link 
                key={article.id} 
                to={`/articles/${article.id}`} 
                style={{
                  ...styles.articleCard,
                  animationDelay: `${index * 0.08}s`
                }}
                className="article-card"
              >
                <div style={styles.imageWrapper}>
                  {article.image_url ? (
                    <>
                      <img 
                        src={article.image_url} 
                        alt={article.title} 
                        style={styles.articleImage}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.querySelector('.placeholder').style.display = 'flex';
                        }}
                      />
                      <div className="placeholder" style={styles.imagePlaceholder}>
                        <span style={styles.placeholderIcon}>📄</span>
                      </div>
                    </>
                  ) : (
                    <div style={{...styles.imagePlaceholder, display: 'flex'}}>
                      <span style={styles.placeholderIcon}>📄</span>
                    </div>
                  )}
                  <div style={styles.categoryBadge}>Стаття</div>
                </div>

                <div style={styles.cardContent}>
                  <h3 style={styles.articleTitle}>{article.title}</h3>
                  
                  <div style={styles.authorSection}>
                    <div style={styles.authorAvatar}>
                      {article.first_name?.[0]}{article.last_name?.[0]}
                    </div>
                    <div style={styles.authorInfo}>
                      <p style={styles.authorName}>
                        {article.first_name} {article.last_name}
                      </p>
                      {article.created_at && (
                        <p style={styles.articleDate}>
                          {formatDate(article.created_at)}
                        </p>
                      )}
                    </div>
                  </div>

                  <p style={styles.excerpt}>
                    {article.content?.substring(0, 160)}
                    {article.content?.length > 160 ? '...' : ''}
                  </p>

                  <div style={styles.readMore}>
                    Читати далі <span style={styles.arrow}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
    minHeight: '100vh',
  },
  
  hero: {
    marginBottom: '3rem',
    textAlign: 'center',
  },
  
  heroContent: {
    marginBottom: '2.5rem',
  },
  
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#23322F',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    lineHeight: '1.2',
  },
  
  icon: {
    fontSize: '3.5rem',
    animation: 'float 3s ease-in-out infinite',
  },
  
  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(35, 50, 47, 0.7)',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.7',
  },
  
  searchBar: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  
  searchInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: '50px',
    boxShadow: '0 4px 16px rgba(35, 50, 47, 0.1)',
    border: '2px solid rgba(157, 192, 139, 0.2)',
    transition: 'all 0.3s ease',
  },
  
  searchIcon: {
    position: 'absolute',
    left: '1.5rem',
    fontSize: '1.2rem',
    opacity: '0.5',
  },
  
  searchInput: {
    flex: '1',
    padding: '1rem 3rem 1rem 3.5rem',
    fontSize: '1rem',
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    color: '#23322F',
  },
  
  clearButton: {
    position: 'absolute',
    right: '1rem',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(35, 50, 47, 0.1)',
    color: '#23322F',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  
  resultsBar: {
    marginBottom: '2rem',
    textAlign: 'center',
    color: 'rgba(35, 50, 47, 0.7)',
    fontSize: '1rem',
  },
  
  resultsCount: {
    display: 'inline-block',
    padding: '0.5rem 1.5rem',
    backgroundColor: 'rgba(157, 192, 139, 0.15)',
    borderRadius: '50px',
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
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
  
  emptyState: {
    textAlign: 'center',
    padding: '5rem 2rem',
    marginTop: '2rem',
  },
  
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
    opacity: '0.6',
  },
  
  emptyTitle: {
    fontSize: '1.75rem',
    color: '#23322F',
    marginBottom: '0.75rem',
    fontWeight: '600',
  },
  
  emptyText: {
    fontSize: '1.1rem',
    color: 'rgba(35, 50, 47, 0.6)',
    lineHeight: '1.6',
    maxWidth: '500px',
    margin: '0 auto 2rem',
  },
  
  resetButton: {
    padding: '0.75rem 2rem',
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
  
  articleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(35, 50, 47, 0.08)',
    textDecoration: 'none',
    color: '#23322F',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'slideUp 0.6s ease forwards',
    border: '1px solid rgba(157, 192, 139, 0.1)',
  },
  
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '220px',
    backgroundColor: '#EDF1D6',
    overflow: 'hidden',
  },
  
  articleImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  imagePlaceholder: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'linear-gradient(135deg, #EDF1D6 0%, #9DC08B 100%)',
  },
  
  placeholderIcon: {
    fontSize: '4rem',
    opacity: '0.3',
  },
  
  categoryBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    padding: '0.4rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#609966',
    borderRadius: '50px',
    fontSize: '0.8rem',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  
  cardContent: {
    padding: '1.75rem',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  
  articleTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#23322F',
    marginBottom: '1rem',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '3.5rem',
  },
  
  authorSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(35, 50, 47, 0.08)',
  },
  
  authorAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#9DC08B',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: '600',
    flexShrink: '0',
  },
  
  authorInfo: {
    flex: '1',
  },
  
  authorName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#23322F',
    marginBottom: '0.15rem',
  },
  
  articleDate: {
    fontSize: '0.8rem',
    color: 'rgba(35, 50, 47, 0.5)',
  },
  
  excerpt: {
    fontSize: '0.95rem',
    color: 'rgba(35, 50, 47, 0.7)',
    lineHeight: '1.7',
    marginBottom: '1.25rem',
    flex: '1',
    display: '-webkit-box',
    WebkitLineClamp: '3',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  
  readMore: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#609966',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: 'auto',
  },
  
  arrow: {
    display: 'inline-block',
    transition: 'transform 0.3s ease',
  },
};

export default DogsArticles;