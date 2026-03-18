'use client';
import { useState } from 'react';
import styles from './page.module.css';

const alertHistory = [
  { id: 1, driver: 'Nguyễn Văn A', type: 'drowsy', level: 'danger', message: 'Phát hiện buồn ngủ - mắt nhắm >3s', time: '2024-12-15 14:32:05', bpm: 58, drowsiness: 85 },
  { id: 2, driver: 'Phạm Văn D', type: 'drowsy', level: 'danger', message: 'Phát hiện buồn ngủ - ngáp liên tục', time: '2024-12-15 13:18:22', bpm: 62, drowsiness: 78 },
  { id: 3, driver: 'Nguyễn Văn A', type: 'heart', level: 'warning', message: 'Nhịp tim bất thường - BPM thấp', time: '2024-12-15 12:45:10', bpm: 52, drowsiness: 45 },
  { id: 4, driver: 'Trần Minh B', type: 'drowsy', level: 'warning', message: 'Phát hiện mắt lim dim kéo dài', time: '2024-12-15 11:22:33', bpm: 68, drowsiness: 55 },
  { id: 5, driver: 'Hoàng Thị E', type: 'drowsy', level: 'danger', message: 'Phát hiện buồn ngủ - mắt nhắm >5s', time: '2024-12-15 10:05:18', bpm: 55, drowsiness: 92 },
  { id: 6, driver: 'Nguyễn Văn A', type: 'yawn', level: 'info', message: 'Phát hiện ngáp', time: '2024-12-15 09:30:44', bpm: 70, drowsiness: 30 },
  { id: 7, driver: 'Phạm Văn D', type: 'heart', level: 'warning', message: 'Nhịp tim tăng đột ngột - BPM cao', time: '2024-12-14 22:15:09', bpm: 105, drowsiness: 20 },
  { id: 8, driver: 'Trần Minh B', type: 'drowsy', level: 'danger', message: 'Phát hiện buồn ngủ - nhiều dấu hiệu', time: '2024-12-14 21:48:55', bpm: 56, drowsiness: 88 },
  { id: 9, driver: 'Lê Quốc C', type: 'yawn', level: 'info', message: 'Phát hiện ngáp liên tục', time: '2024-12-14 20:33:12', bpm: 72, drowsiness: 35 },
  { id: 10, driver: 'Hoàng Thị E', type: 'drowsy', level: 'warning', message: 'Mắt lim dim - theo dõi', time: '2024-12-14 19:12:07', bpm: 65, drowsiness: 50 },
];

export default function HistoryPage() {
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filtered = alertHistory.filter(a => {
    return (filterLevel === 'all' || a.level === filterLevel) &&
           (filterType === 'all' || a.type === filterType);
  });

  const getLevelBadge = (level) => {
    const map = {
      danger: { text: 'Nguy hiểm', color: 'var(--accent-red)', bg: 'rgba(255,71,87,0.12)' },
      warning: { text: 'Cảnh báo', color: 'var(--accent-yellow)', bg: 'rgba(255,165,2,0.12)' },
      info: { text: 'Thông tin', color: 'var(--primary)', bg: 'rgba(0,212,255,0.12)' },
    };
    return map[level] || map.info;
  };

  const getTypeIcon = (type) => {
    const map = { drowsy: '😴', heart: '❤️', yawn: '🥱', face: '👁️' };
    return map[type] || '📋';
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>📋 Lịch Sử Cảnh Báo</h1>
          <p>Xem lại toàn bộ lịch sử cảnh báo của hệ thống</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background: 'linear-gradient(135deg, #FF4757, #FF6B81)' }}>🚨</div>
          <div>
            <strong>{alertHistory.filter(a => a.level === 'danger').length}</strong>
            <span>Nguy hiểm</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background: 'linear-gradient(135deg, #FFA502, #FF6348)' }}>⚠️</div>
          <div>
            <strong>{alertHistory.filter(a => a.level === 'warning').length}</strong>
            <span>Cảnh báo</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background: 'linear-gradient(135deg, #00D4FF, #0099CC)' }}>ℹ️</div>
          <div>
            <strong>{alertHistory.filter(a => a.level === 'info').length}</strong>
            <span>Thông tin</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background: 'linear-gradient(135deg, #2ED573, #26DE81)' }}>📊</div>
          <div>
            <strong>{alertHistory.length}</strong>
            <span>Tổng sự kiện</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span>Mức độ:</span>
          {['all', 'danger', 'warning', 'info'].map(l => (
            <button key={l} className={`${styles.filterBtn} ${filterLevel === l ? styles.active : ''}`} onClick={() => setFilterLevel(l)}>
              {l === 'all' ? 'Tất cả' : l === 'danger' ? '🔴 Nguy hiểm' : l === 'warning' ? '🟡 Cảnh báo' : '🔵 Thông tin'}
            </button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          <span>Loại:</span>
          {['all', 'drowsy', 'heart', 'yawn'].map(t => (
            <button key={t} className={`${styles.filterBtn} ${filterType === t ? styles.active : ''}`} onClick={() => setFilterType(t)}>
              {t === 'all' ? 'Tất cả' : t === 'drowsy' ? '😴 Buồn ngủ' : t === 'heart' ? '❤️ Nhịp tim' : '🥱 Ngáp'}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Loại</th>
              <th>Tài xế</th>
              <th>Chi tiết</th>
              <th>Mức độ</th>
              <th>BPM</th>
              <th>Buồn ngủ</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((alert, i) => {
              const badge = getLevelBadge(alert.level);
              return (
                <tr key={alert.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <td className={styles.typeCell}>
                    <span className={styles.typeIcon}>{getTypeIcon(alert.type)}</span>
                  </td>
                  <td className={styles.driverCell}>
                    <strong>{alert.driver}</strong>
                  </td>
                  <td className={styles.messageCell}>{alert.message}</td>
                  <td>
                    <span className={styles.levelBadge} style={{ color: badge.color, background: badge.bg }}>
                      {badge.text}
                    </span>
                  </td>
                  <td className={styles.bpmCell}>
                    <span style={{ color: alert.bpm > 100 || alert.bpm < 60 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                      {alert.bpm}
                    </span>
                  </td>
                  <td>
                    <div className={styles.drowsinessBar}>
                      <div className={styles.drowsinessBarFill} style={{
                        width: `${alert.drowsiness}%`,
                        background: alert.drowsiness > 70 ? 'var(--accent-red)' : alert.drowsiness > 40 ? 'var(--accent-yellow)' : 'var(--accent-green)',
                      }}></div>
                      <span>{alert.drowsiness}%</span>
                    </div>
                  </td>
                  <td className={styles.timeCell}>{alert.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
