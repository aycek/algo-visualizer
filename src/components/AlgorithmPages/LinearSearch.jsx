import { useState, useMemo } from 'react';
import { generateLinearSearchSteps } from '../../utils/algorithmHelpers';
import { useAlgorithmState } from '../../hooks/useAlgorithmState';
import { parseArrayInput } from '../../utils/validation';
import ControlPanel from '../Common/ControlPanel';
import InfoPanel from '../Common/InfoPanel';
import { t } from '../../utils/i18n';

const DEFAULT = [4, 2, 7, 1, 9, 3, 8, 5];

export default function LinearSearch({ lang = 'tr' }) {
  const [input, setInput] = useState(DEFAULT.join(', '));
  const [target, setTarget] = useState(9);
  const [arr, setArr] = useState(DEFAULT);
  const [error, setError] = useState('');

  const steps = useMemo(() => generateLinearSearchSteps(arr, target, lang), [arr, target, lang]);
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
    if (i === step.current) return 'bg-amber-400 text-white shadow-md scale-105';
    if (step.current !== -1 && i < step.current) return 'bg-rose-100 dark:bg-rose-950 text-rose-400 border-rose-200 dark:border-rose-900 opacity-60';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700';
  };

  const complexity = {
    [t(lang, 'complexity.best')]: 'O(1)',
    [t(lang, 'complexity.avg')]: 'O(n)',
    [t(lang, 'complexity.worst')]: 'O(n)',
    [t(lang, 'complexity.space')]: 'O(1)',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">Linear Search</h2>
        <p className="text-gray-500 dark:text-gray-400">
          {lang === 'tr' ? 'Dizide baştan sona tek tek kontrol eder' : 'Checks each element one by one from start to end'}
        </p>
      </div>

      <div className="card flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t(lang, 'algo.array')}</label>
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
        <div className="flex items-center justify-center gap-2 flex-wrap py-8">
          {step.array.map((val, i) => (
            <div key={i} className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 font-bold text-sm transition-all duration-200 ${boxColor(i)}`}>
              {val}
            </div>
          ))}
        </div>
        <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">{t(lang, 'legend.searching')}: </span>
          <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{step.target}</span>
          {step.found !== -1 && <span className="ml-3 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">✓ {t(lang, 'algo.found')}: {step.found}</span>}
          {step.phase === 'not-found' && <span className="ml-3 text-rose-500 font-semibold text-sm">✗ {t(lang, 'algo.notFound')}</span>}
        </div>
      </div>

      <ControlPanel state={state} lang={lang} />
      <InfoPanel message={step.message} complexity={complexity}
        pseudocode={`procedure linearSearch(A, target)\n  for i = 0 to n-1\n    if A[i] == target\n      return i\n  return -1`}
        description={lang === 'tr' ? 'Linear Search en basit arama algoritmasıdır. Sıralanmamış dizilerde kullanılabilir.' : 'Linear Search is the simplest search algorithm. Works on unsorted arrays.'}
        lang={lang} />
    </div>
  );
}
