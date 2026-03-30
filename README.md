# DrowsyGuard - Web Dashboard

Dashboard web real-time giám sát tài xế sử dụng Next.js.

## Công nghệ
- Next.js 16 (App Router)
- React 19
- MQTT.js (Real-time communication)
- CSS Modules

## Tính năng
- Dashboard tổng quan
- Analytics: Phân tích dữ liệu buồn ngủ
- Devices: Quản lý thiết bị ESP32-CAM
- Drivers: Quản lý tài xế
- History: Lịch sử cảnh báo
- Settings: Cài đặt hệ thống

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem dashboard.

### 3. Build production
```bash
npm run build
npm start
```

## Cấu hình MQTT
Dashboard kết nối với MQTT broker để nhận dữ liệu real-time:
- Broker: HiveMQ (broker.hivemq.com)
- Port: 8000 (WebSocket)
- Topic: `tu_drowsy_7b8k9m_security/#`

## Cấu trúc project
```
src/
├── app/
│   ├── dashboard/          # Dashboard pages
│   │   ├── analytics/      # Trang phân tích
│   │   ├── devices/        # Quản lý thiết bị
│   │   ├── drivers/        # Quản lý tài xế
│   │   ├── history/        # Lịch sử
│   │   └── settings/       # Cài đặt
│   ├── layout.js           # Root layout
│   └── page.js             # Landing page
├── components/
│   └── Sidebar/            # Sidebar navigation
└── hooks/
    ├── useMqtt.js          # MQTT connection hook
    ├── useVoiceAI.js       # Voice AI hook
    └── useAlarmSound.js    # Alarm sound hook
```

## Deploy
Deploy dễ dàng lên Vercel:
```bash
npm run build
```

Hoặc push lên GitHub và kết nối với Vercel.
