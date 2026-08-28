import { ArrowLeft, BarChart2 } from 'lucide-react';
import BubbleSort from '../AlgorithmPages/BubbleSort';
import SelectionSort from '../AlgorithmPages/SelectionSort';
import InsertionSort from '../AlgorithmPages/InsertionSort';
import MergeSort from '../AlgorithmPages/MergeSort';
import BinarySearch from '../AlgorithmPages/BinarySearch';
import LinearSearch from '../AlgorithmPages/LinearSearch';
import { t } from '../../utils/i18n';

const algos = [
  { id: 'bubble',    label: 'Bubble Sort',    tag: 'O(n²)',      component: BubbleSort    },
  { id: 'selection', label: 'Selection Sort',  tag: 'O(n²)',      component: SelectionSort  },
  { id: 'insertion', label: 'Insertion Sort',  tag: 'O(n²)',      component: InsertionSort  },
  { id: 'merge',     label: 'Merge Sort',      tag: 'O(n log n)', component: MergeSort      },
  { id: 'binary',    label: 'Binary Search',   tag: 'O(log n)',   component: BinarySearch   },
  { id: 'linear',    label: 'Linear Search',   tag: 'O(n)',       component: LinearSearch   },
];

export default function ArrayAlgorithms({ setPage, lang = 'tr', selected = null, onSelect }) {
  const algo = selected ? algos.find(a => a.id === selected) : null;
  if (algo) {
    const Component = algo.component;
    return (
      <div>
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <button onClick={() => onSelect(null)} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-4">
            <ArrowLeft size={16} /> {t(lang, 'home.categories.array.title')}
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
            <BarChart2 size={22} className="text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t(lang, 'home.categories.array.title')}</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t(lang, 'home.categories.array.desc')}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {algos.map((algo, i) => (
          <button
            key={algo.id}
            onClick={() => onSelect(algo.id)}
            className="text-left p-5 card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-gray-800 dark:text-gray-100">{algo.label}</span>
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-mono">{algo.tag}</span>
            </div>
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-60" />
          </button>
        ))}
      </div>
    </div>
  );
}
