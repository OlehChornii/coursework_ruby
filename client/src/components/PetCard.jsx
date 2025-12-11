// client/src/components/PetCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PetCard = ({ pet }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getCategoryPath = () => {
    switch (pet.category) {
      case 'dog':
        return '/dogs';
      case 'cat':
        return '/cats';
      default:
        return '/others';
    }
  };

  const getCategoryIcon = () => {
    switch (pet.category) {
      case 'dog':
        return '🐕';
      case 'cat':
        return '🐈';
      default:
        return '🐾';
    }
  };

  const getCategoryLabel = () => {
    switch (pet.category) {
      case 'dog':
        return 'Собака';
      case 'cat':
        return 'Кіт';
      default:
        return 'Тварина';
    }
  };

  const formatAge = (months) => {
    if (!months) return 'Вік невідомий';
    if (months < 12) {
      return `${months} ${months === 1 ? 'місяць' : months < 5 ? 'місяці' : 'місяців'}`;
    }
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'рік' : years < 5 ? 'роки' : 'років'}`;
    }
    return `${years} ${years === 1 ? 'рік' : 'р.'} ${remainingMonths} міс.`;
  };

  return (
    <Link
      to={`${getCategoryPath()}/${pet.id}`}
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-16px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 20px 48px rgba(96, 153, 102, 0.25)' 
          : '0 4px 12px rgba(35, 50, 47, 0.06)',
        borderColor: isHovered ? 'rgba(157, 192, 139, 0.3)' : 'rgba(157, 192, 139, 0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="pet-card"
    >
      <div style={styles.imageContainer}>
        {pet.image_url && !imageError ? (
          <img
            src={pet.image_url}
            alt={pet.name}
            style={{
              ...styles.image,
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={styles.placeholder}>
            <span style={styles.placeholderIcon}>{getCategoryIcon()}</span>
          </div>
        )}
        
        <div style={styles.categoryBadge}>
          <span style={styles.categoryIcon}>{getCategoryIcon()}</span>
          {getCategoryLabel()}
        </div>

        {pet.is_for_adoption && (
          <div style={styles.adoptionOverlay}>
            <div style={styles.heartIcon}>💛</div>
          </div>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <h3 style={styles.name}>{pet.name}</h3>
          {pet.breed && (
            <p style={styles.breed}>{pet.breed}</p>
          )}
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>
              {pet.gender === 'male' ? '♂' : '♀'}
            </span>
            <span style={styles.infoText}>
              {pet.gender === 'male' ? 'Самець' : 'Самка'}
            </span>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>📅</span>
            <span style={styles.infoText}>{formatAge(pet.age_months)}</span>
          </div>

          {pet.size && (
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>📏</span>
              <span style={styles.infoText}>
                {pet.size === 'small' ? 'Малий' : 
                 pet.size === 'medium' ? 'Середній' : 'Великий'}
              </span>
            </div>
          )}

          {pet.color && (
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>🎨</span>
              <span style={styles.infoText}>{pet.color}</span>
            </div>
          )}
        </div>

        <div style={styles.divider}></div>

        {pet.is_for_adoption ? (
          <div style={styles.adoptionBadge}>
            <span style={styles.adoptionIcon}>💛</span>
            <span style={styles.adoptionText}>Доступний для всиновлення</span>
          </div>
        ) : (
          <div style={styles.priceContainer}>
            <span style={styles.priceLabel}>Ціна:</span>
            <span style={styles.price}>
              {pet.price ? `${pet.price.toLocaleString('uk-UA')} грн` : 'Договірна'}
            </span>
          </div>
        )}

        {pet.description && (
          <p style={styles.description}>
            {pet.description.length > 80 
              ? `${pet.description.substring(0, 80)}...` 
              : pet.description}
          </p>
        )}

        <div style={styles.footer}>
          <button
            style={{
              ...styles.viewButton,
              backgroundColor: isHovered ? '#609966' : 'transparent',
              color: isHovered ? '#FFFFFF' : '#609966',
            }}
          >
            Переглянути
            <span style={{
              ...styles.arrow,
              transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
            }}>
              →
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: '#23322F',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    border: '2px solid transparent',
    position: 'relative',
    height: '100%',
    boxShadow: '0 2px 8px rgba(35, 50, 47, 0.05)',
  },

  imageContainer: {
    width: '100%',
    height: '240px',
    overflow: 'hidden',
    backgroundColor: '#EDF1D6',
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  placeholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #EDF1D6 0%, #9DC08B 100%)',
  },

  placeholderIcon: {
    fontSize: '5rem',
    opacity: 0.4,
    filter: 'grayscale(0.2)',
  },

  categoryBadge: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#609966',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },

  categoryIcon: {
    fontSize: '1.1rem',
  },

  adoptionOverlay: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '56px',
    height: '56px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(10px)',
    animation: 'pulse 2s ease-in-out infinite',
  },

  heartIcon: {
    fontSize: '1.8rem',
  },

  content: {
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },

  header: {
    marginBottom: '1rem',
  },

  name: {
    fontSize: '1.5rem',
    marginBottom: '0.35rem',
    fontWeight: '700',
    color: '#23322F',
    lineHeight: 1.3,
  },

  breed: {
    color: '#609966',
    fontSize: '1rem',
    fontWeight: '500',
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem',
    marginBottom: '1.25rem',
  },

  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 0.75rem',
    backgroundColor: 'rgba(157, 192, 139, 0.08)',
    borderRadius: '10px',
    fontSize: '0.9rem',
  },

  infoIcon: {
    fontSize: '1.2rem',
    opacity: 0.8,
  },

  infoText: {
    color: 'rgba(35, 50, 47, 0.8)',
    fontWeight: '500',
    fontSize: '0.9rem',
  },

  divider: {
    height: '1px',
    backgroundColor: 'rgba(35, 50, 47, 0.1)',
    margin: '1.25rem 0',
  },

  adoptionBadge: {
    background: 'linear-gradient(135deg, #9DC08B 0%, #7db876 100%)',
    color: '#FFFFFF',
    padding: '1rem',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 6px 16px rgba(157, 192, 139, 0.3)',
  },

  adoptionIcon: {
    fontSize: '1.3rem',
  },

  adoptionText: {
    flex: 1,
  },

  priceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(96, 153, 102, 0.08)',
    borderRadius: '12px',
  },

  priceLabel: {
    color: 'rgba(35, 50, 47, 0.7)',
    fontSize: '0.95rem',
    fontWeight: '500',
  },

  price: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#609966',
  },

  description: {
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: 'rgba(35, 50, 47, 0.7)',
    lineHeight: 1.6,
  },

  footer: {
    marginTop: 'auto',
    paddingTop: '1.25rem',
  },

  viewButton: {
    width: '100%',
    padding: '0.875rem',
    border: '2px solid #609966',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },

  arrow: {
    display: 'inline-block',
    transition: 'transform 0.3s ease',
    fontSize: '1.2rem',
  },
};

export default PetCard;