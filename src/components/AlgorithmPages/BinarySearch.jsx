import { useState, useMemo } from 'react';
import { generateBinarySearchSteps } from '../../utils/algorithmHelpers';
import { getExplanation } from '../../utils/algorithmExplanations';
import { useAlgorithmState } from '../../hooks/useAlgorithmState';
import { parseArrayInput } from '../../utils/validation';
import ControlPanel from '../Common/ControlPanel';
import InfoPanel from '../Common/InfoPanel';
import { t } from '../../utils/i18n';

const DEFAULT = [11, 12, 22, 25, 34, 64, 90];

export default function BinarySearch({ lang = 'tr' }) {
  const [input, setInput] = useState(DEFAULT.join(', '));
  const [target, setTarget] = useState(25);
  const [arr, setArr] = useState(DEFAULT);
  const [error, setError] = useState('');

  const steps = useMemo(() => generateBinarySearchSteps(arr, target, lang), [arr, target, lang]);
  const state = useAlgorithmState(steps);
  const { step } = state;

  const apply = () => {
    const { values, error: err } = parseArrayInput(input, { min: 2, max: 14, allowNegative: true, lang });
    if (err) { setError(err); return; }
    setError('');
    setArr(values);
  };

  const boxColor = (i) => {
    if (i === step.found) return 'bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/30';
    if (i === step.mid) return 'bg-amber-400 text-white shadow-md';
    if (step.lo !== -1 && i >= step.lo && i <= step.hi) return 'bg-indigo-100 dark:bg-indigo-900 border-indigo-400 dark:border-indigo-600 text-indigo-800 dark:text-indigo-200';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 opacity-40';
  };

  const complexity = {
    [t(lang, 'complexity.best')]: 'O(1)',
    [t(lang, 'complexity.avg')]: 'O(log n)',
    [t(lang, 'complexity.worst')]: 'O(log n)',
    [t(lang, 'complexity.space')]: 'O(1)',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">Binary Search</h2>
        <p className="text-gray-500 dark:text-gray-400">
          {lang === 'tr' ? 'Sıralı dizide arama alanını her adımda yarıya böler' : 'Halves the search space each step on a sorted array'}
        </p>
      </div>

      <div className="card flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t(lang, 'algo.autoSort')}</label>
          <input value={input} onChange={e => setInput(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>
        <div className="w-32">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t(lang, 'algo.target')}</label>
          <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button onClick={apply} className="btn-primary">{t(lang, 'algo.apply')}</button>
      </div>

      <div className="card">
        <div className="flex items-center justify-center gap-2 flex-wrap py-6">
          {step.array.map((val, i) => (
            <div key={i} className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 font-bold text-sm transition-all duration-300 border-transparent ${boxColor(i)}`}>
              {val}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-2 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
          <div className="text-center">
            <span className="block text-gray-500 dark:text-gray-400 mb-1">{t(lang, 'legend.searching')}</span>
            <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{step.target}</span>
          </div>
          {step.lo !== -1 && <div className="text-center"><span className="block text-gray-500 dark:text-gray-400 mb-1">Lo</span><span className="font-bold text-indigo-600 dark:text-indigo-400">{step.lo}</span></div>}
          {step.mid !== -1 && <div className="text-center"><span className="block text-gray-500 dark:text-gray-400 mb-1">Mid</span><span className="font-bold text-amber-600">{step.mid}</span></div>}
          {step.lo !== -1 && <div className="text-center"><span className="block text-gray-500 dark:text-gray-400 mb-1">Hi</span><span className="font-bold text-indigo-600 dark:text-indigo-400">{step.hi}</span></div>}
        </div>
        {step.found !== -1 && <p className="text-center text-emerald-600 font-semibold mt-2 text-sm">{t(lang, 'algo.found')}: {step.found}</p>}
        {step.phase === 'not-found' && <p className="text-center text-rose-500 font-semibold mt-2 text-sm">{t(lang, 'algo.notFound')}</p>}
      </div>

      <ControlPanel state={state} lang={lang} />
      <InfoPanel message={step.message} complexity={complexity}
        pseudocode={`procedure binarySearch(A, target)\n  lo = 0; hi = n-1\n  while lo <= hi\n    mid = (lo+hi)/2\n    if A[mid] == target: return mid\n    else if A[mid] < target: lo = mid+1\n    else: hi = mid-1\n  return -1`}
        description={lang === 'tr' ? 'Binary Search her adımda orta elemanı kontrol eder ve arama alanını yarıya böler. Sadece sıralı dizilerde çalışır.' : 'Binary Search checks the middle element each step and halves the search space. Only works on sorted arrays.'}
        explanation={getExplanation('binarySearch', lang)}
        lang={lang} />
    </div>
  );
}
