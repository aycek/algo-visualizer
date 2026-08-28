import { BarChart2, Share2, GitBranch, Gamepad2, ArrowRight, Zap, BookOpen, Trophy } from 'lucide-react';
import { t } from '../../utils/i18n';

export default function Home({ setPage, lang }) {
  const categories = [
    {
      id: 'array', icon: BarChart2,
      color: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-100 dark:border-indigo-900',
      algorithms: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Binary Search', 'Linear Search'],
    },
    {
      id: 'graph', icon: Share2,
      color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-100 dark:border-emerald-900',
      algorithms: ['BFS', 'DFS'],
    },
    {
      id: 'tree', icon: GitBranch,
      color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-100 dark:border-amber-900',
      algorithms: ['Inorder', 'Preorder', 'Postorder', 'Level-Order'],
    },
    {
      id: 'game', icon: Gamepad2,
      color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50 dark:bg-pink-950/30', border: 'border-pink-100 dark:border-pink-900',
      algorithms: ['Easy', 'Medium', 'Hard'],
    },
  ];

  const totalAlgorithms = categories
    .filter(c => c.id !== 'game')
    .reduce((sum, c) => sum + c.algorithms.length, 0);

  const stats = [
    { icon: Zap,      value: `${totalAlgorithms}`,    key: 'stats.algo'     },
    { icon: BookOpen, value: `${categories.length}`,  key: 'stats.category' },
    { icon: Trophy,   value: '15',                    key: 'stats.quiz'     },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-6 mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-medium">
          <Zap size={14} />
          {t(lang, 'home.badge')}
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          <span className="text-gradient">{t(lang, 'home.title1')}</span>
          <br />
          <span className="text-gray-800 dark:text-gray-100">{t(lang, 'home.title2')}</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t(lang, 'home.desc')}
        </p>

        <div className="flex justify-center gap-8 pt-2">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.key} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Icon size={14} className="text-indigo-500" />
                  <span className="text-2xl font-bold text-gradient">{s.value}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t(lang, `home.${s.key}`)}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          const info = t(lang, `home.categories.${cat.id}`);
          return (
            <button
              key={cat.id}
              onClick={() => setPage(cat.id)}
              className={`group text-left p-6 rounded-2xl border ${cat.bg} ${cat.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{info.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">{info.desc}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {cat.algorithms.slice(0, 3).map(a => (
                  <span key={a} className="text-xs bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700">
                    {a}
                  </span>
                ))}
                {cat.algorithms.length > 3 && (
                  <span className="text-xs text-gray-400">+{cat.algorithms.length - 3}</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                {t(lang, 'home.explore')} <ArrowRight size={14} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
