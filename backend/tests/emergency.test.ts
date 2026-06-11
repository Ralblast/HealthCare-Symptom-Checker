import { describe, it, expect } from 'vitest';
import { isEmergency } from '../src/services/condition.service.js';

describe('isEmergency', () => {
  it('flags red-flag phrases', () => {
    expect(isEmergency('I have severe chest pain')).toBe(true);
    expect(isEmergency('I think I am having a STROKE')).toBe(true);
    expect(isEmergency('he is unconscious')).toBe(true);
  });

  it('lets ordinary symptoms through', () => {
    expect(isEmergency('mild headache and a runny nose')).toBe(false);
    expect(isEmergency('sore throat for two days')).toBe(false);
  });
});
