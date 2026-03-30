# DrowsyGuard - Python Backend

Backend AI xử lý phát hiện buồn ngủ sử dụng Computer Vision.

## Công nghệ
- OpenCV: Xử lý video stream
- MediaPipe: Phát hiện khuôn mặt và landmarks
- NumPy & SciPy: Tính toán toán học
- Pygame: Phát âm thanh cảnh báo
- MQTT: Giao tiếp với ESP32-CAM

## Chức năng
- Nhận video stream từ ESP32-CAM
- Phát hiện mắt nhắm (Eye Aspect Ratio - EAR)
- Phát hiện ngáp (Mouth Aspect Ratio - MAR)
- Gửi lệnh báo động qua MQTT
- Phát âm thanh cảnh báo local

## Cài đặt

### 1. Cài đặt Python dependencies
```bash
pip install -r esp32_cam/requirements.txt
```

### 2. Chạy server
```bash
python esp32_cam/main.py
```

hoặc

```bash
python esp32_cam/server.py
```

## Cấu hình
- MQTT Broker: HiveMQ (broker.hivemq.com)
- MQTT Topic: `tu_drowsy_7b8k9m_security/`
- Camera IP: Tự động nhận từ ESP32-CAM qua MQTT

## Files
- `main.py`: Script chính xử lý AI
- `server.py`: Server backend
- `utils.py`: Các hàm tiện ích
- `test_call.py`: Test MQTT connection
- `generate_alarm.py`: Tạo file âm thanh cảnh báo
- `alarm.wav`: File âm thanh báo động
- `requirements.txt`: Python dependencies

## Thuật toán
- **EAR (Eye Aspect Ratio)**: Tính tỷ lệ mở mắt
- **MAR (Mouth Aspect Ratio)**: Tính độ há miệng
- Ngưỡng cảnh báo tùy chỉnh được
