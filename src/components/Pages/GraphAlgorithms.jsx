import { ArrowLeft, Share2 } from 'lucide-react';
import BFS from '../AlgorithmPages/BFS';
import DFS from '../AlgorithmPages/DFS';
import { t } from '../../utils/i18n';

export default function GraphAlgorithms({ setPage, lang = 'tr', selected = null, onSelect }) {
  const algos = [
    {
      id: 'bfs', label: 'BFS',
      subtitle: lang === 'tr' ? 'Genişlik Öncelikli Arama' : 'Breadth-First Search',
      tag: 'O(V+E)',
      desc: lang === 'tr' ? 'Seviye seviye arama. Ağırlıksız grafta en kısa yol garantisi.' : 'Level-by-level search. Guarantees shortest path in unweighted graphs.',
      component: BFS,
    },
    {
      id: 'dfs', label: 'DFS',
      subtitle: lang === 'tr' ? 'Derinlik Öncelikli Arama' : 'Depth-First Search',
      tag: 'O(V+E)',
      desc: lang === 'tr' ? 'Derinlik öncelikli özyinelemeli arama. Topolojik sıralama için ideal.' : 'Deep recursive search. Ideal for topological sorting and cycle detection.',
      component: DFS,
    },
  ];

  const algo = selected ? algos.find(a => a.id === selected) : null;
  if (algo) {
    const Component = algo.component;
    return (
      <div>
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <button onClick={() => onSelect(null)} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-4">
            <ArrowLeft size={16} /> {t(lang, 'home.categories.graph.title')}
          </button>
        </div>
        <Component lang={lang} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => setPage('home')} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <Share2 size={22} className="text-emerald-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t(lang, 'home.categories.graph.title')}</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t(lang, 'home.categories.graph.desc')}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {algos.map((algo, i) => (
          <button key={algo.id} onClick={() => onSelect(algo.id)}
            className="text-left p-6 card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-bold text-lg text-gray-800 dark:text-gray-100">{algo.label}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">{algo.subtitle}</p>
              </div>
              <span className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-mono">{algo.tag}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{algo.desc}</p>
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-60" />
          </button>
        ))}
      </div>
    </div>
  );
}
