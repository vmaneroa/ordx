import { useState } from 'react';
import Logo from '../Logo.jsx';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function fmt(iso) {
  const d = new Date(iso);
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((a - b) / 86400000);
  const day = diff === 0 ? 'Hoy' : diff === 1 ? 'Ayer' : `${d.getDate()} ${MESES[d.getMonth()]}`;
  const time = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  return { day, time };
}

export default function HistoryView({ history, onOpenEntry, onClearHistory, onStartNow }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', animation: 'fadeScreen 0.4s ease' }}>
      {/* Header */}
      <div style={{ padding: 'calc(14px + env(safe-area-inset-top)) 26px 12px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--text-38)', marginBottom: 10 }}>
          TU DIARIO MENTAL
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 34, color: 'var(--text)', lineHeight: 1 }}>
          Historial
        </div>
      </div>

      {history.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 40px', gap: 18 }}>
          <Logo size={40} opacity={0.5} />
          <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontStyle: 'italic', color: 'var(--text-60)', lineHeight: 1.3 }}>
            Todo en silencio, por ahora
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-45)', lineHeight: 1.5 }}>
            Cuando sueltes lo que llevas dentro, quedará guardado aquí.
          </div>
          <button
            type="button"
            onClick={onStartNow}
            style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 14, border: '1px solid var(--border-2)', background: 'var(--surface-2)', color: 'var(--text)', fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Empezar ahora →
          </button>
        </div>
      ) : (
        <div className="scroll-y" style={{ flex: 1, minHeight: 0, padding: '8px 22px calc(24px + env(safe-area-inset-bottom))' }}>
          {history.map((entry) => {
            const { day, time } = fmt(entry.createdAt);
            const totalItems = entry.parsed.reduce((n, c) => n + (c.items ? c.items.length : 0), 0);
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => onOpenEntry(entry)}
                style={{ display: 'block', width: '100%', textAlign: 'left', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--surface)', padding: 18, marginBottom: 12, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 19, color: 'var(--text)' }}>{day}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-40)' }}>{time}</span>
                </div>
                <div style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--text-60)' }}>
                  {entry.originalText.slice(0, 96).trim()}
                  {entry.originalText.length > 96 ? '…' : ''}
                </div>
                <div style={{ display: 'flex', gap: 7, marginTop: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                  {entry.parsed.map((c) => (
                    <span key={c.id} style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--surface-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                      {c.emoji}
                    </span>
                  ))}
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-40)', display: 'flex', alignItems: 'center', marginLeft: 4 }}>
                    {totalItems} ítems
                  </span>
                </div>
              </button>
            );
          })}

          <div style={{ display: 'flex', justifyContent: 'center', padding: '18px 0 4px' }}>
            {confirming ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'var(--mono)', fontSize: 11 }}>
                <button type="button" onClick={() => { onClearHistory(); setConfirming(false); }} style={{ border: 'none', background: 'transparent', color: 'var(--c-urgente)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em' }}>
                  SÍ, VACIAR
                </button>
                <button type="button" onClick={() => setConfirming(false)} style={{ border: 'none', background: 'transparent', color: 'var(--text-40)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em' }}>
                  CANCELAR
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} style={{ border: 'none', background: 'transparent', color: 'var(--text-40)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em' }}>
                VACIAR HISTORIAL
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
