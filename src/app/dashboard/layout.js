'use client';
import Sidebar from '@/components/Sidebar/Sidebar';
import { MqttProvider } from '@/hooks/useMqtt';
import useMqtt from '@/hooks/useMqtt';
import styles from './layout.module.css';

function DashboardInner({ children }) {
  const { isConnected } = useMqtt();

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar isConnected={isConnected} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <MqttProvider>
      <DashboardInner>{children}</DashboardInner>
    </MqttProvider>
  );
}
