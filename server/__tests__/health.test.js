const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Health Check', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET / should return 200', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.body).toHaveProperty('message');
  });
});
