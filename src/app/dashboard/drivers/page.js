'use client';
import { useState } from 'react';
import styles from './page.module.css';

const initialDrivers = [
  { id: 'DRV-001', name: 'Nguyễn Văn A', phone: '0901234567', license: 'Hạng C', vehicle: '51A-123.45', route: 'TP.HCM - Đà Lạt', status: 'online', alerts: 3, totalTrips: 128, avatar: '👨‍✈️' },
  { id: 'DRV-002', name: 'Trần Minh B', phone: '0912345678', license: 'Hạng D', vehicle: '51B-678.90', route: 'TP.HCM - Nha Trang', status: 'online', alerts: 1, totalTrips: 95, avatar: '👨‍✈️' },
  { id: 'DRV-003', name: 'Lê Quốc C', phone: '0923456789', license: 'Hạng C', vehicle: '51C-111.22', route: 'TP.HCM - Vũng Tàu', status: 'offline', alerts: 0, totalTrips: 210, avatar: '👨‍✈️' },
  { id: 'DRV-004', name: 'Phạm Văn D', phone: '0934567890', license: 'Hạng E', vehicle: '51D-333.44', route: 'TP.HCM - Cần Thơ', status: 'alert', alerts: 7, totalTrips: 67, avatar: '👨‍✈️' },
  { id: 'DRV-005', name: 'Hoàng Thị E', phone: '0945678901', license: 'Hạng C', vehicle: '51E-555.66', route: 'TP.HCM - Bình Dương', status: 'online', alerts: 2, totalTrips: 156, avatar: '👩‍✈️' },
];

