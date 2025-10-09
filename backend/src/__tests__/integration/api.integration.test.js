import supertest from 'supertest';
import app from '../../../server.js';

const request = supertest(app);

describe('Nasa API Integration Tests', () => {
  describe('GET /api/nasa/apod', () => {
    it('should fetch data from NASA API', async () => {
      const response = await request
        .get('/api/nasa/apod')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('url');
      expect(response.body).toHaveProperty('hdurl');
      expect(response.body).toHaveProperty('explanation');
      expect(response.body).toHaveProperty('media_type', 'image');
      expect(response.body).toHaveProperty('date');
    });
  });
});