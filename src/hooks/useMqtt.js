'use client';
import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import mqtt from 'mqtt';

const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';
const TOPIC_PREFIX = 'tu_drowsy_7b8k9m_security/';

const TOPICS = {
  HEARTRATE: TOPIC_PREFIX + 'sensor/heartrate',
  CAMERA_IP: TOPIC_PREFIX + 'sensor/camera_ip',
  ALARM: TOPIC_PREFIX + 'command/alarm',
  DROWSY: TOPIC_PREFIX + 'status/drowsy',
};

const MqttContext = createContext(null);

export function MqttProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [heartRate, setHeartRate] = useState(0);
  const [cameraIp, setCameraIp] = useState('');
  const [alarmActive, setAlarmActive] = useState(false);
  const [isDrowsy, setIsDrowsy] = useState(false);
  const [heartHistory, setHeartHistory] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    const clientId = 'drowsyguard_web_' + Math.random().toString(16).slice(2, 10);

    const client = mqtt.connect(MQTT_BROKER_URL, {
      clientId,
      clean: true,
      connectTimeout: 10000,
      reconnectPeriod: 5000,
      keepalive: 60,
      protocolVersion: 4,
    });

    clientRef.current = client;

    client.on('connect', () => {
      console.log('[MQTT] Connected to HiveMQ broker');
      setIsConnected(true);
      Object.values(TOPICS).forEach((topic) => {
        client.subscribe(topic, (err) => {
          if (!err) {
            console.log(`[MQTT] Subscribed: ${topic}`);
          }
        });
      });
    });

    client.on('message', (topic, message) => {
      const payload = message.toString();

      switch (topic) {
        case TOPICS.HEARTRATE: {
          const bpm = parseInt(payload, 10);
          if (!isNaN(bpm) && bpm > 0 && bpm < 300) {
            setHeartRate(bpm);
            setHeartHistory((prev) => {
              const updated = [...prev, { time: Date.now(), value: bpm }];
              return updated.slice(-30);
            });
          }
          break;
        }
        case TOPICS.CAMERA_IP: {
          const ip = payload.trim();
          if (ip) {
            setCameraIp(ip);
            console.log(`[MQTT] Camera IP: ${ip}`);
          }
          break;
        }
        case TOPICS.ALARM: {
          const active = payload.trim() === '1';
          setAlarmActive(active);
          console.log(`[MQTT] Alarm: ${active ? 'ON' : 'OFF'}`);
          break;
        }
        case TOPICS.DROWSY: {
          const drowsy = payload.trim() === '1';
          setIsDrowsy(drowsy);
          console.log(`[MQTT] Drowsy: ${drowsy ? 'YES' : 'NO'}`);
          break;
        }
        default:
          break;
      }
    });

    client.on('close', () => {
      console.log('[MQTT] Disconnected');
      setIsConnected(false);
    });

    client.on('reconnect', () => {
      console.log('[MQTT] Reconnecting...');
    });

    client.on('error', (err) => {
      console.error('[MQTT] Error:', err.message);
    });

    return () => {
      if (client) {
        client.end(true);
      }
    };
  }, []);

  const publish = useCallback((topic, message) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish(TOPIC_PREFIX + topic, message);
    }
  }, []);

  const value = {
    isConnected,
    heartRate,
    cameraIp,
    alarmActive,
    isDrowsy,
    heartHistory,
    publish,
    TOPICS,
  };

  return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>;
}

export default function useMqtt() {
  const context = useContext(MqttContext);
  if (!context) {
    throw new Error('useMqtt must be used within a MqttProvider');
  }
  return context;
}
