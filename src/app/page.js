'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [isVisible, setIsVisible] = useState({});
  const [heartRate, setHeartRate] = useState(72);
  const [particles, setParticles] = useState([]);
  const heroRef = useRef(null);

  useEffect(() => {
    // Generate particles
    const p = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
    }));
    setParticles(p);

    // Heartbeat simulation
    const interval = setInterval(() => {
      setHeartRate(70 + Math.floor(Math.random() * 10));
    }, 1500);

    // Intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const features = [
    {
      icon: '👁️',
      title: 'Nhận Diện Khuôn Mặt',
      desc: 'AI Face Detection phát hiện trạng thái mắt nhắm, ngáp, và biểu hiện buồn ngủ của tài xế theo thời gian thực.',
      gradient: 'linear-gradient(135deg, #00D4FF, #0099CC)',
    },
    {
      icon: '❤️',
      title: 'Giám Sát Nhịp Tim',
      desc: 'Cảm biến nhịp tim MAX30102 theo dõi liên tục BPM và SpO2, phát hiện bất thường ngay lập tức.',
      gradient: 'linear-gradient(135deg, #FF4757, #FF6B81)',
    },
    {
      icon: '🔔',
      title: 'Cảnh Báo Thông Minh',
      desc: 'Hệ thống cảnh báo đa cấp: còi, rung, LED cảnh báo và gửi thông báo qua app khi phát hiện buồn ngủ.',
      gradient: 'linear-gradient(135deg, #FFA502, #FF6348)',
    },
    {
      icon: '📡',
      title: 'Kết Nối IoT',
      desc: 'Kết nối ESP32/Arduino qua MQTT/WebSocket, truyền dữ liệu real-time lên cloud dashboard.',
      gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)',
    },
    {
      icon: '📊',
      title: 'Dashboard Real-time',
      desc: 'Giao diện giám sát trực quan với biểu đồ nhịp tim, trạng thái tài xế, và lịch sử cảnh báo.',
      gradient: 'linear-gradient(135deg, #2ED573, #26DE81)',
    },
    {
      icon: '🔐',
      title: 'Bảo Mật Dữ Liệu',
      desc: 'Dữ liệu sinh trắc học được mã hóa và bảo mật, tuân thủ tiêu chuẩn bảo vệ quyền riêng tư.',
      gradient: 'linear-gradient(135deg, #3742fa, #5352ed)',
    },
  ];

  const stats = [
    { number: '99.2%', label: 'Độ chính xác Face ID', icon: '🎯' },
    { number: '<500ms', label: 'Thời gian phản hồi', icon: '⚡' },
    { number: '24/7', label: 'Giám sát liên tục', icon: '🕐' },
    { number: '50+', label: 'Thiết bị hỗ trợ', icon: '🔌' },
  ];

  const techStack = [
    { name: 'ESP32', desc: 'Vi điều khiển', icon: '🔧' },
    { name: 'MAX30102', desc: 'Cảm biến nhịp tim', icon: '❤️' },
    { name: 'Camera OV2640', desc: 'Nhận diện khuôn mặt', icon: '📷' },
    { name: 'MQTT', desc: 'Giao thức truyền thông', icon: '📡' },
    { name: 'Next.js', desc: 'Web Framework', icon: '⚛️' },
    { name: 'Firebase', desc: 'Cloud Database', icon: '🔥' },
  ];

  const teamMembers = [
    { name: 'Trần Văn Thuận', role: 'Team Leader / IoT Developer', avatar: '👨‍💻' },
    { name: 'Thành viên 2', role: 'Hardware Engineer', avatar: '🔧' },
    { name: 'Thành viên 3', role: 'AI / ML Engineer', avatar: '🤖' },
    { name: 'Thành viên 4', role: 'Frontend Developer', avatar: '🎨' },
  ];

  return (
    <div className={styles.landing}>
      {/* Particles Background */}
      <div className={styles.particlesContainer}>
        {particles.map(p => (
          <div
            key={p.id}
            className={styles.particle}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.navLogo}>
            <span className={styles.navLogoIcon}>🛡️</span>
            <span className={styles.navLogoText}>DrowsyGuard</span>
          </Link>
          <div className={styles.navLinks}>
            <a href="#features">Tính năng</a>
            <a href="#technology">Công nghệ</a>
            <a href="#team">Đội ngũ</a>
            <Link href="/dashboard" className={styles.navCta}>
              Vào Dashboard
              <span className={styles.ctaArrow}>→</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroGrid}></div>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot}></span>
            ĐỒ ÁN CUỐI KỲ • HỆ THỐNG IoT
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine1}>Hệ Thống Cảnh Báo</span>
            <span className={styles.heroLine2}>
              <span className={styles.gradientWord}>Buồn Ngủ</span> Cho Tài Xế
            </span>
          </h1>
          <p className={styles.heroSubtitle}>
            Bảo vệ an toàn giao thông với công nghệ AI Face Detection và cảm biến nhịp tim IoT. 
            Phát hiện buồn ngủ trong <strong>{'<'}500ms</strong> với độ chính xác <strong>99.2%</strong>.
          </p>
          <div className={styles.heroActions}>
            <Link href="/dashboard" className="btn-primary">
              🚀 Truy Cập Dashboard
            </Link>
            <a href="#features" className="btn-secondary">
              Tìm Hiểu Thêm ↓
            </a>
          </div>

          {/* Live Demo Widget */}
          <div className={styles.demoWidget}>
            <div className={styles.demoCard}>
              <div className={styles.faceDetection}>
                <div className={styles.faceFrame}>
                  <div className={styles.faceCorner} style={{ top: 0, left: 0 }}></div>
                  <div className={styles.faceCorner} style={{ top: 0, right: 0 }}></div>
                  <div className={styles.faceCorner} style={{ bottom: 0, left: 0 }}></div>
                  <div className={styles.faceCorner} style={{ bottom: 0, right: 0 }}></div>
                  <div className={styles.scanLine}></div>
                  <div className={styles.faceIcon}>👤</div>
                </div>
                <div className={styles.detectionLabel}>
                  <span className={styles.statusGreen}>● ĐANG NHẬN DIỆN</span>
                </div>
              </div>
            </div>
            <div className={styles.demoCard}>
              <div className={styles.heartMonitor}>
                <div className={styles.heartIcon}>❤️</div>
                <div className={styles.bpmValue}>{heartRate}</div>
                <div className={styles.bpmLabel}>BPM</div>
                <div className={styles.heartWave}>
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={styles.waveBar}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.demoCard}>
              <div className={styles.alertStatus}>
                <div className={styles.alertIconBig}>✅</div>
                <div className={styles.alertText}>TRẠNG THÁI AN TOÀN</div>
                <div className={styles.alertDesc}>Tài xế tỉnh táo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.statItem}>
              <span className={styles.statIcon}>{stat.icon}</span>
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features">
        <div className={styles.sectionContainer}>
          <div
            className={`${styles.sectionHeader} ${isVisible['features-header'] ? styles.visible : ''}`}
            id="features-header"
            data-animate
          >
            <span className={styles.sectionBadge}>TÍNH NĂNG</span>
            <h2>Công Nghệ Tiên Tiến</h2>
            <p>Kết hợp AI, IoT và cảm biến sinh trắc học để bảo vệ tài xế</p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature, i) => (
              <div
                key={i}
                className={`${styles.featureCard} ${isVisible[`feature-${i}`] ? styles.visible : ''}`}
                id={`feature-${i}`}
                data-animate
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={styles.featureIconWrapper} style={{ background: feature.gradient }}>
                  <span>{feature.icon}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionContainer}>
          <div
            className={`${styles.sectionHeader} ${isVisible['how-header'] ? styles.visible : ''}`}
            id="how-header"
            data-animate
          >
            <span className={styles.sectionBadge}>QUY TRÌNH</span>
            <h2>Cách Hoạt Động</h2>
            <p>Từ cảm biến đến cảnh báo, mọi thứ diễn ra trong vài mili giây</p>
          </div>
          <div className={styles.stepsContainer}>
            {[
              { step: '01', title: 'Thu Thập Dữ Liệu', desc: 'Camera và cảm biến nhịp tim thu thập dữ liệu sinh trắc học từ tài xế liên tục.', icon: '📷' },
              { step: '02', title: 'Xử Lý AI', desc: 'Thuật toán AI phân tích biểu hiện khuôn mặt và nhịp tim để phát hiện dấu hiệu buồn ngủ.', icon: '🧠' },
              { step: '03', title: 'Truyền Dữ Liệu', desc: 'ESP32 gửi dữ liệu qua MQTT/WiFi lên cloud server để giám sát từ xa.', icon: '📡' },
              { step: '04', title: 'Cảnh Báo Tức Thì', desc: 'Khi phát hiện buồn ngủ, hệ thống kích hoạt còi, rung và gửi thông báo ngay lập tức.', icon: '🚨' },
            ].map((item, i) => (
              <div
                key={i}
                className={`${styles.stepCard} ${isVisible[`step-${i}`] ? styles.visible : ''}`}
                id={`step-${i}`}
                data-animate
              >
                <div className={styles.stepNumber}>{item.step}</div>
                <div className={styles.stepIcon}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                {i < 3 && <div className={styles.stepConnector}></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className={styles.technology} id="technology">
        <div className={styles.sectionContainer}>
          <div
            className={`${styles.sectionHeader} ${isVisible['tech-header'] ? styles.visible : ''}`}
            id="tech-header"
            data-animate
          >
            <span className={styles.sectionBadge}>CÔNG NGHỆ</span>
            <h2>Nền Tảng Công Nghệ</h2>
            <p>Sử dụng các công nghệ hiện đại và đáng tin cậy</p>
          </div>
          <div className={styles.techGrid}>
            {techStack.map((tech, i) => (
              <div
                key={i}
                className={`${styles.techCard} ${isVisible[`tech-${i}`] ? styles.visible : ''}`}
                id={`tech-${i}`}
                data-animate
              >
                <span className={styles.techIcon}>{tech.icon}</span>
                <h4>{tech.name}</h4>
                <p>{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className={styles.architecture}>
        <div className={styles.sectionContainer}>
          <div
            className={`${styles.sectionHeader} ${isVisible['arch-header'] ? styles.visible : ''}`}
            id="arch-header"
            data-animate
          >
            <span className={styles.sectionBadge}>KIẾN TRÚC</span>
            <h2>Kiến Trúc Hệ Thống</h2>
            <p>Sơ đồ tổng quan kiến trúc IoT</p>
          </div>
          <div className={styles.archDiagram}>
            <div className={styles.archLayer}>
              <div className={styles.archTitle}>🔧 Lớp Cảm Biến (Hardware)</div>
              <div className={styles.archItems}>
                <div className={styles.archItem}>ESP32-CAM</div>
                <div className={styles.archItem}>MAX30102</div>
                <div className={styles.archItem}>Buzzer/LED</div>
                <div className={styles.archItem}>Motor rung</div>
              </div>
            </div>
            <div className={styles.archArrow}>⬇️ MQTT / WiFi</div>
            <div className={styles.archLayer}>
              <div className={styles.archTitle}>☁️ Lớp Cloud (Server)</div>
              <div className={styles.archItems}>
                <div className={styles.archItem}>MQTT Broker</div>
                <div className={styles.archItem}>Firebase</div>
                <div className={styles.archItem}>REST API</div>
                <div className={styles.archItem}>WebSocket</div>
              </div>
            </div>
            <div className={styles.archArrow}>⬇️ HTTPS / WSS</div>
            <div className={styles.archLayer}>
              <div className={styles.archTitle}>💻 Lớp Ứng Dụng (Frontend)</div>
              <div className={styles.archItems}>
                <div className={styles.archItem}>Dashboard</div>
                <div className={styles.archItem}>Analytics</div>
                <div className={styles.archItem}>Alerts</div>
                <div className={styles.archItem}>Management</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.team} id="team">
        <div className={styles.sectionContainer}>
          <div
            className={`${styles.sectionHeader} ${isVisible['team-header'] ? styles.visible : ''}`}
            id="team-header"
            data-animate
          >
            <span className={styles.sectionBadge}>ĐỘI NGŨ</span>
            <h2>Đội Ngũ Phát Triển</h2>
            <p>Đồ án cuối kỳ được thực hiện bởi</p>
          </div>
          <div className={styles.teamGrid}>
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className={`${styles.teamCard} ${isVisible[`team-${i}`] ? styles.visible : ''}`}
                id={`team-${i}`}
                data-animate
              >
                <div className={styles.teamAvatar}>
                  <span>{member.avatar}</span>
                </div>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Sẵn Sàng Giám Sát?</h2>
          <p>Truy cập dashboard để theo dõi trạng thái tài xế và thiết bị IoT</p>
          <Link href="/dashboard" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
            🚀 Vào Dashboard Ngay
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>🛡️ DrowsyGuard</span>
            <p>Hệ thống IoT cảnh báo buồn ngủ cho tài xế</p>
          </div>
          <div className={styles.footerInfo}>
            <p>© 2024 DrowsyGuard • Đồ Án Cuối Kỳ</p>
            <p>Trần Văn Thuận • IoT & Embedded Systems</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
