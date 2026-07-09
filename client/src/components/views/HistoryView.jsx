import { useState } from 'react';
import { motion } from 'framer-motion';
import AppHeader from '../AppHeader.jsx';
import Logo from '../Logo.jsx';

const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function formatDateParts(isoString) {
  const date = new Date(isoString);
  const now = new Date();

  const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfEntry = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.round((startOfToday - startOfEntry) / 86400000);

  if (dayDiff === 0) return { day: 'Hoy', time };
  if (dayDiff === 1) return { day: 'Ayer', time };
  return { day: `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`, time };
}

export default function HistoryView({
  history,
  onOpenEntry,
  onClearHistory,
  onStartNow,
  onOpenSettings,
}) {
  const [confirmingClear, setConfirmingClear] = useState(false);

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
        title="Historial"
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

      {history.length === 0 ? (
        <div
          className="flex flex-1 flex-col items-center justify-center text-center"
          style={{ gap: 'var(--s4)', padding: 'var(--s6)' }}
        >
          <span style={{ fontSize: 40 }} aria-hidden="true">
            🧠
          </span>
          <p className="text-body" style={{ color: 'var(--text-muted)' }}>
            Aún no hay volcados
          </p>
          <button type="button" onClick={onStartNow} className="btn-ghost-outline">
            Empezar ahora →
          </button>
        </div>
      ) : (
        <>
          <div>
            {history.map((entry, index) => {
              const { day, time } = formatDateParts(entry.createdAt);
              return (
                <motion.button
                  key={entry.id}
                  type="button"
                  onClick={() => onOpenEntry(entry)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: index * 0.07,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="history-row"
                >
                  <span className="history-date">
                    <span className="history-date-day">{day}</span>
                    <span className="history-date-time tabular-nums">{time}</span>
                  </span>
                  <span className="history-preview">
                    <span className="history-text block">
                      {entry.originalText.slice(0, 80)}
                      {entry.originalText.length > 80 ? '…' : ''}
                    </span>
                    <span className="history-chips">
                      {entry.parsed.map((cat) => (
                        <span key={cat.id} className="history-chip">
                          {cat.emoji} {cat.items.length}
                        </span>
                      ))}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div
            className="flex justify-center"
            style={{ padding: 'var(--s8) var(--s4) var(--s4)' }}
          >
            {confirmingClear ? (
              <div className="flex items-center" style={{ gap: 'var(--s4)', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>¿Borrar todo el historial?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClearHistory();
                    setConfirmingClear(false);
                  }}
                  className="btn-ghost"
                  style={{ color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}
                >
                  Sí, borrar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingClear(false)}
                  className="btn-ghost"
                  style={{ fontSize: 13 }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingClear(true)}
                className="btn-ghost"
                style={{ color: 'var(--danger)', fontSize: 13 }}
              >
                Borrar historial
              </button>
            )}
          </div>
        </>
      )}
    </motion.section>
  );
}
