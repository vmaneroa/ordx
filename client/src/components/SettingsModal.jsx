import { motion } from 'framer-motion';
import Logo from './Logo.jsx';

export default function SettingsModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ajustes"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 380,
          background: '#0f0f16',
          border: '1px solid var(--border-2)',
          borderRadius: 24,
          padding: 26,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="icon-btn"
          style={{ position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 11 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        <Logo size={30} />

        <div style={{ fontFamily: 'var(--serif)', fontSize: 26, color: 'var(--text)', marginTop: 18, marginBottom: 12 }}>
          Ajustes
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-60)', marginBottom: 18 }}>
          ordx v1.0.0 — Tus datos nunca salen de tu dispositivo ni de la conexión con el servidor
          propio.
        </p>

        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '13px 16px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-45)', marginBottom: 4 }}>
            MODELO
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-85)' }}>
            Claude Sonnet · claude-sonnet-4-6
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
