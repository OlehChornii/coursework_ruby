// client/src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getAnalyticsOverview, getAnalyticsTimeseries } from '../../services/api';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [requestsSeries, setRequestsSeries] = useState([]);
  const [errorsSeries, setErrorsSeries] = useState([]);
  const [latencySeries, setLatencySeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setError(null);

      const [overviewRes, requestsRes, errorsRes, latencyRes] = await Promise.all([
        getAnalyticsOverview(),
        getAnalyticsTimeseries('requests', timeRange),
        getAnalyticsTimeseries('errors', timeRange),
        getAnalyticsTimeseries('avgDuration', timeRange)
      ]);

      const overviewPayload = overviewRes?.data && overviewRes.data.data ? overviewRes.data.data : overviewRes?.data;
      const requestsPayload = requestsRes?.data && requestsRes.data.data ? requestsRes.data.data : requestsRes?.data;
      const errorsPayload = errorsRes?.data && errorsRes.data.data ? errorsRes.data.data : errorsRes?.data;
      const latencyPayload = latencyRes?.data && latencyRes.data.data ? latencyRes.data.data : latencyRes?.data;

      setOverview(overviewPayload || null);
      setRequestsSeries(requestsPayload || { data: [], trend: null });
      setErrorsSeries(errorsPayload || { data: [], trend: null });
      setLatencySeries(latencyPayload || { data: [], trend: null });
      setLastUpdate(new Date());

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Помилка завантаження даних аналітики');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    if (!trend) return '';
    switch(trend.direction) {
      case 'rising': return '↗';
      case 'falling': return '↘';
      default: return '→';
    }
  };

  const getTrendColor = (trend) => {
    if (!trend) return '#666';
    switch(trend.direction) {
      case 'rising': return '#06A77D';
      case 'falling': return '#E63946';
      default: return '#666';
    }
  };

  const getTimeRangeLabel = () => {
    const labels = {
      '24h': '24 години',
      '7d': '7 днів',
      '30d': '30 днів'
    };
    return labels[timeRange] || timeRange;
  };

  const getHealthStatus = () => {
    if (!overview) return { label: 'Невідомо', color: '#999', icon: '❓' };
    
    const errorRate = overview.errorRate || 0;
    const avgDuration = overview.avgDuration || 0;
    
    if (errorRate < 1 && avgDuration < 300) {
      return { label: 'Відмінно', color: '#06A77D', icon: '✓' };
    } else if (errorRate < 5 && avgDuration < 500) {
      return { label: 'Добре', color: '#9DC08B', icon: '✓' };
    } else if (errorRate < 10 && avgDuration < 1000) {
      return { label: 'Задовільно', color: '#F77F00', icon: '⚠️' };
    } else {
      return { label: 'Потребує уваги', color: '#E63946', icon: '⚠️' };
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Завантаження аналітики...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>{error}</h2>
          <button onClick={fetchData} style={styles.retryBtn}>
            <span style={styles.btnIcon}>↻</span>
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  const healthStatus = getHealthStatus();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>
            <span style={styles.titleIcon}>📊</span>
            Аналітика
          </h1>
          <p style={styles.subtitle}>
            Моніторинг та статистика системи в реальному часі
          </p>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.controls}>
            <div style={styles.selectWrapper}>
              <span style={styles.selectIcon}>📅</span>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                style={styles.select}
              >
                <option value="24h">24 години</option>
                <option value="7d">7 днів</option>
                <option value="30d">30 днів</option>
              </select>
            </div>
            <button onClick={fetchData} style={styles.refreshBtn} title="Оновити дані">
              <span style={styles.refreshIcon}>↻</span>
            </button>
          </div>
          {lastUpdate && (
            <div style={styles.updateInfo}>
              <span style={styles.updateIcon}>🕒</span>
              Оновлено: {lastUpdate.toLocaleTimeString('uk-UA')}
            </div>
          )}
        </div>
      </div>

      <div style={{
        ...styles.healthBanner,
        borderColor: healthStatus.color
      }}>
        <div style={styles.healthLeft}>
          <div style={{
            ...styles.healthIcon,
            backgroundColor: healthStatus.color + '20',
            color: healthStatus.color
          }}>
            {healthStatus.icon}
          </div>
          <div style={styles.healthContent}>
            <div style={styles.healthLabel}>Стан системи</div>
            <div style={{
              ...styles.healthStatus,
              color: healthStatus.color
            }}>
              {healthStatus.label}
            </div>
          </div>
        </div>
        <div style={styles.healthStats}>
          <div style={styles.healthStat}>
            <span style={styles.healthStatLabel}>Час роботи</span>
            <span style={styles.healthStatValue}>99.9%</span>
          </div>
          <div style={styles.healthStatDivider}></div>
          <div style={styles.healthStat}>
            <span style={styles.healthStatLabel}>Період</span>
            <span style={styles.healthStatValue}>{getTimeRangeLabel()}</span>
          </div>
        </div>
      </div>

      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <div style={{...styles.metricIconWrapper, backgroundColor: '#609966'}}>
              <span style={styles.metricIcon}>📨</span>
            </div>
            <div style={styles.metricBadge}>Запити</div>
          </div>
          <div style={styles.metricValue}>
            {(overview?.totalRequests || 0).toLocaleString()}
          </div>
          <div style={styles.metricLabel}>
            за {getTimeRangeLabel()}
          </div>
          <div style={styles.metricFooter}>
            <div style={styles.metricProgress}>
              <div style={{
                ...styles.metricProgressBar,
                width: '100%',
                backgroundColor: '#609966'
              }}></div>
            </div>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <div style={{...styles.metricIconWrapper, backgroundColor: '#E63946'}}>
              <span style={styles.metricIcon}>❌</span>
            </div>
            <div style={styles.metricBadge}>Помилки</div>
          </div>
          <div style={styles.metricValue}>
            {(overview?.errorRequests || 0).toLocaleString()}
          </div>
          <div style={styles.metricLabel}>
            {(overview?.errorRate || 0).toFixed(2)}% від усіх запитів
          </div>
          <div style={styles.metricFooter}>
            <div style={styles.metricProgress}>
              <div style={{
                ...styles.metricProgressBar,
                width: `${Math.min(overview?.errorRate || 0, 100)}%`,
                backgroundColor: (overview?.errorRate || 0) > 5 ? '#E63946' : '#06A77D'
              }}></div>
            </div>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <div style={{...styles.metricIconWrapper, backgroundColor: '#F77F00'}}>
              <span style={styles.metricIcon}>⏱️</span>
            </div>
            <div style={styles.metricBadge}>Затримка</div>
          </div>
          <div style={styles.metricValue}>
            {overview?.avgDuration || 0}
            <span style={styles.metricUnit}>мс</span>
          </div>
          <div style={styles.metricLabel}>
            середній час відповіді
          </div>
          <div style={styles.metricFooter}>
            <div style={styles.metricProgress}>
              <div style={{
                ...styles.metricProgressBar,
                width: `${Math.min((overview?.avgDuration || 0) / 10, 100)}%`,
                backgroundColor: (overview?.avgDuration || 0) > 500 ? '#E63946' : '#06A77D'
              }}></div>
            </div>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <div style={{...styles.metricIconWrapper, backgroundColor: '#3498DB'}}>
              <span style={styles.metricIcon}>👥</span>
            </div>
            <div style={styles.metricBadge}>Користувачі</div>
          </div>
          <div style={styles.metricValue}>
            {(overview?.uniqueUsers || 0).toLocaleString()}
          </div>
          <div style={styles.metricLabel}>
            унікальних активних
          </div>
          <div style={styles.metricFooter}>
            <div style={styles.metricProgress}>
              <div style={{
                ...styles.metricProgressBar,
                width: '85%',
                backgroundColor: '#3498DB'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.chartsSection}>
        <div style={styles.chartCardWide}>
          <div style={styles.chartCardHeader}>
            <div style={styles.chartTitleGroup}>
              <h2 style={styles.chartTitle}>
                <span style={styles.chartTitleIcon}>📈</span>
                Запити до API
              </h2>
              {requestsSeries.trend && (
                <div style={{
                  ...styles.trendBadge,
                  backgroundColor: getTrendColor(requestsSeries.trend) + '15',
                  color: getTrendColor(requestsSeries.trend),
                  borderColor: getTrendColor(requestsSeries.trend)
                }}>
                  <span style={styles.trendIcon}>{getTrendIcon(requestsSeries.trend)}</span>
                  <span style={styles.trendText}>
                    {requestsSeries.trend.percentChange > 0 ? '+' : ''}
                    {requestsSeries.trend.percentChange}%
                  </span>
                  <span style={styles.trendConfidence}>
                    ({requestsSeries.trend.confidence})
                  </span>
                </div>
              )}
            </div>
          </div>
          <LineChart 
            data={requestsSeries.data} 
            color="#609966"
            label="Запитів"
            title=""
          />
        </div>

        <div style={styles.chartCard}>
          <div style={styles.chartCardHeader}>
            <div style={styles.chartTitleGroup}>
              <h2 style={styles.chartTitle}>
                <span style={styles.chartTitleIcon}>📉</span>
                Помилки
              </h2>
              {errorsSeries.trend && (
                <div style={{
                  ...styles.trendBadge,
                  backgroundColor: getTrendColor(errorsSeries.trend) + '15',
                  color: getTrendColor(errorsSeries.trend),
                  borderColor: getTrendColor(errorsSeries.trend)
                }}>
                  <span style={styles.trendIcon}>{getTrendIcon(errorsSeries.trend)}</span>
                  <span style={styles.trendText}>
                    {errorsSeries.trend.percentChange > 0 ? '+' : ''}
                    {errorsSeries.trend.percentChange}%
                  </span>
                </div>
              )}
            </div>
          </div>
          <LineChart 
            data={errorsSeries.data} 
            color="#E63946"
            label="Помилок"
            title=""
          />
        </div>

        <div style={styles.chartCard}>
          <div style={styles.chartCardHeader}>
            <div style={styles.chartTitleGroup}>
              <h2 style={styles.chartTitle}>
                <span style={styles.chartTitleIcon}>⚡</span>
                Затримка
              </h2>
              {latencySeries.trend && (
                <div style={{
                  ...styles.trendBadge,
                  backgroundColor: getTrendColor(latencySeries.trend) + '15',
                  color: getTrendColor(latencySeries.trend),
                  borderColor: getTrendColor(latencySeries.trend)
                }}>
                  <span style={styles.trendIcon}>{getTrendIcon(latencySeries.trend)}</span>
                  <span style={styles.trendText}>
                    {latencySeries.trend.percentChange > 0 ? '+' : ''}
                    {latencySeries.trend.percentChange}%
                  </span>
                </div>
              )}
            </div>
          </div>
          <LineChart 
            data={latencySeries.data} 
            color="#F77F00"
            label="Затримка (мс)"
            title=""
          />
        </div>

        {overview?.topEndpoints && (
          <div style={styles.chartCardFull}>
            <div style={styles.chartCardHeader}>
              <h2 style={styles.chartTitle}>
                <span style={styles.chartTitleIcon}>🔝</span>
                Топ endpoints за активністю
              </h2>
            </div>
            <BarChart data={overview.topEndpoints} />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    backgroundColor: '#EDF1D6',
    minHeight: '100vh'
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1.5rem'
  },
  headerLeft: {
    flex: 1,
    minWidth: '250px'
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.75rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#23322F',
    margin: 0,
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  titleIcon: {
    fontSize: '2rem'
  },
  subtitle: {
    color: '#666',
    fontSize: '0.95rem',
    margin: 0
  },
  controls: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center'
  },
  selectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: '10px',
    border: '2px solid #E2E3E5',
    padding: '0.65rem 1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  selectIcon: {
    fontSize: '1.1rem',
    marginRight: '0.5rem'
  },
  select: {
    border: 'none',
    background: 'transparent',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#23322F',
    cursor: 'pointer',
    outline: 'none',
    paddingRight: '0.5rem'
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    backgroundColor: '#609966',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    boxShadow: '0 2px 6px rgba(96,153,102,0.3)',
    transition: 'all 0.2s ease'
  },
  refreshIcon: {
    display: 'inline-block',
    transition: 'transform 0.3s ease'
  },
  updateInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#666',
    background: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #F0F0F0'
  },
  updateIcon: {
    fontSize: '1rem'
  },

  healthBanner: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '2px solid',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  healthLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  healthIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: '700'
  },
  healthContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  healthLabel: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  healthStatus: {
    fontSize: '1.5rem',
    fontWeight: '700'
  },
  healthStats: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  },
  healthStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem'
  },
  healthStatLabel: {
    fontSize: '0.75rem',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  healthStatValue: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#23322F'
  },
  healthStatDivider: {
    width: '1px',
    height: '40px',
    background: '#E0E0E0'
  },

  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  metricCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    transition: 'all 0.2s ease'
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  metricIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  metricIcon: {
    fontSize: '1.5rem'
  },
  metricBadge: {
    background: '#F8F9FA',
    color: '#666',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  metricValue: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#23322F',
    marginBottom: '0.25rem',
    lineHeight: 1
  },
  metricUnit: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#666',
    marginLeft: '0.25rem'
  },
  metricLabel: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '1rem'
  },
  metricFooter: {
    marginTop: '1rem'
  },
  metricProgress: {
    height: '4px',
    background: '#F0F0F0',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  metricProgressBar: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease'
  },

  chartsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '1.5rem'
  },
  chartCard: {
    gridColumn: 'span 6',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    overflow: 'hidden'
  },
  chartCardWide: {
    gridColumn: 'span 12',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    overflow: 'hidden'
  },
  chartCardFull: {
    gridColumn: 'span 12',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    overflow: 'hidden'
  },
  chartCardHeader: {
    padding: '1.25rem 1.5rem',
    borderBottom: '2px solid #F5F5F5'
  },
  chartTitleGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  chartTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#23322F',
    margin: 0
  },
  chartTitleIcon: {
    fontSize: '1.5rem'
  },
  trendBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    border: '2px solid'
  },
  trendIcon: {
    fontSize: '1.1rem'
  },
  trendText: {
    fontWeight: '700'
  },
  trendConfidence: {
    fontSize: '0.75rem',
    opacity: 0.8,
    fontWeight: '500'
  },

  loadingCard: {
    background: 'white',
    padding: '4rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center'
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid #F0F0F0',
    borderTop: '4px solid #609966',
    borderRadius: '50%',
    margin: '0 auto 1.5rem',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#666',
    fontSize: '1.1rem',
    margin: 0
  },

  errorCard: {
    background: 'white',
    padding: '4rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center'
  },
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  errorTitle: {
    color: '#E63946',
    fontSize: '1.5rem',
    marginBottom: '1.5rem'
  },
  retryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#609966',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    boxShadow: '0 2px 6px rgba(96,153,102,0.3)',
    transition: 'all 0.2s ease'
  },
  btnIcon: {
    fontSize: '1.2rem'
  }
};

export default Dashboard;