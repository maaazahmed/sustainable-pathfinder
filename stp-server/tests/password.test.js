const app = require('../server'); // Adjust the path to your app.js file
const User = require('../models/User'); // Adjust the path
const { generateToken } = require('../controllers/authController'); // Adjust the path to your token generation function
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');



let mongoServer;


describe('GET /api/auth/forgetpassword/:email', () => {
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
    it('should send a email reset password if user exists', async () => {
        // Mock user data
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });
        await user.save();

        // Send request to controller
        const response = await request(app)
            .get(`/api/auth/forgetpassword/${user.email}`)
            .send();

        // Check response
        expect(response.status).toBe(200);
        expect(response.body.message).toBe(`A reset password link has been sent to ${user.email} which is associated to ${user.username}`);
        // expect(response.body.token).toBeDefined();
        // Add more assertions as needed
    }); // Set a higher timeout (e.g., 10 seconds)

    it('should return an error if user does not exist', async () => {
        // Send request to controller with non-existent email
        const response = await request(app)
            .get('/api/auth/forgetpassword/nonexistent@example.com')
            .send();

        // Check response
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User with this email does not exist!');
        // Add more assertions as needed
    });
});









describe('POST /api/auth/resetpassword', () => {
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
    it('should update user password successfully', async () => {
        // Mock user data
        const user = new User({
            // _id: '60c060c060c060c060c060c0', // Replace with a valid user ID from your database
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',

        });

        // Save user to the database
        await user.save();
        const tkn = generateToken({username:user.username, email:user.email, password:user.password, _id: user._id })

        // Mock request body
        const requestBody = {
            password: 'newpassword123',
        };


        // Send request to controller
        const response = await request(app)
            .post('/api/auth/resetpassword')
            .set('x-auth-token', tkn) // Replace with a valid JWT token for authorization
            .send(requestBody);

        // Check response
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Password updated successfully!');
        // Add more assertions as needed
    });

    it('should return 401 if authorization header is missing', async () => {
        // Mock request body
        const requestBody = {
            password: 'newpassword123',
        };

        // Send request to controller without authorization header
        const response = await request(app)
            .post('/api/auth/resetpassword')
            .send(requestBody);

        // Check response
        expect(response.status).toBe(401);
        // Add more assertions as needed
    });

    it('should return 403 if authorization header is invalid', async () => {
        // Mock request body
        const requestBody = {
            password: 'newpassword123',
        };

        // Send request to controller with invalid authorization header
        const response = await request(app)
            .post('/api/auth/resetpassword')
            .set('x-auth-token', 'invalidToken')
            .send(requestBody);

        // Check response
        expect(response.status).toBe(403);
        // Add more assertions as needed
    });
});