# DrowsyGuard - Arduino ESP32-CAM

Hệ thống phát hiện buồn ngủ khi lái xe sử dụng ESP32-CAM.

## Phần cứng
- ESP32-CAM (AI-Thinker)
- Cảm biến nhịp tim MAX30102 (GY-MAX30102)
- Buzzer 5V (còi báo động)

## Chức năng
- Stream camera qua WiFi
- Đo nhịp tim real-time
- Điều khiển còi buzzer
- Gửi dữ liệu qua MQTT (HiveMQ)

## Cài đặt
1. Mở file `esp32_cam/CameraWebServer/CameraWebServer.ino` bằng Arduino IDE
2. Cài đặt thư viện:
   - ESP32 Board Support
   - PubSubClient (MQTT)
   - SparkFun MAX3010x Pulse and Proximity Sensor Library
3. Cấu hình WiFi trong code:
   ```cpp
   const char *ssid = "YOUR_WIFI_SSID";
   const char *password = "YOUR_WIFI_PASSWORD";
   ```
4. Upload code lên ESP32-CAM

## Kết nối phần cứng
- MAX30102 SDA → GPIO 1
- MAX30102 SCL → GPIO 2
- Buzzer (+) → GPIO 41
- Buzzer (-) → GPIO 42 (Virtual GND)

## MQTT Topics
- Publish: `tu_drowsy_7b8k9m_security/sensor/heartrate`
- Publish: `tu_drowsy_7b8k9m_security/sensor/camera_ip`
- Subscribe: `tu_drowsy_7b8k9m_security/command/alarm`
