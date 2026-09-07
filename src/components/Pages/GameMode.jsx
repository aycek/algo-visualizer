import { useReducer } from 'react';
import {
  BarChart2, Network, Route, GitBranch, Search,
  Trophy, RotateCcw, CheckCircle, XCircle, ArrowLeft, Zap, Clock,
} from 'lucide-react';
import {
  generateBubbleSortSteps, generateSelectionSortSteps, generateInsertionSortSteps,
  generateBFSSteps, generateDFSSteps, generateRandomGraph,
  generateBinarySearchSteps, generateLinearSearchSteps,
} from '../../utils/algorithmHelpers';
import {
  generateRandomArray, generateRandomTree, computeTreeLayout,
  preorderSequence, inorderSequence, postorderSequence, levelorderSequence,
  extractBubbleDecisions, extractSelectionDecisions, extractInsertionDecisions,
  extractBinarySearchRounds, extractLinearSearchOrder,
} from '../../utils/quizHelpers';
import { t } from '../../utils/i18n';

const BEST_KEY = 'algoviz_quiz_best_v2';
function loadBest() {
  try { return JSON.parse(localStorage.getItem(BEST_KEY)) || {}; } catch { return {}; }
}
function saveBest(map) {
  try { localStorage.setItem(BEST_KEY, JSON.stringify(map)); } catch { /* ignore */ }
}

