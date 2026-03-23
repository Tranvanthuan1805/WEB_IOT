'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar({ isConnected = false }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard', desc: 'Giám sát' },
    { path: '/dashboard/drivers', icon: '👤', label: 'Tài Xế', desc: 'Quản lý' },
    { path: '/dashboard/history', icon: '📋', label: 'Lịch Sử', desc: 'Cảnh báo' },
    { path: '/dashboard/analytics', icon: '📈', label: 'Phân Tích', desc: 'Thống kê' },
    { path: '/dashboard/devices', icon: '🔌', label: 'Thiết Bị', desc: 'IoT' },
    { path: '/dashboard/settings', icon: '⚙️', label: 'Cài Đặt', desc: 'Hệ thống' },
  ];

  return (
    <>
      <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
        <span className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              <span className={styles.logoEmoji}>🛡️</span>
              <div className={styles.logoPulse}></div>
            </div>
            <div className={styles.logoText}>
              <h1>DrowsyGuard</h1>
              <span>IoT Safety System</span>
            </div>
          </Link>
        </div>

        <div className={styles.timeWidget}>
          <div className={styles.timeDisplay}>{currentTime}</div>
          <div className={styles.dateDisplay}>
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navLabel}>MENU CHÍNH</div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <div className={styles.navContent}>
                <span className={styles.navLabel2}>{item.label}</span>
                <span className={styles.navDesc}>{item.desc}</span>
              </div>
              {pathname === item.path && <div className={styles.activeIndicator} />}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.connectionStatus}>
            <div className={`${styles.statusDot} ${isConnected ? styles.online : styles.offline}`}></div>
            <span>{isConnected ? 'MQTT đã kết nối' : 'MQTT mất kết nối'}</span>
          </div>
          <div className={styles.version}>v2.0.1 • IoT Platform</div>
        </div>
      </aside>
    </>
  );
}

