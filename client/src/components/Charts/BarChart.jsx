// client/src/components/Charts/BarChart.jsx
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ data = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [sortBy, setSortBy] = useState('requests');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const labels = data.map(d => {
      const path = d.path;
      if (path.length > 30) {
        return '...' + path.slice(-27);
      }
      return path;
    });

    const requests = data.map(d => d.requests);
    const errors = data.map(d => d.errors);

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Запитів',
            data: requests,
            backgroundColor: 'rgba(96, 153, 102, 0.85)',
            borderColor: 'rgba(96, 153, 102, 1)',
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false
          },
          {
            label: 'Помилок',
            data: errors,
            backgroundColor: 'rgba(230, 57, 70, 0.85)',
            borderColor: 'rgba(230, 57, 70, 1)',
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.8,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              font: {
                size: 13,
                weight: '600'
              },
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle',
              color: '#23322F'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(35, 50, 47, 0.95)',
            padding: 14,
            titleFont: {
              size: 14,
              weight: '600'
            },
            bodyFont: {
              size: 13
            },
            bodySpacing: 6,
            borderColor: 'rgba(157, 192, 139, 0.3)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              title: function(context) {
                const index = context[0].dataIndex;
                return data[index].path;
              },
              afterLabel: function(context) {
                const index = context.dataIndex;
                const item = data[index];
                return [
                  `Середня затримка: ${item.avgDuration} мс`,
                  `Відсоток помилок: ${item.errorRate}%`
                ];
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
              padding: 8
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              font: {
                size: 10,
                weight: '500'
              },
              color: '#666',
              maxRotation: 45,
              minRotation: 45,
              padding: 8
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const getSortIcon = (column) => {
    if (sortBy !== column) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (!data || data.length === 0) {
    return (
      <div style={styles.emptyCard}>
        <div style={styles.emptyIcon}>📊</div>
        <h3 style={styles.emptyTitle}>Немає даних для відображення</h3>
        <p style={styles.emptyText}>Дані з'являться після виконання запитів до API</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <h3 style={styles.chartTitle}>
            <span style={styles.titleIcon}>📊</span>
            Активність endpoint-ів
          </h3>
          <div style={styles.chartStats}>
            <div style={styles.statBadge}>
              <span style={styles.statLabel}>Всього endpoint-ів:</span>
              <span style={styles.statValue}>{data.length}</span>
            </div>
          </div>
        </div>
        <div style={styles.chartWrapper}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
      
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>
            <span style={styles.titleIcon}>📋</span>
            Детальна статистика
          </h3>
          <div style={styles.tableLegend}>
            <div style={styles.legendItem}>
              <div style={{...styles.legendDot, backgroundColor: '#06A77D'}}></div>
              <span style={styles.legendText}>Норма</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.legendDot, backgroundColor: '#E63946'}}></div>
              <span style={styles.legendText}>Проблема</span>
            </div>
          </div>
        </div>
        
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th} onClick={() => handleSort('path')}>
                  <div style={styles.thContent}>
                    <span>Endpoint</span>
                    <span style={styles.sortIcon}>{getSortIcon('path')}</span>
                  </div>
                </th>
                <th style={styles.thCenter} onClick={() => handleSort('requests')}>
                  <div style={styles.thContent}>
                    <span>Запитів</span>
                    <span style={styles.sortIcon}>{getSortIcon('requests')}</span>
                  </div>
                </th>
                <th style={styles.thCenter} onClick={() => handleSort('errors')}>
                  <div style={styles.thContent}>
                    <span>Помилок</span>
                    <span style={styles.sortIcon}>{getSortIcon('errors')}</span>
                  </div>
                </th>
                <th style={styles.thCenter} onClick={() => handleSort('errorRate')}>
                  <div style={styles.thContent}>
                    <span>Error Rate</span>
                    <span style={styles.sortIcon}>{getSortIcon('errorRate')}</span>
                  </div>
                </th>
                <th style={styles.thCenter} onClick={() => handleSort('avgDuration')}>
                  <div style={styles.thContent}>
                    <span>Avg Latency</span>
                    <span style={styles.sortIcon}>{getSortIcon('avgDuration')}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, idx) => (
                <tr key={idx} style={styles.bodyRow}>
                  <td style={styles.td} title={item.path}>
                    <div style={styles.endpointCell}>
                      <span style={styles.endpointIcon}>🔗</span>
                      <span style={styles.endpointText}>
                        {item.path.length > 45 ? '...' + item.path.slice(-42) : item.path}
                      </span>
                    </div>
                  </td>
                  <td style={styles.tdCenter}>
                    <span style={styles.numberBadge}>
                      {item.requests.toLocaleString()}
                    </span>
                  </td>
                  <td style={styles.tdCenter}>
                    <span style={{
                      ...styles.errorBadge,
                      ...(item.errors > 0 ? styles.errorBadgeWarning : {})
                    }}>
                      {item.errors}
                    </span>
                  </td>
                  <td style={styles.tdCenter}>
                    <div style={styles.rateCell}>
                      <div style={{
                        ...styles.rateBar,
                        width: `${Math.min(item.errorRate, 100)}%`,
                        backgroundColor: item.errorRate > 5 ? '#E63946' : '#06A77D'
                      }}></div>
                      <span style={{
                        ...styles.rateText,
                        color: item.errorRate > 5 ? '#E63946' : '#06A77D'
                      }}>
                        {item.errorRate}%
                      </span>
                    </div>
                  </td>
                  <td style={styles.tdCenter}>
                    <div style={styles.latencyCell}>
                      <span style={{
                        ...styles.latencyBadge,
                        backgroundColor: item.avgDuration > 500 
                          ? 'rgba(230, 57, 70, 0.1)' 
                          : item.avgDuration > 300
                          ? 'rgba(247, 127, 0, 0.1)'
                          : 'rgba(6, 167, 125, 0.1)',
                        color: item.avgDuration > 500 
                          ? '#E63946' 
                          : item.avgDuration > 300
                          ? '#F77F00'
                          : '#06A77D'
                      }}>
                        {item.avgDuration} мс
                      </span>
                      {item.avgDuration > 500 && (
                        <span style={styles.warningIcon}>⚠️</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
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
  chartTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#23322F',
    margin: 0
  },
  titleIcon: {
    fontSize: '1.5rem'
  },
  chartStats: {
    display: 'flex',
    gap: '1rem'
  },
  statBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#EDF1D6',
    padding: '0.5rem 1rem',
    borderRadius: '20px'
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#23322F'
  },
  chartWrapper: {
    padding: '1.5rem',
    position: 'relative'
  },
  
  tableCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #F0F0F0',
    overflow: 'hidden'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderBottom: '2px solid #F5F5F5',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  tableTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#23322F',
    margin: 0
  },
  tableLegend: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  legendText: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '500'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem'
  },
  headerRow: {
    background: '#F8F9FA'
  },
  th: {
    padding: '1rem 1.25rem',
    textAlign: 'left',
    fontWeight: '700',
    color: '#23322F',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background 0.2s ease',
    position: 'sticky',
    top: 0,
    background: '#F8F9FA',
    zIndex: 10
  },
  thCenter: {
    padding: '1rem 1.25rem',
    textAlign: 'center',
    fontWeight: '700',
    color: '#23322F',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background 0.2s ease',
    position: 'sticky',
    top: 0,
    background: '#F8F9FA',
    zIndex: 10
  },
  thContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  sortIcon: {
    fontSize: '0.85rem',
    color: '#9DC08B',
    fontWeight: '600'
  },
  bodyRow: {
    borderBottom: '1px solid #F0F0F0',
    transition: 'background 0.15s ease'
  },
  td: {
    padding: '1rem 1.25rem',
    color: '#23322F'
  },
  tdCenter: {
    padding: '1rem 1.25rem',
    textAlign: 'center'
  },
  endpointCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  endpointIcon: {
    fontSize: '1rem',
    opacity: 0.6
  },
  endpointText: {
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    color: '#609966',
    fontWeight: '500'
  },
  numberBadge: {
    display: 'inline-block',
    padding: '0.35rem 0.75rem',
    background: '#EDF1D6',
    color: '#23322F',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.85rem'
  },
  errorBadge: {
    display: 'inline-block',
    padding: '0.35rem 0.75rem',
    background: '#F0F0F0',
    color: '#666',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.85rem'
  },
  errorBadgeWarning: {
    background: 'rgba(230, 57, 70, 0.1)',
    color: '#E63946'
  },
  rateCell: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  rateBar: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    height: '4px',
    borderRadius: '2px',
    opacity: 0.2,
    transition: 'width 0.3s ease'
  },
  rateText: {
    position: 'relative',
    fontWeight: '700',
    fontSize: '0.9rem',
    zIndex: 1
  },
  latencyCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  latencyBadge: {
    padding: '0.35rem 0.75rem',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.85rem'
  },
  warningIcon: {
    fontSize: '1rem'
  }
};

export default BarChart;