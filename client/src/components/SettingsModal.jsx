import { motion } from 'framer-motion';

export default function SettingsModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ajustes"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ajustes"
          className="btn-ghost absolute"
          style={{ top: 'var(--s3)', right: 'var(--s3)' }}
        >
          ✕
        </button>

        <h3 className="text-title" style={{ marginBottom: 'var(--s4)' }}>
          Ajustes
        </h3>

        <p
          className="text-body"
          style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 'var(--s4)' }}
        >
          ordx v1.0.0 — Tus datos nunca salen de tu dispositivo ni de la conexión con el servidor
          propio.
        </p>

        <div
          style={{
            background: 'var(--bg-overlay)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--r-md)',
            padding: 'var(--s3) var(--s4)',
            fontSize: 14,
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Modelo: </span>
          <span style={{ fontWeight: 600 }}>Claude Sonnet claude-sonnet-4-6</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
