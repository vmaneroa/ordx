const ICONS = {
  input: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.4" />
    </svg>
  ),
  results: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <line x1="7" y1="8" x2="17" y2="8" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="7" y1="16" x2="13" y2="16" />
    </svg>
  ),
  history: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="7.5" x2="12" y2="12" />
      <line x1="12" y1="12" x2="15" y2="13.5" />
    </svg>
  ),
};

const TABS = [
  { id: 'input', label: 'Volcado' },
  { id: 'results', label: 'Resultado' },
  { id: 'history', label: 'Historial' },
];

export default function BottomNav({ view, setView, hasResults }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => {
        const active = view === tab.id;
        const disabled = tab.id === 'results' && !hasResults;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={disabled}
            onClick={() => setView(tab.id)}
            className={`nav-tab${active ? ' active' : ''}`}
          >
            {ICONS[tab.id]}
            <span className="nav-tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
