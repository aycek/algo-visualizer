import { useTheme } from './hooks/useTheme';
import { useLang } from './hooks/useLang';
import { useHashRoute } from './hooks/useHashRoute';
import { t } from './utils/i18n';
import Header from './components/Layout/Header';
import Home from './components/Pages/Home';
import ArrayAlgorithms from './components/Pages/ArrayAlgorithms';
import GraphAlgorithms from './components/Pages/GraphAlgorithms';
import TreeAlgorithms from './components/Pages/TreeAlgorithms';
import GameMode from './components/Pages/GameMode';

export default function App() {
  const { page, sub, navigate } = useHashRoute();
  const { dark, toggle: toggleDark } = useTheme();
  const { lang, toggle: toggleLang } = useLang();

  const setPage = (id) => navigate(id);

  const renderPage = () => {
    switch (page) {
      case 'home':  return <Home setPage={setPage} lang={lang} />;
      case 'array': return <ArrayAlgorithms setPage={setPage} lang={lang} selected={sub} onSelect={id => navigate('array', id)} />;
      case 'graph': return <GraphAlgorithms setPage={setPage} lang={lang} selected={sub} onSelect={id => navigate('graph', id)} />;
      case 'tree':  return <TreeAlgorithms setPage={setPage} lang={lang} />;
      case 'game':  return <GameMode lang={lang} />;
      default:      return <Home setPage={setPage} lang={lang} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header dark={dark} toggleDark={toggleDark} lang={lang} toggleLang={toggleLang} page={page} setPage={setPage} />
      <main className="pb-16">{renderPage()}</main>
      <footer className="border-t border-gray-100 dark:border-gray-800 py-6 text-center text-xs text-gray-400">
        {t(lang, 'footer')} ✨
      </footer>
    </div>
  );
}