export default function DriversPage() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', license: 'Hạng C', vehicle: '', route: '' });

  const filteredDrivers = drivers.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       d.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAddDriver = () => {
    if (!formData.name || !formData.phone || !formData.vehicle) return;
    const newDriver = {
      id: `DRV-${String(drivers.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'offline',
      alerts: 0,
      totalTrips: 0,
      avatar: '👨‍✈️',
    };
    setDrivers(prev => [...prev, newDriver]);
    setFormData({ name: '', phone: '', license: 'Hạng C', vehicle: '', route: '' });
    setShowModal(false);
  };

  const handleDeleteDriver = (id) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
  };

  const getStatusBadge = (status) => {
    const map = {
      online: { text: 'Đang hoạt động', className: 'online' },
      offline: { text: 'Ngoại tuyến', className: 'offline' },
      alert: { text: 'Có cảnh báo', className: 'alert' },
    };
    return map[status] || map.offline;
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>👤 Quản Lý Tài Xế</h1>
          <p>Quản lý thông tin và giám sát trạng thái tài xế</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          ➕ Thêm Tài Xế
        </button>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsRow}>
        <div className={styles.miniStat}>
          <span className={styles.miniStatIcon}>👥</span>
          <div>
            <strong>{drivers.length}</strong>
            <span>Tổng tài xế</span>
          </div>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniStatIcon} style={{ background: 'rgba(46, 213, 115, 0.15)' }}>🟢</span>
          <div>
            <strong>{drivers.filter(d => d.status === 'online').length}</strong>
            <span>Đang hoạt động</span>
          </div>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniStatIcon} style={{ background: 'rgba(255, 71, 87, 0.15)' }}>🔴</span>
          <div>
            <strong>{drivers.filter(d => d.status === 'alert').length}</strong>
            <span>Có cảnh báo</span>
          </div>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniStatIcon} style={{ background: 'rgba(100, 116, 139, 0.15)' }}>⚫</span>
          <div>
            <strong>{drivers.filter(d => d.status === 'offline').length}</strong>
            <span>Ngoại tuyến</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm tài xế, ID, biển số..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filterTabs}>
          {['all', 'online', 'offline', 'alert'].map(f => (
            <button
              key={f}
              className={`${styles.filterTab} ${filterStatus === f ? styles.active : ''}`}
              onClick={() => setFilterStatus(f)}
            >
              {f === 'all' ? 'Tất cả' : f === 'online' ? '🟢 Online' : f === 'offline' ? '⚫ Offline' : '🔴 Cảnh báo'}
            </button>
          ))}
        </div>
      </div>

      {/* Drivers Grid */}
      <div className={styles.driversGrid}>
        {filteredDrivers.map((driver, i) => {
          const badge = getStatusBadge(driver.status);
          return (
            <div key={driver.id} className={styles.driverCard} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.driverCardHeader}>
                <div className={styles.driverAvatarSmall}>
                  <span>{driver.avatar}</span>
                  <div className={`${styles.statusIndicator} ${styles[driver.status]}`}></div>
                </div>
                <div className={styles.driverMainInfo}>
                  <h4>{driver.name}</h4>
                  <span className={styles.driverIdSmall}>{driver.id}</span>
                </div>
                <span className={`status-badge status-${badge.className}`}>{badge.text}</span>
              </div>
              <div className={styles.driverCardBody}>
                <div className={styles.driverDetailRow}>
                  <span>📞 {driver.phone}</span>
                  <span>🪪 {driver.license}</span>
                </div>
                <div className={styles.driverDetailRow}>
                  <span>🚗 {driver.vehicle}</span>
                  <span>🛣️ {driver.route}</span>
                </div>
              </div>
              <div className={styles.driverCardFooter}>
                <div className={styles.driverStat}>
                  <span>🚨 {driver.alerts} cảnh báo</span>
                </div>
                <div className={styles.driverStat}>
                  <span>🚛 {driver.totalTrips} chuyến</span>
                </div>
                <div className={styles.driverActions}>
                  <button className={styles.actionBtn} title="Xem chi tiết" onClick={() => setSelectedDriver(driver)}>👁️</button>
                  <button className={styles.actionBtn} title="Xóa" onClick={() => handleDeleteDriver(driver.id)}>🗑️</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDrivers.length === 0 && (
        <div className={styles.emptyState}>
          <span>🔍</span>
          <p>Không tìm thấy tài xế nào</p>
        </div>
      )}

      {/* Add Driver Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>➕ Thêm Tài Xế Mới</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Họ và tên *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nhập họ tên tài xế" />
              </div>
              <div className={styles.formGroup}>
                <label>Số điện thoại *</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0901234567" />
              </div>
              <div className={styles.formGroup}>
                <label>Hạng bằng lái</label>
                <select value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})}>
                  <option>Hạng B1</option>
                  <option>Hạng B2</option>
                  <option>Hạng C</option>
                  <option>Hạng D</option>
                  <option>Hạng E</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Biển số xe *</label>
                <input type="text" value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})} placeholder="51A-123.45" />
              </div>
              <div className={styles.formGroup}>
                <label>Tuyến đường</label>
                <input type="text" value={formData.route} onChange={e => setFormData({...formData, route: e.target.value})} placeholder="TP.HCM - Đà Lạt" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-primary" onClick={handleAddDriver}>Thêm Tài Xế</button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Detail Modal */}
      {selectedDriver && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDriver(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>👤 Chi Tiết Tài Xế</h3>
              <button onClick={() => setSelectedDriver(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailProfile}>
                <div className={styles.detailAvatar}>
                  <span>{selectedDriver.avatar}</span>
                </div>
                <h4>{selectedDriver.name}</h4>
                <span className={`status-badge status-${getStatusBadge(selectedDriver.status).className}`}>
                  {getStatusBadge(selectedDriver.status).text}
                </span>
              </div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}><span>ID</span><strong>{selectedDriver.id}</strong></div>
                <div className={styles.detailItem}><span>Điện thoại</span><strong>{selectedDriver.phone}</strong></div>
                <div className={styles.detailItem}><span>Bằng lái</span><strong>{selectedDriver.license}</strong></div>
                <div className={styles.detailItem}><span>Biển số</span><strong>{selectedDriver.vehicle}</strong></div>
                <div className={styles.detailItem}><span>Tuyến đường</span><strong>{selectedDriver.route}</strong></div>
                <div className={styles.detailItem}><span>Tổng chuyến đi</span><strong>{selectedDriver.totalTrips}</strong></div>
                <div className={styles.detailItem}><span>Cảnh báo</span><strong style={{ color: selectedDriver.alerts > 5 ? 'var(--accent-red)' : 'inherit' }}>{selectedDriver.alerts}</strong></div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn-secondary" onClick={() => setSelectedDriver(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
