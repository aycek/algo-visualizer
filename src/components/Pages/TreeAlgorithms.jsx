import { ArrowLeft, GitBranch } from 'lucide-react';
import { useState } from 'react';
import { useAlgorithmState } from '../../hooks/useAlgorithmState';
import ControlPanel from '../Common/ControlPanel';
import InfoPanel from '../Common/InfoPanel';
import { t } from '../../utils/i18n';

const tree = {
  value: 1,
  left:  { value: 2, left: { value: 4, left: null, right: null }, right: { value: 5, left: null, right: null } },
  right: { value: 3, left: { value: 6, left: null, right: null }, right: { value: 7, left: null, right: null } },
};

const positions = {
  1: { x: 280, y: 50 }, 2: { x: 150, y: 140 }, 3: { x: 410, y: 140 },
  4: { x: 80, y: 230 }, 5: { x: 220, y: 230 }, 6: { x: 340, y: 230 }, 7: { x: 480, y: 230 },
};
const treeEdges = [[1,2],[1,3],[2,4],[2,5],[3,6],[3,7]];

function inorder(node, steps, visited, lang) {
  if (!node) return;
  const m = lang === 'tr' ? `Sol alt ağaç: ${node.value}` : `Left subtree: ${node.value}`;
  steps.push({ visited: [...visited], current: null, message: m, phase: 'go-left' });
  inorder(node.left, steps, visited, lang);
  visited.push(node.value);
  steps.push({ visited: [...visited], current: node.value, message: `${node.value} ${lang === 'tr' ? 'ziyaret edildi' : 'visited'}`, phase: 'visit' });
  inorder(node.right, steps, visited, lang);
}

function preorder(node, steps, visited, lang) {
  if (!node) return;
  visited.push(node.value);
  steps.push({ visited: [...visited], current: node.value, message: `${node.value} ${lang === 'tr' ? 'ziyaret edildi' : 'visited'}`, phase: 'visit' });
  preorder(node.left, steps, visited, lang);
  preorder(node.right, steps, visited, lang);
}

function postorder(node, steps, visited, lang) {
  if (!node) return;
  postorder(node.left, steps, visited, lang);
  postorder(node.right, steps, visited, lang);
  visited.push(node.value);
  steps.push({ visited: [...visited], current: node.value, message: `${node.value} ${lang === 'tr' ? 'ziyaret edildi' : 'visited'}`, phase: 'visit' });
}

function levelorder(node, steps, lang) {
  const queue = [node];
  const visited = [];
  while (queue.length) {
    const n = queue.shift();
    visited.push(n.value);
    steps.push({ visited: [...visited], current: n.value, message: `${n.value} ${lang === 'tr' ? 'ziyaret edildi (seviye-sıra)' : 'visited (level order)'}`, phase: 'visit' });
    if (n.left) queue.push(n.left);
    if (n.right) queue.push(n.right);
  }
}

function buildSteps(type, lang) {
  const labels = {
    inorder:    lang === 'tr' ? 'Inorder başlıyor'    : 'Inorder starting',
    preorder:   lang === 'tr' ? 'Preorder başlıyor'   : 'Preorder starting',
    postorder:  lang === 'tr' ? 'Postorder başlıyor'  : 'Postorder starting',
    levelorder: lang === 'tr' ? 'Level-Order başlıyor': 'Level-Order starting',
  };
  const done = lang === 'tr' ? 'Tamamlandı' : 'Completed';
  const steps = [{ visited: [], current: null, message: labels[type], phase: 'start' }];
  const v = [];
  if (type === 'inorder')    inorder(tree, steps, v, lang);
  if (type === 'preorder')   preorder(tree, steps, v, lang);
  if (type === 'postorder')  postorder(tree, steps, v, lang);
  if (type === 'levelorder') levelorder(tree, steps, lang);
  const last = steps[steps.length - 1].visited;
  steps.push({ visited: last, current: null, message: `${done}: ${last.join(' -> ')}`, phase: 'done' });
  return steps;
}

