import { useCallback, useEffect, useMemo, useState } from 'react';
import CategoryCard from '../CategoryCard.jsx';
import { getChecks, saveChecks } from '../../utils/storage.js';

const CHECKABLE = new Set(['urgente', 'tareas', 'compra']);
const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((a - b) / 86400000);
  const rel = diff === 0 ? 'HOY' : diff === 1 ? 'AYER' : null;
  const stamp = `${d.getDate()} ${MESES[d.getMonth()]}`;
  return rel ? `${rel} · ${stamp}` : stamp;
}

function buildMarkdown(entry) {
  return entry.parsed
    .map((c) => {
      const head = `${c.emoji} ${c.title}`;
      const body = c.items.map((it) => `  - ${it}`).join('\n');
      return `${head}\n${body}`;
    })
    .join('\n\n');
}

function StatCard({ value, label, color }) {
  const tint = color
    ? { background: `${color}14`, border: `1px solid ${color}33` }
    : { background: 'var(--surface-2)', border: '1px solid var(--border)' };
  return (
    <div style={{ flex: 1, padding: 14, borderRadius: 16, ...tint }}>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 30, color: color || 'var(--text)', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', color: color ? `${color}b3` : 'var(--text-45)', marginTop: 5 }}>
        {label}
      </div>
    </div>
  );
}

export default function ResultsView({ entry, showToast, onOpenSettings }) {
  const [checks, setChecks] = useState(() => getChecks(entry.id));

  useEffect(() => {
    setChecks(getChecks(entry.id));
  }, [entry.id]);

  const toggleCheck = useCallback(
    (categoryId, itemIndex) => {
      setChecks((prev) => {
        const next = { ...prev, [`${itemIndex}_${categoryId}`]: !prev[`${itemIndex}_${categoryId}`] };
        saveChecks(entry.id, next);
        return next;
      });
    },
    [entry.id]
  );

  const stats = useMemo(() => {
    let total = 0;
    let urgent = 0;
    let done = 0;
    entry.parsed.forEach((c) => {
      if (c.id === 'ruido') return;
      c.items.forEach((_, i) => {
        total += 1;
        if (c.id === 'urgente') urgent += 1;
        if (CHECKABLE.has(c.id) && checks[`${i}_${c.id}`]) done += 1;
      });
    });
    return { total, urgent, done };
  }, [entry.parsed, checks]);

  const copy = useCallback(async () => {
    const md = buildMarkdown(entry);
    try {
      await navigator.clipboard.writeText(md);
      showToast('¡Copiado!');
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = md;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        showToast('¡Copiado!');
      } catch {
        showToast('No se pudo copiar', 'danger');
      }
    }
  }, [entry, showToast]);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', animation: 'fadeScreen 0.45s ease' }}>
      {/* Header */}
      <div style={{ padding: 'calc(12px + env(safe-area-inset-top)) 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button type="button" aria-label="Ajustes" onClick={onOpenSettings} className="icon-btn">
          <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="7" x2="17" y2="7" />
            <circle cx="8" cy="7" r="2.1" fill="var(--bg)" />
            <line x1="3" y1="13" x2="17" y2="13" />
            <circle cx="13" cy="13" r="2.1" fill="var(--bg)" />
          </svg>
        </button>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--text-40)' }}>
          {formatDate(entry.createdAt)}
        </span>
        <button type="button" onClick={copy} style={{ display: 'flex', alignItems: 'center', gap: 7, height: 40, padding: '0 14px', borderRadius: 13, border: '1px solid var(--border-2)', background: 'var(--surface-2)', cursor: 'pointer' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-85)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2.5" />
            <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-85)' }}>Copiar</span>
        </button>
      </div>

      {/* Contenido scrollable */}
      <div className="scroll-y" style={{ flex: 1, minHeight: 0, padding: '0 22px calc(24px + env(safe-area-inset-bottom))' }}>
        <div style={{ animation: 'floatUp 0.5s ease both' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 40, lineHeight: 1.05, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            Del caos,{' '}
            <span style={{ fontStyle: 'italic', background: 'var(--grad-2)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              esto
            </span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-50)', marginTop: 6 }}>
            Ya está todo en su sitio. Respira.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, margin: '22px 0 8px', animation: 'floatUp 0.5s ease 0.08s both' }}>
          <StatCard value={stats.total} label="ÍTEMS" />
          <StatCard value={stats.urgent} label="URGENTES" color="#F0685F" />
          <StatCard value={stats.done} label="HECHAS" color="#5FCE9B" />
        </div>

        {entry.parsed.map((category) => (
          <CategoryCard key={category.id} category={category} checks={checks} onToggleCheck={toggleCheck} />
        ))}
      </div>
    </div>
  );
}
