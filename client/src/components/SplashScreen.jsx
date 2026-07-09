import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFadingOut(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        opacity: fadingOut ? 0 : 1,
        transition: 'opacity 400ms ease',
        pointerEvents: 'none',
      }}
    >
      {/* Resplandor de fondo */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,123,242,0.35), rgba(79,208,230,0.1) 55%, transparent 70%)',
          filter: 'blur(30px)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        style={{ zIndex: 2, animation: 'floatUp 0.7s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <span className="logo" style={{ fontSize: 56 }}>
          ord<span className="x">x</span>
        </span>
      </div>
      <span
        style={{ zIndex: 2, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--text-45)', animation: 'floatUp 0.6s ease 0.25s both' }}
      >
        del caos al orden
      </span>
    </div>
  );
}
