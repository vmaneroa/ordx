import { useEffect, useMemo, useRef, useState } from 'react';
import Logo from '../Logo.jsx';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition.js';

const PLACEHOLDER =
  'Suéltalo aquí. Tareas, ideas, citas, recados… sin orden y sin filtros. Ya lo ordeno yo.';

const PROCESS_STEPS = [
  { color: 'var(--cyan)', text: 'Leyendo lo que soltaste', delay: 0 },
  { color: 'var(--indigo)', text: 'Encontrando lo urgente', delay: 0.5 },
  { color: 'var(--violet)', text: 'Poniendo cada cosa en su sitio', delay: 1 },
];

function GearIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="7" x2="17" y2="7" />
      <circle cx="8" cy="7" r="2.1" fill="var(--bg)" />
      <line x1="3" y1="13" x2="17" y2="13" />
      <circle cx="13" cy="13" r="2.1" fill="var(--bg)" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <line x1="12" y1="17" x2="12" y2="20.5" />
    </svg>
  );
}

function fmtTimer(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

/* ---------------- Pantalla: escuchando (dictado por voz) ---------------- */
function ListeningScreen({ interim, elapsed, onStop }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--bg)',
        padding: 'calc(12px + env(safe-area-inset-top)) 26px 0',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 60,
        animation: 'fadeScreen 0.4s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={30} opacity={0.9} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--cyan)' }}>
          {fmtTimer(elapsed)}
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 38 }}>
        <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 120, height: 120, borderRadius: '50%', border: '1.5px solid rgba(138,107,240,0.5)', animation: 'ringPulse 2.4s ease-out infinite' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 120, height: 120, borderRadius: '50%', border: '1.5px solid rgba(79,208,230,0.4)', animation: 'ringPulse 2.4s ease-out 1.2s infinite' }} />
          <div style={{ width: 118, height: 118, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #8a6bf0, #4fd0e6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 55px rgba(108,123,242,0.55)', animation: 'micBreath 1.6s ease-in-out infinite' }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M6 11a6 6 0 0 0 12 0" />
              <line x1="12" y1="17" x2="12" y2="20.5" />
            </svg>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 38 }}>
          {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((d, i) => (
            <div key={i} style={{ width: 4, height: 38, borderRadius: 2, background: 'linear-gradient(#8a6bf0, #4fd0e6)', transformOrigin: 'center bottom', animation: `wave 1s ease-in-out ${d}s infinite` }} />
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.24em', color: 'var(--cyan)', marginBottom: 14 }}>
            ESCUCHANDO…
          </div>
          <div style={{ fontSize: 18, lineHeight: 1.55, color: 'var(--text-85)', maxWidth: 260 }}>
            {interim ? `«${interim}»` : 'Habla con naturalidad…'}
            <span style={{ display: 'inline-block', width: 2, height: 18, marginLeft: 2, transform: 'translateY(3px)', background: 'var(--cyan)', animation: 'caret 1.1s step-end infinite' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0 calc(40px + env(safe-area-inset-bottom))' }}>
        <button type="button" onClick={onStop} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 26px', borderRadius: 18, background: 'var(--surface-3)', border: '1px solid var(--border-3)', cursor: 'pointer' }}>
          <span style={{ width: 13, height: 13, borderRadius: 3, background: 'var(--text)' }} />
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>Toca para parar</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------- Pantalla: procesando ---------------- */
function ProcessingScreen() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--bg)',
        padding: 'calc(12px + env(safe-area-inset-top)) 26px 0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 60,
        animation: 'fadeScreen 0.4s ease',
      }}
    >
      <div style={{ position: 'absolute', top: '26%', left: '50%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,123,242,0.45), rgba(79,208,230,0.12) 55%, transparent 70%)', filter: 'blur(30px)', transform: 'translate(-50%, -50%)', animation: 'micBreath 3s ease-in-out infinite' }} />

      <div style={{ zIndex: 2 }}>
        <Logo size={30} opacity={0.85} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36, zIndex: 2 }}>
        <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#8a6bf0', borderRightColor: '#4fd0e6', animation: 'orbSpin 1.4s linear infinite' }} />
          <div style={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', border: '1.5px solid transparent', borderBottomColor: 'rgba(138,107,240,0.6)', animation: 'orbSpin 2s linear infinite reverse' }} />
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'radial-gradient(circle, #8a6bf0, #4fd0e6)', filter: 'blur(1px)', animation: 'micBreath 2.2s ease-in-out infinite' }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 29, color: 'var(--text)', fontStyle: 'italic' }}>
            Ordenando tu mente…
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--text-40)', marginTop: 10 }}>
            CLAUDE ESTÁ LEYENDO
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 230 }}>
          {PROCESS_STEPS.map((s) => (
            <div key={s.text} style={{ display: 'flex', alignItems: 'center', gap: 11, animation: `floatUp 0.5s ease ${s.delay}s both` }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }} />
              <span style={{ fontSize: 14, color: 'var(--text-72)' }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Vista compose (contenedor) ---------------- */
export default function InputView({
  text,
  setText,
  loading,
  error,
  onSubmit,
  onOpenSettings,
  onListeningChange,
}) {
  const [interimText, setInterimText] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const taRef = useRef(null);

  const { isListening, isSupported, toggleListening, stopListening } = useSpeechRecognition({
    onResult: ({ final, interim }) => {
      if (final) {
        setText((prev) => (prev ? prev.replace(/\s*$/, ' ') : '') + final);
        setInterimText('');
      } else {
        setInterimText(interim);
      }
    },
    onEnd: () => setInterimText(''),
  });

  // Notifica a App para ocultar la nav durante el dictado
  useEffect(() => {
    onListeningChange?.(isListening);
  }, [isListening, onListeningChange]);

  // Cronómetro de escucha
  useEffect(() => {
    if (!isListening) {
      setElapsed(0);
      return undefined;
    }
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [isListening]);

  // Corta el dictado al enviar
  useEffect(() => {
    if (loading && isListening) {
      stopListening();
      setInterimText('');
    }
  }, [loading, isListening, stopListening]);

  const wordCount = useMemo(() => {
    const t = text.trim();
    return t ? t.split(/\s+/).length : 0;
  }, [text]);

  const isEmpty = !text.trim();

  if (loading) return <ProcessingScreen />;
  if (isListening) {
    return <ListeningScreen interim={interimText} elapsed={elapsed} onStop={stopListening} />;
  }

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: 'calc(12px + env(safe-area-inset-top)) 26px 0',
        animation: 'fadeScreen 0.4s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={32} />
        <button type="button" aria-label="Ajustes" onClick={onOpenSettings} className="icon-btn">
          <GearIcon />
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--text-38)', marginBottom: 14 }}>
          VOLCADO MENTAL · SIN FILTROS
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 37, lineHeight: 1.08, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          ¿Qué llevas <span style={{ fontStyle: 'italic' }}>dentro</span> hoy?
        </div>
      </div>

      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER}
        aria-label="Volcado mental"
        style={{
          flex: 1,
          minHeight: 0,
          marginTop: 20,
          width: '100%',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          resize: 'none',
          color: 'var(--text-85)',
          fontFamily: 'var(--sans)',
          fontSize: 16.5,
          lineHeight: 1.72,
        }}
      />

      {error && (
        <div style={{ fontFamily: 'var(--sans)', fontSize: 13.5, color: 'var(--c-urgente)', padding: '4px 0 2px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0 16px' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-40)' }}>
          {wordCount} {wordCount === 1 ? 'palabra' : 'palabras'}
        </span>
        {isSupported && (
          <button
            type="button"
            aria-label="Dictar por voz"
            onClick={toggleListening}
            style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <MicIcon />
          </button>
        )}
      </div>

      <button type="button" onClick={onSubmit} disabled={isEmpty} className="btn-cta" style={{ marginBottom: 'calc(6px + env(safe-area-inset-bottom))' }}>
        Ordenar mi mente
      </button>
    </div>
  );
}
