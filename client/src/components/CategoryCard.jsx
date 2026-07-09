import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHECKABLE = new Set(['urgente', 'tareas', 'compra']);
const PROGRESS = new Set(['urgente', 'tareas']);
const TIME_REGEX = /\b(\d{1,2}:\d{2})\b/;

function Checkmark() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
      <path
        d="M1 4L3.8 6.8L9 1.2"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Extrae la hora de un ítem de calendario y limpia conectores colgantes
function splitEventTime(text) {
  const match = text.match(TIME_REGEX);
  if (!match) return null;
  const rest = text
    .replace(match[1], '')
    .replace(/\s{2,}/g, ' ')
    .replace(/[,\s]*(a las|a la|de las|a)\s*$/i, '')
    .trim();
  return { time: match[1], rest: rest || text };
}

export default function CategoryCard({ category, checks, onToggleCheck }) {
  const [expanded, setExpanded] = useState(true);
  const isCheckable = CHECKABLE.has(category.id);
  const doneCount = isCheckable
    ? category.items.filter((_, i) => checks[`${i}_${category.id}`]).length
    : 0;
  const showProgress = PROGRESS.has(category.id) && doneCount > 0;

  return (
    <div
      className="category-card"
      style={{
        '--cat-color': `var(--cat-${category.id})`,
        '--cat-color-dim': `var(--cat-${category.id}-dim)`,
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="card-header"
        aria-expanded={expanded}
      >
        <span className="card-emoji" aria-hidden="true">
          {category.emoji}
        </span>
        <span className="card-title">{category.title}</span>
        <span className="card-badge">{category.items.length}</span>
        <span className={`card-chevron${expanded ? ' open' : ''}`} aria-hidden="true">
          ▼
        </span>
      </button>

      {showProgress && (
        <div className="card-progress">
          <div className="card-progress-track">
            <div
              className="card-progress-fill"
              style={{ width: `${(doneCount / category.items.length) * 100}%` }}
            />
          </div>
          <span className="text-caption tabular-nums">
            {doneCount} / {category.items.length}
          </span>
        </div>
      )}

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {category.id === 'ruido' ? (
              <div style={{ paddingTop: 'var(--s1)' }}>
                {category.items.map((item, index) => (
                  <blockquote key={index} className="ruido-block">
                    <div className="ruido-label">Descartado</div>
                    {item}
                  </blockquote>
                ))}
              </div>
            ) : (
              <ul>
                {category.items.map((item, index) => {
                  const isChecked = Boolean(checks[`${index}_${category.id}`]);

                  if (isCheckable) {
                    const round = category.id === 'compra';
                    return (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => onToggleCheck(category.id, index)}
                          className={`card-item tappable${isChecked ? ' done' : ''}`}
                          role="checkbox"
                          aria-checked={isChecked}
                        >
                          <span
                            className={`checkbox${round ? ' round' : ''}${isChecked ? ' checked' : ''}`}
                            aria-hidden="true"
                          >
                            {isChecked && <Checkmark />}
                          </span>
                          <span className="item-text">{item}</span>
                        </button>
                      </li>
                    );
                  }

                  if (category.id === 'calendario') {
                    const event = splitEventTime(item);
                    return (
                      <li key={index} className="card-item">
                        {event ? (
                          <>
                            <span className="event-time tabular-nums">{event.time}</span>
                            <span className="item-text">{event.rest}</span>
                          </>
                        ) : (
                          <>
                            <span aria-hidden="true">📅</span>
                            <span className="item-text">{item}</span>
                          </>
                        )}
                      </li>
                    );
                  }

                  return (
                    <li key={index} className="card-item">
                      <span className="item-text">{item}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
