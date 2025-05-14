const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // Adjust the path to your app.js file
const User = require('../models/User'); // Adjust the path
const bcrypt = require("bcrypt");


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

describe('POST /api/auth/signin', () => {
    it('should log in a user successfully', async () => {
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: hashedPassword,
        });
        await user.save();


        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login Successful!');
        expect(response.body.token).toBeDefined();
    });

    it('should return an error for invalid credentials', async () => {
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: hashedPassword,
        });
        await user.save();

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword',
            });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Invalid email or password!');
    });

    it('should return an error if user is not found', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Invalid email or password!');
    });



    it('should return an error if database operation fails', async () => {
        jest.spyOn(User, 'findOne').mockImplementation(() => {
            throw new Error('Database error');
        });
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(500);
        expect(response.error.message).toBe('cannot POST /api/auth/login (500)');
    });
});