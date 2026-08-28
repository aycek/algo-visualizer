// ─── BUBBLE SORT ───────────────────────────────────────────────────────────
export function generateBubbleSortSteps(arr, lang = 'tr') {
  const steps = [];
  const a = [...arr];
  const msg = lang === 'tr'
    ? { start: 'Bubble Sort başlıyor...', compare: (i,j,ai,aj) => `a[${i}]=${ai} ve a[${j}]=${aj} karşılaştırılıyor`, swap: (i,j) => `a[${i}] ve a[${j}] yer değiştirdi`, done: 'Dizi sıralandı!' }
    : { start: 'Bubble Sort starting...', compare: (i,j,ai,aj) => `Comparing a[${i}]=${ai} and a[${j}]=${aj}`, swap: (i,j) => `Swapped a[${i}] and a[${j}]`, done: 'Array sorted!' };

  steps.push({ array: [...a], comparing: [], swapped: [], sorted: [], message: msg.start, phase: 'start' });
  const sorted = new Set();
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      steps.push({ array: [...a], comparing: [j, j + 1], swapped: [], sorted: [...sorted], message: msg.compare(j, j+1, a[j], a[j+1]), phase: 'compare' });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], comparing: [], swapped: [j, j + 1], sorted: [...sorted], message: msg.swap(j, j+1), phase: 'swap' });
      }
    }
    sorted.add(a.length - 1 - i);
  }
  sorted.add(0);
  steps.push({ array: [...a], comparing: [], swapped: [], sorted: [...Array(a.length).keys()], message: msg.done, phase: 'done' });
  return steps;
}

// ─── SELECTION SORT ────────────────────────────────────────────────────────
export function generateSelectionSortSteps(arr, lang = 'tr') {
  const steps = [];
  const a = [...arr];
  const sorted = new Set();
  const msg = lang === 'tr'
    ? { start: 'Selection Sort başlıyor...', finding: (i) => `Pozisyon ${i} için minimum aranıyor`, compare: (j,mj,aj,amj) => `a[${j}]=${aj} ile min a[${mj}]=${amj} karşılaştırılıyor`, newMin: (mj,amj) => `Yeni minimum: a[${mj}]=${amj}`, swap: (i,mj) => `a[${i}] ve a[${mj}] yer değiştirdi`, done: 'Dizi sıralandı!' }
    : { start: 'Selection Sort starting...', finding: (i) => `Finding minimum for position ${i}`, compare: (j,mj,aj,amj) => `Comparing a[${j}]=${aj} with min a[${mj}]=${amj}`, newMin: (mj,amj) => `New minimum: a[${mj}]=${amj}`, swap: (i,mj) => `Swapped a[${i}] and a[${mj}]`, done: 'Array sorted!' };

  steps.push({ array: [...a], comparing: [], minIdx: -1, sorted: [], message: msg.start, phase: 'start' });
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    steps.push({ array: [...a], comparing: [i], minIdx, sorted: [...sorted], message: msg.finding(i), phase: 'finding' });
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ array: [...a], comparing: [j], minIdx, sorted: [...sorted], message: msg.compare(j, minIdx, a[j], a[minIdx]), phase: 'compare' });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push({ array: [...a], comparing: [j], minIdx, sorted: [...sorted], message: msg.newMin(minIdx, a[minIdx]), phase: 'new-min' });
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ array: [...a], comparing: [], minIdx: i, sorted: [...sorted], message: msg.swap(i, minIdx), phase: 'swap' });
    }
    sorted.add(i);
  }
  sorted.add(a.length - 1);
  steps.push({ array: [...a], comparing: [], minIdx: -1, sorted: [...Array(a.length).keys()], message: msg.done, phase: 'done' });
  return steps;
}

