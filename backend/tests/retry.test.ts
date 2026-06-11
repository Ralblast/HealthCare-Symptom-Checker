import { describe, it, expect, vi } from 'vitest';
import { retryWithBackoff } from '../src/utils/retry.js';

describe('retryWithBackoff', () => {
  it('returns the result on the first try', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    await expect(retryWithBackoff(fn)).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries once then succeeds', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('flaky'))
      .mockResolvedValue('ok');
    await expect(retryWithBackoff(fn, 2, 1)).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws after exhausting all attempts', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fails'));
    await expect(retryWithBackoff(fn, 2, 1)).rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
