import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// These hit the real Express app (routing + middleware + error handling) but
// none of them reach the database, so they run without a Mongo connection.
describe('API wiring', () => {
  it('returns 404 with the endpoint list for unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(Array.isArray(res.body.availableEndpoints)).toBe(true);
  });

  it('rejects an empty symptom with a 400', async () => {
    const res = await request(app).post('/api/start-check').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('INVALID_INPUT');
  });

  it('rejects too-short analysis context', async () => {
    const res = await request(app).post('/api/analyze').send({ fullContext: 'hi' });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('CONTEXT_TOO_SHORT');
  });
});
