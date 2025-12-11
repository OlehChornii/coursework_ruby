// client/src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.brandSection}>
          <div style={styles.brandLogo}>
            <span style={styles.brandIcon}>🐾</span>
            <span style={styles.brandName}>PetMarket</span>
          </div>
          <p style={styles.brandDescription}>
            Найбільша платформа для пошуку та всиновлення домашніх тварин в Україні. 
            Об'єднуємо людей і тварин з 2020 року.
          </p>
          <div style={styles.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              📘
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              📷
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              🐦
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              📺
            </a>
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>Категорії</h4>
          <div style={styles.linkGroup}>
            <Link to="/dogs/list" style={styles.link}>
              <span style={styles.linkIcon}>🐕</span>
              Собаки
            </Link>
            <Link to="/cats/list" style={styles.link}>
              <span style={styles.linkIcon}>🐈</span>
              Коти
            </Link>
            <Link to="/others" style={styles.link}>
              <span style={styles.linkIcon}>🐰</span>
              Інші тварини
            </Link>
            <Link to="/adopt" style={styles.highlightLink}>
              <span style={styles.linkIcon}>💙</span>
              Всиновлення
            </Link>
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>Ресурси</h4>
          <div style={styles.linkGroup}>
            <Link to="/about" style={styles.link}>
              <span style={styles.linkIcon}>ℹ️</span>
              Про нас
            </Link>
            <Link to="/reviews" style={styles.link}>
              <span style={styles.linkIcon}>⭐</span>
              Відгуки
            </Link>
            <Link to="/dogs/breeds" style={styles.link}>
              <span style={styles.linkIcon}>📖</span>
              Породи собак
            </Link>
            <Link to="/cats/breeds" style={styles.link}>
              <span style={styles.linkIcon}>📖</span>
              Породи котів
            </Link>
            <Link to="/dogs/articles" style={styles.link}>
              <span style={styles.linkIcon}>📝</span>
              Статті про догляд
            </Link>
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>Контакти</h4>
          <div style={styles.contactGroup}>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📧</span>
              <div>
                <div style={styles.contactLabel}>Email</div>
                <a href="mailto:info@petmarket.ua" style={styles.contactLink}>
                  info@petmarket.ua
                </a>
              </div>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📱</span>
              <div>
                <div style={styles.contactLabel}>Телефон</div>
                <a href="tel:+380123456789" style={styles.contactLink}>
                  +380 (12) 345-67-89
                </a>
              </div>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📍</span>
              <div>
                <div style={styles.contactLabel}>Адреса</div>
                <p style={styles.contactText}>Київ, Україна</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.newsletter}>
        <div style={styles.newsletterContent}>
          <div style={styles.newsletterText}>
            <h4 style={styles.newsletterTitle}>
              📬 Підпишіться на новини
            </h4>
            <p style={styles.newsletterSubtitle}>
              Отримуйте інформацію про нових улюбленців та корисні поради
            </p>
          </div>
          <div style={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Ваша електронна пошта" 
              style={styles.newsletterInput}
            />
            <button style={styles.newsletterButton}>
              Підписатися
            </button>
          </div>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <div style={styles.bottomContent}>
          <p style={styles.copyright}>
            © {currentYear} <span style={styles.copyrightBrand}>PetMarket</span>. Всі права захищені.
          </p>
          <div style={styles.bottomLinks}>
            <Link to="/privacy" style={styles.bottomLink}>
              Політика конфіденційності
            </Link>
            <span style={styles.separator}>•</span>
            <Link to="/terms" style={styles.bottomLink}>
              Умови використання
            </Link>
            <span style={styles.separator}>•</span>
            <Link to="/contact" style={styles.bottomLink}>
              Зв'язатися з нами
            </Link>
          </div>
        </div>
      </div>

      <button 
        style={styles.backToTop}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Повернутися вгору"
      >
        ⬆
      </button>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#40513B',
    color: '#EDF1D6',
    marginTop: '4rem',
    position: 'relative',
  },

  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 2rem 3rem',
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr',
    gap: '3rem',
  },

  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  brandLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    marginBottom: '0.5rem',
  },
  brandIcon: {
    fontSize: '2.5rem',
  },
  brandName: {
    fontSize: '2rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #9DC08B, #EDF1D6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  brandDescription: {
    color: '#EDF1D6',
    fontSize: '0.95rem',
    lineHeight: '1.7',
    opacity: 0.9,
    margin: 0,
  },
  socialLinks: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(157, 192, 139, 0.15)',
    borderRadius: '10px',
    fontSize: '1.3rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
  },

  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  heading: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
    color: '#fff',
    fontWeight: '700',
    letterSpacing: '-0.3px',
  },
  linkGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    color: '#EDF1D6',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    padding: '0.4rem 0',
    opacity: 0.9,
  },
  linkIcon: {
    fontSize: '1.1rem',
    opacity: 0.8,
  },
  highlightLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    color: '#9DC08B',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    padding: '0.4rem 0',
  },

  contactGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.8rem',
  },
  contactIcon: {
    fontSize: '1.4rem',
    marginTop: '0.1rem',
  },
  contactLabel: {
    fontSize: '0.8rem',
    color: '#9DC08B',
    fontWeight: '600',
    marginBottom: '0.2rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  contactLink: {
    color: '#EDF1D6',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.3s ease',
  },
  contactText: {
    color: '#EDF1D6',
    fontSize: '0.95rem',
    margin: 0,
  },

  newsletter: {
    backgroundColor: 'rgba(96, 153, 102, 0.15)',
    borderTop: '2px solid rgba(157, 192, 139, 0.2)',
    borderBottom: '2px solid rgba(157, 192, 139, 0.2)',
  },
  newsletterContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
  },
  newsletterText: {
    flex: '1',
  },
  newsletterTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 0.5rem 0',
  },
  newsletterSubtitle: {
    fontSize: '0.95rem',
    color: '#EDF1D6',
    opacity: 0.9,
    margin: 0,
  },
  newsletterForm: {
    display: 'flex',
    gap: '0.75rem',
    maxWidth: '450px',
    flex: '1',
  },
  newsletterInput: {
    flex: 1,
    padding: '0.9rem 1.2rem',
    borderRadius: '10px',
    border: '2px solid rgba(157, 192, 139, 0.3)',
    backgroundColor: 'rgba(237, 241, 214, 0.1)',
    color: '#EDF1D6',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  newsletterButton: {
    padding: '0.9rem 2rem',
    backgroundColor: '#9DC08B',
    color: '#40513B',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },

  bottomBar: {
    backgroundColor: 'rgba(35, 50, 47, 0.5)',
  },
  bottomContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.75rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
  },
  copyright: {
    color: '#EDF1D6',
    fontSize: '0.9rem',
    opacity: 0.85,
    margin: 0,
  },
  copyrightBrand: {
    color: '#9DC08B',
    fontWeight: '700',
  },
  bottomLinks: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  bottomLink: {
    color: '#EDF1D6',
    textDecoration: 'none',
    fontSize: '0.85rem',
    opacity: 0.85,
    transition: 'all 0.3s ease',
  },
  separator: {
    color: '#9DC08B',
    opacity: 0.5,
  },

  backToTop: {
    position: 'fixed',
    bottom: '2rem',
    left: '2rem',
    width: '50px',
    height: '50px',
    backgroundColor: '#609966',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    fontSize: '1.4rem',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(96, 153, 102, 0.4)',
    transition: 'all 0.3s ease',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Footer;