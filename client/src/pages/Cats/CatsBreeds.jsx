// client/src/pages/Cats/CatsBreeds.jsx
import React, { useState, useEffect } from 'react';
import { petsAPI } from '../../services/api';

const CatsBreeds = () => {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      const response = await petsAPI.getBreeds('cat');
      setBreeds(response.data);
    } catch (error) {
      console.error('Error fetching breeds:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBreeds = breeds.filter(breed =>
    breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (breed.description && breed.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            <span style={styles.icon}>🐈</span>
            Породи котів
          </h1>
          <p style={styles.subtitle}>
            Відкрийте для себе різноманітні породи котів та їх унікальні характеристики
          </p>
        </div>
        
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Пошук породи..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Завантаження порід...</p>
        </div>
      ) : filteredBreeds.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔍</div>
          <h3 style={styles.emptyTitle}>Нічого не знайдено</h3>
          <p style={styles.emptyText}>
            Спробуйте змінити пошуковий запит
          </p>
        </div>
      ) : (
        <>
          <div style={styles.resultsCount}>
            Знайдено порід: <strong>{filteredBreeds.length}</strong>
          </div>
          
          <div style={styles.breedGrid}>
            {filteredBreeds.map((breed, index) => (
              <div 
                key={breed.id} 
                style={{
                  ...styles.breedCard,
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <div style={styles.imageContainer}>
                  {breed.image_url ? (
                    <img 
                      src={breed.image_url} 
                      alt={breed.name} 
                      style={styles.breedImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div style={styles.imagePlaceholder}>
                    <span style={styles.placeholderIcon}>🐱</span>
                  </div>
                </div>
                
                <div style={styles.cardContent}>
                  <h3 style={styles.breedName}>{breed.name}</h3>
                  
                  {breed.description && (
                    <p style={styles.description}>{breed.description}</p>
                  )}
                  
                  {breed.characteristics && (
                    <div style={styles.characteristics}>
                      <div style={styles.characteristicsLabel}>
                        ✨ Характеристики
                      </div>
                      <div style={styles.characteristicsContent}>
                        {breed.characteristics}
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
  
  header: {
    marginBottom: '3rem',
    textAlign: 'center',
  },
  
  headerContent: {
    marginBottom: '2rem',
  },
  
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#23322F',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  },
  
  icon: {
    fontSize: '3.5rem',
    animation: 'bounce 2s ease-in-out infinite',
  },
  
  subtitle: {
    fontSize: '1.125rem',
    color: 'rgba(35, 50, 47, 0.7)',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  
  searchContainer: {
    maxWidth: '500px',
    margin: '0 auto',
  },
  
  searchInput: {
    width: '100%',
    padding: '1rem 1.5rem',
    fontSize: '1rem',
    border: '2px solid rgba(157, 192, 139, 0.3)',
    borderRadius: '50px',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: '0 2px 8px rgba(35, 50, 47, 0.08)',
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '1.5rem',
  },
  
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(157, 192, 139, 0.2)',
    borderTop: '4px solid #609966',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  loadingText: {
    fontSize: '1.125rem',
    color: 'rgba(35, 50, 47, 0.7)',
    fontWeight: '500',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    marginTop: '2rem',
  },
  
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: '0.5',
  },
  
  emptyTitle: {
    fontSize: '1.5rem',
    color: '#23322F',
    marginBottom: '0.5rem',
  },
  
  emptyText: {
    fontSize: '1rem',
    color: 'rgba(35, 50, 47, 0.6)',
  },
  
  resultsCount: {
    marginBottom: '2rem',
    fontSize: '1rem',
    color: 'rgba(35, 50, 47, 0.7)',
    textAlign: 'center',
  },
  
  breedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  
  breedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(35, 50, 47, 0.1)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeInUp 0.5s ease forwards',
  },
  
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '240px',
    backgroundColor: '#EDF1D6',
    overflow: 'hidden',
  },
  
  breedImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
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
    backgroundColor: '#EDF1D6',
  },
  
  placeholderIcon: {
    fontSize: '4rem',
    opacity: '0.4',
  },
  
  cardContent: {
    padding: '1.5rem',
    flex: '1',
  },
  
  breedName: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#23322F',
    marginBottom: '0.75rem',
  },
  
  description: {
    fontSize: '0.95rem',
    color: 'rgba(35, 50, 47, 0.75)',
    lineHeight: '1.6',
    marginBottom: '1rem',
    display: '-webkit-box',
    WebkitLineClamp: '3',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  
  characteristics: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(157, 192, 139, 0.1)',
    borderRadius: '10px',
    borderLeft: '3px solid #9DC08B',
  },
  
  characteristicsLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#609966',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  characteristicsContent: {
    fontSize: '0.9rem',
    color: 'rgba(35, 50, 47, 0.8)',
    lineHeight: '1.5',
  },
  
  cardFooter: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid rgba(35, 50, 47, 0.08)',
  },
  
  detailsButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'transparent',
    color: '#609966',
    border: '2px solid #609966',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
};

export default CatsBreeds;