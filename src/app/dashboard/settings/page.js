'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    drowsinessThreshold: 70,
    heartRateMin: 55,
    heartRateMax: 100,
    eyeClosedDuration: 3,
    yawnCount: 3,
    alertSound: true,
    alertVibration: true,
    alertLED: true,
    pushNotification: true,
    emailNotification: false,
    smsNotification: false,
    mqttBroker: 'broker.hivemq.com',
    mqttPort: 1883,
    mqttTopic: 'drowsyguard/data',
    wifiSSID: 'DrowsyGuard_AP',
    dataInterval: 1000,
    cameraResolution: '640x480',
    autoRestart: true,
    darkMode: true,
    language: 'vi',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>⚙️ Cài Đặt Hệ Thống</h1>
          <p>Cấu hình ngưỡng cảnh báo, kết nối và thông báo</p>
        </div>
        <button className={`btn-primary ${saved ? styles.savedBtn : ''}`} onClick={handleSave}>
          {saved ? '✅ Đã lưu!' : '💾 Lưu Cài Đặt'}
        </button>
      </div>

      {saved && (
        <div className={styles.savedBanner}>
          ✅ Cài đặt đã được lưu thành công!
        </div>
      )}

      <div className={styles.settingsGrid}>
        {/* Alert Thresholds */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <span>🎯</span>
            <h3>Ngưỡng Cảnh Báo</h3>
          </div>
          <div className={styles.settingsCardBody}>
            <div className={styles.settingsItem}>
              <div className={styles.settingsLabel}>
                <span>Ngưỡng buồn ngủ (%)</span>
                <strong>{settings.drowsinessThreshold}%</strong>
              </div>
              <input type="range" min="30" max="95" value={settings.drowsinessThreshold} onChange={e => updateSetting('drowsinessThreshold', Number(e.target.value))} className={styles.slider} />
              <div className={styles.sliderLabels}>
                <span>Nhạy (30%)</span>
                <span>Mặc định (70%)</span>
                <span>Ít nhạy (95%)</span>
              </div>
            </div>
            <div className={styles.settingsItem}>
              <div className={styles.settingsLabel}>
                <span>Nhịp tim tối thiểu (BPM)</span>
                <strong>{settings.heartRateMin}</strong>
              </div>
              <input type="range" min="40" max="70" value={settings.heartRateMin} onChange={e => updateSetting('heartRateMin', Number(e.target.value))} className={styles.slider} />
            </div>
            <div className={styles.settingsItem}>
              <div className={styles.settingsLabel}>
                <span>Nhịp tim tối đa (BPM)</span>
                <strong>{settings.heartRateMax}</strong>
              </div>
              <input type="range" min="80" max="140" value={settings.heartRateMax} onChange={e => updateSetting('heartRateMax', Number(e.target.value))} className={styles.slider} />
            </div>
            <div className={styles.settingsItem}>
              <div className={styles.settingsLabel}>
                <span>Thời gian nhắm mắt tối đa (giây)</span>
                <strong>{settings.eyeClosedDuration}s</strong>
              </div>
              <input type="range" min="1" max="10" value={settings.eyeClosedDuration} onChange={e => updateSetting('eyeClosedDuration', Number(e.target.value))} className={styles.slider} />
            </div>
            <div className={styles.settingsItem}>
              <div className={styles.settingsLabel}>
                <span>Số lần ngáp cảnh báo</span>
                <strong>{settings.yawnCount}</strong>
              </div>
              <input type="range" min="1" max="10" value={settings.yawnCount} onChange={e => updateSetting('yawnCount', Number(e.target.value))} className={styles.slider} />
            </div>
          </div>
        </div>

        {/* Alert Types */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <span>🔔</span>
            <h3>Phương Thức Cảnh Báo</h3>
          </div>
          <div className={styles.settingsCardBody}>
            {[
              { key: 'alertSound', label: 'Còi cảnh báo', desc: 'Phát âm thanh khi phát hiện buồn ngủ', icon: '🔊' },
              { key: 'alertVibration', label: 'Rung cảnh báo', desc: 'Kích hoạt motor rung trên ghế tài xế', icon: '📳' },
              { key: 'alertLED', label: 'Đèn LED cảnh báo', desc: 'Nhấp nháy đèn LED đỏ cảnh báo', icon: '💡' },
              { key: 'pushNotification', label: 'Push Notification', desc: 'Gửi thông báo lên web dashboard', icon: '📱' },
              { key: 'emailNotification', label: 'Email Notification', desc: 'Gửi email cảnh báo đến quản lý', icon: '📧' },
              { key: 'smsNotification', label: 'SMS Notification', desc: 'Gửi tin nhắn SMS cảnh báo', icon: '💬' },
            ].map(item => (
              <div key={item.key} className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleIcon}>{item.icon}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.desc}</p>
                  </div>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" checked={settings[item.key]} onChange={e => updateSetting(item.key, e.target.checked)} />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* MQTT Settings */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <span>📡</span>
            <h3>Kết Nối MQTT</h3>
          </div>
          <div className={styles.settingsCardBody}>
            <div className={styles.inputGroup}>
              <label>MQTT Broker</label>
              <input type="text" value={settings.mqttBroker} onChange={e => updateSetting('mqttBroker', e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label>Port</label>
              <input type="number" value={settings.mqttPort} onChange={e => updateSetting('mqttPort', Number(e.target.value))} />
            </div>
            <div className={styles.inputGroup}>
              <label>Topic</label>
              <input type="text" value={settings.mqttTopic} onChange={e => updateSetting('mqttTopic', e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label>WiFi SSID</label>
              <input type="text" value={settings.wifiSSID} onChange={e => updateSetting('wifiSSID', e.target.value)} />
            </div>
            <div className={styles.connectionTest}>
              <button className="btn-secondary">🔗 Test Kết Nối</button>
              <span className={styles.testStatus}>● Đã kết nối</span>
            </div>
          </div>
        </div>

        {/* Device Settings */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <span>🔧</span>
            <h3>Thiết Bị & Hệ Thống</h3>
          </div>
          <div className={styles.settingsCardBody}>
            <div className={styles.inputGroup}>
              <label>Tần suất gửi dữ liệu (ms)</label>
              <select value={settings.dataInterval} onChange={e => updateSetting('dataInterval', Number(e.target.value))}>
                <option value={500}>500ms (Nhanh)</option>
                <option value={1000}>1000ms (Mặc định)</option>
                <option value={2000}>2000ms (Tiết kiệm)</option>
                <option value={5000}>5000ms (Tối thiểu)</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Độ phân giải Camera</label>
              <select value={settings.cameraResolution} onChange={e => updateSetting('cameraResolution', e.target.value)}>
                <option value="320x240">320x240 (QVGA)</option>
                <option value="640x480">640x480 (VGA)</option>
                <option value="800x600">800x600 (SVGA)</option>
                <option value="1024x768">1024x768 (XGA)</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Ngôn ngữ</label>
              <select value={settings.language} onChange={e => updateSetting('language', e.target.value)}>
                <option value="vi">🇻🇳 Tiếng Việt</option>
                <option value="en">🇺🇸 English</option>
              </select>
            </div>
            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleIcon}>🔄</span>
                <div>
                  <strong>Tự động khởi động lại</strong>
                  <p>Khởi động lại thiết bị khi mất kết nối</p>
                </div>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" checked={settings.autoRestart} onChange={e => updateSetting('autoRestart', e.target.checked)} />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
