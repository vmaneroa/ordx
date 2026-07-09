import { useEffect, useRef, useState } from 'react';

export function useSpeechRecognition({ onResult, onEnd }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Callbacks en refs: el efecto de setup corre una sola vez pero siempre
  // invoca la versión más reciente de onResult/onEnd
  const onResultRef = useRef(onResult);
  const onEndRef = useRef(onEnd);
  onResultRef.current = onResult;
  onEndRef.current = onEnd;

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return undefined;

    setIsSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // sigue escuchando sin parar
    recognition.interimResults = true; // muestra texto mientras hablas
    recognition.lang = 'es-ES';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      onResultRef.current?.({ final: finalTranscript, interim: interimTranscript });
    };

    recognition.onend = () => {
      // En iOS Safari el reconocimiento se corta solo tras un silencio —
      // reinicia si el usuario no lo detuvo explícitamente
      if (recognition._shouldRestart) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
          onEndRef.current?.();
        }
      } else {
        setIsListening(false);
        onEndRef.current?.();
      }
    };

    recognition.onerror = (e) => {
      console.error('Speech error:', e.error);
      // "no-speech" dispara onend, que reinicia si procede; los errores de
      // permiso o red sí detienen la escucha
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        recognition._shouldRestart = false;
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition._shouldRestart = false;
      try {
        recognition.stop();
      } catch {
        /* noop */
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current._shouldRestart = true;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      /* ya estaba arrancado */
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current._shouldRestart = false;
    recognitionRef.current.stop();
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return { isListening, isSupported, toggleListening, stopListening };
}
