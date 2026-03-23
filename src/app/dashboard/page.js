'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import useMqtt from '@/hooks/useMqtt';
import useAlarmSound from '@/hooks/useAlarmSound';
import styles from './page.module.css';

export default function Dashboard() {
  const {
    isConnected,
    heartRate: mqttHeartRate,
    cameraIp,
    alarmActive,
    isDrowsy,
    heartHistory,
    publish,
  } = useMqtt();

  const { startAlarm, stopAlarm } = useAlarmSound();

  const [sessionTime, setSessionTime] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manualIp, setManualIp] = useState('');
  const [driverName] = useState('Nguyễn Văn A');
  const [smsSent, setSmsSent] = useState(false);
  const EMERGENCY_PHONE = '0335111783';

  // Hiển thị BPM: ưu tiên MQTT, fallback 0
  const heartRate = mqttHeartRate || 0;

  // Python AI Server URL
  const AI_SERVER = 'http://localhost:5000';
  const aiVideoFeedUrl = `${AI_SERVER}/video_feed`;

  // Camera stream URL (direct from ESP32, as fallback)
  const effectiveIp = cameraIp || manualIp;
  const cameraStreamUrl = effectiveIp ? `http://${effectiveIp}:81/stream` : '';

  // Set camera IP on Python server
  const setServerCamera = useCallback((ip) => {
    if (ip) {
      fetch(`${AI_SERVER}/set_camera?ip=${ip}`)
        .then(() => console.log(`[AI] Set camera IP: ${ip}`))
        .catch(() => {});
    }
  }, []);

  // When MQTT receives a camera IP, also tell the Python server
  useEffect(() => {
    if (cameraIp) {
      setServerCamera(cameraIp);
    }
  }, [cameraIp, setServerCamera]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Send SMS alert via Python server
  const sendSmsAlert = useCallback(() => {
    if (smsSent) return;
    setSmsSent(true);
    fetch(`${AI_SERVER}/send_sms?phone=${EMERGENCY_PHONE}&message=${encodeURIComponent(
      `🚨 DROWSYGUARD CẢNH BÁO!\nTài xế: ${driverName}\nBPM: ${heartRate}\nThời gian: ${new Date().toLocaleString('vi-VN')}\nTrạng thái: BUỒN NGỦ - CẦN DỪNG XE NGAY!`
    )}`)
      .then(res => res.json())
      .then(data => {
        console.log('[SMS] Alert sent:', data);
        setNotifications(prev => [{
          id: Date.now(),
          type: 'warning',
          message: `📱 Đã gửi cảnh báo SMS đến ${EMERGENCY_PHONE}`,
          time: new Date().toLocaleTimeString('vi-VN'),
        }, ...prev].slice(0, 8));
      })
      .catch(() => console.log('[SMS] Server not available'));
  }, [smsSent, driverName, heartRate, AI_SERVER, EMERGENCY_PHONE]);

  // Alert trigger từ MQTT alarm + sound + SMS
  useEffect(() => {
    if (alarmActive) {
      setShowAlert(true);
      if (soundEnabled) {
        startAlarm();
      }
      sendSmsAlert();
      setNotifications((prev) =>
        [
          {
            id: Date.now(),
            type: 'danger',
            message: `🚨 PHÁT HIỆN BUỒN NGỦ! Còi báo động đã bật.`,
            time: new Date().toLocaleTimeString('vi-VN'),
          },
          ...prev,
        ].slice(0, 8)
      );
      setAlertsCount((prev) => prev + 1);
    } else {
      setShowAlert(false);
      stopAlarm();
      setSmsSent(false);
    }
  }, [alarmActive, soundEnabled, startAlarm, stopAlarm, sendSmsAlert]);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      if (prev) {
        stopAlarm();
      } else if (alarmActive) {
        startAlarm();
      }
      return !prev;
    });
  }, [alarmActive, startAlarm, stopAlarm]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getStatusColor = () => {
    if (alarmActive || isDrowsy) return 'danger';
    if (heartRate > 0 && heartRate < 55) return 'warning';
    return 'safe';
  };

  const getStatusText = () => {
    if (alarmActive) return 'NGUY HIỂM - BUỒN NGỦ';
    if (isDrowsy) return 'CẢNH BÁO - MỆT MỎI';
    if (heartRate > 0 && heartRate < 55) return 'CẢNH BÁO - NHỊP TIM THẤP';
    return 'AN TOÀN - TỈNH TÁO';
  };

  const getDrowsinessLevel = () => {
    if (alarmActive) return 90;
    if (isDrowsy) return 60;
    if (heartRate > 0 && heartRate < 55) return 50;
    return 10;
  };

  const drowsinessLevel = getDrowsinessLevel();

  // --- HEART RATE ANALYSIS ---
  const getHrZone = () => {
    if (heartRate === 0) return { zone: 'Chưa có dữ liệu', color: '#666', icon: '📡' };
    if (heartRate < 50) return { zone: 'Rất thấp (Nguy hiểm)', color: '#FF4757', icon: '⚠️' };
    if (heartRate < 60) return { zone: 'Nghỉ ngơi', color: '#00D4FF', icon: '😴' };
    if (heartRate < 100) return { zone: 'Bình thường', color: '#2ED573', icon: '💚' };
    if (heartRate < 120) return { zone: 'Cao (Stress)', color: '#FFA502', icon: '⚡' };
    if (heartRate < 140) return { zone: 'Rất cao (Nguy hiểm)', color: '#FF6348', icon: '🔥' };
    return { zone: 'Cực cao (Nguy hiểm)', color: '#FF4757', icon: '🚨' };
  };

  const getHealthSuggestions = () => {
    const suggestions = [];
    const drivingHours = sessionTime / 3600;

    // BPM-based suggestions
    if (heartRate > 0 && heartRate < 55) {
      suggestions.push({ icon: '🛑', text: 'Nhịp tim thấp bất thường. NÊN DỪNG XE nghỉ ngơi ngay!', severity: 'danger' });
      suggestions.push({ icon: '☕', text: 'Uống cà phê hoặc nước có caffeine để tăng tỉnh táo.', severity: 'warning' });
    } else if (heartRate >= 55 && heartRate < 65) {
      suggestions.push({ icon: '😪', text: 'Nhịp tim cho thấy cơ thể đang trong trạng thái buồn ngủ.', severity: 'warning' });
      suggestions.push({ icon: '🏃', text: 'Nên dừng xe, đi bộ 5-10 phút để tăng tuần hoàn.', severity: 'info' });
    } else if (heartRate >= 65 && heartRate < 100) {
      suggestions.push({ icon: '✅', text: 'Nhịp tim ổn định, trạng thái sức khỏe tốt.', severity: 'success' });
    } else if (heartRate >= 100 && heartRate <= 120) {
      suggestions.push({ icon: '💧', text: 'Nhịp tim hơi cao. Uống nước, hít thở sâu để giảm stress.', severity: 'warning' });
    } else if (heartRate > 120) {
      suggestions.push({ icon: '🚑', text: 'Nhịp tim rất cao! Dừng xe an toàn và nghỉ ngơi ngay!', severity: 'danger' });
    }

    // Driving time suggestions
    if (drivingHours >= 4) {
      suggestions.push({ icon: '⏰', text: `Đã lái ${Math.floor(drivingHours)}h liên tục. BẮT BUỘC nghỉ ít nhất 30 phút!`, severity: 'danger' });
    } else if (drivingHours >= 2) {
      suggestions.push({ icon: '🅿️', text: `Đã lái ${Math.floor(drivingHours)}h. Nên tìm trạm nghỉ trong 30 phút tới.`, severity: 'warning' });
    } else if (drivingHours >= 1) {
      suggestions.push({ icon: '👍', text: `Thời gian lái ${Math.floor(drivingHours)}h. Kế hoạch nghỉ sau ${4 - Math.floor(drivingHours)}h nữa.`, severity: 'info' });
    }

    // Meal suggestions based on time
    const hour = new Date().getHours();
    if (hour >= 11 && hour <= 13) {
      suggestions.push({ icon: '🍚', text: 'Giờ ăn trưa: Ăn nhẹ, tránh ăn quá no gây buồn ngủ.', severity: 'info' });
    } else if (hour >= 17 && hour <= 19) {
      suggestions.push({ icon: '🍜', text: 'Giờ ăn tối: Ăn vừa phải, uống nước đầy đủ.', severity: 'info' });
    } else if (hour >= 22 || hour <= 5) {
      suggestions.push({ icon: '🌙', text: 'Khung giờ nguy hiểm (đêm khuya). Ưu tiên nghỉ ngơi nếu có thể.', severity: 'warning' });
    }

    // Drowsy/alarm suggestions
    if (alarmActive) {
      suggestions.unshift({ icon: '🚨', text: 'ĐANG PHÁT HIỆN BUỒN NGỦ! Dừng xe ở chỗ an toàn NGAY!', severity: 'danger' });
      suggestions.push({ icon: '📱', text: `Cảnh báo đã gửi SMS đến SĐT: ${EMERGENCY_PHONE}`, severity: 'info' });
    }

    if (suggestions.length === 0) {
      suggestions.push({ icon: '📡', text: 'Đang chờ dữ liệu nhịp tim từ cảm biến MAX30102...', severity: 'info' });
    }

    return suggestions;
  };

  const hrZone = getHrZone();
  const healthSuggestions = getHealthSuggestions();

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Dashboard Giám Sát</h1>
          <p>Theo dõi trạng thái tài xế theo thời gian thực</p>
        </div>
        <div className={styles.headerRight}>
          <div className={`${styles.mqttBadge} ${isConnected ? styles.mqttOnline : styles.mqttOffline}`}>
            <span className={styles.mqttDot}></span>
            {isConnected ? 'MQTT Connected' : 'MQTT Disconnected'}
          </div>
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
      {showAlert && (
        <div className={styles.alertBanner}>
          <div className={styles.alertBannerContent}>
            <span className={styles.alertIcon}>🚨</span>
            <div>
              <strong>CẢNH BÁO BUỒN NGỦ!</strong>
              <p>Hệ thống phát hiện tài xế đang có dấu hiệu buồn ngủ. Còi báo động đã được kích hoạt!</p>
            </div>
            <button
              className={styles.soundToggle}
              onClick={toggleSound}
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button className={styles.alertDismiss} onClick={() => { setShowAlert(false); stopAlarm(); }}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Camera / Face Detection Card - AI Processed */}
        <div className={`${styles.card} ${styles.faceCard} ${alarmActive ? styles.alertGlow : ''}`}>
          <div className={styles.cardHeader}>
            <h3>📷 Camera AI Detection</h3>
            <span className={`${styles.liveBadge}`}>
              {!cameraError ? '● LIVE' : '○ OFFLINE'}
            </span>
          </div>
          <div className={styles.faceDetectionArea}>
            <div className={styles.cameraView}>
              <img
                src={aiVideoFeedUrl}
                alt="AI Drowsiness Detection"
                className={`${styles.cameraStream} ${alarmActive ? styles.cameraAlert : ''}`}
                onError={() => setCameraError(true)}
                onLoad={() => setCameraError(false)}
              />
            </div>
            <div className={styles.faceInfo}>
              <div className={styles.faceInfoItem}>
                <span className={styles.faceInfoLabel}>AI Server</span>
                <span className={`${styles.faceInfoValue} ${!cameraError ? styles.open : styles.closed}`}>
                  {!cameraError ? '🟢 Online' : '🔴 Offline'}
                </span>
              </div>
              <div className={styles.faceInfoItem}>
                <span className={styles.faceInfoLabel}>Camera IP</span>
                {cameraIp ? (
                  <span className={styles.faceInfoValue}>{cameraIp}</span>
                ) : (
                  <div className={styles.manualIpInput}>
                    <input
                      type="text"
                      placeholder="VD: 192.168.1.100"
                      value={manualIp}
                      onChange={(e) => {
                        setManualIp(e.target.value);
                        setCameraError(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && manualIp) {
                          setServerCamera(manualIp);
                        }
                      }}
                      className={styles.ipInput}
                    />
                  </div>
                )}
              </div>
              <div className={styles.faceInfoItem}>
                <span className={styles.faceInfoLabel}>Trạng thái</span>
                <span className={`${styles.faceInfoValue} ${isDrowsy || alarmActive ? styles.closed : styles.open}`}>
                  {alarmActive ? '😴 BUỒN NGỦ' : isDrowsy ? '😑 MỆT MỎI' : '👁️ TỈNH TÁO'}
                </span>
              </div>
              <div className={styles.faceInfoItem}>
                <span className={styles.faceInfoLabel}>Tài xế</span>
                <span className={styles.faceInfoValue}>{driverName}</span>
              </div>
            </div>
          </div>
        </div>


        {/* Heart Rate Card - Enhanced */}
        {/* Heart Rate Card - Enhanced */}
        <div className={`${styles.card} ${styles.heartCard}`}>
          <div className={styles.cardHeader}>
            <h3>❤️ Nhịp Tim Real-time</h3>
            <span className={styles.liveBadge}>
              {heartRate > 0 ? '● LIVE' : '○ CHỜ DỮ LIỆU'}
            </span>
          </div>
          <div className={styles.heartContent}>
            {/* BPM Display with pulse */}
            <div className={styles.heartMainValue}>
              <span
                className={styles.heartEmoji}
                style={{
                  animationDuration: heartRate > 0 ? `${60 / heartRate}s` : '1.5s',
                }}
              >
                ❤️
              </span>
              <span
                className={styles.bpmBig}
                style={{
                  color: heartRate > 120
                    ? 'var(--accent-red)'
                    : heartRate > 100
                    ? 'var(--accent-yellow)'
                    : heartRate > 0
                    ? 'var(--accent-green)'
                    : undefined,
                  WebkitTextFillColor: heartRate > 120
                    ? 'var(--accent-red)'
                    : heartRate > 100
                    ? 'var(--accent-yellow)'
                    : heartRate > 0
                    ? 'var(--accent-green)'
                    : undefined,
                }}
              >
                {heartRate || '--'}
              </span>
              <span className={styles.bpmUnit}>BPM</span>
            </div>

            {/* HR Zone Indicator */}
            <div className={styles.hrZone}>
              <div className={styles.hrZoneBar}>
                <div className={styles.hrZoneSegment} style={{ background: 'var(--accent-green)', flex: 1 }}></div>
                <div className={styles.hrZoneSegment} style={{ background: 'var(--accent-yellow)', flex: 1 }}></div>
                <div className={styles.hrZoneSegment} style={{ background: 'var(--accent-orange)', flex: 1 }}></div>
                <div className={styles.hrZoneSegment} style={{ background: 'var(--accent-red)', flex: 1 }}></div>
                {heartRate > 0 && (
                  <div
                    className={styles.hrZoneIndicator}
                    style={{ left: `${Math.min(Math.max(((heartRate - 40) / 120) * 100, 0), 100)}%` }}
                  ></div>
                )}
              </div>
              <div className={styles.hrZoneLabels}>
                <span>Nghỉ</span>
                <span>Bình thường</span>
                <span>Cao</span>
                <span>Nguy hiểm</span>
              </div>
            </div>

            {/* ECG-style SVG Line Chart */}
            <div className={styles.heartChart}>
              <svg
                viewBox="0 0 300 80"
                className={styles.ecgChart}
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                <line x1="0" y1="40" x2="300" y2="40" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                {heartHistory.length > 1 && (
                  <>
                    {/* Area fill */}
                    <path
                      d={
                        heartHistory
                          .map((data, i) => {
                            const x = (i / (heartHistory.length - 1)) * 300;
                            const y = 80 - ((data.value - 40) / 120) * 80;
                            return `${i === 0 ? 'M' : 'L'}${x},${Math.max(2, Math.min(78, y))}`;
                          })
                          .join(' ') +
                        ` L300,80 L0,80 Z`
                      }
                      fill="url(#ecgGradient)"
                      opacity="0.3"
                    />
                    {/* Line */}
                    <path
                      d={heartHistory
                        .map((data, i) => {
                          const x = (i / (heartHistory.length - 1)) * 300;
                          const y = 80 - ((data.value - 40) / 120) * 80;
                          return `${i === 0 ? 'M' : 'L'}${x},${Math.max(2, Math.min(78, y))}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke={
                        heartRate > 120
                          ? 'var(--accent-red)'
                          : heartRate > 100
                          ? 'var(--accent-yellow)'
                          : 'var(--accent-green)'
                      }
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className={styles.ecgLine}
                    />
                    {/* Current point */}
                    {heartHistory.length > 0 && (
                      <circle
                        cx={300}
                        cy={Math.max(2, Math.min(78, 80 - ((heartHistory[heartHistory.length - 1].value - 40) / 120) * 80))}
                        r="4"
                        fill={
                          heartRate > 120
                            ? 'var(--accent-red)'
                            : heartRate > 100
                            ? 'var(--accent-yellow)'
                            : 'var(--accent-green)'
                        }
                        className={styles.ecgDot}
                      />
                    )}
                  </>
                )}
                <defs>
                  <linearGradient id="ecgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              {heartHistory.length === 0 && (
                <div className={styles.chartPlaceholder}>
                  <span>📡</span>
                  <p>Đang chờ dữ liệu từ cảm biến MAX30102...</p>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className={styles.heartMeta}>
              <div className={styles.heartMetaItem}>
                <span>🔻 Min</span>
                <strong>
                  {heartHistory.length > 0
                    ? Math.min(...heartHistory.map((d) => d.value))
                    : '--'}{' '}
                  BPM
                </strong>
              </div>
              <div className={styles.heartMetaItem}>
                <span>📊 Trung bình</span>
                <strong>
                  {heartHistory.length > 0
                    ? Math.round(
                        heartHistory.reduce((a, b) => a + b.value, 0) /
                          heartHistory.length
                      )
                    : '--'}{' '}
                  BPM
                </strong>
              </div>
              <div className={styles.heartMetaItem}>
                <span>🔺 Max</span>
                <strong>
                  {heartHistory.length > 0
                    ? Math.max(...heartHistory.map((d) => d.value))
                    : '--'}{' '}
                  BPM
                </strong>
              </div>
              <div className={styles.heartMetaItem}>
                <span>📈 Mẫu</span>
                <strong>{heartHistory.length}/30</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Drowsiness Level Card */}
        <div className={`${styles.card} ${styles.drowsinessCard} ${alarmActive ? styles.alertGlow : ''}`}>
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
              <div className={styles.quickStatIcon} style={{ background: 'linear-gradient(135deg, #00D4FF, #0099CC)' }}>❤️</div>
              <div className={styles.quickStatInfo}>
                <span className={styles.quickStatValue}>{heartRate || '--'}</span>
                <span className={styles.quickStatLabel}>BPM hiện tại</span>
              </div>
            </div>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatIcon} style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>📡</div>
              <div className={styles.quickStatInfo}>
                <span className={styles.quickStatValue}>{isConnected ? 'Online' : 'Offline'}</span>
                <span className={styles.quickStatLabel}>MQTT Broker</span>
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

        {/* Google Maps - Tuyến đường */}
        <div className={`${styles.card} ${styles.mapCard}`}>
          <div className={styles.cardHeader}>
            <h3>🗺️ Bản Đồ Tuyến Đường</h3>
            <a
              href="https://www.google.com/maps/dir/TP.HCM/Đà+Lạt"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapOpenBtn}
            >
              Mở Google Maps ↗
            </a>
          </div>
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1004418.0461792!2d106.6297783!3d11.1698939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x317529292e8d3d1b%3A0xf2784b2f01baecf6!2zVFAuSENNLCBWaeG7h3QgTmFt!3m2!1d10.8230989!2d106.6296638!4m5!1s0x317112fef20988b1%3A0xad5f228b672bf930!2zxJDDoCBM4bqhdCwgTMOibSDEkOG7k25nLCBWaeG7h3QgTmFt!3m2!1d11.9404192!2d108.4583132!5e0!3m2!1svi!2s!4v1710000000000"
              width="100%"
              height="280"
              style={{ border: 0, borderRadius: '10px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - Tuyến đường TP.HCM - Đà Lạt"
            ></iframe>
          </div>
        </div>

        {/* Heart Rate Analysis Card */}
        <div className={`${styles.card} ${styles.hrAnalysisCard}`}>
          <div className={styles.cardHeader}>
            <h3>🩺 Phân Tích Nhịp Tim Chuyên Sâu</h3>
            <span className={styles.liveBadge} style={{ background: hrZone.color + '22', color: hrZone.color }}>
              {hrZone.icon} {hrZone.zone}
            </span>
          </div>
          <div className={styles.hrAnalysisContent}>
            {/* HR Zone visual */}
            <div className={styles.hrZoneBig}>
              <div className={styles.hrZoneCircle} style={{ borderColor: hrZone.color, boxShadow: `0 0 20px ${hrZone.color}44` }}>
                <span className={styles.hrZoneBpm} style={{ color: hrZone.color }}>{heartRate || '--'}</span>
                <span className={styles.hrZoneUnit}>BPM</span>
              </div>
              <div className={styles.hrZoneDetails}>
                <div className={styles.hrZoneBar}>
                  {[{l:'<50',c:'#FF4757'},{l:'50-60',c:'#00D4FF'},{l:'60-80',c:'#2ED573'},{l:'80-100',c:'#FFA502'},{l:'100-120',c:'#FF6348'},{l:'>120',c:'#FF4757'}].map((z,i) => (
                    <div key={i} style={{flex:1,height:'6px',background:z.c,opacity: heartRate > 0 && i === (heartRate<50?0:heartRate<60?1:heartRate<80?2:heartRate<100?3:heartRate<120?4:5) ? 1 : 0.2, borderRadius:'3px', transition:'opacity 0.3s'}} title={z.l}></div>
                  ))}
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.6rem',color:'rgba(255,255,255,0.4)',marginTop:'4px'}}>
                  <span>Thấp</span><span>Nghỉ</span><span>BT</span><span>Cao</span><span>Stress</span><span>Nguy</span>
                </div>
              </div>
            </div>

            {/* Health Suggestions */}
            <div className={styles.healthSuggestions}>
              <h4 style={{fontSize:'0.85rem',marginBottom:'8px',color:'rgba(255,255,255,0.7)'}}>💡 Gợi ý sức khỏe & nghỉ ngơi:</h4>
              {healthSuggestions.map((s, i) => (
                <div key={i} className={`${styles.suggestion} ${styles[s.severity]}`}>
                  <span className={styles.suggestionIcon}>{s.icon}</span>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>

            {/* Emergency Call */}
            <div className={styles.emergencySection}>
              <a href={`tel:${EMERGENCY_PHONE}`} className={styles.emergencyBtn}>
                📞 Gọi khẩn cấp: {EMERGENCY_PHONE}
              </a>
              <p style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.4)',marginTop:'4px',textAlign:'center'}}>SMS cảnh báo tự động khi phát hiện buồn ngủ</p>
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
              notifications.map((notif) => (
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
