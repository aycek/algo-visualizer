import { Sun, Moon, Cpu, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { t } from '../../utils/i18n';

export default function Header({ dark, toggleDark, lang, toggleLang, page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'home',  label: t(lang, 'nav.home')  },
    { id: 'array', label: t(lang, 'nav.array') },
    { id: 'graph', label: t(lang, 'nav.graph') },
    { id: 'tree',  label: t(lang, 'nav.tree')  },
    { id: 'game',  label: t(lang, 'nav.game')  },
  ];

  const navigate = (id) => { setPage(id); setMenuOpen(false); };

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate('home')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Cpu size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-gradient">Algo</span>
              <span className="text-gray-700 dark:text-gray-200">Viz</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  page === item.id
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm font-semibold text-gray-700 dark:text-gray-200"
              title={lang === 'tr' ? 'Dili değiştir' : 'Change language'}
            >
              <Globe size={14} />
              {lang === 'tr' ? 'TR' : 'EN'}
            </button>
            <button
              onClick={toggleDark}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              title={dark ? (lang === 'tr' ? 'Aydınlık moda geç' : 'Switch to light mode') : (lang === 'tr' ? 'Karanlık moda geç' : 'Switch to dark mode')}
            >
              {dark ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
            </button>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-fade-in">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  page === item.id
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
