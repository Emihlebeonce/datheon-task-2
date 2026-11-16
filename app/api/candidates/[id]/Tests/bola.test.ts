import { describe, it, expect } from 'vitest';
import { GET } from '../route';

function makeRequest(email?: string) {
  return new Request('http://localhost:3000/api/candidates/1', {
    headers: email ? { 'x-user-email': email } : {},
  }) as any;
}

describe('BOLA Guard - Task 2', () => {
  it('User A can read their own record', async () => {
    const res = await GET(makeRequest('thando@example.com'), { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(200);
  });

  it('User A cannot read User B record', async () => {
    const res = await GET(makeRequest('thando@example.com'), { params: Promise.resolve({ id: '2' }) });
    expect(res.status).toBe(404);
  });

  it('Request without auth header returns 401', async () => {
    const res = await GET(makeRequest(), { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(401);
  });
});