// ─── CATEGORY / VARIANT METADATA ───────────────────────────────────────────
const CATEGORIES = [
  { id: 'sorting',   icon: BarChart2, color: 'from-indigo-500 to-blue-600',  bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
  { id: 'bfs',       icon: Network,   color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  { id: 'dfs',       icon: Route,     color: 'from-violet-500 to-purple-600',bg: 'bg-violet-50 dark:bg-violet-950/40' },
  { id: 'tree',      icon: GitBranch, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  { id: 'searching', icon: Search,    color: 'from-rose-500 to-pink-600',    bg: 'bg-rose-50 dark:bg-rose-950/40' },
];

const CATEGORY_LABEL = {
  tr: { sorting: 'Sıralama', bfs: 'BFS', dfs: 'DFS', tree: 'Ağaç Gezintisi', searching: 'Arama' },
  en: { sorting: 'Sorting', bfs: 'BFS', dfs: 'DFS', tree: 'Tree Traversal', searching: 'Searching' },
};
const CATEGORY_DESC = {
  tr: {
    sorting: 'Hangi elemanların yer değiştireceğini sen belirle',
    bfs: 'Ziyaret sırasını sen belirle',
    dfs: 'Ziyaret sırasını sen belirle',
    tree: 'Gezinti sırasını sen belirle',
    searching: 'Arama adımlarını sen belirle',
  },
  en: {
    sorting: 'You decide which elements swap',
    bfs: 'You decide the visit order',
    dfs: 'You decide the visit order',
    tree: 'You decide the traversal order',
    searching: 'You decide the search steps',
  },
};

const SORT_VARIANTS = [
  { id: 'bubble',    label: 'Bubble Sort',    generate: generateBubbleSortSteps,    extract: extractBubbleDecisions,
    actions: [{ key: 'swap', tr: 'Yer Değiştir', en: 'Swap' }, { key: 'keep', tr: 'Sırayı Koru', en: 'Keep Order' }] },
  { id: 'selection', label: 'Selection Sort', generate: generateSelectionSortSteps, extract: extractSelectionDecisions,
    actions: [{ key: 'newMin', tr: 'Yeni Minimum', en: 'New Minimum' }, { key: 'keep', tr: 'Minimum Değil', en: 'Not Minimum' }] },
  { id: 'insertion', label: 'Insertion Sort', generate: generateInsertionSortSteps,  extract: extractInsertionDecisions,
    actions: [{ key: 'shift', tr: 'Kaydır', en: 'Shift' }, { key: 'insert', tr: 'Buraya Yerleştir', en: 'Insert Here' }] },
];

const TREE_VARIANTS = [
  { id: 'preorder',   label: 'Preorder',    sequence: preorderSequence },
  { id: 'inorder',    label: 'Inorder',     sequence: inorderSequence },
  { id: 'postorder',  label: 'Postorder',   sequence: postorderSequence },
  { id: 'levelorder', label: 'Level-Order', sequence: levelorderSequence },
];

const SEARCH_VARIANTS = [
  { id: 'linear', label: 'Linear Search' },
  { id: 'binary', label: 'Binary Search' },
];

// ─── QUIZ INITIALIZERS (build random data + ground truth) ────────────────
function initSortingQuiz(variantId, lang) {
  const variant = SORT_VARIANTS.find(v => v.id === variantId);
  const array = generateRandomArray();
  const steps = variant.generate(array, lang);
  const decisions = variant.extract(steps);
  return {
    category: 'sorting', variantId, actions: variant.actions,
    array, decisions, finalArray: steps[steps.length - 1].array,
    cursor: 0, total: decisions.length,
    correctFirstTry: 0, mistakes: 0, mistakesThisStep: 0,
    startedAt: Date.now(), finishedAt: null,
  };
}

function initGraphQuiz(category, lang) {
  const { graph, positions } = generateRandomGraph();
  const nodes = Object.keys(graph);
  const edges = [];
  nodes.forEach(n => graph[n].forEach(m => { if (n < m) edges.push([n, m]); }));
  const startNode = nodes[0];
  const steps = category === 'bfs' ? generateBFSSteps(graph, startNode, lang) : generateDFSSteps(graph, startNode, lang);
  const order = steps[steps.length - 1].visited;
  return {
    category, variantId: null,
    graph, positions, nodes, edges, startNode, order,
    visited: [startNode],
    cursor: 1, total: order.length - 1,
    correctFirstTry: 0, mistakes: 0, mistakesThisStep: 0,
    startedAt: Date.now(), finishedAt: null,
  };
}

function initTreeQuiz(variantId) {
  const variant = TREE_VARIANTS.find(v => v.id === variantId);
  const tree = generateRandomTree();
  const { positions, edges } = computeTreeLayout(tree);
  const order = variant.sequence(tree);
  return {
    category: 'tree', variantId,
    tree, positions, edges, order,
    visited: [],
    cursor: 0, total: order.length,
    correctFirstTry: 0, mistakes: 0, mistakesThisStep: 0,
    startedAt: Date.now(), finishedAt: null,
  };
}

function initSearchingQuiz(variantId, lang) {
  const raw = generateRandomArray();
  if (variantId === 'linear') {
    const target = Math.random() < 0.8 ? raw[Math.floor(Math.random() * raw.length)] : 9999;
    const steps = generateLinearSearchSteps(raw, target, lang);
    const order = extractLinearSearchOrder(steps);
    return {
      category: 'searching', variantId, array: raw, target, order,
      visited: [],
      cursor: 0, total: order.length,
      correctFirstTry: 0, mistakes: 0, mistakesThisStep: 0,
      startedAt: Date.now(), finishedAt: null,
    };
  }
  const sorted = [...raw].sort((a, b) => a - b);
  const target = Math.random() < 0.8 ? sorted[Math.floor(Math.random() * sorted.length)] : 9999;
  const steps = generateBinarySearchSteps(raw, target, lang);
  const rounds = extractBinarySearchRounds(steps);
  return {
    category: 'searching', variantId, array: sorted, target, rounds,
    roundIdx: 0, phase: 'guessMid', lo: rounds[0].lo, hi: rounds[0].hi, foundIndex: -1,
    cursor: 0, total: rounds.length,
    correctFirstTry: 0, mistakes: 0, mistakesThisStep: 0,
    startedAt: Date.now(), finishedAt: null,
  };
}

// ─── PURE STEP FUNCTIONS (validate a user action against ground truth) ────
function stepSorting(quiz, actionKey) {
  const decision = quiz.decisions[quiz.cursor];
  const isCorrect = decision.action === actionKey;
  if (!isCorrect) {
    return { quiz: { ...quiz, mistakes: quiz.mistakes + 1, mistakesThisStep: quiz.mistakesThisStep + 1 }, isCorrect, decision };
  }
  const firstTry = quiz.mistakesThisStep === 0;
  const nextCursor = quiz.cursor + 1;
  const done = nextCursor >= quiz.total;
  return {
    quiz: {
      ...quiz, cursor: nextCursor, mistakesThisStep: 0,
      correctFirstTry: quiz.correctFirstTry + (firstTry ? 1 : 0),
      finishedAt: done ? Date.now() : null,
    },
    isCorrect, decision, done,
  };
}

function stepVisitOrder(quiz, clickedNode) {
  const expected = quiz.order[quiz.cursor];
  const isCorrect = clickedNode === expected;
  if (!isCorrect) {
    return { quiz: { ...quiz, mistakes: quiz.mistakes + 1, mistakesThisStep: quiz.mistakesThisStep + 1 }, isCorrect, expected };
  }
  const firstTry = quiz.mistakesThisStep === 0;
  const nextCursor = quiz.cursor + 1;
  const done = nextCursor >= quiz.order.length;
  return {
    quiz: {
      ...quiz, visited: [...quiz.visited, clickedNode], cursor: nextCursor, mistakesThisStep: 0,
      correctFirstTry: quiz.correctFirstTry + (firstTry ? 1 : 0),
      finishedAt: done ? Date.now() : null,
    },
    isCorrect, expected, done,
  };
}

function stepLinearSearch(quiz, clickedIndex) {
  const expected = quiz.order[quiz.cursor];
  const isCorrect = clickedIndex === expected;
  if (!isCorrect) {
    return { quiz: { ...quiz, mistakes: quiz.mistakes + 1, mistakesThisStep: quiz.mistakesThisStep + 1 }, isCorrect, expected };
  }
  const firstTry = quiz.mistakesThisStep === 0;
  const nextCursor = quiz.cursor + 1;
  const done = nextCursor >= quiz.order.length;
  return {
    quiz: {
      ...quiz, visited: [...quiz.visited, clickedIndex], cursor: nextCursor, mistakesThisStep: 0,
      correctFirstTry: quiz.correctFirstTry + (firstTry ? 1 : 0),
      finishedAt: done ? Date.now() : null,
    },
    isCorrect, expected, done,
  };
}

function stepBinaryMid(quiz, clickedIndex) {
  const round = quiz.rounds[quiz.roundIdx];
  const isCorrect = clickedIndex === round.mid;
  if (!isCorrect) {
    return { quiz: { ...quiz, mistakes: quiz.mistakes + 1, mistakesThisStep: quiz.mistakesThisStep + 1 }, isCorrect, round };
  }
  const firstTry = quiz.mistakesThisStep === 0;
  if (round.outcome === 'found') {
    return {
      quiz: { ...quiz, foundIndex: round.mid, mistakesThisStep: 0, correctFirstTry: quiz.correctFirstTry + (firstTry ? 1 : 0), finishedAt: Date.now() },
      isCorrect, round, done: true,
    };
  }
  return { quiz: { ...quiz, phase: 'chooseDirection' }, isCorrect, round, done: false };
}

function stepBinaryDirection(quiz, dir) {
  const round = quiz.rounds[quiz.roundIdx];
  const isCorrect = dir === round.outcome;
  if (!isCorrect) {
    return { quiz: { ...quiz, mistakes: quiz.mistakes + 1, mistakesThisStep: quiz.mistakesThisStep + 1 }, isCorrect, round };
  }
  const firstTry = quiz.mistakesThisStep === 0;
  const nextRoundIdx = quiz.roundIdx + 1;
  const baseUpdate = { mistakesThisStep: 0, correctFirstTry: quiz.correctFirstTry + (firstTry ? 1 : 0) };
  if (nextRoundIdx >= quiz.rounds.length) {
    return { quiz: { ...quiz, ...baseUpdate, finishedAt: Date.now(), notFound: true }, isCorrect, round, done: true };
  }
  const next = quiz.rounds[nextRoundIdx];
  return {
    quiz: { ...quiz, ...baseUpdate, roundIdx: nextRoundIdx, lo: next.lo, hi: next.hi, phase: 'guessMid' },
    isCorrect, round, done: false,
  };
}

// ─── REDUCER ────────────────────────────────────────────────────────────────
const initialState = { screen: 'category', category: null, quiz: null, feedback: null, bestScores: loadBest() };

function reducer(state, action) {
  switch (action.type) {
    case 'PICK_CATEGORY': {
      if (action.category === 'bfs' || action.category === 'dfs') {
        return { ...state, screen: 'playing', category: action.category, quiz: initGraphQuiz(action.category, action.lang), feedback: null };
      }
      return { ...state, screen: 'variant', category: action.category, feedback: null };
    }
    case 'PICK_VARIANT': {
      const { category, variantId, lang } = action;
      const quiz = category === 'sorting' ? initSortingQuiz(variantId, lang)
        : category === 'tree' ? initTreeQuiz(variantId)
        : initSearchingQuiz(variantId, lang);
      return { ...state, screen: 'playing', quiz, feedback: null };
    }
    case 'APPLY_STEP':
      return { ...state, quiz: action.quiz, feedback: action.feedback };
    case 'CLEAR_FEEDBACK':
      return state.feedback ? { ...state, feedback: null } : state;
    case 'FINISH': {
      const bestScores = { ...state.bestScores };
      const { key, pct } = action;
      const isNewRecord = !bestScores[key] || bestScores[key].pct < pct;
      if (isNewRecord) {
        bestScores[key] = { pct, date: new Date().toISOString() };
        saveBest(bestScores);
      }
      return { ...state, screen: 'result', bestScores, isNewRecord };
    }
    case 'RETRY_SAME': {
      if (state.category === 'bfs' || state.category === 'dfs') {
        return { ...state, screen: 'playing', quiz: initGraphQuiz(state.category, action.lang), feedback: null };
      }
      return { ...state, screen: 'variant', quiz: null, feedback: null };
    }
    case 'BACK_TO_CATEGORIES':
      return { ...initialState, bestScores: state.bestScores };
    default:
      return state;
  }
}

// ─── SHARED UI PIECES ───────────────────────────────────────────────────────
function ProgressBar({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

function FeedbackBanner({ feedback }) {
  if (!feedback) return null;
  return (
    <div className={`p-4 rounded-xl mb-5 animate-fade-in border flex items-start gap-2 ${
      feedback.ok
        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
    }`}>
      {feedback.ok ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <XCircle size={18} className="shrink-0 mt-0.5" />}
      <p className="text-sm font-medium">{feedback.message}</p>
    </div>
  );
}

function QuizHeader({ lang, category, variantLabel, cursor, total, onQuit }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button onClick={onQuit} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        <ArrowLeft size={16} /> {CATEGORY_LABEL[lang][category]}{variantLabel ? ` · ${variantLabel}` : ''}
      </button>
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{Math.min(cursor, total)} / {total}</span>
    </div>
  );
}

// ─── SORTING QUIZ VIEW ──────────────────────────────────────────────────────
function SortingQuizView({ lang, quiz, dispatch }) {
  const decision = quiz.decisions[quiz.cursor];
  const array = decision ? decision.arrayBefore : quiz.finalArray;
  const maxVal = Math.max(...array);
  const done = quiz.finishedAt !== null;
  const variant = SORT_VARIANTS.find(v => v.id === quiz.variantId);

  const barColor = (i) => {
    if (done) return 'from-emerald-400 to-emerald-600';
    if (decision && decision.pair.includes(i)) return 'from-amber-400 to-amber-600';
    return 'from-indigo-400 to-indigo-600';
  };

  const answer = (actionKey) => {
    const result = stepSorting(quiz, actionKey);
    const desc = variant.actions.find(a => a.key === result.decision.action);
    const message = result.isCorrect
      ? (lang === 'tr' ? 'Doğru!' : 'Correct!')
      : (lang === 'tr' ? `Yanlış. Doğru cevap: "${desc[lang]}" olmalıydı.` : `Wrong. The correct answer was "${desc[lang]}".`);
    dispatch({ type: 'APPLY_STEP', quiz: result.quiz, feedback: { ok: result.isCorrect, message } });
    if (result.isCorrect && result.done) {
      finishQuiz(dispatch, result.quiz);
    }
  };

  return (
    <div>
      <QuizHeader lang={lang} category="sorting" variantLabel={variant.label} cursor={quiz.cursor} total={quiz.total} onQuit={() => dispatch({ type: 'BACK_TO_CATEGORIES' })} />
      <ProgressBar current={quiz.cursor} total={quiz.total} />
      <div className="card mb-4">
        <div className="flex items-end justify-center gap-2 h-40 px-2">
          {array.map((val, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{val}</span>
              <div className={`w-full rounded-t-lg bg-gradient-to-t ${barColor(i)} transition-all duration-300`} style={{ height: `${(val / maxVal) * 120}px` }} />
              <span className="text-xs text-gray-400">{i}</span>
            </div>
          ))}
        </div>
      </div>
      {!done && decision && (
        <div className="grid grid-cols-2 gap-3">
          {variant.actions.map(a => (
            <button key={a.key} onClick={() => answer(a.key)} className="btn-primary justify-center py-3">{a[lang]}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── GRAPH / TREE VISIT-ORDER QUIZ (BFS, DFS, Tree traversal) ──────────────
function VisitOrderGraph({ nodes, edges, positions, visited, onPick }) {
  const nodeColor = (n) => {
    if (visited.includes(n)) return '#10b981';
    return '#94a3b8';
  };
  return (
    <svg viewBox="0 0 540 360" className="w-full max-h-72">
      {edges.map(([a, b]) => {
        const pa = positions[a], pb = positions[b];
        return <line key={`${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="#cbd5e1" strokeWidth={1.5} />;
      })}
      {nodes.map(n => {
        const p = positions[n];
        return (
          <g key={n} onClick={() => onPick(n)} className="cursor-pointer">
            <circle cx={p.x} cy={p.y} r={26} fill={nodeColor(n)} className="transition-all duration-300 hover:opacity-80"
              stroke={visited[visited.length - 1] === n ? '#fff' : 'transparent'} strokeWidth={3} />
            <text x={p.x} y={p.y + 5} textAnchor="middle" fill="white" fontSize={16} fontWeight="bold" className="pointer-events-none">{n}</text>
          </g>
        );
      })}
    </svg>
  );
}

function GraphQuizView({ lang, quiz, dispatch }) {
  const done = quiz.finishedAt !== null;
  const label = quiz.category === 'bfs' ? 'BFS' : 'DFS';

  const pick = (node) => {
    const result = stepVisitOrder(quiz, node);
    const message = result.isCorrect
      ? (lang === 'tr' ? `Doğru! ${node} sıradaki düğümdü.` : `Correct! ${node} was next.`)
      : (lang === 'tr'
        ? `Yanlış. Sıradaki düğüm ${result.expected} olmalıydı, ${node} değil.`
        : `Wrong. The next node should have been ${result.expected}, not ${node}.`);
    dispatch({ type: 'APPLY_STEP', quiz: result.quiz, feedback: { ok: result.isCorrect, message } });
    if (result.isCorrect && result.done) finishQuiz(dispatch, result.quiz);
  };

  return (
    <div>
      <QuizHeader lang={lang} category={quiz.category} variantLabel={null} cursor={quiz.cursor - 1} total={quiz.total} onQuit={() => dispatch({ type: 'BACK_TO_CATEGORIES' })} />
      <ProgressBar current={quiz.cursor - 1} total={quiz.total} />
      <div className="card mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
          {lang === 'tr' ? `Başlangıç düğümü: ${quiz.startNode} — ${label} sırasına göre sıradaki düğüme tıkla.` : `Start node: ${quiz.startNode} — click the next node in ${label} order.`}
        </p>
        <VisitOrderGraph nodes={quiz.nodes} edges={quiz.edges} positions={quiz.positions} visited={quiz.visited} onPick={done ? () => {} : pick} />
        <div className="mt-2 text-center text-xs">
          <span className="text-gray-500 dark:text-gray-400 mr-2">{t(lang, 'algo.order')}:</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400">{quiz.visited.join(' -> ')}</span>
        </div>
      </div>
    </div>
  );
}

function TreeQuizView({ lang, quiz, dispatch }) {
  const done = quiz.finishedAt !== null;
  const variant = TREE_VARIANTS.find(v => v.id === quiz.variantId);
  const nodeColor = (v) => (quiz.visited.includes(v) ? '#10b981' : '#94a3b8');

  const pick = (value) => {
    const result = stepVisitOrder(quiz, value);
    const message = result.isCorrect
      ? (lang === 'tr' ? `Doğru! ${value} sıradaki düğümdü.` : `Correct! ${value} was next.`)
      : (lang === 'tr'
        ? `Yanlış. ${variant.label} sırasında bir sonraki düğüm ${result.expected} olmalıydı, ${value} değil.`
        : `Wrong. In ${variant.label} order the next node should have been ${result.expected}, not ${value}.`);
    dispatch({ type: 'APPLY_STEP', quiz: result.quiz, feedback: { ok: result.isCorrect, message } });
    if (result.isCorrect && result.done) finishQuiz(dispatch, result.quiz);
  };

  return (
    <div>
      <QuizHeader lang={lang} category="tree" variantLabel={variant.label} cursor={quiz.cursor} total={quiz.total} onQuit={() => dispatch({ type: 'BACK_TO_CATEGORIES' })} />
      <ProgressBar current={quiz.cursor} total={quiz.total} />
      <div className="card mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
          {lang === 'tr' ? `${variant.label} sırasına göre sıradaki düğüme tıkla.` : `Click the next node in ${variant.label} order.`}
        </p>
        <svg viewBox="0 0 560 300" className="w-full max-h-64">
          {quiz.edges.map(([a, b]) => {
            const pa = quiz.positions[a], pb = quiz.positions[b];
            return <line key={`${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="#cbd5e1" strokeWidth={2} />;
          })}
          {Object.entries(quiz.positions).map(([v, p]) => (
            <g key={v} onClick={() => !done && pick(Number(v))} className="cursor-pointer">
              <circle cx={p.x} cy={p.y} r={24} fill={nodeColor(Number(v))} className="transition-all duration-300 hover:opacity-80" />
              <text x={p.x} y={p.y + 5} textAnchor="middle" fill="white" fontSize={15} fontWeight="bold" className="pointer-events-none">{v}</text>
            </g>
          ))}
        </svg>
        <div className="mt-2 text-center text-xs">
          <span className="text-gray-500 dark:text-gray-400 mr-2">{t(lang, 'algo.order')}:</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400">{quiz.visited.join(' -> ')}</span>
        </div>
      </div>
    </div>
  );
}

// ─── SEARCHING QUIZ VIEW ────────────────────────────────────────────────────
function LinearSearchQuizView({ lang, quiz, dispatch }) {
  const done = quiz.finishedAt !== null;

  const boxColor = (i) => {
    if (quiz.visited.includes(i)) {
      return quiz.array[i] === quiz.target ? 'bg-emerald-500 text-white' : 'bg-rose-100 dark:bg-rose-950 text-rose-500';
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200';
  };

  const pick = (i) => {
    const result = stepLinearSearch(quiz, i);
    const message = result.isCorrect
      ? (lang === 'tr' ? `Doğru! a[${i}] sırada kontrol edilecekti.` : `Correct! a[${i}] was next to check.`)
      : (lang === 'tr' ? `Yanlış. Linear Search baştan sona ilerler, sıradaki indeks ${result.expected} olmalıydı.` : `Wrong. Linear Search moves left to right, index ${result.expected} was next.`);
    dispatch({ type: 'APPLY_STEP', quiz: result.quiz, feedback: { ok: result.isCorrect, message } });
    if (result.isCorrect && result.done) finishQuiz(dispatch, result.quiz);
  };

  return (
    <div>
      <QuizHeader lang={lang} category="searching" variantLabel="Linear Search" cursor={quiz.cursor} total={quiz.total} onQuit={() => dispatch({ type: 'BACK_TO_CATEGORIES' })} />
      <ProgressBar current={quiz.cursor} total={quiz.total} />
      <div className="card mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">
          {lang === 'tr' ? `Aranan değer: ${quiz.target}. Sıradaki kontrol edilecek kutuya tıkla.` : `Target: ${quiz.target}. Click the next box to check.`}
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap py-4">
          {quiz.array.map((val, i) => (
            <button key={i} onClick={() => !done && pick(i)}
              className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 border-transparent font-bold text-sm transition-all duration-200 ${boxColor(i)}`}>
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BinarySearchQuizView({ lang, quiz, dispatch }) {
  const done = quiz.finishedAt !== null;
  const round = quiz.rounds[quiz.roundIdx];

  const boxColor = (i) => {
    if (i === quiz.foundIndex) return 'bg-emerald-500 text-white scale-110';
    if (i < quiz.lo || i > quiz.hi) return 'bg-gray-100 dark:bg-gray-800 text-gray-400 opacity-40';
    return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200';
  };

  const pickMid = (i) => {
    const result = stepBinaryMid(quiz, i);
    const message = result.isCorrect
      ? (result.round.outcome === 'found'
        ? (lang === 'tr' ? `Doğru! a[${i}]=${quiz.target}, hedef bulundu.` : `Correct! a[${i}]=${quiz.target}, target found.`)
        : (lang === 'tr' ? `Doğru orta eleman bu.` : `That's the correct middle element.`))
      : (lang === 'tr' ? `Yanlış. lo=${round.lo}, hi=${round.hi} için orta indeks Math.floor((${round.lo}+${round.hi})/2)=${round.mid} olmalıydı.`
        : `Wrong. For lo=${round.lo}, hi=${round.hi} the middle index should be Math.floor((${round.lo}+${round.hi})/2)=${round.mid}.`);
    dispatch({ type: 'APPLY_STEP', quiz: result.quiz, feedback: { ok: result.isCorrect, message } });
    if (result.isCorrect && result.done) finishQuiz(dispatch, result.quiz);
  };

  const pickDirection = (dir) => {
    const result = stepBinaryDirection(quiz, dir);
    const dirLabel = { left: lang === 'tr' ? 'sol yarı' : 'left half', right: lang === 'tr' ? 'sağ yarı' : 'right half' };
    const message = result.isCorrect
      ? (lang === 'tr' ? 'Doğru yön!' : 'Correct direction!')
      : (lang === 'tr' ? `Yanlış. a[mid]=${round.array[round.mid]}, hedef=${quiz.target} olduğundan ${dirLabel[round.outcome]} aranmalı.`
        : `Wrong. Since a[mid]=${round.array[round.mid]} and target=${quiz.target}, you should search the ${dirLabel[round.outcome]}.`);
    dispatch({ type: 'APPLY_STEP', quiz: result.quiz, feedback: { ok: result.isCorrect, message } });
    if (result.isCorrect && result.done) finishQuiz(dispatch, result.quiz);
  };

  return (
    <div>
      <QuizHeader lang={lang} category="searching" variantLabel="Binary Search" cursor={quiz.roundIdx} total={quiz.total} onQuit={() => dispatch({ type: 'BACK_TO_CATEGORIES' })} />
      <ProgressBar current={quiz.roundIdx} total={quiz.total} />
      <div className="card mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">
          {lang === 'tr' ? `Aranan değer: ${quiz.target}. ` : `Target: ${quiz.target}. `}
          {!done && (quiz.phase === 'guessMid'
            ? (lang === 'tr' ? 'Şu anki lo/hi aralığının orta kutusuna tıkla.' : 'Click the middle box of the current lo/hi range.')
            : (lang === 'tr' ? 'Sonra hangi yarıda aranacağını seç.' : 'Then choose which half to search next.'))}
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap py-4">
          {quiz.array.map((val, i) => (
            <button key={i} disabled={done || quiz.phase !== 'guessMid' || i < quiz.lo || i > quiz.hi}
              onClick={() => pickMid(i)}
              className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 border-transparent font-bold text-sm transition-all duration-200 ${boxColor(i)} disabled:cursor-not-allowed`}>
              {val}
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>lo={quiz.lo}</span><span>hi={quiz.hi}</span>
        </div>
      </div>
      {!done && quiz.phase === 'chooseDirection' && (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => pickDirection('left')} className="btn-primary justify-center py-3">{lang === 'tr' ? 'Sol Yarı' : 'Left Half'}</button>
          <button onClick={() => pickDirection('right')} className="btn-primary justify-center py-3">{lang === 'tr' ? 'Sağ Yarı' : 'Right Half'}</button>
        </div>
      )}
    </div>
  );
}

// ─── COMPLETION HELPER ──────────────────────────────────────────────────────
// quiz.total already reflects the exact number of decisions made for this
// run (for binary search, extractBinarySearchRounds already stops at the
// found/not-found round), so no category-specific override is needed here.
function finishQuiz(dispatch, quiz) {
  const pct = quiz.total > 0 ? Math.round((quiz.correctFirstTry / quiz.total) * 100) : 100;
  const key = `${quiz.category}:${quiz.variantId || 'default'}`;
  dispatch({ type: 'FINISH', key, pct });
}

// ─── RESULT SCREEN ──────────────────────────────────────────────────────────
function ResultScreen({ lang, state, dispatch }) {
  const { quiz, category, isNewRecord } = state;
  const total = quiz.total;
  const pct = total > 0 ? Math.round((quiz.correctFirstTry / total) * 100) : 100;
  const elapsedSec = quiz.finishedAt ? Math.round((quiz.finishedAt - quiz.startedAt) / 1000) : 0;
  const title = pct >= 80 ? t(lang, 'game.excellent') : pct >= 50 ? t(lang, 'game.good') : t(lang, 'game.tryMore');

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center animate-fade-in">
      <div className={`w-24 h-24 bg-gradient-to-br ${pct >= 70 ? 'from-amber-400 to-yellow-500' : 'from-gray-400 to-gray-500'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}>
        <Trophy size={40} className="text-white" />
      </div>
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-2">{t(lang, 'game.done')}</p>
      {isNewRecord && (
        <p className="text-sm mb-6 inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
          <Trophy size={14} /> {t(lang, 'game.newRecord')}
        </p>
      )}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: CheckCircle, label: lang === 'tr' ? 'İlk Denemede Doğru' : 'Correct First Try', value: `${quiz.correctFirstTry}/${total}`, color: 'text-emerald-600 dark:text-emerald-400' },
          { icon: XCircle,     label: lang === 'tr' ? 'Toplam Hata' : 'Total Mistakes',       value: quiz.mistakes,                          color: 'text-rose-600 dark:text-rose-400' },
          { icon: Clock,       label: lang === 'tr' ? 'Süre' : 'Time',                        value: `${elapsedSec}s`,                       color: 'text-indigo-600 dark:text-indigo-400' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card text-center">
              <Icon size={24} className={`${s.color} mx-auto mb-2`} />
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          );
        })}
      </div>
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
          <span>{t(lang, 'game.success')}</span><span>%{pct}</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${pct >= 70 ? 'from-emerald-500 to-teal-500' : 'from-amber-500 to-orange-500'} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => dispatch({ type: 'RETRY_SAME', lang })} className="btn-primary flex items-center gap-2">
          <RotateCcw size={16} /> {t(lang, 'game.replay')}
        </button>
        <button onClick={() => dispatch({ type: 'BACK_TO_CATEGORIES' })} className="btn-secondary flex items-center gap-2">
          <ArrowLeft size={16} /> {CATEGORY_LABEL[lang][category]}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function GameMode({ lang = 'tr' }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { screen, category, quiz, feedback, bestScores } = state;

  if (screen === 'category') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Zap size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-2">{t(lang, 'game.title')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{lang === 'tr' ? 'Bir kategori seç ve algoritmanın adımlarını sen yürüt!' : 'Pick a category and execute the algorithm yourself!'}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const keys = Object.keys(bestScores).filter(k => k.startsWith(`${cat.id}:`));
            const bestPct = keys.length ? Math.max(...keys.map(k => bestScores[k].pct)) : null;
            return (
              <button key={cat.id} onClick={() => dispatch({ type: 'PICK_CATEGORY', category: cat.id, lang })}
                className={`relative text-left p-6 rounded-2xl border ${cat.bg} border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                {bestPct != null && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-white/70 dark:bg-gray-900/70 px-2 py-0.5 rounded-full">
                    <Trophy size={10} /> %{bestPct}
                  </span>
                )}
                <div className={`w-10 h-10 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                  <Icon size={18} className="text-white" />
                </div>
                <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{CATEGORY_LABEL[lang][cat.id]}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{CATEGORY_DESC[lang][cat.id]}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (screen === 'variant') {
    const variants = category === 'sorting' ? SORT_VARIANTS : category === 'tree' ? TREE_VARIANTS : SEARCH_VARIANTS;
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
        <button onClick={() => dispatch({ type: 'BACK_TO_CATEGORIES' })} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6">
          <ArrowLeft size={16} /> {lang === 'tr' ? 'Kategoriler' : 'Categories'}
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{CATEGORY_LABEL[lang][category]}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {variants.map(v => (
            <button key={v.id} onClick={() => dispatch({ type: 'PICK_VARIANT', category, variantId: v.id, lang })}
              className="card text-left p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <p className="font-bold text-gray-800 dark:text-gray-100">{v.label}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'playing' && quiz) {
    let View;
    if (quiz.category === 'sorting') View = SortingQuizView;
    else if (quiz.category === 'bfs' || quiz.category === 'dfs') View = GraphQuizView;
    else if (quiz.category === 'tree') View = TreeQuizView;
    else if (quiz.variantId === 'linear') View = LinearSearchQuizView;
    else View = BinarySearchQuizView;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <FeedbackBanner feedback={feedback} />
        <View lang={lang} quiz={quiz} dispatch={dispatch} />
      </div>
    );
  }

  if (screen === 'result' && quiz) {
    return <ResultScreen lang={lang} state={state} dispatch={dispatch} />;
  }

  return null;
}
