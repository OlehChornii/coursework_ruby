// client/src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usersAPI } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await usersAPI.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка входу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h1 style={styles.title}>Вхід</h1>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="your@email.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Завантаження...' : 'Увійти'}
          </button>
        </form>

        <p style={styles.text}>
          Немає акаунту? <Link to="/register" style={styles.link}>Зареєструватися</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
  },
  formBox: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(64, 81, 59, 0.15)',
    width: '100%',
    maxWidth: '500px',
    border: '2px solid #9DC08B',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#40513B',
    fontWeight: '700',
  },
  error: {
    backgroundColor: '#A0522D',
    color: '#fff',
    padding: '0.85rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#40513B',
  },
  input: {
    padding: '0.85rem',
    border: '2px solid #9DC08B',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  button: {
    padding: '1rem',
    backgroundColor: '#609966',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(96, 153, 102, 0.3)',
  },
  text: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#609966',
  },
  link: {
    color: '#609966',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
};


export default Login;