function TreeViz({ step }) {
  const nodeColor = (n) => {
    if (n === step.current) return '#f59e0b';
    if (step.visited.includes(n)) return '#10b981';
    return '#94a3b8';
  };
  return (
    <svg viewBox="0 0 560 300" className="w-full max-h-64">
      {treeEdges.map(([a, b]) => {
        const pa = positions[a], pb = positions[b];
        return <line key={`${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="#cbd5e1" strokeWidth={2} />;
      })}
      {Object.entries(positions).map(([n, p]) => (
        <g key={n}>
          <circle cx={p.x} cy={p.y} r={24} fill={nodeColor(Number(n))} className="transition-all duration-300"
            stroke={Number(n) === step.current ? '#fff' : 'transparent'} strokeWidth={3} />
          <text x={p.x} y={p.y + 5} textAnchor="middle" fill="white" fontSize={15} fontWeight="bold">{n}</text>
        </g>
      ))}
    </svg>
  );
}

function TraversalView({ type, setType, lang }) {
  const traversals = [
    { id: 'inorder',    label: 'Inorder',     desc: lang === 'tr' ? 'Sol -> Kök -> Sağ' : 'Left -> Root -> Right' },
    { id: 'preorder',   label: 'Preorder',    desc: lang === 'tr' ? 'Kök -> Sol -> Sağ' : 'Root -> Left -> Right' },
    { id: 'postorder',  label: 'Postorder',   desc: lang === 'tr' ? 'Sol -> Sağ -> Kök' : 'Left -> Right -> Root' },
    { id: 'levelorder', label: 'Level-Order', desc: lang === 'tr' ? 'Seviye Seviye'     : 'Level by Level'        },
  ];

  const steps = buildSteps(type, lang);
  const state = useAlgorithmState(steps);
  const { step } = state;
  const currentT = traversals.find(tr => tr.id === type);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 justify-center">
        {traversals.map(tr => (
          <button key={tr.id} onClick={() => setType(tr.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${type === tr.id ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {tr.label} <span className="text-xs opacity-70 ml-1">({tr.desc})</span>
          </button>
        ))}
      </div>

      <div className="card">
        <TreeViz step={step} />
        <div className="flex flex-wrap justify-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
          {[{color:'bg-gray-400',key:'legend.unvisited'},{color:'bg-amber-400',key:'legend.current'},{color:'bg-emerald-500',key:'legend.visited'}].map(l => (
            <div key={l.key} className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded-full ${l.color}`}/><span className="text-gray-500 dark:text-gray-400">{t(lang, l.key)}</span></div>
          ))}
        </div>
        {step.visited.length > 0 && (
          <div className="mt-2 text-center text-xs">
            <span className="text-gray-500 dark:text-gray-400 mr-2">{t(lang, 'algo.order')}:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">{step.visited.join(' -> ')}</span>
          </div>
        )}
      </div>

      <ControlPanel state={state} lang={lang} />
      <InfoPanel message={step.message}
        complexity={{ [t(lang, 'complexity.time')]: 'O(n)', [t(lang, 'complexity.space')]: 'O(h)', 'Method': currentT?.desc }}
        pseudocode={`procedure ${type}(node)\n  if node is null: return\n  // ${currentT?.desc}\n  process(node)`}
        description={lang === 'tr' ? `${currentT?.label} gezintisi: ${currentT?.desc} sırasını takip eder.` : `${currentT?.label} traversal follows ${currentT?.desc} order.`}
        lang={lang} />
    </div>
  );
}

export default function TreeAlgorithms({ setPage, lang = 'tr' }) {
  const [type, setType] = useState('inorder');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => setPage('home')} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <GitBranch size={22} className="text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t(lang, 'home.categories.tree.title')}</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t(lang, 'home.categories.tree.desc')}</p>
        </div>
      </div>
      <TraversalView type={type} setType={setType} lang={lang} />
    </div>
  );
}
