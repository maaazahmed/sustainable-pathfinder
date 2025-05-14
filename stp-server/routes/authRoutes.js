const express = require("express");
const api = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { signupController, signinController, getUserController, logoutController } = require("../controllers/authController");



api.post("/register", signupController);

api.post("/login", signinController);

api.get("/user", authMiddleware, getUserController);


api.post("/logout", logoutController)

module.exports = api;
