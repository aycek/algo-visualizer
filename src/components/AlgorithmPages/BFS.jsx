import { useState, useMemo } from 'react';
import { Shuffle } from 'lucide-react';
import { generateBFSSteps, generateRandomGraph } from '../../utils/algorithmHelpers';
import { useAlgorithmState } from '../../hooks/useAlgorithmState';
import ControlPanel from '../Common/ControlPanel';
import InfoPanel from '../Common/InfoPanel';
import { t } from '../../utils/i18n';

export default function BFS({ lang = 'tr' }) {
  const [{ graph, positions }, setGraphData] = useState(() => generateRandomGraph());
  const [start, setStart] = useState('A');

  const nodes = useMemo(() => Object.keys(graph), [graph]);
  const edges = useMemo(() => {
    const e = [];
    nodes.forEach(n => graph[n].forEach(m => { if (n < m) e.push([n, m]); }));
    return e;
  }, [graph, nodes]);

  const randomizeGraph = () => {
    const next = generateRandomGraph();
    setGraphData(next);
    setStart(Object.keys(next.graph)[0]);
  };

  const steps = useMemo(() => generateBFSSteps(graph, start, lang), [graph, start, lang]);
  const state = useAlgorithmState(steps);
  const { step } = state;

  const nodeColor = (n) => {
    if (n === step.current) return '#f59e0b';
    if (step.exploring === n) return '#a78bfa';
    if (step.visited.includes(n)) return '#10b981';
    if (step.queue && step.queue.includes(n)) return '#6366f1';
    return '#94a3b8';
  };

  const complexity = {
    [t(lang, 'complexity.time')]: 'O(V+E)',
    [t(lang, 'complexity.space')]: 'O(V)',
    [t(lang, 'complexity.best')]: 'O(1)',
    [t(lang, 'complexity.worst')]: 'O(V+E)',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">BFS</h2>
        <p className="text-gray-500 dark:text-gray-400">
          {lang === 'tr' ? 'Breadth-First Search — Genişlik Öncelikli Arama' : 'Breadth-First Search — Level by level graph traversal'}
        </p>
      </div>

      <div className="card flex flex-wrap items-end justify-between gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{t(lang, 'algo.startNode')}</label>
          <div className="flex gap-2 flex-wrap">
            {nodes.map(n => (
              <button key={n} onClick={() => setStart(n)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${start === n ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{nodes.length} {t(lang, 'algo.nodeCount')}</span>
          <button onClick={randomizeGraph} className="btn-secondary">
            <Shuffle size={16} /> {t(lang, 'algo.newGraph')}
          </button>
        </div>
      </div>

      <div className="card">
        <svg viewBox="0 0 540 360" className="w-full max-h-64">
          {edges.map(([a, b]) => {
            const pa = positions[a], pb = positions[b];
            const isActive = (step.current === a && step.exploring === b) || (step.current === b && step.exploring === a);
            return <line key={`${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={isActive ? '#a78bfa' : '#cbd5e1'} strokeWidth={isActive ? 3 : 1.5} className="transition-all duration-300" />;
          })}
          {nodes.map(n => {
            const p = positions[n];
            return (
              <g key={n}>
                <circle cx={p.x} cy={p.y} r={26} fill={nodeColor(n)} className="transition-all duration-300"
                  stroke={n === step.current ? '#fff' : 'transparent'} strokeWidth={3} />
                <text x={p.x} y={p.y + 5} textAnchor="middle" fill="white" fontSize={16} fontWeight="bold">{n}</text>
              </g>
            );
          })}
        </svg>
        <div className="flex flex-wrap justify-center gap-4 mt-2 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
          {[{color:'bg-gray-400',key:'legend.unvisited'},{color:'bg-indigo-500',key:'legend.inQueue'},{color:'bg-amber-400',key:'legend.current'},{color:'bg-purple-400',key:'legend.exploring'},{color:'bg-emerald-500',key:'legend.visited'}].map(l => (
            <div key={l.key} className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded-full ${l.color}`}/><span className="text-gray-500 dark:text-gray-400">{t(lang, l.key)}</span></div>
          ))}
        </div>
        {step.queue && step.queue.length > 0 && (
          <div className="mt-2 text-center text-xs">
            <span className="text-gray-500 dark:text-gray-400 mr-2">{t(lang, 'algo.queue')}:</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400">[{step.queue.join(', ')}]</span>
          </div>
        )}
        {step.visited.length > 0 && (
          <div className="mt-1 text-center text-xs">
            <span className="text-gray-500 dark:text-gray-400 mr-2">{t(lang, 'algo.visit')}:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">{step.visited.join(' -> ')}</span>
          </div>
        )}
      </div>

      <ControlPanel state={state} lang={lang} />
      <InfoPanel message={step.message} complexity={complexity}
        pseudocode={`procedure BFS(G, start)\n  visited = {start}\n  queue = [start]\n  while queue not empty\n    node = queue.dequeue()\n    process(node)\n    for neighbor in G[node]\n      if not visited: enqueue(neighbor)`}
        description={lang === 'tr' ? 'BFS kuyruğa aldığı düğümleri seviye seviye ziyaret eder. Ağırlıksız grafta en kısa yolu garantiler.' : 'BFS visits nodes level by level using a queue. Guarantees shortest path in unweighted graphs.'}
        lang={lang} />
    </div>
  );
}
