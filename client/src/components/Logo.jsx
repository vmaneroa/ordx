export default function Logo({ size = 22, opacity = 1 }) {
  return (
    <span
      style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: size,
        fontWeight: 400,
        letterSpacing: '-0.5px',
        display: 'flex',
        alignItems: 'baseline',
        opacity,
        userSelect: 'none',
      }}
    >
      <span style={{ color: '#EEEEF5', fontStyle: 'normal' }}>ord</span>
      <span
        style={{
          background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontStyle: 'italic',
        }}
      >
        x
      </span>
    </span>
  );
}
