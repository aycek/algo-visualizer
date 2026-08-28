import { describe, it, expect } from 'vitest';
import { parseArrayInput } from './validation';

describe('parseArrayInput', () => {
  it('parses a valid comma-separated list', () => {
    const { values, error } = parseArrayInput('5, 3, 1, 4', { lang: 'en' });
    expect(error).toBeNull();
    expect(values).toEqual([5, 3, 1, 4]);
  });

  it('rejects empty input', () => {
    const { values, error } = parseArrayInput('', { lang: 'en' });
    expect(values).toBeNull();
    expect(error).toMatch(/at least one number/i);
  });

  it('rejects non-numeric entries', () => {
    const { values, error } = parseArrayInput('1, abc, 3', { lang: 'en' });
    expect(values).toBeNull();
    expect(error).toMatch(/invalid number/i);
  });

  it('rejects too few elements', () => {
    const { values, error } = parseArrayInput('1', { min: 2, max: 12, lang: 'en' });
    expect(values).toBeNull();
    expect(error).toMatch(/2-12/);
  });

  it('rejects too many elements', () => {
    const many = Array.from({ length: 13 }, (_, i) => i).join(', ');
    const { values, error } = parseArrayInput(many, { min: 2, max: 12, lang: 'en' });
    expect(values).toBeNull();
    expect(error).toMatch(/2-12/);
  });

  it('rejects negative numbers when allowNegative is false', () => {
    const { values, error } = parseArrayInput('1, -2, 3', { allowNegative: false, lang: 'en' });
    expect(values).toBeNull();
    expect(error).toMatch(/negative/i);
  });

  it('allows negative numbers when allowNegative is true', () => {
    const { values, error } = parseArrayInput('1, -2, 3', { allowNegative: true, lang: 'en' });
    expect(error).toBeNull();
    expect(values).toEqual([1, -2, 3]);
  });
});
