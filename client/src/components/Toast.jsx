import { motion } from 'framer-motion';

export default function Toast({ message, variant = 'success' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 8, x: '-50%' }}
      transition={{ duration: 0.2 }}
      className="toast"
      role="status"
    >
      <span
        className="toast-dot"
        style={{ background: variant === 'success' ? 'var(--success)' : 'var(--danger)' }}
        aria-hidden="true"
      />
      {message}
    </motion.div>
  );
}
