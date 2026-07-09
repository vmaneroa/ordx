import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AppHeader from '../AppHeader.jsx';
import CategoryCard from '../CategoryCard.jsx';
import { getChecks, saveChecks } from '../../utils/storage.js';

const CHECKABLE = new Set(['urgente', 'tareas', 'compra']);

function buildMarkdown(entry) {
  return entry.parsed
    .map((cat) => {
      const items = cat.items.map((item) => `- ${item}`).join('\n');
      return `## ${cat.emoji} ${cat.title}\n\n${items}`;
    })
    .join('\n\n');
}

export default function ResultsView({ entry, onNewDump, showToast }) {
  const scrollAnchorRef = useRef(null);
  const [checks, setChecks] = useState(() => getChecks(entry.id));

  useEffect(() => {
    setChecks(getChecks(entry.id));
  }, [entry.id]);

  const toggleCheck = useCallback(
    (categoryId, itemIndex) => {
      setChecks((prev) => {
        const key = `${itemIndex}_${categoryId}`;
        const next = { ...prev, [key]: !prev[key] };
        saveChecks(entry.id, next);
        return next;
      });
    },
    [entry.id]
  );

  const copyMarkdown = useCallback(async () => {
    const markdown = buildMarkdown(entry);
    try {
      await navigator.clipboard.writeText(markdown);
      showToast('¡Copiado!');
    } catch {
      // Fallback para contextos sin Clipboard API (iframes, PWAs antiguas)
      try {
        const helper = document.createElement('textarea');
        helper.value = markdown;
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        const ok = document.execCommand('copy');
        helper.remove();
        if (!ok) throw new Error('copy failed');
        showToast('¡Copiado!');
      } catch {
        showToast('No se pudo copiar', 'danger');
      }
    }
  }, [entry, showToast]);

  const scrollToTop = useCallback(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const stats = useMemo(() => {
    const totalItems = entry.parsed.reduce((sum, cat) => sum + cat.items.length, 0);
    const urgentCount = entry.parsed.find((cat) => cat.id === 'urgente')?.items.length || 0;
    const doneCount = entry.parsed
      .filter((cat) => CHECKABLE.has(cat.id))
      .reduce(
        (sum, cat) =>
          sum + cat.items.filter((_, i) => checks[`${i}_${cat.id}`]).length,
        0
      );
    return { totalItems, urgentCount, doneCount };
  }, [entry.parsed, checks]);

  return (
    <motion.section
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -8, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div ref={scrollAnchorRef} />

      <AppHeader
        left={
          <button type="button" onClick={onNewDump} className="btn-ghost">
            ← Nuevo volcado
          </button>
        }
        title="Tu orden"
        right={
          <button
            type="button"
            onClick={copyMarkdown}
            aria-label="Copiar resultado en Markdown"
            className="btn-ghost"
            style={{ fontSize: 16 }}
          >
            📋
          </button>
        }
      />

      <div className="stats-bar">
        <span className="stats-chip">{stats.totalItems} ítems</span>
        {stats.urgentCount > 0 && (
          <span className="stats-chip" style={{ color: 'var(--cat-urgente)' }}>
            {stats.urgentCount} {stats.urgentCount === 1 ? 'urgente' : 'urgentes'}
          </span>
        )}
        {stats.doneCount > 0 && (
          <span className="stats-chip" style={{ color: 'var(--cat-notas)' }}>
            {stats.doneCount} {stats.doneCount === 1 ? 'completada' : 'completadas'}
          </span>
        )}
      </div>

      <div
        className="flex flex-col"
        style={{ padding: 'var(--s3) var(--s4)', gap: 'var(--s2)' }}
      >
        {entry.parsed.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              delay: index * 0.07,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <CategoryCard category={category} checks={checks} onToggleCheck={toggleCheck} />
          </motion.div>
        ))}
      </div>

      <button type="button" onClick={scrollToTop} aria-label="Volver arriba" className="fab">
        ✨
      </button>
    </motion.section>
  );
}
