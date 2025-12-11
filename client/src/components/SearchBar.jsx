// client/src/components/SearchBar.jsx
import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Шукати тварин...", showFilters = false }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [category, setCategory] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ query, category: category !== 'all' ? category : undefined });
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch({ query: '', category: category !== 'all' ? category : undefined });
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div
          style={{
            ...styles.searchWrapper,
            borderColor: isFocused ? '#609966' : 'rgba(157, 192, 139, 0.3)',
            boxShadow: isFocused 
              ? '0 8px 24px rgba(96, 153, 102, 0.2)' 
              : '0 4px 16px rgba(35, 50, 47, 0.08)',
          }}
        >
          <span style={styles.searchIcon}>🔍</span>
          
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={styles.input}
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              style={styles.clearButton}
              aria-label="Очистити пошук"
            >
              ✕
            </button>
          )}

          <button type="submit" style={styles.button}>
            <span style={styles.buttonText}>Шукати</span>
            <span style={styles.buttonIcon}>→</span>
          </button>
        </div>
      </form>

      {showFilters && (
        <div style={styles.filtersContainer}>
          <div style={styles.filterLabel}>Категорія:</div>
          <div style={styles.filterButtons}>
            {[
              { value: 'all', label: 'Всі', icon: '🐾' },
              { value: 'dog', label: 'Собаки', icon: '🐕' },
              { value: 'cat', label: 'Коти', icon: '🐈' },
              { value: 'other', label: 'Інші', icon: '🦜' },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => {
                  setCategory(filter.value);
                  if (onSearch && query) {
                    onSearch({ 
                      query, 
                      category: filter.value !== 'all' ? filter.value : undefined 
                    });
                  }
                }}
                style={{
                  ...styles.filterButton,
                  ...(category === filter.value ? styles.filterButtonActive : {}),
                }}
                className={`filter-button ${category === filter.value ? 'active' : ''}`}
              >
                <span style={styles.filterIcon}>{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {query && (
        <div style={styles.searchInfo}>
          Пошук: <strong>"{query}"</strong>
          {category !== 'all' && (
            <> в категорії <strong>{
              category === 'dog' ? 'Собаки' : 
              category === 'cat' ? 'Коти' : 'Інші'
            }</strong></>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
  },

  form: {
    width: '100%',
  },

  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0.75rem',
    backgroundColor: '#FFFFFF',
    borderRadius: '50px',
    border: '2px solid',
    transition: 'all 0.3s ease',
    position: 'relative',
  },

  searchIcon: {
    fontSize: '1.3rem',
    paddingLeft: '0.5rem',
    opacity: 0.6,
    flexShrink: 0,
  },

  input: {
    flex: 1,
    padding: '0.75rem 0.5rem',
    fontSize: '1rem',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#23322F',
    minWidth: 0,
  },

  clearButton: {
    width: '32px',
    height: '32px',
    padding: 0,
    backgroundColor: 'rgba(35, 50, 47, 0.1)',
    color: '#23322F',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },

  button: {
    padding: '0.75rem 1.75rem',
    fontSize: '1rem',
    background: 'linear-gradient(135deg, #609966 0%, #40513B 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 6px 16px rgba(96, 153, 102, 0.4)',
    flexShrink: 0,
  },

  buttonText: {
    display: 'inline-block',
  },

  buttonIcon: {
    display: 'inline-block',
    transition: 'transform 0.3s ease',
    fontSize: '1.2rem',
  },

  filtersContainer: {
    marginTop: '1.5rem',
    padding: '1.5rem',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(35, 50, 47, 0.06)',
    border: '1px solid rgba(157, 192, 139, 0.2)',
  },

  filterLabel: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'rgba(35, 50, 47, 0.7)',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  filterButtons: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },

  filterButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '0.95rem',
    backgroundColor: 'transparent',
    color: 'rgba(35, 50, 47, 0.7)',
    border: '2px solid rgba(157, 192, 139, 0.3)',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  filterButtonActive: {
    background: 'linear-gradient(135deg, #609966 0%, #40513B 100%)',
    color: '#FFFFFF',
    borderColor: '#609966',
    boxShadow: '0 6px 16px rgba(96, 153, 102, 0.4)',
  },

  filterIcon: {
    fontSize: '1.2rem',
  },

  searchInfo: {
    marginTop: '1rem',
    padding: '0.875rem 1.25rem',
    backgroundColor: 'rgba(157, 192, 139, 0.1)',
    borderRadius: '12px',
    fontSize: '0.95rem',
    color: 'rgba(35, 50, 47, 0.8)',
    textAlign: 'center',
    border: '1px solid rgba(157, 192, 139, 0.2)',
  },
};

export default SearchBar;