// ─── INSERTION SORT ────────────────────────────────────────────────────────
export function generateInsertionSortSteps(arr, lang = 'tr') {
  const steps = [];
  const a = [...arr];
  const msg = lang === 'tr'
    ? { start: 'Insertion Sort başlıyor...', pick: (i,v) => `a[${i}]=${v} eklenecek`, shift: (j,v) => `a[${j}]=${v} bir sağa kaydırıldı`, insert: (v,p) => `${v} pozisyon ${p}'e yerleştirildi`, done: 'Dizi sıralandı!' }
    : { start: 'Insertion Sort starting...', pick: (i,v) => `a[${i}]=${v} will be inserted`, shift: (j,v) => `a[${j}]=${v} shifted right`, insert: (v,p) => `${v} placed at position ${p}`, done: 'Array sorted!' };

  steps.push({ array: [...a], comparing: [], inserted: -1, sorted: [0], message: msg.start, phase: 'start' });
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push({ array: [...a], comparing: [i], inserted: -1, sorted: [...Array(i).keys()], message: msg.pick(i, key), phase: 'pick' });
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      steps.push({ array: [...a], comparing: [j, j + 1], inserted: -1, sorted: [...Array(i).keys()], message: msg.shift(j, a[j]), phase: 'shift' });
      j--;
    }
    a[j + 1] = key;
    steps.push({ array: [...a], comparing: [], inserted: j + 1, sorted: [...Array(i + 1).keys()], message: msg.insert(key, j + 1), phase: 'insert' });
  }
  steps.push({ array: [...a], comparing: [], inserted: -1, sorted: [...Array(a.length).keys()], message: lang === 'tr' ? 'Dizi sıralandı!' : 'Array sorted!', phase: 'done' });
  return steps;
}

// ─── BINARY SEARCH ─────────────────────────────────────────────────────────
export function generateBinarySearchSteps(arr, target, lang = 'tr') {
  const steps = [];
  const a = [...arr].sort((x, y) => x - y);
  let lo = 0, hi = a.length - 1;
  const msg = lang === 'tr'
    ? { start: (t) => `${t} aranıyor (sıralı dizi)`, check: (mid,v,l,h) => `Ortadaki: a[${mid}]=${v}  lo=${l}, hi=${h}`, found: (mid,t) => `Bulundu! a[${mid}]=${t}`, right: (v,t) => `${v} < ${t} -> sağ yarıya geç`, left: (v,t) => `${v} > ${t} -> sol yarıya geç`, notFound: (t) => `${t} dizide bulunamadı` }
    : { start: (t) => `Searching for ${t} (sorted array)`, check: (mid,v,l,h) => `Middle: a[${mid}]=${v}  lo=${l}, hi=${h}`, found: (mid,t) => `Found! a[${mid}]=${t}`, right: (v,t) => `${v} < ${t} -> go right half`, left: (v,t) => `${v} > ${t} -> go left half`, notFound: (t) => `${t} not found in array` };

  steps.push({ array: a, lo, hi, mid: -1, found: -1, target, message: msg.start(target), phase: 'start' });
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    steps.push({ array: a, lo, hi, mid, found: -1, target, message: msg.check(mid, a[mid], lo, hi), phase: 'check' });
    if (a[mid] === target) {
      steps.push({ array: a, lo, hi, mid, found: mid, target, message: msg.found(mid, target), phase: 'found' });
      return steps;
    } else if (a[mid] < target) {
      lo = mid + 1;
      steps.push({ array: a, lo, hi, mid, found: -1, target, message: msg.right(a[mid], target), phase: 'right' });
    } else {
      hi = mid - 1;
      steps.push({ array: a, lo, hi, mid, found: -1, target, message: msg.left(a[mid], target), phase: 'left' });
    }
  }
  steps.push({ array: a, lo: -1, hi: -1, mid: -1, found: -1, target, message: msg.notFound(target), phase: 'not-found' });
  return steps;
}

// ─── LINEAR SEARCH ─────────────────────────────────────────────────────────
export function generateLinearSearchSteps(arr, target, lang = 'tr') {
  const steps = [];
  const msg = lang === 'tr'
    ? { start: (t) => `${t} aranıyor`, check: (i,v) => `a[${i}]=${v} kontrol ediliyor`, found: (i,t) => `Bulundu! a[${i}]=${t}`, notFound: (t) => `${t} dizide yok` }
    : { start: (t) => `Searching for ${t}`, check: (i,v) => `Checking a[${i}]=${v}`, found: (i,t) => `Found! a[${i}]=${t}`, notFound: (t) => `${t} not in array` };

  steps.push({ array: arr, current: -1, found: -1, target, message: msg.start(target), phase: 'start' });
  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: arr, current: i, found: -1, target, message: msg.check(i, arr[i]), phase: 'check' });
    if (arr[i] === target) {
      steps.push({ array: arr, current: i, found: i, target, message: msg.found(i, target), phase: 'found' });
      return steps;
    }
  }
  steps.push({ array: arr, current: -1, found: -1, target, message: msg.notFound(target), phase: 'not-found' });
  return steps;
}

