export default function AppHeader({ left, title, right }) {
  return (
    <header className="app-header">
      <div className="app-header-side">{left}</div>
      {title && <div className="app-header-title">{title}</div>}
      <div className="app-header-side right">{right}</div>
    </header>
  );
}
