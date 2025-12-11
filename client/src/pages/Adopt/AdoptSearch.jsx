// client/src/pages/Adopt/AdoptSearch.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { petsAPI } from '../../services/api';
import PetCard from '../../components/PetCard';

const AdoptSearch = () => {
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    breed: '',
    gender: '',
    minAge: '',
    maxAge: '',
    sort: 'recent',
  });

  useEffect(() => {
    if (filters.category && filters.category !== 'all') {
      fetchBreeds(filters.category);
    } else {
      setBreeds([]);
      setFilters(prev => ({ ...prev, breed: '' }));
    }
  }, [filters.category]);

  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        forAdoption: 'true',
        q: filters.q || undefined,
        category: filters.category || undefined,
        breed: filters.breed || undefined,
        gender: filters.gender || undefined,
        min_age_months: filters.minAge || undefined,
        max_age_months: filters.maxAge || undefined,
        sort: filters.sort || 'recent',
      };

      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await petsAPI.getAll(params);
      
      const data = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || [];
      
      setPets(data);
    } catch (error) {
      console.error('Error fetching adoption pets:', error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const fetchBreeds = async (category) => {
    try {
      const response = await petsAPI.getBreeds(category);
      setBreeds(response.data);
    } catch (error) {
      console.error('Error fetching breeds:', error);
      setBreeds([]);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      q: '',
      category: '',
      breed: '',
      gender: '',
      minAge: '',
      maxAge: '',
      sort: 'recent',
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>💙 Всиновлення тварин</h1>
          <p style={styles.heroSubtitle}>
            Подаруйте дім тварині з притулку — знайдіть друга поруч
          </p>
        </div>
      </div>

      <div style={styles.contentGrid}>
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Фільтри</h3>

          <div style={styles.filterGroup}>
            <label style={styles.label}>🔍 Пошук</label>
            <input
              type="text"
              placeholder="Ім'я, порода, опис..."
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Категорія</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={styles.select}
            >
              <option value="">Всі категорії</option>
              <option value="dog">🐕 Собаки</option>
              <option value="cat">🐈 Коти</option>
              <option value="other">🐾 Інше</option>
            </select>
          </div>

          {filters.category && filters.category !== 'all' && (
            <div style={styles.filterGroup}>
              <label style={styles.label}>Порода</label>
              <select
                value={filters.breed}
                onChange={(e) => handleFilterChange('breed', e.target.value)}
                style={styles.select}
              >
                <option value="">Всі породи</option>
                {breeds.map((breed) => (
                  <option key={breed.id} value={breed.name}>
                    {breed.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={styles.filterGroup}>
            <label style={styles.label}>Стать</label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              style={styles.select}
            >
              <option value="">Не важливо</option>
              <option value="male">♂ Самець</option>
              <option value="female">♀ Самка</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Вік (місяців)</label>
            <div style={styles.rangeInputs}>
              <input
                type="number"
                min="0"
                placeholder="Від"
                value={filters.minAge}
                onChange={(e) => handleFilterChange('minAge', e.target.value)}
                style={styles.smallInput}
              />
              <span style={{ padding: '0 0.5rem', color: '#6b7170', whiteSpace: 'nowrap' }}>—</span>
              <input
                type="number"
                min="0"
                placeholder="До"
                value={filters.maxAge}
                onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                style={styles.smallInput}
              />
            </div>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Сортування</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              style={styles.select}
            >
              <option value="">Не важливо</option>
              <option value="age_asc">Вік: за зростанням</option>
              <option value="age_desc">Вік: за спаданням</option>
              <option value="name">За ім'ям (А-Я)</option>
            </select>
          </div>

          <button
            onClick={handleClearFilters}
            style={styles.resetButton}
          >
            Скинути фільтри
          </button>
        </aside>

        <main style={styles.main}>
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p>Завантаження тварин...</p>
            </div>
          ) : pets.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyEmoji}>😿</div>
              <h3>Тварин для всиновлення не знайдено</h3>
              <p style={{ color: '#6b7170', marginBottom: '1rem' }}>
                Спробуйте змінити фільтри або поверніться пізніше
              </p>
              <button style={styles.primaryButton} onClick={handleClearFilters}>
                Скинути фільтри
              </button>
            </div>
          ) : (
            <>
              <div style={styles.grid}>
                {pets.map((pet) => (
                  <div key={pet.id} style={styles.cardWrapper}>
                    <PetCard pet={pet} />
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    padding: '2.5rem',
    marginBottom: '2rem',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
  },

  heroTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '2.5rem',
    fontWeight: '700',
  },

  heroSubtitle: {
    margin: 0,
    fontSize: '1.1rem',
    opacity: 0.95,
  },

  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '2rem',
  },

  sidebar: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '16px',
    height: 'fit-content',
    boxShadow: '0 4px 16px rgba(64, 81, 59, 0.1)',
    border: '2px solid #9DC08B',
    position: 'sticky',
    top: '2rem',
  },

  sidebarTitle: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.25rem',
    color: '#40513B',
    fontWeight: '700',
  },

  filterGroup: {
    marginBottom: '1.25rem',
  },

  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#40513B',
    fontSize: '0.9rem',
  },

  input: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #9DC08B',
    borderRadius: '10px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },

  select: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #9DC08B',
    borderRadius: '10px',
    fontSize: '0.95rem',
    outline: 'none',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },

  rangeInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  smallInput: {
    flex: '1 1 0',
    minWidth: 0,
    padding: '0.65rem',
    border: '2px solid #9DC08B',
    borderRadius: '10px',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  },

  resetButton: {
    width: '100%',
    padding: '0.85rem',
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    marginTop: '0.5rem',
    transition: 'all 0.2s',
  },

  main: {
    minHeight: '500px',
  },

  loading: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#718096',
  },

  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    margin: '0 auto 1rem auto',
    animation: 'spin 0.8s linear infinite',
  },

  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
  },

  emptyEmoji: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },

  primaryButton: {
    padding: '0.85rem 1.5rem',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.2s',
  },

  resultsHeader: {
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f7fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },

  resultsCount: {
    margin: 0,
    color: '#4a5568',
    fontSize: '0.95rem',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.5rem',
  },

  cardWrapper: {
    display: 'flex',
  },
};

export default AdoptSearch;