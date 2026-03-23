'use client';
import { useEffect, useRef, useCallback } from 'react';

export default function useAlarmSound() {
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);
  const isPlayingRef = useRef(false);
  const speechIntervalRef = useRef(null);

  // Beep sound using Web Audio API
  const playBeep = useCallback((frequency = 800, duration = 200) => {
    try {
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = audioContextRef.current;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime + duration / 1000 - 0.05);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration / 1000);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (e) {
      // Audio API not available
    }
  }, []);

  // Vietnamese female Google voice alert
  const speakWarning = useCallback(() => {
    try {
      if (!('speechSynthesis' in window)) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance('CẢNH BÁO BUỒN NGỦ');

      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Prefer Google Vietnamese female voice
      const voices = window.speechSynthesis.getVoices();
      const googleViVoice = voices.find(
        (v) => v.lang === 'vi-VN' && v.name.includes('Google')
      );
      const anyViVoice = voices.find(
        (v) => v.lang === 'vi-VN' || v.lang.startsWith('vi')
      );
      if (googleViVoice) {
        utterance.voice = googleViVoice;
      } else if (anyViVoice) {
        utterance.voice = anyViVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Speech API not available
    }
  }, []);

  const startAlarm = useCallback(() => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    // Speak immediately
    speakWarning();

    // Beep pattern: high-low-silence-silence
    let step = 0;
    const pattern = () => {
      if (!isPlayingRef.current) return;
      if (step % 4 === 0) playBeep(880, 150);
      else if (step % 4 === 1) playBeep(660, 150);
      step = (step + 1) % 4;
    };

    pattern();
    intervalRef.current = setInterval(pattern, 250);

    // Repeat voice every 8 seconds
    speechIntervalRef.current = setInterval(() => {
      if (isPlayingRef.current) {
        speakWarning();
      }
    }, 8000);
  }, [playBeep, speakWarning]);

  const stopAlarm = useCallback(() => {
    isPlayingRef.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (speechIntervalRef.current) {
      clearInterval(speechIntervalRef.current);
      speechIntervalRef.current = null;
    }

    // Stop any ongoing speech
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    // Preload voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }

    return () => {
      stopAlarm();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stopAlarm]);

  return { startAlarm, stopAlarm, speakWarning };
}
