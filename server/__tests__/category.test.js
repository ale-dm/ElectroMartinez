const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Category & Brand API', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/category/all', () => {
    test('should return all categories', async () => {
      const response = await request(app)
        .get('/api/category/all')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/brand/all', () => {
    test('should return all brands', async () => {
      const response = await request(app)
        .get('/api/brand/all')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
