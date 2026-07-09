const TABS = [
  { id: 'input', emoji: '🧠', label: 'Volcado' },
  { id: 'results', emoji: '✨', label: 'Resultado' },
  { id: 'history', emoji: '🕐', label: 'Historial' },
];

export default function BottomNav({ view, setView, hasResults }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => {
        const isActive = view === tab.id;
        const disabled = tab.id === 'results' && !hasResults;

        return (
          <button
            key={tab.id}
            type="button"
            disabled={disabled}
            onClick={() => setView(tab.id)}
            className={`nav-tab${isActive ? ' active' : ''}`}
          >
            <span className="nav-tab-icon" aria-hidden="true">
              {tab.emoji}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
