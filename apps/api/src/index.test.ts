import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from './index.js';

describe('health', () => {
  it('returns UP', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });
});
