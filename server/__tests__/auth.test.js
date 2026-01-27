const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Auth API', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/user/register', () => {
    test('should fail without required fields', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({})
        .expect(400);
      
      expect(response.body).toHaveProperty('msg');
    });

    test('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('msg');
    });
  });

  describe('POST /api/user/login', () => {
    test('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'wrongpassword'
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('msg');
    });
  });
});
