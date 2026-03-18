'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

const initialDevices = [
  { id: 'ESP32-001', name: 'ESP32-CAM Module A', type: 'Camera', location: 'Xe 51A-123.45', status: 'online', lastPing: '2s ago', firmware: 'v2.1.3', signal: 92, battery: null, ip: '192.168.1.101' },
  { id: 'MAX30-001', name: 'MAX30102 Sensor A', type: 'Heart Rate', location: 'Xe 51A-123.45', status: 'online', lastPing: '1s ago', firmware: 'v1.4.0', signal: 88, battery: 78, ip: '192.168.1.102' },
  { id: 'ESP32-002', name: 'ESP32-CAM Module B', type: 'Camera', location: 'Xe 51B-678.90', status: 'online', lastPing: '3s ago', firmware: 'v2.1.3', signal: 76, battery: null, ip: '192.168.1.103' },
  { id: 'MAX30-002', name: 'MAX30102 Sensor B', type: 'Heart Rate', location: 'Xe 51B-678.90', status: 'online', lastPing: '2s ago', firmware: 'v1.4.0', signal: 85, battery: 92, ip: '192.168.1.104' },
  { id: 'ESP32-003', name: 'ESP32-CAM Module C', type: 'Camera', location: 'Xe 51C-111.22', status: 'offline', lastPing: '2h ago', firmware: 'v2.0.8', signal: 0, battery: null, ip: '192.168.1.105' },
  { id: 'MAX30-003', name: 'MAX30102 Sensor C', type: 'Heart Rate', location: 'Xe 51C-111.22', status: 'offline', lastPing: '2h ago', firmware: 'v1.3.5', signal: 0, battery: 15, ip: '192.168.1.106' },
  { id: 'BUZ-001', name: 'Buzzer Alert Module', type: 'Alert', location: 'Xe 51A-123.45', status: 'online', lastPing: '1s ago', firmware: 'v1.0.2', signal: 95, battery: null, ip: '192.168.1.107' },
  { id: 'VIB-001', name: 'Vibration Motor', type: 'Alert', location: 'Xe 51A-123.45', status: 'online', lastPing: '1s ago', firmware: 'v1.0.0', signal: 95, battery: null, ip: '192.168.1.108' },
];

export default function DevicesPage() {
  const [devices, setDevices] = useState(initialDevices);
  const [filter, setFilter] = useState('all');
  const [pingAnimations, setPingAnimations] = useState({});

  const filteredDevices = devices.filter(d => filter === 'all' || d.status === filter);

  const handlePing = (deviceId) => {
    setPingAnimations(prev => ({ ...prev, [deviceId]: true }));
    setTimeout(() => {
      setPingAnimations(prev => ({ ...prev, [deviceId]: false }));
    }, 2000);
  };

  const getDeviceIcon = (type) => {
    const map = { 'Camera': '📷', 'Heart Rate': '❤️', 'Alert': '🔔' };
    return map[type] || '🔌';
  };

  const getSignalBars = (signal) => {
    const bars = Math.ceil(signal / 25);
    return (
      <div className={styles.signalBars}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`${styles.signalBar} ${i <= bars ? styles.active : ''}`} style={{ height: `${i * 5 + 4}px` }}></div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>🔌 Quản Lý Thiết Bị IoT</h1>
          <p>Giám sát và quản lý các thiết bị IoT trong hệ thống</p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statEmoji}>🔌</span>
          <div>
            <strong>{devices.length}</strong>
            <span>Tổng thiết bị</span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statEmoji} style={{ background: 'rgba(46,213,115,0.15)' }}>🟢</span>
          <div>
            <strong>{devices.filter(d => d.status === 'online').length}</strong>
            <span>Đang kết nối</span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statEmoji} style={{ background: 'rgba(100,116,139,0.15)' }}>⚫</span>
          <div>
            <strong>{devices.filter(d => d.status === 'offline').length}</strong>
            <span>Mất kết nối</span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statEmoji} style={{ background: 'rgba(255,165,2,0.15)' }}>⚡</span>
          <div>
            <strong>{devices.filter(d => d.battery && d.battery < 30).length}</strong>
            <span>Pin yếu</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filterRow}>
        {['all', 'online', 'offline'].map(f => (
          <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? '📋 Tất cả' : f === 'online' ? '🟢 Online' : '⚫ Offline'}
          </button>
        ))}
      </div>

      {/* Devices Grid */}
      <div className={styles.devicesGrid}>
        {filteredDevices.map((device, i) => (
          <div key={device.id} className={`${styles.deviceCard} ${device.status === 'offline' ? styles.offline : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceTypeIcon}>
                <span>{getDeviceIcon(device.type)}</span>
              </div>
              <div className={styles.deviceMainInfo}>
                <h4>{device.name}</h4>
                <span className={styles.deviceId}>{device.id}</span>
              </div>
              <div className={`${styles.deviceStatus} ${styles[device.status]}`}>
                <span className={styles.statusDotD}></span>
                {device.status === 'online' ? 'Online' : 'Offline'}
              </div>
            </div>

            <div className={styles.deviceBody}>
              <div className={styles.deviceInfoRow}>
                <span>📍 {device.location}</span>
                <span>🔄 {device.lastPing}</span>
              </div>
              <div className={styles.deviceInfoRow}>
                <span>💻 {device.firmware}</span>
                <span>🌐 {device.ip}</span>
              </div>
              <div className={styles.deviceMetrics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Tín hiệu</span>
                  <div className={styles.metricValue}>
                    {getSignalBars(device.signal)}
                    <span>{device.signal}%</span>
                  </div>
                </div>
                {device.battery !== null && (
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Pin</span>
                    <div className={styles.batteryContainer}>
                      <div className={styles.battery}>
                        <div className={styles.batteryLevel} style={{
                          width: `${device.battery}%`,
                          background: device.battery > 50 ? 'var(--accent-green)' : device.battery > 20 ? 'var(--accent-yellow)' : 'var(--accent-red)',
                        }}></div>
                      </div>
                      <span>{device.battery}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.deviceFooter}>
              <button
                className={`${styles.pingBtn} ${pingAnimations[device.id] ? styles.pinging : ''}`}
                onClick={() => handlePing(device.id)}
                disabled={device.status === 'offline'}
              >
                {pingAnimations[device.id] ? '📡 Đang ping...' : '📡 Ping'}
              </button>
              <button className={styles.deviceActionBtn}>⚙️ Cấu hình</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
