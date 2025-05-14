const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
var bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');

const app = express();


dotenv.config();

connectDB();

// app.use(cors());

// app.use(
//   cors({
//     origin: "http://localhost:3000", // Must match your frontend
//     credentials: true,               // Allow cookies, auth headers, etc.
//   })
// );

const allowedOrigins = ['http://localhost:3000'];

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow credentials (cookies, etc.)
  })
);

// Handle preflight requests
app.options('*', cors());

app.use(cookieParser());


app.use(express.json());
module.exports = app

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "5000kb" }));
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
