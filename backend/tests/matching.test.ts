import { describe, it, expect } from 'vitest';
import { extractKeywords, matchByKeywords } from '../src/services/condition.service.js';

const conditions = [
  { condition: 'Common Cold', symptoms: ['runny nose', 'cough', 'sore throat'] },
  { condition: 'Migraine', symptoms: ['severe headache', 'nausea', 'aura'] },
];

describe('extractKeywords', () => {
  it('keeps words longer than three characters', () => {
    expect(extractKeywords('I have a really bad cough')).toEqual(['have', 'really', 'cough']);
  });
});

describe('matchByKeywords', () => {
  it('matches conditions whose symptoms overlap the keywords', () => {
    const result = matchByKeywords(conditions, ['cough', 'congestion']);
    expect(result).toHaveLength(1);
    expect(result[0].condition).toBe('Common Cold');
  });

  it('returns nothing when there is no overlap', () => {
    expect(matchByKeywords(conditions, ['sprained', 'ankle'])).toHaveLength(0);
  });
});
