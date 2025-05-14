// const request = require("supertest");
// const app = require("../server");



// const mongoose = require('mongoose');
// const connectDB = require("../config/db"); // Adjust the path to your connectDB file

// jest.mock('mongoose');

// describe('connectDB', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should connect to MongoDB successfully', async () => {
//     // Mock mongoose.connect to resolve successfully
//     mongoose.connect.mockResolvedValueOnce();

//     // Mock console.log to capture log messages
//     console.log = jest.fn();

//     await connectDB();

//     expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI, {});
//     expect(console.log).toHaveBeenCalledWith('MongoDB connected...');
//   });

//   it('should fail to connect to MongoDB and exit process', async () => {
//     // Mock mongoose.connect to reject with an error
//     const errorMessage = 'Failed to connect';
//     mongoose.connect.mockRejectedValueOnce(new Error(errorMessage));

//     // Mock console.error and process.exit
//     console.error = jest.fn();
//     process.exit = jest.fn();

//     await connectDB();

//     expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI, {});
//     expect(console.error).toHaveBeenCalledWith(errorMessage);
//     expect(process.exit).toHaveBeenCalledWith(1);
//   });
// });



// // describe("Auth Routes",  () => {
// //   it("should respond with a 401 for unauthorized requests", () => {
// //     const response =  request(app).get("/api/auth/signup");
// //     console.log(response)
// //     expect(401).toBe(401);
// //   });
// // });

// // describe("Auth Routes", () => {
// //   it("should successfully log in a user with correct credentials", async () => {
// //     const credentials = {
// //       email: "valid@example.com",
// //       password: "password123",
// //     };
// //     const response = await request(app).post("/api/auth/login").send(credentials);
// //     expect(response.status).toBe(200);
// //     expect(response.body).toHaveProperty("token");
// //   });

// //   it("should return a 401 for invalid credentials", async () => {
// //     const invalidCredentials = {
// //       email: "invalid@example.com",
// //       password: "wrongpassword",
// //     };
// //     const response = await request(app).post("/api/auth/login").send(invalidCredentials);
// //     expect(response.status).toBe(401);
// //   });
// // });




// // describe("Event Routes", () => {
// //   it("should get all events", async () => {
// //     const response = await request(app).get("/api/events");
// //     expect(response.status).toBe(200);
// //     expect(response.body).toBeInstanceOf(Array);
// //   });

// //   it("should create a new event", async () => {
// //     const newEvent = {
// //       title: "Test Event",
// //       description: "This is a test event.",
// //       // ... other event properties
// //     };
// //     const response = await request(app).post("/api/events").send(newEvent);
// //     expect(response.status).toBe(201);
// //     expect(response.body).toHaveProperty("_id");
// //   });

// //   // ... test cases for other event routes (GET by ID, UPDATE, DELETE)
// // });
