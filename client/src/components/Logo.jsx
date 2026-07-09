export default function Logo() {
  return (
    <span
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 900,
        fontSize: '22px',
        letterSpacing: '-0.5px',
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
    </span>
  );
}
