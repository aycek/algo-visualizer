import { useState, useMemo } from 'react';
import { generateSelectionSortSteps } from '../../utils/algorithmHelpers';
import { useAlgorithmState } from '../../hooks/useAlgorithmState';
import { parseArrayInput } from '../../utils/validation';
import ControlPanel from '../Common/ControlPanel';
import InfoPanel from '../Common/InfoPanel';
import { t } from '../../utils/i18n';

const DEFAULT = [64, 25, 12, 22, 11];

export default function SelectionSort({ lang = 'tr' }) {
  const [input, setInput] = useState(DEFAULT.join(', '));
  const [arr, setArr] = useState(DEFAULT);
  const [error, setError] = useState('');
  const steps = useMemo(() => generateSelectionSortSteps(arr, lang), [arr, lang]);
  const state = useAlgorithmState(steps);
  const { step } = state;
  const maxVal = Math.max(...step.array);

  const apply = () => {
    const { values, error: err } = parseArrayInput(input, { min: 2, max: 12, allowNegative: false, lang });
    if (err) { setError(err); return; }
    setError('');
    setArr(values);
  };

  const randomize = () => {
    const r = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    setArr(r); setInput(r.join(', ')); setError('');
  };

  const barColor = (i) => {
    if (step.phase === 'done' || step.sorted.includes(i)) return 'from-emerald-400 to-emerald-600';
    if (i === step.minIdx) return 'from-pink-400 to-pink-600';
    if (step.comparing.includes(i)) return 'from-amber-400 to-amber-600';
    return 'from-indigo-400 to-indigo-600';
  };

  const complexity = {
    [t(lang, 'complexity.best')]: 'O(n²)',
    [t(lang, 'complexity.avg')]: 'O(n²)',
    [t(lang, 'complexity.worst')]: 'O(n²)',
    [t(lang, 'complexity.space')]: 'O(1)',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">Selection Sort</h2>
        <p className="text-gray-500 dark:text-gray-400">
          {lang === 'tr' ? 'Her geciste minimum elemani bulup dogru pozisyona koyar' : 'Finds the minimum element each pass and places it in position'}
        </p>
      </div>

      <div className="card flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t(lang, 'algo.array')}</label>
          <input value={input} onChange={e => setInput(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>
        <button onClick={apply} className="btn-primary">{t(lang, 'algo.apply')}</button>
        <button onClick={randomize} className="btn-secondary">{t(lang, 'algo.random')}</button>
      </div>

      <div className="card">
        <div className="flex items-end justify-center gap-2 h-48 px-4">
          {step.array.map((val, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{val}</span>
              <div className={`w-full rounded-t-lg bg-gradient-to-t ${barColor(i)} transition-all duration-300`}
                style={{ height: `${(val / maxVal) * 140}px` }} />
              <span className="text-xs text-gray-400">{i}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
          {[{color:'bg-indigo-500',key:'legend.normal'},{color:'bg-amber-500',key:'legend.scanned'},{color:'bg-pink-500',key:'legend.min'},{color:'bg-emerald-500',key:'legend.sorted'}].map(l => (
            <div key={l.key} className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded ${l.color}`}/><span className="text-gray-500 dark:text-gray-400">{t(lang, l.key)}</span></div>
          ))}
        </div>
      </div>

      <ControlPanel state={state} lang={lang} />
      <InfoPanel message={step.message} complexity={complexity}
        pseudocode={`procedure selectionSort(A)\n  for i = 0 to n-2\n    minIdx = i\n    for j = i+1 to n-1\n      if A[j] < A[minIdx]: minIdx = j\n    swap(A[i], A[minIdx])`}
        description={lang === 'tr' ? 'Selection Sort her geciste siralanmamis kisimdan en kucuk elemani secip sirali kismin sonuna ekler.' : 'Selection Sort finds the minimum element from unsorted part and places it at the beginning.'}
        lang={lang} />
    </div>
  );
}