// ─── BFS ──────────────────────────────────────────────────────────────────
export function generateBFSSteps(graph, startNode, lang = 'tr') {
  const steps = [];
  const visited = new Set();
  const queue = [startNode];
  visited.add(startNode);
  const visitedOrder = [];
  const msg = lang === 'tr'
    ? { start: (n) => `BFS başlıyor - başlangıç: ${n}`, visit: (n) => `${n} ziyaret edildi`, enqueue: (n) => `${n} kuyruğa eklendi`, done: (o) => `BFS tamamlandı. Sıra: ${o}` }
    : { start: (n) => `BFS starting - start node: ${n}`, visit: (n) => `Visited ${n}`, enqueue: (n) => `${n} added to queue`, done: (o) => `BFS done. Order: ${o}` };

  steps.push({ visited: [], queue: [startNode], current: null, message: msg.start(startNode), phase: 'start' });
  while (queue.length > 0) {
    const node = queue.shift();
    visitedOrder.push(node);
    steps.push({ visited: [...visitedOrder], queue: [...queue], current: node, message: msg.visit(node), phase: 'visit' });
    for (const neighbor of (graph[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        steps.push({ visited: [...visitedOrder], queue: [...queue], current: node, exploring: neighbor, message: msg.enqueue(neighbor), phase: 'enqueue' });
      }
    }
  }
  steps.push({ visited: [...visitedOrder], queue: [], current: null, message: msg.done(visitedOrder.join(' -> ')), phase: 'done' });
  return steps;
}

// ─── DFS ──────────────────────────────────────────────────────────────────
export function generateDFSSteps(graph, startNode, lang = 'tr') {
  const steps = [];
  const visited = new Set();
  const visitedOrder = [];
  const msg = lang === 'tr'
    ? { start: (n) => `DFS başlıyor - başlangıç: ${n}`, visit: (n) => `${n} ziyaret edildi`, explore: (a,b) => `${a} -> ${b} kenarı izleniyor`, backtrack: (n) => `${n}'a geri dönüldü`, done: (o) => `DFS tamamlandı. Sıra: ${o}` }
    : { start: (n) => `DFS starting - start node: ${n}`, visit: (n) => `Visited ${n}`, explore: (a,b) => `Exploring edge ${a} -> ${b}`, backtrack: (n) => `Backtracked to ${n}`, done: (o) => `DFS done. Order: ${o}` };

  steps.push({ visited: [], stack: [startNode], current: null, message: msg.start(startNode), phase: 'start' });
  function dfs(node) {
    visited.add(node);
    visitedOrder.push(node);
    steps.push({ visited: [...visitedOrder], stack: [], current: node, message: msg.visit(node), phase: 'visit' });
    for (const neighbor of (graph[node] || [])) {
      if (!visited.has(neighbor)) {
        steps.push({ visited: [...visitedOrder], stack: [], current: node, exploring: neighbor, message: msg.explore(node, neighbor), phase: 'explore' });
        dfs(neighbor);
        steps.push({ visited: [...visitedOrder], stack: [], current: node, message: msg.backtrack(node), phase: 'backtrack' });
      }
    }
  }
  dfs(startNode);
  steps.push({ visited: [...visitedOrder], stack: [], current: null, message: msg.done(visitedOrder.join(' -> ')), phase: 'done' });
  return steps;
}

// ─── MERGE SORT ────────────────────────────────────────────────────────────
export function generateMergeSortSteps(arr, lang = 'tr') {
  const steps = [];
  const a = [...arr];
  const msg = lang === 'tr'
    ? { start: 'Merge Sort başlıyor...', compare: (l,r) => `${l} ile ${r} karşılaştırılıyor`, place: (v) => `${v} yerleştirildi`, copy: (v) => `${v} kopyalandı`, divide: (lo,mid,hi) => `[${lo}..${mid}] ve [${mid+1}..${hi}] bölünüyor`, merged: (lo,hi) => `[${lo}..${hi}] birleştirildi`, done: 'Dizi sıralandı!' }
    : { start: 'Merge Sort starting...', compare: (l,r) => `Comparing ${l} and ${r}`, place: (v) => `Placed ${v}`, copy: (v) => `Copied ${v}`, divide: (lo,mid,hi) => `Dividing [${lo}..${mid}] and [${mid+1}..${hi}]`, merged: (lo,hi) => `Merged [${lo}..${hi}]`, done: 'Array sorted!' };

  steps.push({ array: [...a], highlighting: [], message: msg.start, phase: 'start' });

  function merge(arr, lo, mid, hi) {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      steps.push({ array: [...arr], highlighting: [k], message: msg.compare(left[i], right[j]), phase: 'compare' });
      if (left[i] <= right[j]) { arr[k++] = left[i++]; }
      else { arr[k++] = right[j++]; }
      steps.push({ array: [...arr], highlighting: [k - 1], message: msg.place(arr[k-1]), phase: 'place' });
    }
    while (i < left.length) { arr[k++] = left[i++]; steps.push({ array: [...arr], highlighting: [k - 1], message: msg.copy(arr[k-1]), phase: 'copy' }); }
    while (j < right.length) { arr[k++] = right[j++]; steps.push({ array: [...arr], highlighting: [k - 1], message: msg.copy(arr[k-1]), phase: 'copy' }); }
  }

  function mergeSort(arr, lo, hi) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    steps.push({ array: [...arr], highlighting: Array.from({ length: hi - lo + 1 }, (_, i) => lo + i), message: msg.divide(lo, mid, hi), phase: 'divide' });
    mergeSort(arr, lo, mid);
    mergeSort(arr, mid + 1, hi);
    merge(arr, lo, mid, hi);
    steps.push({ array: [...arr], highlighting: Array.from({ length: hi - lo + 1 }, (_, i) => lo + i), message: msg.merged(lo, hi), phase: 'merged' });
  }

  mergeSort(a, 0, a.length - 1);
  steps.push({ array: [...a], highlighting: [...Array(a.length).keys()], message: msg.done, phase: 'done' });
  return steps;
}

