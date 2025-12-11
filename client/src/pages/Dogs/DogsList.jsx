// client/src/pages/Dogs/DogsList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { petsAPI } from '../../services/api';
import PetCard from '../../components/PetCard';

const DogsList = () => {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    breed: '',
    gender: '',
    minPrice: '',
    maxPrice: '',
    minAge: '',
    maxAge: '',
    search: '',
    sort: 'recent',
  });


  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchDogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        category: 'dog',
        breed: filters.breed || undefined,
        gender: filters.gender || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        min_age_months: filters.minAge || undefined,
        max_age_months: filters.maxAge || undefined,
        search: filters.search || undefined,
        sort: filters.sort || 'recent',
      };

      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await petsAPI.getByCategory('dog', params);
      setDogs(response.data);
    } catch (error) {
      console.error('Error fetching dogs:', error);
      setDogs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  const fetchBreeds = async () => {
    try {
      const response = await petsAPI.getBreeds('dog');
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
      breed: '',
      gender: '',
      minPrice: '',
      maxPrice: '',
      minAge: '',
      maxAge: '',
      search: '',
      sort: 'recent',
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🐕 Собаки</h1>
        <div style={styles.nav}>
          <Link to="/dogs/list" style={styles.navLinkActive}>
            Список
          </Link>
          <Link to="/dogs/breeds" style={styles.navLink}>
            Породи
          </Link>
          <Link to="/dogs/articles" style={styles.navLink}>
            Статті
          </Link>
        </div>
      </div>

      <div style={styles.content}>
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Фільтри</h3>

          <div style={styles.filterGroup}>
            <label style={styles.label}>🔍 Пошук</label>
            <input
              type="text"
              placeholder="Ім'я, порода, опис..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={styles.input}
            />
          </div>

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
              <span style={{ padding: '0 0.5rem', color: '#6b7170' }}>—</span>
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
            <label style={styles.label}>Ціна (грн)</label>
            <div style={styles.rangeInputs}>
              <input
                type="number"
                min="0"
                placeholder="Від"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                style={styles.smallInput}
              />
              <span style={{ padding: '0 0.5rem', color: '#6b7170' }}>—</span>
              <input
                type="number"
                min="0"
                placeholder="До"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
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
              <option value="price_asc">Ціна: за зростанням</option>
              <option value="price_desc">Ціна: за спаданням</option>
              <option value="age_asc">Вік: за зростанням</option>
              <option value="age_desc">Вік: за спаданням</option>
              <option value="name">За ім'ям (А-Я)</option>
            </select>
          </div>

          <button onClick={handleClearFilters} style={styles.resetButton}>
            Скинути фільтри
          </button>
        </aside>

        <main style={styles.main}>
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p>Завантаження собак...</p>
            </div>
          ) : dogs.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyEmoji}>🐶</div>
              <h3>Собак не знайдено</h3>
              <p style={{ color: '#6b7170', marginBottom: '1rem' }}>
                Спробуйте змінити фільтри або поверніться пізніше
              </p>
              <button style={styles.primaryButton} onClick={handleClearFilters}>
                Скинути фільтри
              </button>
            </div>
          ) : (
            <>
              <div style={styles.resultsHeader}>
                <p style={styles.resultsCount}>
                  Знайдено: <strong>{dogs.length}</strong> {dogs.length === 1 ? 'собака' : 'собак'}
                </p>
              </div>

              <div style={styles.grid}>
                {dogs.map((dog) => (
                  <div key={dog.id} style={styles.cardWrapper}>
                    <PetCard pet={dog} />
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

  header: {
    marginBottom: '2rem',
    color: '#40513B',
  },

  title: {
    margin: '0 0 1rem 0',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#40513B',
  },

  nav: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },

  navLink: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#e8f5e9',
    borderRadius: '10px',
    textDecoration: 'none',
    color: '#40513B',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
  },

  navLinkActive: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#9DC08B',
    borderRadius: '10px',
    textDecoration: 'none',
    color: '#fff',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    border: '2px solid #9DC08B',
  },

  content: {
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
    borderTop: '4px solid #9DC08B',
    borderRadius: '50%',
    margin: '0 auto 1rem auto',
    animation: 'spin 0.8s linear infinite',
  },

  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(64, 81, 59, 0.08)',
    border: '2px solid #e8f5e9',
  },

  emptyEmoji: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },

  primaryButton: {
    padding: '0.85rem 1.5rem',
    backgroundColor: '#9DC08B',
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
    padding: '1rem 1.25rem',
    backgroundColor: '#f1f8f1',
    borderRadius: '12px',
    border: '1px solid #9DC08B',
  },

  resultsCount: {
    margin: 0,
    color: '#40513B',
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

export default DogsList;