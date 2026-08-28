import { useState } from 'react';
import { BookOpen, Clock, Code2 } from 'lucide-react';
import { t } from '../../utils/i18n';

export default function InfoPanel({ message, complexity, pseudocode, description, lang = 'tr' }) {
  const [tab, setTab] = useState('message');

  const tabs = [
    { id: 'message',    label: t(lang, 'info.desc'),       icon: BookOpen },
    { id: 'complexity', label: t(lang, 'info.complexity'), icon: Clock    },
    { id: 'pseudocode', label: t(lang, 'info.pseudo'),     icon: Code2    },
  ];

  return (
    <div className="card space-y-3">
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {tabs.map(tab_item => {
          const Icon = tab_item.icon;
          return (
            <button
              key={tab_item.id}
              onClick={() => setTab(tab_item.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                tab === tab_item.id
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{tab_item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="min-h-[90px] animate-fade-in">
        {tab === 'message' && (
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 shrink-0" />
              <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed">{message}</p>
            </div>
            {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
        )}
        {tab === 'complexity' && (
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(complexity || {}).map(([k, v]) => (
              <div key={k} className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{k}</p>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400 font-mono">{v}</p>
              </div>
            ))}
          </div>
        )}
        {tab === 'pseudocode' && (
          <pre className="text-xs bg-gray-900 dark:bg-gray-950 text-green-400 p-3 rounded-xl overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap">
            {pseudocode}
          </pre>
        )}
      </div>
    </div>
  );
}
