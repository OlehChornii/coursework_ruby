// client/src/components/Charts/LineChart.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ data = [], color = '#609966', label = 'Value', title = '' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const labels = data.map(d => {
      const ts = d.timestamp;
      if (ts.length > 10) {
        const hour = ts.split('T')[1];
        return `${hour}:00`;
      } else {
        const parts = ts.split('-');
        return `${parts[2]}/${parts[1]}`;
      }
    });

    const values = data.map(d => d.value);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: values,
          borderColor: color,
          backgroundColor: createGradient(ctx, color),
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#fff',
          pointBorderColor: color,
          pointBorderWidth: 2,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(35, 50, 47, 0.95)',
            padding: 14,
            titleFont: {
              size: 14,
              weight: '600'
            },
            bodyFont: {
              size: 13
            },
            borderColor: 'rgba(157, 192, 139, 0.3)',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                return `${label}: ${context.parsed.y.toLocaleString()}`;
              },
              footer: function(context) {
                const index = context[0].dataIndex;
                return `Timestamp: ${data[index].timestamp}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(35, 50, 47, 0.06)',
              drawBorder: false
            },
            ticks: {
              font: {
                size: 11,
                weight: '500'
              },
              color: '#666',
              padding: 8,
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              font: {
                size: 11,
                weight: '500'
              },
              color: '#666',
              maxRotation: 45,
              minRotation: 0,
              padding: 8
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, color, label]);

  const createGradient = (ctx, baseColor) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, baseColor + '40');
    gradient.addColorStop(1, baseColor + '05');
    return gradient;
  };

  if (!data || data.length === 0) {
    return (
      <div style={styles.emptyCard}>
        <div style={styles.emptyIcon}>📈</div>
        <h3 style={styles.emptyTitle}>Немає даних для відображення</h3>
        <p style={styles.emptyText}>Дані з'являться після накопичення статистики</p>
      </div>
    );
  }

  const currentValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue > 0 ? ((change / previousValue) * 100).toFixed(1) : 0;

  return (
    <div style={styles.container}>
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <div style={styles.headerLeft}>
            <h3 style={styles.chartTitle}>
              {title || label}
            </h3>
            <div style={styles.currentValue}>
              <span style={styles.valueNumber}>{currentValue.toLocaleString()}</span>
              {change !== 0 && (
                <span style={{
                  ...styles.changeIndicator,
                  color: change > 0 ? '#06A77D' : '#E63946'
                }}>
                  {change > 0 ? '↑' : '↓'} {Math.abs(changePercent)}%
                </span>
              )}
            </div>
          </div>
          
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Макс</div>
              <div style={styles.statValue}>{Math.max(...data.map(d => d.value)).toLocaleString()}</div>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Мін</div>
              <div style={styles.statValue}>{Math.min(...data.map(d => d.value)).toLocaleString()}</div>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Середнє</div>
              <div style={styles.statValue}>
                {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(0)}
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.chartWrapper}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%'
  },
  
  emptyCard: {
    background: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: 0.6
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#23322F',
    margin: '0 0 0.5rem 0'
  },
  emptyText: {
    color: '#666',
    fontSize: '0.95rem',
    margin: 0
  },
  
  chartCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    overflow: 'hidden'
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderBottom: '2px solid #F5F5F5',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  chartTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#23322F',
    margin: 0
  },
  currentValue: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.75rem'
  },
  valueNumber: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#609966'
  },
  changeIndicator: {
    fontSize: '1rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  statsGrid: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem'
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600'
  },
  statValue: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#23322F'
  },
  statDivider: {
    width: '1px',
    height: '30px',
    background: '#E0E0E0'
  },
  chartWrapper: {
    padding: '1.5rem',
    position: 'relative'
  }
};

export default LineChart;