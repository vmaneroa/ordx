export default function Toast({ message, variant = 'success' }) {
  const dot = variant === 'success' ? '#5FCE9B' : '#F0685F';
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'calc(96px + env(safe-area-inset-bottom))',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '11px 20px',
        borderRadius: 999,
        background: 'rgba(20, 20, 27, 0.96)',
        border: '1px solid var(--border-3)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        zIndex: 999,
        animation: 'toastIn 0.25s ease',
      }}
      role="status"
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: dot }} />
      <span style={{ fontFamily: 'var(--sans)', fontSize: 13.5, fontWeight: 500, color: 'var(--text)' }}>
        {message}
      </span>
    </div>
  );
}
