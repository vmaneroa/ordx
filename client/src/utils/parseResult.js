// Definición de categorías en el orden fijo de renderizado
export const CATEGORIES = [
  { id: 'urgente', emoji: '🚨', match: 'URGENTE' },
  { id: 'tareas', emoji: '✅', match: 'TAREAS' },
  { id: 'calendario', emoji: '📅', match: 'CALENDARIO' },
  { id: 'compra', emoji: '🛒', match: 'COMPRA' },
  { id: 'notas', emoji: '📝', match: 'NOTAS' },
  { id: 'ruido', emoji: '🗑️', match: 'RUIDO' },
];

// Una línea es cabecera de categoría si empieza por un emoji de categoría
// seguido de texto en mayúsculas
const HEADER_REGEX = /^(?:#+\s*)?(?:\*\*)?\s*(🚨|✅|📅|🛒|📝|🗑️)\s*([A-ZÁÉÍÓÚÑÜ][^\n]*)/u;

function slugForEmoji(emoji) {
  const cat = CATEGORIES.find((c) => c.emoji === emoji);
  return cat ? cat.id : null;
}

/**
 * Divide la respuesta en secciones por cabecera de categoría y extrae los ítems.
 * Devuelve [{ id, emoji, title, items: [string] }] en el orden fijo de CATEGORIES.
 */
export function parseResult(text) {
  if (!text || typeof text !== 'string') return [];

  const lines = text.split('\n');
  const sections = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const headerMatch = line.match(HEADER_REGEX);
    if (headerMatch) {
      const emoji = headerMatch[1];
      const id = slugForEmoji(emoji);
      if (id) {
        current = {
          id,
          emoji,
          title: headerMatch[2].replace(/\*\*/g, '').replace(/:\s*$/, '').trim(),
          items: [],
        };
        sections.push(current);
        continue;
      }
    }

    if (current && /^[*\-•]\s+/.test(line)) {
      const item = line.replace(/^[*\-•]\s+/, '').trim();
      if (item) current.items.push(item);
    }
  }

  // Ordenar según el orden fijo de categorías y descartar vacías
  const withContent = sections.filter((s) => s.items.length > 0);
  const order = CATEGORIES.map((c) => c.id);
  withContent.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  return withContent;
}
