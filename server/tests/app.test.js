const request = require('supertest');
const app = require('../app');

describe('Health Check', () => {
  test('GET /health should return 200 and status ok', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('CORS Configuration', () => {
  test('Should allow requests from allowed origins', async () => {
    const response = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:3000');
    
    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  test('Should block requests from disallowed origins', async () => {
    const response = await request(app)
      .get('/health')
      .set('Origin', 'http://disallowed.com');
    
    expect(response.status).toBe(500); // CORS error triggers our error handler
    expect(response.body.error).toBe('Internal Server Error');
  });
});

describe('404 Handler', () => {
  test('Should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/nonexistent');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
  });
});