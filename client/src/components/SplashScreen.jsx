import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadingOut(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#08080E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        opacity: fadingOut ? 0 : 1,
        transition: 'opacity 400ms ease',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 900,
          fontSize: '48px',
          letterSpacing: '-1px',
          userSelect: 'none',
        }}
      >
        <span style={{ color: '#EEEEF5' }}>ord</span>
        <span
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          x
        </span>
      </motion.span>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ fontSize: '13px', color: 'var(--text-muted)' }}
      >
        del caos al orden
      </motion.span>
    </div>
  );
}
