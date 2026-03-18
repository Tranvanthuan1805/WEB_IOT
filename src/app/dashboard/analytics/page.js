'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('week');
  const [animatedValues, setAnimatedValues] = useState({});

  const weeklyData = [
    { day: 'T2', alerts: 3, drowsy: 2, heart: 1 },
    { day: 'T3', alerts: 5, drowsy: 4, heart: 1 },
    { day: 'T4', alerts: 2, drowsy: 1, heart: 1 },
    { day: 'T5', alerts: 7, drowsy: 5, heart: 2 },
    { day: 'T6', alerts: 4, drowsy: 3, heart: 1 },
    { day: 'T7', alerts: 6, drowsy: 4, heart: 2 },
    { day: 'CN', alerts: 1, drowsy: 1, heart: 0 },
  ];

  const driverStats = [
    { name: 'Phạm Văn D', alerts: 7, score: 65, trend: 'down' },
    { name: 'Nguyễn Văn A', alerts: 5, score: 78, trend: 'up' },
    { name: 'Hoàng Thị E', alerts: 3, score: 85, trend: 'up' },
    { name: 'Trần Minh B', alerts: 2, score: 90, trend: 'stable' },
    { name: 'Lê Quốc C', alerts: 1, score: 95, trend: 'up' },
  ];

  const hourlyDistribution = [
    { hour: '0-4h', value: 35 },
    { hour: '4-8h', value: 15 },
    { hour: '8-12h', value: 8 },
    { hour: '12-16h', value: 22 },
    { hour: '16-20h', value: 12 },
    { hour: '20-24h', value: 28 },
  ];

  const maxAlerts = Math.max(...weeklyData.map(d => d.alerts));
  const maxHourly = Math.max(...hourlyDistribution.map(h => h.value));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({ ready: true });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>📈 Phân Tích & Thống Kê</h1>
          <p>Phân tích dữ liệu cảnh báo và hiệu suất an toàn</p>
        </div>
        <div className={styles.periodSelector}>
          {['day', 'week', 'month'].map(p => (
            <button key={p} className={`${styles.periodBtn} ${period === p ? styles.active : ''}`} onClick={() => setPeriod(p)}>
              {p === 'day' ? 'Ngày' : p === 'week' ? 'Tuần' : 'Tháng'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className={styles.overviewGrid}>
        <div className={styles.overviewCard}>
          <div className={styles.overviewIcon} style={{ background: 'linear-gradient(135deg, #FF4757, #FF6B81)' }}>🚨</div>
          <div className={styles.overviewInfo}>
            <span className={styles.overviewValue}>28</span>
            <span className={styles.overviewLabel}>Tổng cảnh báo</span>
            <span className={styles.overviewChange} style={{ color: 'var(--accent-red)' }}>↑ 12% so với tuần trước</span>
          </div>
        </div>
        <div className={styles.overviewCard}>
          <div className={styles.overviewIcon} style={{ background: 'linear-gradient(135deg, #2ED573, #26DE81)' }}>✅</div>
          <div className={styles.overviewInfo}>
            <span className={styles.overviewValue}>82.6%</span>
            <span className={styles.overviewLabel}>Điểm an toàn</span>
            <span className={styles.overviewChange} style={{ color: 'var(--accent-green)' }}>↑ 3.2% so với tuần trước</span>
          </div>
        </div>
        <div className={styles.overviewCard}>
          <div className={styles.overviewIcon} style={{ background: 'linear-gradient(135deg, #00D4FF, #0099CC)' }}>⏱️</div>
          <div className={styles.overviewInfo}>
            <span className={styles.overviewValue}>156h</span>
            <span className={styles.overviewLabel}>Giờ giám sát</span>
            <span className={styles.overviewChange} style={{ color: 'var(--accent-green)' }}>↑ 8% so với tuần trước</span>
          </div>
        </div>
        <div className={styles.overviewCard}>
          <div className={styles.overviewIcon} style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>👥</div>
          <div className={styles.overviewInfo}>
            <span className={styles.overviewValue}>5</span>
            <span className={styles.overviewLabel}>Tài xế hoạt động</span>
            <span className={styles.overviewChange}>Không đổi</span>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        {/* Weekly Chart */}
        <div className={styles.chartCard}>
          <h3>📊 Cảnh Báo Theo Ngày</h3>
          <div className={styles.barChart}>
            {weeklyData.map((d, i) => (
              <div key={i} className={styles.barGroup}>
                <div className={styles.barContainer}>
                  <div
                    className={styles.bar}
                    style={{
                      height: animatedValues.ready ? `${(d.alerts / maxAlerts) * 100}%` : '0%',
                      background: d.alerts > 5 ? 'linear-gradient(180deg, var(--accent-red), rgba(255,71,87,0.3))' :
                        d.alerts > 3 ? 'linear-gradient(180deg, var(--accent-yellow), rgba(255,165,2,0.3))' :
                        'linear-gradient(180deg, var(--accent-green), rgba(46,213,115,0.3))',
                      transitionDelay: `${i * 100}ms`,
                    }}
                  >
                    <span className={styles.barValue}>{d.alerts}</span>
                  </div>
                </div>
                <span className={styles.barLabel}>{d.day}</span>
              </div>
            ))}
          </div>
          <div className={styles.chartLegend}>
            <div><span style={{ background: 'var(--accent-green)' }}></span> Thấp (≤3)</div>
            <div><span style={{ background: 'var(--accent-yellow)' }}></span> Trung bình (4-5)</div>
            <div><span style={{ background: 'var(--accent-red)' }}></span> Cao ({'>'}5)</div>
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className={styles.chartCard}>
          <h3>🕐 Phân Bố Theo Giờ</h3>
          <div className={styles.horizontalBars}>
            {hourlyDistribution.map((h, i) => (
              <div key={i} className={styles.hBarRow}>
                <span className={styles.hBarLabel}>{h.hour}</span>
                <div className={styles.hBarTrack}>
                  <div
                    className={styles.hBarFill}
                    style={{
                      width: animatedValues.ready ? `${(h.value / maxHourly) * 100}%` : '0%',
                      background: h.value > 25 ? 'linear-gradient(90deg, var(--accent-red), rgba(255,71,87,0.5))' :
                        h.value > 15 ? 'linear-gradient(90deg, var(--accent-yellow), rgba(255,165,2,0.5))' :
                        'linear-gradient(90deg, var(--accent-green), rgba(46,213,115,0.5))',
                      transitionDelay: `${i * 100}ms`,
                    }}
                  ></div>
                </div>
                <span className={styles.hBarValue}>{h.value}%</span>
              </div>
            ))}
          </div>
          <p className={styles.chartNote}>💡 Cảnh báo tập trung cao vào ban đêm (0-4h) và sau trưa (12-16h)</p>
        </div>

        {/* Driver Rankings */}
        <div className={styles.chartCard}>
          <h3>🏆 Xếp Hạng Tài Xế</h3>
          <div className={styles.rankingList}>
            {driverStats.map((d, i) => (
              <div key={i} className={styles.rankingItem}>
                <span className={styles.rank}>#{i + 1}</span>
                <div className={styles.rankInfo}>
                  <strong>{d.name}</strong>
                  <div className={styles.rankDetails}>
                    <span>🚨 {d.alerts} cảnh báo</span>
                    <span className={styles.trendIcon}>
                      {d.trend === 'up' ? '📈' : d.trend === 'down' ? '📉' : '➡️'}
                    </span>
                  </div>
                </div>
                <div className={styles.scoreCircle}>
                  <svg viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke={d.score >= 90 ? 'var(--accent-green)' : d.score >= 75 ? 'var(--accent-yellow)' : 'var(--accent-red)'}
                      strokeWidth="3"
                      strokeDasharray={`${d.score} ${100 - d.score}`}
                      strokeDashoffset="25"
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                  </svg>
                  <span className={styles.scoreValue}>{d.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className={styles.chartCard}>
          <h3>💡 Phân Tích & Đề Xuất</h3>
          <div className={styles.insightsList}>
            <div className={`${styles.insight} ${styles.red}`}>
              <span className={styles.insightIcon}>⚠️</span>
              <div>
                <strong>Tài xế Phạm Văn D cần chú ý</strong>
                <p>Có 7 cảnh báo trong tuần, nhiều nhất trong nhóm. Nên xem xét điều chỉnh lịch trình.</p>
              </div>
            </div>
            <div className={`${styles.insight} ${styles.yellow}`}>
              <span className={styles.insightIcon}>🕐</span>
              <div>
                <strong>Khung giờ nguy hiểm: 0h-4h</strong>
                <p>35% cảnh báo xảy ra trong khung giờ này. Hạn chế lái xe ban đêm.</p>
              </div>
            </div>
            <div className={`${styles.insight} ${styles.green}`}>
              <span className={styles.insightIcon}>📈</span>
              <div>
                <strong>Điểm an toàn cải thiện</strong>
                <p>Điểm an toàn trung bình tăng 3.2% so với tuần trước, cho thấy hiệu quả giám sát.</p>
              </div>
            </div>
            <div className={`${styles.insight} ${styles.blue}`}>
              <span className={styles.insightIcon}>💡</span>
              <div>
                <strong>Đề xuất: Nghỉ ngơi bắt buộc</strong>
                <p>Nên thiết lập chế độ nghỉ ngơi bắt buộc sau 4h lái xe liên tục.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
