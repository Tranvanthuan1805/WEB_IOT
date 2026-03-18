import Sidebar from '@/components/Sidebar/Sidebar';
import styles from './layout.module.css';

export const metadata = {
  title: "Dashboard - DrowsyGuard IoT",
  description: "Bảng điều khiển giám sát hệ thống cảnh báo buồn ngủ cho tài xế",
};

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.dashboardLayout}>
      <Sidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
