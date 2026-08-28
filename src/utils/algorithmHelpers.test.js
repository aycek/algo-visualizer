import { describe, it, expect } from 'vitest';
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateBinarySearchSteps,
  generateLinearSearchSteps,
  generateBFSSteps,
  generateDFSSteps,
  sampleGraph,
} from './algorithmHelpers';

function lastArray(steps) {
  return steps[steps.length - 1].array;
}

describe('sort step generators', () => {
  const input = [64, 34, 25, 12, 22, 11, 90];
  const expected = [...input].sort((a, b) => a - b);

  it.each([
    ['bubble sort', generateBubbleSortSteps],
    ['selection sort', generateSelectionSortSteps],
    ['insertion sort', generateInsertionSortSteps],
    ['merge sort', generateMergeSortSteps],
  ])('%s produces a fully sorted final step', (_name, generate) => {
    const steps = generate(input, 'en');
    expect(lastArray(steps)).toEqual(expected);
    expect(steps[steps.length - 1].phase).toBe('done');
    expect(steps[0].phase).toBe('start');
  });

  it('does not mutate the original input array', () => {
    const original = [3, 1, 2];
    const copy = [...original];
    generateBubbleSortSteps(original, 'en');
    expect(original).toEqual(copy);
  });

  it('handles an already-sorted array', () => {
    const steps = generateInsertionSortSteps([1, 2, 3], 'en');
    expect(lastArray(steps)).toEqual([1, 2, 3]);
  });

  it('handles a two-element array', () => {
    const steps = generateSelectionSortSteps([2, 1], 'en');
    expect(lastArray(steps)).toEqual([1, 2]);
  });
});

describe('generateBinarySearchSteps', () => {
  const sorted = [11, 12, 22, 25, 34, 64, 90];

  it('finds a target that exists', () => {
    const steps = generateBinarySearchSteps(sorted, 25, 'en');
    const last = steps[steps.length - 1];
    expect(last.phase).toBe('found');
    expect(sorted[last.found]).toBe(25);
  });

  it('reports not-found for a missing target', () => {
    const steps = generateBinarySearchSteps(sorted, 99, 'en');
    expect(steps[steps.length - 1].phase).toBe('not-found');
  });

  it('sorts an unsorted array before searching', () => {
    const steps = generateBinarySearchSteps([5, 1, 4, 2, 3], 3, 'en');
    expect(steps[0].array).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('generateLinearSearchSteps', () => {
  const arr = [4, 2, 7, 1, 9, 3, 8, 5];

  it('finds a target that exists', () => {
    const steps = generateLinearSearchSteps(arr, 9, 'en');
    const last = steps[steps.length - 1];
    expect(last.phase).toBe('found');
    expect(arr[last.found]).toBe(9);
  });

  it('reports not-found for a missing target', () => {
    const steps = generateLinearSearchSteps(arr, 42, 'en');
    expect(steps[steps.length - 1].phase).toBe('not-found');
  });
});

describe('graph traversal step generators', () => {
  it.each([
    ['BFS', generateBFSSteps],
    ['DFS', generateDFSSteps],
  ])('%s visits every reachable node exactly once starting from A', (_name, generate) => {
    const steps = generate(sampleGraph, 'A', 'en');
    const last = steps[steps.length - 1];
    expect(last.phase).toBe('done');
    expect(last.visited[0]).toBe('A');
    expect(new Set(last.visited).size).toBe(last.visited.length);
    expect(last.visited.sort()).toEqual(Object.keys(sampleGraph).sort());
  });
});