// ─── QUIZ QUESTIONS ────────────────────────────────────────────────────────
export const quizQuestions = {
  tr: [
    { id: 1, difficulty: 'easy', question: 'Binary Search algoritmasının zaman karmaşıklığı nedir?', options: ['O(n)', 'O(log n)', 'O(n2)', 'O(1)'], correct: 1, explanation: 'Binary Search her adımda arama alanını yarıya böler, bu nedenle O(log n) karmaşıklığına sahiptir.' },
    { id: 2, difficulty: 'easy', question: 'Bubble Sort hangi durum için en kötü zaman karmaşıklığına sahiptir?', options: ['Sıralı dizi', 'Rastgele dizi', 'Ters sıralı dizi', 'Tek elemanlı dizi'], correct: 2, explanation: 'Ters sıralı dizide her eleman için maksimum takas yapılır: O(n2).' },
    { id: 3, difficulty: 'easy', question: 'BFS hangi veri yapısını kullanır?', options: ['Stack', 'Queue', 'Heap', 'Tree'], correct: 1, explanation: 'BFS (Breadth-First Search) FIFO yapısı olan Queue kullanır.' },
    { id: 4, difficulty: 'easy', question: "Linear Search'ın en kötü zaman karmaşıklığı nedir?", options: ['O(1)', 'O(log n)', 'O(n)', 'O(n2)'], correct: 2, explanation: 'Linear Search en kötü durumda tüm elemanları taramak zorundadır: O(n).' },
    { id: 5, difficulty: 'easy', question: "Selection Sort'un zaman karmaşıklığı nedir?", options: ['O(n log n)', 'O(n)', 'O(n2)', 'O(log n)'], correct: 2, explanation: 'Selection Sort iki iç içe döngü kullandığından O(n2) karmaşıklığına sahiptir.' },
    { id: 6, difficulty: 'medium', question: 'DFS hangi veri yapısını kullanır?', options: ['Queue', 'Stack (veya recursion)', 'Heap', 'Linked List'], correct: 1, explanation: 'DFS (Depth-First Search) LIFO yapısı olan Stack veya özyineleme kullanır.' },
    { id: 7, difficulty: 'medium', question: "Binary Search'ın çalışması için dizinin özelliği ne olmalıdır?", options: ['Sıralanmış olmalı', 'Sıralanmamış olmalı', 'Tek elemanlar içermeli', 'Çift sayılar içermeli'], correct: 0, explanation: 'Binary Search sadece sıralı dizilerde çalışır, aksi halde doğru sonuç vermez.' },
    { id: 8, difficulty: 'medium', question: 'Insertion Sort hangi durumda en verimlidir?', options: ['Ters sıralı dizi', 'Neredeyse sıralı dizi', 'Rastgele dizi', 'Büyük diziler'], correct: 1, explanation: 'Insertion Sort neredeyse sıralı dizilerde O(n) performansıyla çalışır.' },
    { id: 9, difficulty: 'medium', question: 'BFS grafta ne garantiler?', options: ['En derin yolu bulur', 'En kısa yolu bulur', 'Her zaman en hızlıdır', 'Döngü tespit eder'], correct: 1, explanation: 'Ağırlıksız grafta BFS, başlangıç ile hedef arasındaki en kısa yolu garantiler.' },
    { id: 10, difficulty: 'medium', question: "Merge Sort'un zaman karmaşıklığı nedir?", options: ['O(n2)', 'O(n)', 'O(n log n)', 'O(log n)'], correct: 2, explanation: 'Merge Sort diziyi log n seviyede böler ve her seviyede O(n) işlem yapar.' },
    { id: 11, difficulty: 'hard', question: 'Hangi sıralama algoritması en kötü durumda O(n log n) garantisi verir?', options: ['Quick Sort', 'Bubble Sort', 'Merge Sort', 'Selection Sort'], correct: 2, explanation: 'Merge Sort her durumda O(n log n) garantisi sağlar. Quick Sort en kötü durumda O(n2) olabilir.' },
    { id: 12, difficulty: 'hard', question: 'Graf için BFS ve DFS hangi karmaşıklığa sahiptir?', options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V x E)'], correct: 2, explanation: 'Hem BFS hem DFS her düğümü ve kenarı bir kez ziyaret eder: O(V + E).' },
    { id: 13, difficulty: 'hard', question: 'n elemanlı sıralı dizide Binary Search kaç adımda sonuç verir (en kötü)?', options: ['n', 'n/2', 'log2(n)', 'sqrt(n)'], correct: 2, explanation: 'Her adımda arama alanı yarıya iner; en kötü durumda log2(n) adım gerekir.' },
    { id: 14, difficulty: 'hard', question: 'Hangi algoritma "divide and conquer" paradigmasını kullanmaz?', options: ['Merge Sort', 'Binary Search', 'Bubble Sort', 'Quick Sort'], correct: 2, explanation: 'Bubble Sort karşılaştırma tabanlı basit bir algoritmadır; böl-ve-yönet kullanmaz.' },
    { id: 15, difficulty: 'hard', question: 'O(n log n) karmaşıklıkla çalışan sıralama algoritması hangisidir?', options: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort'], correct: 3, explanation: 'Merge Sort O(n log n) ile çalışan en verimli algoritmalardan biridir.' },
  ],
  en: [
    { id: 1, difficulty: 'easy', question: 'What is the time complexity of Binary Search?', options: ['O(n)', 'O(log n)', 'O(n2)', 'O(1)'], correct: 1, explanation: 'Binary Search halves the search space each step, giving O(log n) complexity.' },
    { id: 2, difficulty: 'easy', question: 'When does Bubble Sort have its worst-case time complexity?', options: ['Sorted array', 'Random array', 'Reverse sorted array', 'Single element array'], correct: 2, explanation: 'A reverse-sorted array causes maximum swaps at every step: O(n2).' },
    { id: 3, difficulty: 'easy', question: 'Which data structure does BFS use?', options: ['Stack', 'Queue', 'Heap', 'Tree'], correct: 1, explanation: 'BFS uses a Queue (FIFO) to process nodes level by level.' },
    { id: 4, difficulty: 'easy', question: 'What is the worst-case time complexity of Linear Search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n2)'], correct: 2, explanation: 'Linear Search may scan every element in the worst case: O(n).' },
    { id: 5, difficulty: 'easy', question: 'What is the time complexity of Selection Sort?', options: ['O(n log n)', 'O(n)', 'O(n2)', 'O(log n)'], correct: 2, explanation: 'Selection Sort uses two nested loops, giving O(n2) complexity.' },
    { id: 6, difficulty: 'medium', question: 'Which data structure does DFS use?', options: ['Queue', 'Stack (or recursion)', 'Heap', 'Linked List'], correct: 1, explanation: 'DFS uses a Stack (LIFO) or recursion to explore depth-first.' },
    { id: 7, difficulty: 'medium', question: 'What must be true about an array for Binary Search to work?', options: ['Must be sorted', 'Must be unsorted', 'Must have unique elements', 'Must have even numbers'], correct: 0, explanation: 'Binary Search only works on sorted arrays; otherwise it gives incorrect results.' },
    { id: 8, difficulty: 'medium', question: 'When is Insertion Sort most efficient?', options: ['Reverse sorted array', 'Nearly sorted array', 'Random array', 'Large arrays'], correct: 1, explanation: 'Insertion Sort runs in O(n) on nearly sorted arrays.' },
    { id: 9, difficulty: 'medium', question: 'What does BFS guarantee in a graph?', options: ['Finds deepest path', 'Finds shortest path', 'Always fastest', 'Detects cycles'], correct: 1, explanation: 'In an unweighted graph, BFS guarantees the shortest path (fewest edges).' },
    { id: 10, difficulty: 'medium', question: 'What is the time complexity of Merge Sort?', options: ['O(n2)', 'O(n)', 'O(n log n)', 'O(log n)'], correct: 2, explanation: 'Merge Sort divides the array log n levels and does O(n) work each level.' },
    { id: 11, difficulty: 'hard', question: 'Which sorting algorithm guarantees O(n log n) in the worst case?', options: ['Quick Sort', 'Bubble Sort', 'Merge Sort', 'Selection Sort'], correct: 2, explanation: 'Merge Sort guarantees O(n log n) always. Quick Sort can be O(n2) worst case.' },
    { id: 12, difficulty: 'hard', question: 'What is the complexity of BFS and DFS on a graph?', options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V x E)'], correct: 2, explanation: 'Both BFS and DFS visit every vertex and edge once: O(V + E).' },
    { id: 13, difficulty: 'hard', question: 'How many steps does Binary Search take on a sorted array of n elements (worst case)?', options: ['n', 'n/2', 'log2(n)', 'sqrt(n)'], correct: 2, explanation: 'Each step halves the search space; worst case is log2(n) steps.' },
    { id: 14, difficulty: 'hard', question: 'Which algorithm does NOT use the divide-and-conquer paradigm?', options: ['Merge Sort', 'Binary Search', 'Bubble Sort', 'Quick Sort'], correct: 2, explanation: 'Bubble Sort is a simple comparison-based algorithm with no divide-and-conquer.' },
    { id: 15, difficulty: 'hard', question: 'Which sorting algorithm can run in O(n log n)?', options: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort'], correct: 3, explanation: 'Merge Sort is one of the most efficient comparison sorts, running in O(n log n).' },
  ],
};

// ─── SAMPLE DATA ───────────────────────────────────────────────────────────
export const sampleGraph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E'],
};

export const graphPositions = {
  A: { x: 300, y: 60 },
  B: { x: 150, y: 180 },
  C: { x: 450, y: 180 },
  D: { x: 70,  y: 300 },
  E: { x: 230, y: 300 },
  F: { x: 380, y: 300 },
};
