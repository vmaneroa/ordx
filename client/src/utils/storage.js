const HISTORY_KEY = 'ordx-history';
const MAX_ENTRIES = 5;

export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Guarda una entrada nueva al principio; conserva un máximo de 5
export function saveEntry(entry) {
  const history = getHistory();
  const updated = [entry, ...history].slice(0, MAX_ENTRIES);
  // Limpiar los checks de las entradas expulsadas del historial
  const removed = [entry, ...history].slice(MAX_ENTRIES);
  removed.forEach((e) => {
    try {
      localStorage.removeItem(`ordx-checks-${e.id}`);
    } catch {
      /* noop */
    }
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function clearHistory() {
  const history = getHistory();
  history.forEach((e) => {
    try {
      localStorage.removeItem(`ordx-checks-${e.id}`);
    } catch {
      /* noop */
    }
  });
  localStorage.removeItem(HISTORY_KEY);
}

// Checks: objeto { "itemIndex_categoriaId": boolean } por volcado
export function getChecks(volcadoId) {
  try {
    const raw = localStorage.getItem(`ordx-checks-${volcadoId}`);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveChecks(volcadoId, checks) {
  localStorage.setItem(`ordx-checks-${volcadoId}`, JSON.stringify(checks));
}
