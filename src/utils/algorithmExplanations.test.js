import { describe, it, expect } from 'vitest';
import { getExplanation } from './algorithmExplanations';

const ALL_IDS = [
  'bubble', 'selection', 'insertion', 'merge',
  'binarySearch', 'linearSearch', 'bfs', 'dfs',
  'treePreorder', 'treeInorder', 'treePostorder', 'treeLevelorder',
];

describe('getExplanation', () => {
  it.each(ALL_IDS)('has non-empty Turkish and English content for %s', (id) => {
    for (const lang of ['tr', 'en']) {
      const { howItWorks, useCases } = getExplanation(id, lang);
      expect(howItWorks.length).toBeGreaterThan(0);
      expect(useCases.length).toBeGreaterThan(0);
      howItWorks.forEach(p => expect(p.length).toBeGreaterThan(20));
      useCases.forEach(c => expect(c.length).toBeGreaterThan(10));
    }
  });

  it('falls back to Turkish for an unknown language', () => {
    const tr = getExplanation('bubble', 'tr');
    const fallback = getExplanation('bubble', 'fr');
    expect(fallback).toEqual(tr);
  });

  it('returns empty arrays for an unknown algorithm id', () => {
    expect(getExplanation('not-a-real-algo', 'tr')).toEqual({ howItWorks: [], useCases: [] });
  });
});
