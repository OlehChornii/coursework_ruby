// client/src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleAuthChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('authChanged', handleAuthChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    try { 
      window.dispatchEvent(new Event('authChanged')); 
    } catch (e) { 
    }
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header style={{
        ...styles.header,
        boxShadow: scrolled ? '0 12px 32px rgba(64, 81, 59, 0.3)' : '0 2px 8px rgba(64, 81, 59, 0.1)',
        transition: 'all 0.3s ease',
      }}>
        <div style={styles.container}>
          <Link to="/" style={styles.logo}>
            <span style={styles.logoIcon}>🐾</span>
            <span style={styles.logoText}>PetMarket</span>
          </Link>

          <nav style={styles.nav} className="desktop-nav">
            <Link 
              to="/dogs/list" 
              style={{
                ...styles.navLink,
                ...(isActive('/dogs') ? styles.navLinkActive : {})
              }}
            >
              <span style={styles.navIcon}>🐕</span>
              Собаки
            </Link>
            <Link 
              to="/cats/list" 
              style={{
                ...styles.navLink,
                ...(isActive('/cats') ? styles.navLinkActive : {})
              }}
            >
              <span style={styles.navIcon}>🐈</span>
              Коти
            </Link>
            <Link 
              to="/others" 
              style={{
                ...styles.navLink,
                ...(isActive('/others') ? styles.navLinkActive : {})
              }}
            >
              <span style={styles.navIcon}>🐰</span>
              Інші
            </Link>
            <Link 
              to="/adopt" 
              style={{
                ...styles.adoptLink,
                ...(isActive('/adopt') ? styles.adoptLinkActive : {})
              }}
            >
              <span style={styles.adoptIcon}>💙</span>
              Всиновлення
            </Link>            
          </nav>

          <div style={styles.actions} className="desktop-actions">
            <Link to="/cart" style={styles.cartLink}>
              <span style={styles.cartIcon}>🛒</span>
              <span style={styles.cartText}>Кошик</span>
            </Link>
            
            {user ? (
              <div style={styles.userMenu}>
                <Link to="/user/profile" style={styles.profileLink}>
                  <span style={styles.avatarIcon}>
                    {user.first_name ? user.first_name.charAt(0).toUpperCase() : '👤'}
                  </span>
                  <span style={styles.userName}>{user.first_name || 'Профіль'}</span>
                </Link>
                <button onClick={handleLogout} style={styles.logoutButton}>
                  <span>🚪</span> Вийти
                </button>
              </div>
            ) : (
              <div style={styles.authLinks}>
                <Link to="/login" style={styles.loginLink}>
                  🔑 Вхід
                </Link>
                <Link to="/register" style={styles.registerButton}>
                  ✨ Реєстрація
                </Link>
              </div>
            )}
          </div>

          <button 
            style={styles.mobileMenuButton} 
            onClick={toggleMobileMenu}
            className="mobile-menu-toggle"
          >
            <span style={styles.hamburger}>
              {mobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div style={styles.mobileMenuOverlay} onClick={toggleMobileMenu}>
          <div style={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <div style={styles.mobileMenuHeader}>
              <span style={styles.mobileMenuTitle}>Меню</span>
              <button style={styles.mobileMenuClose} onClick={toggleMobileMenu}>
                ✕
              </button>
            </div>

            <nav style={styles.mobileNav}>
              <Link to="/dogs/list" style={styles.mobileNavLink} onClick={toggleMobileMenu}>
                <span style={styles.mobileNavIcon}>🐕</span>
                Собаки
              </Link>
              <Link to="/cats/list" style={styles.mobileNavLink} onClick={toggleMobileMenu}>
                <span style={styles.mobileNavIcon}>🐈</span>
                Коти
              </Link>
              <Link to="/others" style={styles.mobileNavLink} onClick={toggleMobileMenu}>
                <span style={styles.mobileNavIcon}>🐰</span>
                Інші
              </Link>
              <Link to="/adopt" style={styles.mobileAdoptLink} onClick={toggleMobileMenu}>
                <span style={styles.mobileNavIcon}>💙</span>
                Всиновлення
              </Link>              
              <Link to="/cart" style={styles.mobileNavLink} onClick={toggleMobileMenu}>
                <span style={styles.mobileNavIcon}>🛒</span>
                Кошик
              </Link>

              <div style={styles.mobileDivider}></div>

              {user ? (
                <>
                  <Link to="/user/profile" style={styles.mobileNavLink} onClick={toggleMobileMenu}>
                    <span style={styles.mobileNavIcon}>👤</span>
                    {user.first_name || 'Профіль'}
                  </Link>
                  <button onClick={() => { handleLogout(); toggleMobileMenu(); }} style={styles.mobileLogoutButton}>
                    <span style={styles.mobileNavIcon}>🚪</span>
                    Вийти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={styles.mobileNavLink} onClick={toggleMobileMenu}>
                    <span style={styles.mobileNavIcon}>🔑</span>
                    Вхід
                  </Link>
                  <Link to="/register" style={styles.mobileRegisterLink} onClick={toggleMobileMenu}>
                    <span style={styles.mobileNavIcon}>✨</span>
                    Реєстрація
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  header: {
    backgroundColor: '#40513B',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    textDecoration: 'none',
    transition: 'transform 0.3s ease',
  },
  logoIcon: {
    fontSize: '2rem',
    animation: 'float 3s ease-in-out infinite',
  },
  logoText: {
    fontSize: '1.6rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #9DC08B, #EDF1D6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.5px',
  },

  nav: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#EDF1D6',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: '0.65rem 1rem',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  navLinkActive: {
    backgroundColor: 'rgba(157, 192, 139, 0.2)',
    color: '#9DC08B',
    transform: 'translateY(-2px)',
  },
  navIcon: {
    fontSize: '1.1rem',
  },
  adoptLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'linear-gradient(135deg, #9DC08B, #7db876)',
    color: '#40513B',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '700',
    padding: '0.7rem 1.3rem',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 16px rgba(157, 192, 139, 0.35)',
  },
  adoptLinkActive: {
    background: 'linear-gradient(135deg, #609966, #40513B)',
    color: '#fff',
    boxShadow: '0 8px 20px rgba(96, 153, 102, 0.4)',
  },
  adoptIcon: {
    fontSize: '1.1rem',
  },

  actions: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  cartLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#EDF1D6',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: '0.65rem 1rem',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  cartIcon: {
    fontSize: '1.3rem',
  },
  cartText: {
    display: 'inline',
  },
  cartBadge: {
    position: 'absolute',
    top: '0.3rem',
    right: '0.3rem',
    backgroundColor: '#e74c3c',
    color: '#fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: '700',
  },

  userMenu: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  profileLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    color: '#EDF1D6',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: '0.6rem 1rem',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
  },
  avatarIcon: {
    fontSize: '0.9rem',
    fontWeight: '700',
    backgroundColor: '#609966',
    color: '#fff',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  userName: {
    display: 'inline',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: '#d35400',
    color: '#fff',
    border: 'none',
    padding: '0.65rem 1.1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 3px 8px rgba(211, 84, 0, 0.3)',
  },

  authLinks: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  loginLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#EDF1D6',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: '0.65rem 1.1rem',
    borderRadius: '10px',
    border: '2px solid rgba(237, 241, 214, 0.3)',
    transition: 'all 0.3s ease',
  },
  registerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'linear-gradient(135deg, #9DC08B, #7db876)',
    color: '#40513B',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '700',
    padding: '0.7rem 1.3rem',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 16px rgba(157, 192, 139, 0.35)',
  },

  mobileMenuButton: {
    display: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#EDF1D6',
    fontSize: '1.8rem',
    cursor: 'pointer',
    padding: '0.5rem',
    transition: 'all 0.3s ease',
  },
  hamburger: {
    display: 'block',
    lineHeight: 1,
  },
  mobileMenuOverlay: {
    display: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(35, 50, 47, 0.8)',
    zIndex: 9999,
    animation: 'fadeIn 0.3s ease',
  },
  mobileMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '280px',
    height: '100%',
    backgroundColor: '#40513B',
    boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.3)',
    animation: 'slideInRight 0.3s ease',
    overflowY: 'auto',
  },
  mobileMenuHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '2px solid rgba(157, 192, 139, 0.2)',
  },
  mobileMenuTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#EDF1D6',
  },
  mobileMenuClose: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#EDF1D6',
    fontSize: '1.8rem',
    cursor: 'pointer',
    padding: '0.2rem',
    lineHeight: 1,
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    gap: '0.5rem',
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    color: '#EDF1D6',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    padding: '0.9rem 1rem',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(157, 192, 139, 0.05)',
  },
  mobileNavIcon: {
    fontSize: '1.3rem',
  },
  mobileAdoptLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    color: '#40513B',
    backgroundColor: '#9DC08B',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '700',
    padding: '0.9rem 1rem',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
  },
  mobileDivider: {
    height: '2px',
    backgroundColor: 'rgba(157, 192, 139, 0.2)',
    margin: '0.5rem 0',
  },
  mobileLogoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    color: '#fff',
    backgroundColor: '#d35400',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    padding: '0.9rem 1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    textAlign: 'left',
  },
  mobileRegisterLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    color: '#40513B',
    backgroundColor: '#9DC08B',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '700',
    padding: '0.9rem 1rem',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
  },
};

export default Header;