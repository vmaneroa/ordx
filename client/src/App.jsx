import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import BottomNav from './components/BottomNav.jsx';
import InputView from './components/views/InputView.jsx';
import ResultsView from './components/views/ResultsView.jsx';
import HistoryView from './components/views/HistoryView.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import Toast from './components/Toast.jsx';
import { parseResult } from './utils/parseResult.js';
import { getHistory, saveEntry, clearHistory, generateId } from './utils/storage.js';

export default function App() {
  const [view, setView] = useState('input'); // "input" | "results" | "history"
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(null); // entrada activa en la vista resultados
  const [history, setHistory] = useState(() => getHistory());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [listening, setListening] = useState(false); // dictado por voz activo (oculta la nav)

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message, variant = 'success') => {
    setToast({ message, variant, key: Date.now() });
  }, []);

  const processText = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Algo salió mal al procesar tu volcado.');
      }

      const entry = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        originalText: trimmed,
        result: data.result,
        parsed: parseResult(data.result),
      };

      setHistory(saveEntry(entry));
      setCurrent(entry);
      setView('results');
    } catch (err) {
      setError(err.message || 'Algo salió mal al procesar tu volcado.');
    } finally {
      setLoading(false);
    }
  }, [text, loading]);

  const startNewDump = useCallback(() => {
    setText('');
    setError(null);
    setView('input');
  }, []);

  const openHistoryEntry = useCallback((entry) => {
    setCurrent(entry);
    setView('results');
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const hasResults = Boolean(current);
  const chromeless = loading || listening; // procesando o dictando: sin bottom-nav

  return (
    <>
      {showSplash && <SplashScreen />}
      <div className="app-shell" style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 300ms' }}>
        <main className="view-scroll">
          {view === 'input' && (
            <InputView
              text={text}
              setText={setText}
              loading={loading}
              error={error}
              onSubmit={processText}
              onOpenSettings={() => setSettingsOpen(true)}
              onListeningChange={setListening}
            />
          )}
          {view === 'results' && current && (
            <ResultsView
              entry={current}
              showToast={showToast}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          )}
          {view === 'history' && (
            <HistoryView
              history={history}
              onOpenEntry={openHistoryEntry}
              onClearHistory={handleClearHistory}
              onStartNow={startNewDump}
            />
          )}
        </main>

        {!chromeless && <BottomNav view={view} setView={setView} hasResults={hasResults} />}

        <AnimatePresence>
          {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {toast && <Toast key={toast.key} message={toast.message} variant={toast.variant} />}
        </AnimatePresence>
      </div>
    </>
  );
}
