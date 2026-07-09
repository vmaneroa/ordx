import { useState } from 'react';

// Metadatos de diseño por categoría (color, título fijo, modo de ítem)
const META = {
  urgente: { color: '#F0685F', title: 'Urgente y prioritario', sub: 'Para hoy', mode: 'check' },
  tareas: { color: '#8A6BF0', title: 'Tareas pendientes', mode: 'check' },
  calendario: { color: '#4FD0E6', title: 'Calendario y citas', mode: 'dot' },
  compra: { color: '#5FCE9B', title: 'Lista de la compra', mode: 'check' },
  notas: { color: '#E6B860', title: 'Notas e ideas', mode: 'dot' },
  ruido: { color: '#9A93B5', title: 'Ruido mental', mode: 'noise' },
};

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function Chevron({ open }) {
  return (
    <span style={{ display: 'flex', transition: 'transform 0.25s', transform: `rotate(${open ? 0 : -90}deg)` }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-40)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  );
}

function Check({ on }) {
  return (
    <svg width="12" height="9" viewBox="0 0 12 9" fill="none" style={{ opacity: on ? 1 : 0, transition: 'opacity 0.18s' }}>
      <path d="M1 4.5L4.2 7.5L11 1" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CategoryCard({ category, checks, onToggleCheck }) {
  const [collapsed, setCollapsed] = useState(false);
  const meta = META[category.id] || { color: '#8A6BF0', title: category.title, mode: 'dot' };
  const open = !collapsed;
  const color = meta.color;
  const isNoise = meta.mode === 'noise';
  const isCheck = meta.mode === 'check';

  const items = category.items || [];
  const doneCount = isCheck ? items.filter((_, i) => checks[`${i}_${category.id}`]).length : 0;
  const showProgress = isCheck && items.length >= 2;

  return (
    <div
      style={{
        borderRadius: 22,
        border: `1px solid ${isNoise ? hexToRgba(color, 0.16) : 'var(--border)'}`,
        background: isNoise ? hexToRgba(color, 0.05) : 'var(--surface)',
        overflow: 'hidden',
        marginBottom: 12,
      }}
    >
      {/* Header colapsable */}
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '16px 18px', cursor: 'pointer', width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
        aria-expanded={open}
      >
        <span style={{ fontSize: 20 }}>{category.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {meta.title}
          </div>
          {meta.sub && (
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color, marginTop: 3 }}>
              {meta.sub}
            </div>
          )}
        </div>
        {!isNoise && (
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 500, minWidth: 24, height: 24, padding: '0 7px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color, background: hexToRgba(color, 0.12) }}>
            {items.length}
          </span>
        )}
        <Chevron open={open} />
      </button>

      {/* Cuerpo */}
      {open && (
        <div style={{ padding: '0 18px 16px' }}>
          {isNoise ? (
            items.map((item, i) => (
              <div key={i} style={{ padding: '4px 2px 2px', fontFamily: 'var(--serif)', fontSize: 19, fontStyle: 'italic', lineHeight: 1.5, color: 'var(--text-72)' }}>
                {item}
              </div>
            ))
          ) : (
            <>
              {showProgress && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0 12px' }}>
                  <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, transition: 'width 0.35s cubic-bezier(0.2,0.8,0.2,1)', background: color, width: `${Math.round((doneCount / items.length) * 100)}%` }} />
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-45)' }}>
                    {doneCount}/{items.length}
                  </span>
                </div>
              )}

              {items.map((item, i) => {
                if (isCheck) {
                  const on = Boolean(checks[`${i}_${category.id}`]);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onToggleCheck(category.id, i)}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '9px 0', cursor: 'pointer', width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
                    >
                      <span
                        style={{
                          width: 22, height: 22, borderRadius: 7, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1, transition: 'all 0.2s',
                          background: on ? color : 'rgba(255,255,255,0.03)',
                          border: on ? '1px solid transparent' : '1.6px solid rgba(255,255,255,0.16)',
                          boxShadow: on ? `0 4px 16px ${hexToRgba(color, 0.4)}` : 'none',
                          animation: on ? 'pop 0.3s ease' : 'none',
                        }}
                      >
                        <Check on={on} />
                      </span>
                      <span style={{ flex: 1, fontSize: 15, lineHeight: 1.45, transition: 'all 0.22s', color: on ? 'rgba(244,243,248,0.34)' : 'var(--text-90)', textDecoration: on ? 'line-through' : 'none' }}>
                        {item}
                      </span>
                    </button>
                  );
                }
                // Modo dot (calendario, notas)
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '9px 0' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', flex: '0 0 auto', marginTop: 8, background: color }} />
                    <span style={{ flex: 1, fontSize: 15, lineHeight: 1.45, color: 'var(--text-90)' }}>{item}</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
