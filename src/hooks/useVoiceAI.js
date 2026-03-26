'use client';
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for AI Voice interaction
 * Handles Speech-to-Text (STT) and Text-to-Speech (TTS)
 */
export default function useVoiceAI(heartRate, statusText) {
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'vi-VN'; 
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('[AI Voice] User said:', transcript);
        handleCommand(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('[AI Voice] Recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [heartRate, statusText]);

  // Text-to-Speech using Google-like Vietnamese female voice
  const speak = useCallback((text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try to find the best Vietnamese female voice
    const voices = window.speechSynthesis.getVoices();
    const optimalVoice = voices.find(v => v.lang.includes('vi') && v.name.includes('Google')) || 
                        voices.find(v => v.lang.includes('vi'));
                        
    if (optimalVoice) utterance.voice = optimalVoice;
    
    setAiResponse(text);
    window.speechSynthesis.speak(utterance);
  }, []);

  // Process voice commands
  const handleCommand = useCallback((text) => {
    if (text.includes('nhịp tim') || text.includes('bpm') || text.includes('tim')) {
      if (heartRate > 0) {
        speak(`Nhịp tim của bạn hiện tại là ${heartRate} BPM. ${statusText}.`);
      } else {
        speak("Tôi chưa nhận được dữ liệu nhịp tim từ cảm biến. Vui lòng kiểm tra thiết bị.");
      }
    } else if (text.includes('tình trạng') || text.includes('sức khỏe') || text.includes('thế nào')) {
      speak(`Trạng thái của bạn hiện tại là ${statusText}.`);
    } else if (text.includes('xin chào') || text.includes('chào')) {
      speak("Xin chào! Tôi là trợ lý AI Drowsy Guard. Tôi có thể giúp gì cho bạn?");
    } else {
      speak("Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi về nhịp tim hoặc tình trạng sức khỏe.");
    }
  }, [heartRate, statusText, speak]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setAiResponse('Đang lắng nghe...');
      } catch (e) {
        console.error('[AI Voice] Start error:', e);
      }
    } else if (!recognitionRef.current) {
      alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.");
    }
  }, [isListening]);

  return { isListening, aiResponse, startListening, speak };
}
