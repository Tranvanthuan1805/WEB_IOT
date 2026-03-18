'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';

export default function Dashboard() {
  const [heartRate, setHeartRate] = useState(75);
  const [heartHistory, setHeartHistory] = useState([]);
  const [eyeStatus, setEyeStatus] = useState('open');
  const [drowsinessLevel, setDrowsinessLevel] = useState(15);
  const [alertActive, setAlertActive] = useState(false);
  const [spO2, setSpO2] = useState(98);
  const [temperature, setTemperature] = useState(36.5);
  const [driverName, setDriverName] = useState('Nguyễn Văn A');
  const [sessionTime, setSessionTime] = useState(0);
  const [alertsCount, setAlertsCount] = useState(3);
  const [notifications, setNotifications] = useState([]);

  // Simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      // Heart rate simulation
      const newHR = 65 + Math.floor(Math.random() * 25);
      setHeartRate(newHR);
      setHeartHistory(prev => {
        const updated = [...prev, { time: Date.now(), value: newHR }];
        return updated.slice(-30);
      });

      // SpO2 simulation
      setSpO2(96 + Math.floor(Math.random() * 4));

      // Temperature
      setTemperature(36.2 + Math.random() * 0.8);

      // Eye status simulation
      const rand = Math.random();
      if (rand > 0.85) {
        setEyeStatus('closed');
        setDrowsinessLevel(prev => Math.min(100, prev + 15));
      } else if (rand > 0.7) {
        setEyeStatus('half');
        setDrowsinessLevel(prev => Math.min(100, prev + 5));
      } else {
        setEyeStatus('open');
        setDrowsinessLevel(prev => Math.max(0, prev - 3));
      }
    }, 1500);

    // Session timer
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  // Alert trigger
  useEffect(() => {
    if (drowsinessLevel > 70) {
      setAlertActive(true);
      if (drowsinessLevel > 80 && notifications.length < 10) {
        setNotifications(prev => [{
          id: Date.now(),
          type: 'danger',
          message: '⚠️ Phát hiện buồn ngủ! Mức cảnh báo: ' + drowsinessLevel + '%',
          time: new Date().toLocaleTimeString('vi-VN'),
        }, ...prev].slice(0, 5));
        setAlertsCount(prev => prev + 1);
      }
    } else {
      setAlertActive(false);
    }
  }, [drowsinessLevel, notifications.length]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getStatusColor = () => {
    if (drowsinessLevel > 70) return 'danger';
    if (drowsinessLevel > 40) return 'warning';
    return 'safe';
  };

  const getStatusText = () => {
    if (drowsinessLevel > 70) return 'NGUY HIỂM - BUỒN NGỦ';
    if (drowsinessLevel > 40) return 'CẢNH BÁO - MỆT MỎI';
    return 'AN TOÀN - TỈNH TÁO';
  };

  const getEyeStatusText = () => {
    switch (eyeStatus) {
      case 'closed': return 'MẮT NHẮM';
      case 'half': return 'MẮT LIM DIM';
      default: return 'MẮT MỞ';
    }
  };

  const getEyeEmoji = () => {
    switch (eyeStatus) {
      case 'closed': return '😴';
      case 'half': return '😑';
      default: return '👁️';
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Dashboard Giám Sát</h1>
          <p>Theo dõi trạng thái tài xế theo thời gian thực</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.sessionInfo}>
            <span className={styles.sessionLabel}>Thời gian phiên:</span>
            <span className={styles.sessionTime}>{formatTime(sessionTime)}</span>
          </div>
          <div className={`${styles.globalStatus} ${styles[getStatusColor()]}`}>
            <span className={styles.globalStatusDot}></span>
            {getStatusText()}
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {alertActive && (
        <div className={styles.alertBanner}>
          <div className={styles.alertBannerContent}>
            <span className={styles.alertIcon}>🚨</span>
            <div>
              <strong>CẢNH BÁO BUỒN NGỦ!</strong>
              <p>Hệ thống phát hiện tài xế đang có dấu hiệu buồn ngủ. Mức độ: {drowsinessLevel}%</p>
            </div>
            <button className={styles.alertDismiss} onClick={() => setAlertActive(false)}>✕</button>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Face Detection Card */}
        <div className={`${styles.card} ${styles.faceCard}`}>
          <div className={styles.cardHeader}>
            <h3>👁️ Nhận Diện Khuôn Mặt</h3>
            <span className={`${styles.liveBadge}`}>● LIVE</span>
          </div>
          <div className={styles.faceDetectionArea}>
            <div className={styles.cameraView}>
              <div className={styles.cameraPlaceholder}>
                <div className={styles.faceFrameDash}>
                  <div className={styles.faceCornerD} data-pos="tl"></div>
                  <div className={styles.faceCornerD} data-pos="tr"></div>
                  <div className={styles.faceCornerD} data-pos="bl"></div>
                  <div className={styles.faceCornerD} data-pos="br"></div>
                  <div className={styles.scanLineD}></div>
                  <span className={styles.faceEmoji}>{getEyeEmoji()}</span>
                </div>
              </div>
            </div>
            <div className={styles.faceInfo}>
              <div className={styles.faceInfoItem}>
                <span className={styles.faceInfoLabel}>Trạng thái mắt</span>
                <span className={`${styles.faceInfoValue} ${styles[eyeStatus]}`}>{getEyeStatusText()}</span>
              </div>
              <div className={styles.faceInfoItem}>
                <span className={styles.faceInfoLabel}>Tài xế</span>
                <span className={styles.faceInfoValue}>{driverName}</span>
              </div>
              <div className={styles.faceInfoItem}>
                <span className={styles.faceInfoLabel}>Face ID</span>
                <span className={`${styles.faceInfoValue} ${styles.verified}`}>✓ Đã xác minh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Heart Rate Card */}
        <div className={`${styles.card} ${styles.heartCard}`}>
          <div className={styles.cardHeader}>
            <h3>❤️ Nhịp Tim</h3>
            <span className={styles.liveBadge}>● LIVE</span>
          </div>
          <div className={styles.heartContent}>
            <div className={styles.heartMainValue}>
              <span className={styles.heartEmoji}>❤️</span>
              <span className={styles.bpmBig}>{heartRate}</span>
              <span className={styles.bpmUnit}>BPM</span>
            </div>
            <div className={styles.heartChart}>
              <div className={styles.chartGrid}>
                {heartHistory.map((data, i) => (
                  <div
                    key={i}
                    className={styles.chartBar}
                    style={{
                      height: `${((data.value - 50) / 50) * 100}%`,
                      background: data.value > 90 ? 'var(--accent-red)' : data.value > 80 ? 'var(--accent-yellow)' : 'var(--accent-green)',
                      opacity: 0.3 + (i / heartHistory.length) * 0.7,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className={styles.heartMeta}>
              <div className={styles.heartMetaItem}>
                <span>SpO2</span>
                <strong>{spO2}%</strong>
              </div>
              <div className={styles.heartMetaItem}>
                <span>Nhiệt độ</span>
                <strong>{temperature.toFixed(1)}°C</strong>
              </div>
              <div className={styles.heartMetaItem}>
                <span>Trung bình</span>
                <strong>{heartHistory.length > 0 ? Math.round(heartHistory.reduce((a, b) => a + b.value, 0) / heartHistory.length) : '--'} BPM</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Drowsiness Level Card */}
        <div className={`${styles.card} ${styles.drowsinessCard} ${alertActive ? styles.alertGlow : ''}`}>
          <div className={styles.cardHeader}>
            <h3>😴 Mức Độ Buồn Ngủ</h3>
          </div>
          <div className={styles.drowsinessContent}>
            <div className={styles.gaugeContainer}>
              <svg className={styles.gauge} viewBox="0 0 200 120">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--accent-green)" />
                    <stop offset="50%" stopColor="var(--accent-yellow)" />
                    <stop offset="100%" stopColor="var(--accent-red)" />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 110 A 80 80 0 0 1 180 110"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 110 A 80 80 0 0 1 180 110"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${drowsinessLevel * 2.51} 251`}
                  className={styles.gaugeProgress}
                />
                <text x="100" y="85" textAnchor="middle" className={styles.gaugeText}>
                  {drowsinessLevel}%
                </text>
                <text x="100" y="105" textAnchor="middle" className={styles.gaugeLabel}>
                  {getStatusText()}
                </text>
              </svg>
            </div>
            <div className={styles.drowsinessLevels}>
              <div className={`${styles.levelItem} ${drowsinessLevel <= 30 ? styles.active : ''}`}>
                <div className={`${styles.levelDot} ${styles.green}`}></div>
                <span>An toàn (0-30%)</span>
              </div>
              <div className={`${styles.levelItem} ${drowsinessLevel > 30 && drowsinessLevel <= 70 ? styles.active : ''}`}>
                <div className={`${styles.levelDot} ${styles.yellow}`}></div>
                <span>Cảnh báo (30-70%)</span>
              </div>
              <div className={`${styles.levelItem} ${drowsinessLevel > 70 ? styles.active : ''}`}>
                <div className={`${styles.levelDot} ${styles.red}`}></div>
                <span>Nguy hiểm (70-100%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`${styles.card} ${styles.statsCard}`}>
          <div className={styles.cardHeader}>
            <h3>📊 Thống Kê Nhanh</h3>
          </div>
          <div className={styles.quickStats}>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatIcon} style={{ background: 'linear-gradient(135deg, #FF4757, #FF6B81)' }}>🚨</div>
              <div className={styles.quickStatInfo}>
                <span className={styles.quickStatValue}>{alertsCount}</span>
                <span className={styles.quickStatLabel}>Cảnh báo hôm nay</span>
              </div>
            </div>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatIcon} style={{ background: 'linear-gradient(135deg, #2ED573, #26DE81)' }}>⏱️</div>
              <div className={styles.quickStatInfo}>
                <span className={styles.quickStatValue}>{formatTime(sessionTime)}</span>
                <span className={styles.quickStatLabel}>Tổng thời gian lái</span>
              </div>
            </div>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatIcon} style={{ background: 'linear-gradient(135deg, #00D4FF, #0099CC)' }}>😴</div>
              <div className={styles.quickStatInfo}>
                <span className={styles.quickStatValue}>2</span>
                <span className={styles.quickStatLabel}>Lần ngáp</span>
              </div>
            </div>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatIcon} style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>👁️</div>
              <div className={styles.quickStatInfo}>
                <span className={styles.quickStatValue}>1</span>
                <span className={styles.quickStatLabel}>Lần nhắm mắt dài</span>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Info Card */}
        <div className={`${styles.card} ${styles.driverCard}`}>
          <div className={styles.cardHeader}>
            <h3>👤 Thông Tin Tài Xế</h3>
          </div>
          <div className={styles.driverContent}>
            <div className={styles.driverAvatar}>
              <span>👨‍✈️</span>
              <div className={`${styles.driverStatusDot} ${styles[getStatusColor()]}`}></div>
            </div>
            <h4 className={styles.driverName}>{driverName}</h4>
            <span className={styles.driverId}>ID: DRV-001</span>
            <div className={styles.driverDetails}>
              <div className={styles.driverDetailItem}>
                <span>Biển số xe</span>
                <strong>51A-123.45</strong>
              </div>
              <div className={styles.driverDetailItem}>
                <span>Tuyến đường</span>
                <strong>TP.HCM - Đà Lạt</strong>
              </div>
              <div className={styles.driverDetailItem}>
                <span>Bằng lái</span>
                <strong>Hạng C</strong>
              </div>
              <div className={styles.driverDetailItem}>
                <span>Kinh nghiệm</span>
                <strong>5 năm</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className={`${styles.card} ${styles.notifCard}`}>
          <div className={styles.cardHeader}>
            <h3>🔔 Thông Báo Gần Đây</h3>
          </div>
          <div className={styles.notifList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyNotif}>
                <span>✅</span>
                <p>Không có cảnh báo nào</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className={`${styles.notifItem} ${styles[notif.type]}`}>
                  <div className={styles.notifContent}>
                    <p>{notif.message}</p>
                    <span className={styles.notifTime}>{notif.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
