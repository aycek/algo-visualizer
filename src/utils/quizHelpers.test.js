import { describe, it, expect } from 'vitest';
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateBinarySearchSteps,
  generateLinearSearchSteps,
} from './algorithmHelpers';
import {
  generateRandomArray,
  generateRandomTree,
  computeTreeLayout,
  preorderSequence,
  inorderSequence,
  postorderSequence,
  levelorderSequence,
  extractBubbleDecisions,
  extractSelectionDecisions,
  extractInsertionDecisions,
  extractBinarySearchRounds,
  extractLinearSearchOrder,
} from './quizHelpers';

describe('generateRandomArray', () => {
  it('produces a length within range and unique values', () => {
    for (let i = 0; i < 20; i++) {
      const arr = generateRandomArray(6, 10, 5, 95);
      expect(arr.length).toBeGreaterThanOrEqual(6);
      expect(arr.length).toBeLessThanOrEqual(10);
      expect(new Set(arr).size).toBe(arr.length);
      arr.forEach(v => {
        expect(v).toBeGreaterThanOrEqual(5);
        expect(v).toBeLessThanOrEqual(95);
      });
    }
  });
});

describe('generateRandomTree / computeTreeLayout', () => {
  it('produces a tree with at least the minimum node count and unique values', () => {
    for (let i = 0; i < 10; i++) {
      const tree = generateRandomTree(2, 5);
      const values = preorderSequence(tree);
      expect(values.length).toBeGreaterThanOrEqual(5);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it('lays out a position for every node and one edge per parent-child link', () => {
    const tree = generateRandomTree(2, 5);
    const nodeCount = preorderSequence(tree).length;
    const { positions, edges } = computeTreeLayout(tree);
    expect(Object.keys(positions)).toHaveLength(nodeCount);
    expect(edges.length).toBe(nodeCount - 1);
  });
});

describe('traversal sequences', () => {
  // fixed manual tree: 1 -> (2 -> (4, 5)), (3 -> (6, 7))
  const tree = {
    value: 1,
    left: { value: 2, left: { value: 4, left: null, right: null }, right: { value: 5, left: null, right: null } },
    right: { value: 3, left: { value: 6, left: null, right: null }, right: { value: 7, left: null, right: null } },
  };

  it('computes preorder', () => expect(preorderSequence(tree)).toEqual([1, 2, 4, 5, 3, 6, 7]));
  it('computes inorder', () => expect(inorderSequence(tree)).toEqual([4, 2, 5, 1, 6, 3, 7]));
  it('computes postorder', () => expect(postorderSequence(tree)).toEqual([4, 5, 2, 6, 7, 3, 1]));
  it('computes level-order', () => expect(levelorderSequence(tree)).toEqual([1, 2, 3, 4, 5, 6, 7]));
});

describe('sorting decision extraction', () => {
  function applyDecisions(arr, decisions, apply) {
    const a = [...arr];
    decisions.forEach(d => apply(a, d));
    return a;
  }

  it('bubble decisions reconstruct the sorted array', () => {
    const arr = [64, 34, 25, 12, 22, 11, 90];
    const steps = generateBubbleSortSteps(arr, 'en');
    const decisions = extractBubbleDecisions(steps);
    expect(decisions.length).toBeGreaterThan(0);
    const result = applyDecisions(arr, decisions, (a, d) => {
      if (d.action === 'swap') { const [j, k] = d.pair; [a[j], a[k]] = [a[k], a[j]]; }
    });
    expect(result).toEqual([...arr].sort((x, y) => x - y));
  });

  it('selection decisions flag exactly the steps that update the running minimum', () => {
    const arr = [64, 25, 12, 22, 11];
    const steps = generateSelectionSortSteps(arr, 'en');
    const decisions = extractSelectionDecisions(steps);
    const newMinCount = decisions.filter(d => d.action === 'newMin').length;
    const actualNewMinSteps = steps.filter(s => s.phase === 'new-min').length;
    expect(newMinCount).toBe(actualNewMinSteps);
  });

  it('insertion decisions contain a shift for every shift step plus one insert per element', () => {
    const arr = [5, 2, 4, 6, 1, 3];
    const steps = generateInsertionSortSteps(arr, 'en');
    const decisions = extractInsertionDecisions(steps);
    const shiftCount = decisions.filter(d => d.action === 'shift').length;
    const insertCount = decisions.filter(d => d.action === 'insert').length;
    expect(shiftCount).toBe(steps.filter(s => s.phase === 'shift').length);
    expect(insertCount).toBe(arr.length - 1);
  });
});

describe('search ground-truth extraction', () => {
  it('extracts one binary-search round per check, ending in found or not-found', () => {
    const arr = [11, 12, 22, 25, 34, 64, 90];
    const steps = generateBinarySearchSteps(arr, 25, 'en');
    const rounds = extractBinarySearchRounds(steps);
    expect(rounds.length).toBeGreaterThan(0);
    expect(['found', 'left', 'right']).toContain(rounds[rounds.length - 1].outcome);
  });

  it('extracts the sequential linear-search check order', () => {
    const arr = [4, 2, 7, 1, 9, 3, 8, 5];
    const steps = generateLinearSearchSteps(arr, 9, 'en');
    const order = extractLinearSearchOrder(steps);
    expect(order).toEqual([0, 1, 2, 3, 4]);
  });
});
