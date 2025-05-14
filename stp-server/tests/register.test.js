// tests/register.test.js
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // Adjust the path to your app.js file

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

describe('POST /api/auth/register', () => {
  it('should create a user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser2@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User Created Successfully!');
    expect(response.body.token).toBeDefined();
  });

  it('should return an error if email is already in use', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('The email address already in use. please try to another email address!');
  });

  it('should return an error if no data is provided', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({});
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Please provide a valid data!');
  });
});
