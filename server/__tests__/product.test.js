const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Product API', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/product/list', () => {
    test('should return products list', async () => {
      const response = await request(app)
        .get('/api/product/list')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/product/featured', () => {
    test('should return featured products', async () => {
      const response = await request(app)
        .get('/api/product/featured')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/product/search', () => {
    test('should search products', async () => {
      const response = await request(app)
        .get('/api/product/search?query=test')
        .expect(200);
      
      expect(response.body).toHaveProperty('products');
    });
  });
});
