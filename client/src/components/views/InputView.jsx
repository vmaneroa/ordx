import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../AppHeader.jsx';
import Logo from '../Logo.jsx';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition.js';

const PLACEHOLDERS = [
  'Escribe todo lo que tienes en la cabeza...',
  'Tareas, ideas, eventos, recados... sin filtros.',
  'El caos es bienvenido aquí.',
  'No te censures. Yo me encargo del resto.',
];

const LOADING_MESSAGES = [
  'Analizando tu volcado…',
  'Clasificando tareas…',
  'Detectando urgencias…',
  'Preparando tu orden…',
];

// iOS no muestra banner de instalación automático: hint manual solo en
// Safari iOS cuando la app aún no está instalada en la pantalla de inicio
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

const EXAMPLE_TEXT = `Uff, tengo mil cosas. Lo más urgente es entregar el informe de ventas hoy antes de las 18h porque el jefe lo necesita para la reunión. También tengo que llamar al médico para pedir cita, creo que era el número 91-234-5678. El jueves a las 17:00 tengo reunión con Marta del equipo de marketing. No sé por qué siempre ponen las reuniones a esa hora, es agotador. Necesito comprar leche, pan de centeno y pilas AA. Tengo que renovar el seguro del coche antes de que caduque, crece que es el día 20. Ah, y una idea que me ronda: ¿y si lanzamos un newsletter semanal con los mejores insights del equipo? Podría ser un buen canal. El tráfico esta mañana ha sido una pesadilla, tardé 45 minutos en llegar. Tengo pendiente revisar el presupuesto del Q3 y mandar el resumen a finanzas.`;

function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center"
      style={{ gap: 'var(--s6)', padding: 'var(--s4)' }}
    >
      <Logo />
      <span className="dot-loader" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="text-body"
          style={{ color: 'var(--text-secondary)' }}
        >
          {LOADING_MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default function InputView({ text, setText, loading, error, onSubmit, onOpenSettings }) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [interimText, setInterimText] = useState('');

  const { isListening, isSupported, toggleListening, stopListening } = useSpeechRecognition({
    onResult: ({ final, interim }) => {
      if (final) {
        // Añade el texto final al textarea (acumula, no reemplaza)
        setText((prev) => prev + final);
        setInterimText('');
      } else {
        setInterimText(interim);
      }
    },
    onEnd: () => setInterimText(''),
  });

  // Al enviar el volcado se corta el dictado
  useEffect(() => {
    if (loading && isListening) {
      stopListening();
      setInterimText('');
    }
  }, [loading, isListening, stopListening]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [text]);

  const isEmpty = !text.trim();

  return (
    <motion.section
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -8, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col"
      style={{ minHeight: '100%' }}
    >
      <AppHeader
        left={<Logo />}
        right={
          <button
            type="button"
            aria-label="Ajustes"
            onClick={onOpenSettings}
            className="btn-ghost"
            style={{ fontSize: 18 }}
          >
            ⚙️
          </button>
        }
      />

      {loading ? (
        <LoadingScreen />
      ) : (
        <div
          className="flex flex-1 flex-col"
          style={{ padding: 'var(--s4)', gap: 'var(--s4)' }}
        >
          <h1 className="text-title" style={{ color: 'var(--text-secondary)' }}>
            ¿Qué tienes en la cabeza?
          </h1>

          {isIOS && !isInstalled && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '10px',
                fontSize: '13px',
                color: 'rgba(238,238,245,0.6)',
                lineHeight: 1.4,
              }}
            >
              <span style={{ fontSize: '16px' }}>💡</span>
              <span>
                Para instalar: toca <strong style={{ color: '#EEEEF5' }}>□↑</strong> en Safari →{' '}
                <strong style={{ color: '#EEEEF5' }}>&quot;Añadir a inicio&quot;</strong>
              </span>
            </div>
          )}

          <div className="relative flex flex-1 flex-col">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="dump-textarea"
              aria-label="Volcado mental"
            />
            {/* Placeholder rotatorio con fade (solo visible con textarea vacío) */}
            {isEmpty && (
              <div
                className="pointer-events-none absolute"
                style={{ top: 'var(--s4)', left: 'var(--s4)', right: 'var(--s4)' }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={placeholderIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="block"
                    style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.65 }}
                  >
                    {PLACEHOLDERS[placeholderIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
          </div>

          {isListening && (
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(238,238,245,0.35)',
                fontStyle: 'italic',
                padding: '6px 4px',
                minHeight: '24px',
                marginTop: 'calc(-1 * var(--s2))',
              }}
            >
              {interimText || '🎙 Escuchando...'}
            </div>
          )}

          <div className="flex items-center justify-between" style={{ marginTop: 'calc(-1 * var(--s2))' }}>
            <button type="button" onClick={() => setText(EXAMPLE_TEXT)} className="btn-link">
              Ver ejemplo
            </button>
            <div className="flex items-center" style={{ gap: 'var(--s3)' }}>
              <span className="text-caption tabular-nums">
                {wordCount} {wordCount === 1 ? 'palabra' : 'palabras'}
              </span>
              {isSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`mic-btn${isListening ? ' mic-btn--active' : ''}`}
                  title={isListening ? 'Detener dictado' : 'Dictar por voz'}
                >
                  {isListening ? '⏹' : '🎙️'}
                  <span>{isListening ? 'Detener' : 'Dictar'}</span>
                </button>
              )}
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-banner"
            >
              {error}
            </motion.p>
          )}

          <button type="button" onClick={onSubmit} disabled={isEmpty} className="btn-primary">
            ✦ Ordenar mi mente
          </button>
        </div>
      )}
    </motion.section>
  );
}
