import { describe, it, expect } from 'vitest';
import { parseJsonResponse } from '../src/utils/json.js';

describe('parseJsonResponse', () => {
  it('parses plain JSON', () => {
    expect(parseJsonResponse('{"a":1}')).toEqual({ a: 1 });
  });

  it('strips ```json code fences (the bug the old version missed)', () => {
    const fenced = '```json\n{"questions":["one","two"]}\n```';
    expect(parseJsonResponse(fenced)).toEqual({ questions: ['one', 'two'] });
  });

  it('extracts the JSON object when wrapped in prose', () => {
    const messy = 'Sure! Here you go: {"urgencyLevel":"low"} hope that helps';
    expect(parseJsonResponse(messy)).toEqual({ urgencyLevel: 'low' });
  });

  it('returns null for garbage', () => {
    expect(parseJsonResponse('not json at all')).toBeNull();
    expect(parseJsonResponse('')).toBeNull();
  });
});
