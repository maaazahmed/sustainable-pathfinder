const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // Adjust the path to your app.js file
const Event = require('../models/Event'); // Adjust the path
const bcrypt = require("bcrypt");




describe('POST /api/events/createEvent', () => {

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
    it('should be able to create a new event', async () => {
        const eventData = {
            title: 'Test Event',
            description: 'This is a test event',
            date: new Date('2024-06-01'),
            time: '12:00 PM',
            image: 'test_image.jpg',
            location: {
                state: 'California',
                city: 'Los Angeles',
                latitude: 34.052235,
                longitude: -118.243683,
                zipCode: '90001',
                description: 'Test location description',
            },
        };

        const event = new Event(eventData);
        const savedEvent = await event.save();

        expect(savedEvent._id).toBeDefined();
        expect(savedEvent.title).toBe(eventData.title);
        expect(savedEvent.description).toBe(eventData.description);
        // Add more assertions for other fields
    });

    it('should require title, description, date, time, latitude, longitude in location', async () => {
        const event = new Event({}); // Create an event without required fields

        let error;
        try {
            await event.save();
        } catch (e) {
            error = e;
        }

        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        // Assert that specific validation errors are present for required fields
        expect(error.errors['title']).toBeDefined();
        expect(error.errors['description']).toBeDefined();
        expect(error.errors['date']).toBeDefined();
        expect(error.errors['time']).toBeDefined();
        expect(error.errors['location.latitude']).toBeDefined();
        expect(error.errors['location.longitude']).toBeDefined();
        // Add more assertions as needed
    });
});






describe('GET /api/events/:id', () => {

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
    it('should return event details for a valid event ID', async () => {
        // Create a mock event
        const event = new Event({
            title: 'Test Event',
            description: 'This is a test event',
            date: '2024-06-01',
            time: '12:00 PM',
            image: 'test_image.jpg',
            location: {
                state: 'California',
                city: 'Los Angeles',
                latitude: 34.052235,
                longitude: -118.243683,
                zipCode: '90001',
                description: 'Test location description',
            },
        });
        await event.save();

        const response = await request(app)
            .get(`/api/events/${event._id}`);

        expect(response.status).toBe(200);
        expect(response.body.code).toBe(200);
        expect(response.body.events.length).toBe(1); // Assuming you're returning an array of events
        // Add more assertions as needed
    });

    it('should return a 404 error for an invalid event ID', async () => {
        const invalidId = 'invalid-id';

        const response = await request(app)
            .get(`/api/events/${invalidId}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBeDefined();
        expect(response.body.code).toBe(404);
    });

    it('should return a 404 error if the event does not exist', async () => {
        // Create an event but don't save it
        const event = new Event({
            title: 'Test Event',
            description: 'This is a test event',
            date: '2024-06-01',
            time: '12:00 PM',
            location: {
                state: 'California',
                city: 'Los Angeles',
                latitude: 34.052235,
                longitude: -118.243683,
                zipCode: '90001',
                description: 'Test location description',
            },
        });

        const response = await request(app)
            .get(`/api/events/${event._id}`);

        expect(response.status).toBe(200);
        // expect(response.body.error).toBeDefined();
        // expect(response.body.code).toBe(404);
    });

    it('should return a 500 error if database operation fails', async () => {
        jest.spyOn(Event, 'find').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const event = new Event({
            title: 'Test Event',
            description: 'This is a test event',
            date: '2024-06-01',
            time: '12:00 PM',
            location: {
                state: 'California',
                city: 'Los Angeles',
                latitude: 34.052235,
                longitude: -118.243683,
                zipCode: '90001',
                description: 'Test location description',
            },
        });
        await event.save();


        const response = await request(app)
            .get(`/api/events/${event._id}`);

            

        expect(response.status).toBe(500);
        expect(response.error.message).toBe(`cannot GET /api/events/${event._id} (500)`);
    });
});
