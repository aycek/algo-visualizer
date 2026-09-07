// ─── RANDOM ARRAY (for sorting/searching quizzes) ──────────────────────────
export function generateRandomArray(minLen = 6, maxLen = 10, minVal = 5, maxVal = 95) {
  const len = minLen + Math.floor(Math.random() * (maxLen - minLen + 1));
  const values = new Set();
  while (values.size < len) {
    values.add(minVal + Math.floor(Math.random() * (maxVal - minVal + 1)));
  }
  return [...values];
}

// ─── RANDOM BINARY TREE (for tree traversal quizzes) ───────────────────────
function countNodes(node) {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

function buildRandomNode(depth, maxDepth, usedValues) {
  let value;
  do { value = 1 + Math.floor(Math.random() * 99); } while (usedValues.has(value));
  usedValues.add(value);
  const node = { value, left: null, right: null };
  if (depth < maxDepth) {
    if (Math.random() > 0.2) node.left = buildRandomNode(depth + 1, maxDepth, usedValues);
    if (Math.random() > 0.2) node.right = buildRandomNode(depth + 1, maxDepth, usedValues);
  }
  return node;
}

export function generateRandomTree(maxDepth = 2, minNodes = 5) {
  let root;
  let guard = 0;
  do {
    root = buildRandomNode(0, maxDepth, new Set());
    guard++;
  } while (countNodes(root) < minNodes && guard < 50);
  return root;
}

// Circular-free layout: x by in-order position, y by depth. Works for any shape.
export function computeTreeLayout(root, width = 560, topMargin = 45, levelHeight = 95) {
  const positions = {};
  const edges = [];
  const total = countNodes(root);
  let counter = 0;

  function assign(node, depth) {
    if (!node) return;
    assign(node.left, depth + 1);
    counter++;
    positions[node.value] = {
      x: Math.round((counter * width) / (total + 1)),
      y: topMargin + depth * levelHeight,
    };
    assign(node.right, depth + 1);
  }
  function collectEdges(node) {
    if (!node) return;
    if (node.left) { edges.push([node.value, node.left.value]); collectEdges(node.left); }
    if (node.right) { edges.push([node.value, node.right.value]); collectEdges(node.right); }
  }

  assign(root, 0);
  collectEdges(root);
  return { positions, edges };
}

// ─── TRAVERSAL GROUND-TRUTH SEQUENCES ──────────────────────────────────────
export function preorderSequence(node, out = []) {
  if (!node) return out;
  out.push(node.value);
  preorderSequence(node.left, out);
  preorderSequence(node.right, out);
  return out;
}

export function inorderSequence(node, out = []) {
  if (!node) return out;
  inorderSequence(node.left, out);
  out.push(node.value);
  inorderSequence(node.right, out);
  return out;
}

export function postorderSequence(node, out = []) {
  if (!node) return out;
  postorderSequence(node.left, out);
  postorderSequence(node.right, out);
  out.push(node.value);
  return out;
}

export function levelorderSequence(root) {
  const out = [];
  const queue = root ? [root] : [];
  while (queue.length) {
    const n = queue.shift();
    out.push(n.value);
    if (n.left) queue.push(n.left);
    if (n.right) queue.push(n.right);
  }
  return out;
}

// ─── SORTING DECISION EXTRACTION (ground truth for interactive quiz) ──────
// Turns a generated step list into a sequence of yes/no decisions the user
// must predict, each carrying the array snapshot to render at that point.

export function extractBubbleDecisions(steps) {
  const decisions = [];
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (s.phase === 'compare') {
      const next = steps[i + 1];
      decisions.push({ pair: s.comparing, action: next && next.phase === 'swap' ? 'swap' : 'keep', arrayBefore: s.array });
    }
  }
  return decisions;
}

export function extractSelectionDecisions(steps) {
  const decisions = [];
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (s.phase === 'compare') {
      const next = steps[i + 1];
      decisions.push({ pair: [s.comparing[0], s.minIdx], action: next && next.phase === 'new-min' ? 'newMin' : 'keep', arrayBefore: s.array });
    }
  }
  return decisions;
}

export function extractInsertionDecisions(steps) {
  const decisions = [];
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const before = steps[i - 1] ? steps[i - 1].array : s.array;
    if (s.phase === 'shift') decisions.push({ pair: s.comparing, action: 'shift', arrayBefore: before });
    else if (s.phase === 'insert') decisions.push({ pair: [Math.max(0, s.inserted - 1), s.inserted], action: 'insert', arrayBefore: before });
  }
  return decisions;
}

// ─── SEARCH GROUND-TRUTH EXTRACTION ────────────────────────────────────────
export function extractBinarySearchRounds(steps) {
  const rounds = [];
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (s.phase === 'check') {
      const next = steps[i + 1];
      rounds.push({ lo: s.lo, hi: s.hi, mid: s.mid, array: s.array, outcome: next ? next.phase : 'not-found' });
    }
  }
  return rounds;
}

export function extractLinearSearchOrder(steps) {
  return steps.filter(s => s.phase === 'check').map(s => s.current);
}
