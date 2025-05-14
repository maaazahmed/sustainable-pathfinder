const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
dotenv.config();

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send({
        success: false,
        message: "Access denied. No token provided",
        authorized: false
    });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return res.status(403).send({
            success: false,
            message: "Token expired",
            authorized: false
        });
    }
    next();
}