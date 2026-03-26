"""
DrowsyGuard Local Bridge - Kết nối AI Server nội bộ với Dashboard trên Vercel

Script này giúp:
1. Dùng ngrok để expose server.py (port 5000) ra internet
2. Tự động publish URL ngrok lên MQTT để dashboard trên Vercel biết kết nối đến đâu

Cách dùng:
    1. Đảm bảo server.py đang chạy ở port 5000
    2. Cài đặt: pip install paho-mqtt pyngrok
    3. Chạy: python local_bridge.py
    
Lưu ý: Cần tài khoản ngrok miễn phí tại https://ngrok.com
       Sau khi đăng ký, chạy: ngrok config add-authtoken YOUR_TOKEN
"""

import time
import sys
import signal

try:
    import paho.mqtt.client as mqtt
except ImportError:
    print("❌ Thiếu thư viện paho-mqtt. Chạy: pip install paho-mqtt")
    sys.exit(1)

try:
    from pyngrok import ngrok, conf
except ImportError:
    print("❌ Thiếu thư viện pyngrok. Chạy: pip install pyngrok")
    sys.exit(1)


# ===== CẤU HÌNH =====
AI_SERVER_PORT = 5000  # Port mà server.py đang chạy
MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
TOPIC_AI_URL = "tu_drowsy_7b8k9m_security/server/ai_url"
PUBLISH_INTERVAL = 30  # Gửi lại URL mỗi 30 giây để đảm bảo dashboard luôn nhận được


def start_ngrok(port):
    """Khởi động tunnel ngrok cho port đã cho"""
    print(f"🔧 Đang tạo tunnel ngrok cho port {port}...")
    try:
        tunnel = ngrok.connect(port, "http")
        public_url = tunnel.public_url
        # Đảm bảo dùng https
        if public_url.startswith("http://"):
            public_url = public_url.replace("http://", "https://", 1)
        print(f"✅ Ngrok tunnel: {public_url}")
        return public_url
    except Exception as e:
        print(f"❌ Lỗi ngrok: {e}")
        print("💡 Hãy đảm bảo bạn đã cấu hình ngrok authtoken:")
        print("   ngrok config add-authtoken YOUR_TOKEN")
        sys.exit(1)


def publish_url_to_mqtt(public_url):
    """Publish URL công khai lên MQTT broker"""
    client = mqtt.Client(client_id=f"drowsy_bridge_{int(time.time())}")
    
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print(f"✅ Đã kết nối MQTT broker: {MQTT_BROKER}")
        else:
            print(f"❌ Lỗi kết nối MQTT: rc={rc}")
    
    def on_disconnect(client, userdata, rc):
        print("⚠️ Mất kết nối MQTT, đang thử lại...")
    
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
    except Exception as e:
        print(f"❌ Không thể kết nối MQTT: {e}")
        sys.exit(1)
    
    return client


def main():
    print("=" * 50)
    print("  🚗 DrowsyGuard Local Bridge")
    print("  Kết nối AI Server → Dashboard Vercel")
    print("=" * 50)
    print()
    
    # Bước 1: Khởi động ngrok
    public_url = start_ngrok(AI_SERVER_PORT)
    
    # Bước 2: Kết nối MQTT và publish URL
    mqtt_client = publish_url_to_mqtt(public_url)
    
    # Chờ MQTT kết nối
    time.sleep(2)
    
    print()
    print(f"📡 Đang publish URL lên MQTT topic: {TOPIC_AI_URL}")
    print(f"🌐 Dashboard sẽ tự động nhận URL: {public_url}")
    print(f"📺 Video feed: {public_url}/video_feed")
    print()
    print("⏳ Nhấn Ctrl+C để dừng...")
    print()
    
    # Xử lý Ctrl+C
    def signal_handler(sig, frame):
        print("\n🛑 Đang dừng bridge...")
        mqtt_client.loop_stop()
        mqtt_client.disconnect()
        ngrok.kill()
        print("👋 Đã dừng. Tạm biệt!")
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    
    # Publish liên tục
    count = 0
    while True:
        try:
            result = mqtt_client.publish(TOPIC_AI_URL, public_url, qos=1, retain=True)
            count += 1
            if count == 1:
                print(f"✅ Đã publish URL lần đầu!")
            elif count % 10 == 0:
                print(f"📡 Đã publish {count} lần (URL: {public_url})")
            time.sleep(PUBLISH_INTERVAL)
        except Exception as e:
            print(f"⚠️ Lỗi publish: {e}")
            time.sleep(5)


if __name__ == "__main__":
    main()
