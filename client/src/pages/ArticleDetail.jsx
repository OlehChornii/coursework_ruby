// client/src/pages/ArticleDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { articlesAPI } from '../services/api';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await articlesAPI.getById(id);
        setArticle(res.data);
      } catch (e) {
        console.error('Article fetch error:', e);
        if (e.response) {
          setError(`HTTP ${e.response.status}`);
        } else {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const estimateReadingTime = (content) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinnerWrapper}>
          <div style={styles.spinner}></div>
          <div style={styles.spinnerInner}></div>
        </div>
        <p style={styles.loadingText}>Завантаження статті...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorContent}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Виникла помилка</h2>
          <p style={styles.errorMessage}>Помилка: {error}</p>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Повернутися назад
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={styles.notFoundContainer}>
        <div style={styles.notFoundContent}>
          <div style={styles.notFoundIcon}>📭</div>
          <h2 style={styles.notFoundTitle}>Стаття не знайдена</h2>
          <p style={styles.notFoundMessage}>
            На жаль, ми не змогли знайти статтю, яку ви шукаєте
          </p>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Повернутися назад
          </button>
        </div>
      </div>
    );
  }

  const readingTime = estimateReadingTime(article.content);

  return (
    <>
      <div style={{...styles.progressBar, width: `${readingProgress}%`}}></div>
      
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backButtonTop}>
          ← Назад
        </button>

        <article style={styles.content}>
          {article.image_url && (
            <div style={styles.imageContainer}>
              <img 
                src={article.image_url} 
                alt={article.title} 
                style={styles.image}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = 'linear-gradient(135deg, #EDF1D6 0%, #9DC08B 100%)';
                  e.target.parentElement.style.display = 'flex';
                  e.target.parentElement.style.alignItems = 'center';
                  e.target.parentElement.style.justifyContent = 'center';
                  e.target.parentElement.innerHTML = '<span style="font-size: 5rem; opacity: 0.3;">📄</span>';
                }}
              />
            </div>
          )}

          <div style={styles.headerSection}>
            <h1 style={styles.title}>{article.title}</h1>

            <div style={styles.metaContainer}>
              <div style={styles.authorSection}>
                <div style={styles.authorAvatar}>
                  {article.first_name?.[0]}{article.last_name?.[0]}
                </div>
                <div style={styles.authorInfo}>
                  <div style={styles.authorName}>
                    {article.first_name} {article.last_name}
                  </div>
                  <div style={styles.metaDetails}>
                    <span style={styles.metaItem}>
                      📅 {formatDate(article.created_at)}
                    </span>
                    {readingTime > 0 && (
                      <>
                        <span style={styles.metaDivider}>•</span>
                        <span style={styles.metaItem}>
                          ⏱️ {readingTime} хв читання
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.markdown}>
            <ReactMarkdown
              children={article.content || ''}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
              components={{
                p: ({ node, children, ...props }) => (
                  <p style={styles.paragraph} {...props}>{children}</p>
                ),
                a: ({ node, children, ...props }) => {
                  const isExternal = props.href && /^https?:\/\//i.test(props.href);
                  return (
                    <a
                      className="article-link"
                      style={styles.link}
                      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      {...props}
                    >
                      {children}
                      {isExternal && <span style={styles.externalIcon}> ↗</span>}
                    </a>
                  );
                },
                strong: ({ node, children, ...props }) => (
                  <strong style={styles.strong} {...props}>{children}</strong>
                ),
                em: ({ node, children, ...props }) => (
                  <em style={styles.em} {...props}>{children}</em>
                ),
                ul: ({ node, children, ...props }) => (
                  <ul style={styles.ul} {...props}>{children}</ul>
                ),
                ol: ({ node, children, ...props }) => (
                  <ol style={styles.ol} {...props}>{children}</ol>
                ),
                li: ({ node, children, ...props }) => (
                  <li style={styles.li} {...props}>{children}</li>
                ),
                h2: ({ node, children, ...props }) => (
                  <h2 style={styles.h2} {...props}>{children}</h2>
                ),
                h3: ({ node, children, ...props }) => (
                  <h3 style={styles.h3} {...props}>{children}</h3>
                ),
                h4: ({ node, children, ...props }) => (
                  <h4 style={styles.h4} {...props}>{children}</h4>
                ),
                blockquote: ({ node, children, ...props }) => (
                  <blockquote style={styles.blockquote} {...props}>{children}</blockquote>
                ),
                code: ({ node, inline, className, children, ...props }) =>
                  inline ? (
                    <code style={styles.inlineCode} {...props}>{children}</code>
                  ) : (
                    <pre style={styles.codeBlock}>
                      <code className={className} {...props}>{children}</code>
                    </pre>
                  ),
                table: ({ node, children, ...props }) => (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table} {...props}>{children}</table>
                  </div>
                ),
                th: ({ node, children, ...props }) => (
                  <th style={styles.th} {...props}>{children}</th>
                ),
                td: ({ node, children, ...props }) => (
                  <td style={styles.td} {...props}>{children}</td>
                ),
                hr: ({ node, ...props }) => (
                  <hr style={styles.hr} {...props} />
                ),
              }}
            />
          </div>
        </article>

        <div style={styles.footer}>
          <button onClick={() => navigate(-1)} style={styles.footerButton}>
            ← Повернутися до списку
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  progressBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '4px',
    backgroundColor: '#609966',
    zIndex: 9999,
    transition: 'width 0.1s ease',
    boxShadow: '0 2px 8px rgba(96, 153, 102, 0.4)',
  },

  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1.5rem 4rem',
    minHeight: '100vh',
  },

  backButtonTop: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    marginBottom: '2rem',
    backgroundColor: '#FFFFFF',
    color: '#609966',
    border: '2px solid #609966',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(35, 50, 47, 0.08)',
  },

  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(35, 50, 47, 0.08)',
    padding: '0',
    overflow: 'hidden',
    border: '1px solid rgba(157, 192, 139, 0.15)',
    animation: 'fadeInUp 0.6s ease',
  },

  imageContainer: {
    width: '100%',
    height: '480px',
    backgroundColor: '#EDF1D6',
    overflow: 'hidden',
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  headerSection: {
    padding: '3rem 3.5rem 1.5rem',
  },

  title: {
    fontSize: '3rem',
    fontWeight: '800',
    lineHeight: 1.2,
    marginBottom: '2rem',
    color: '#23322F',
    letterSpacing: '-0.5px',
  },

  metaContainer: {
    marginBottom: '1.5rem',
  },

  authorSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },

  authorAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#9DC08B',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: '700',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(157, 192, 139, 0.3)',
  },

  authorInfo: {
    flex: 1,
  },

  authorName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#23322F',
    marginBottom: '0.35rem',
  },

  metaDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },

  metaItem: {
    fontSize: '0.95rem',
    color: 'rgba(35, 50, 47, 0.6)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },

  metaDivider: {
    color: 'rgba(35, 50, 47, 0.3)',
    fontSize: '0.8rem',
  },

  divider: {
    height: '1px',
    backgroundColor: 'rgba(35, 50, 47, 0.1)',
    margin: '0 3.5rem 2rem',
  },

  markdown: {
    padding: '0 3.5rem 3rem',
  },

  paragraph: {
    fontSize: '1.15rem',
    lineHeight: 1.85,
    color: '#23322F',
    marginBottom: '1.5rem',
    letterSpacing: '0.01em',
  },

  strong: {
    fontWeight: '700',
    color: '#609966',
  },

  em: {
    fontStyle: 'italic',
    color: 'rgba(35, 50, 47, 0.85)',
  },

  link: {
    color: '#609966',
    textDecoration: 'none',
    borderBottom: '2px solid rgba(96, 153, 102, 0.3)',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  },

  externalIcon: {
    fontSize: '0.85em',
    opacity: 0.7,
  },

  ul: {
    paddingLeft: '1.8rem',
    marginBottom: '1.5rem',
    lineHeight: 1.8,
  },

  ol: {
    paddingLeft: '1.8rem',
    marginBottom: '1.5rem',
    lineHeight: 1.8,
  },

  li: {
    marginBottom: '0.75rem',
    fontSize: '1.1rem',
    color: '#23322F',
    paddingLeft: '0.5rem',
  },

  h2: {
    fontSize: '2.2rem',
    marginTop: '3rem',
    marginBottom: '1.25rem',
    fontWeight: '700',
    color: '#23322F',
    letterSpacing: '-0.3px',
    lineHeight: 1.3,
  },

  h3: {
    fontSize: '1.75rem',
    marginTop: '2.5rem',
    marginBottom: '1rem',
    fontWeight: '700',
    color: '#23322F',
    letterSpacing: '-0.2px',
    lineHeight: 1.3,
  },

  h4: {
    fontSize: '1.4rem',
    marginTop: '2rem',
    marginBottom: '0.75rem',
    fontWeight: '600',
    color: '#23322F',
  },

  blockquote: {
    margin: '2rem 0',
    padding: '1.5rem 1.8rem',
    borderLeft: '5px solid #9DC08B',
    backgroundColor: 'rgba(157, 192, 139, 0.08)',
    color: 'rgba(35, 50, 47, 0.85)',
    borderRadius: '0 12px 12px 0',
    fontStyle: 'italic',
    fontSize: '1.05rem',
    lineHeight: 1.7,
  },

  inlineCode: {
    backgroundColor: 'rgba(157, 192, 139, 0.15)',
    color: '#609966',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
    fontSize: '0.9em',
    fontWeight: '500',
    border: '1px solid rgba(157, 192, 139, 0.25)',
  },

  codeBlock: {
    backgroundColor: '#23322F',
    color: '#EDF1D6',
    padding: '1.75rem',
    borderRadius: '14px',
    overflowX: 'auto',
    marginBottom: '2rem',
    lineHeight: 1.7,
    fontSize: '0.95rem',
    fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
    boxShadow: '0 4px 16px rgba(35, 50, 47, 0.15)',
    border: '1px solid rgba(157, 192, 139, 0.2)',
  },

  tableWrapper: {
    overflowX: 'auto',
    marginBottom: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(35, 50, 47, 0.08)',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '1rem',
  },

  th: {
    backgroundColor: '#9DC08B',
    color: '#FFFFFF',
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '2px solid #609966',
  },

  td: {
    padding: '0.875rem 1rem',
    borderBottom: '1px solid rgba(35, 50, 47, 0.1)',
    color: '#23322F',
  },

  hr: {
    border: 'none',
    height: '2px',
    backgroundColor: 'rgba(157, 192, 139, 0.3)',
    margin: '3rem 0',
    borderRadius: '2px',
  },

  footer: {
    marginTop: '3rem',
    textAlign: 'center',
  },

  footerButton: {
    padding: '1rem 2.5rem',
    backgroundColor: '#609966',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(96, 153, 102, 0.3)',
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
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

  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
  },

  errorContent: {
    maxWidth: '500px',
    backgroundColor: '#FFFFFF',
    padding: '3rem',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(230, 57, 70, 0.15)',
    border: '2px solid rgba(230, 57, 70, 0.2)',
  },

  errorIcon: {
    fontSize: '4rem',
    marginBottom: '1.5rem',
  },

  errorTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#23322F',
    marginBottom: '1rem',
  },

  errorMessage: {
    fontSize: '1.1rem',
    color: 'rgba(35, 50, 47, 0.7)',
    marginBottom: '2rem',
  },

  notFoundContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
  },

  notFoundContent: {
    maxWidth: '500px',
    backgroundColor: '#FFFFFF',
    padding: '3rem',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(35, 50, 47, 0.1)',
    border: '2px solid rgba(157, 192, 139, 0.2)',
  },

  notFoundIcon: {
    fontSize: '4rem',
    marginBottom: '1.5rem',
  },

  notFoundTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#23322F',
    marginBottom: '1rem',
  },

  notFoundMessage: {
    fontSize: '1.1rem',
    color: 'rgba(35, 50, 47, 0.7)',
    marginBottom: '2rem',
    lineHeight: 1.6,
  },

  backButton: {
    padding: '0.875rem 2rem',
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
};

export default ArticleDetail;