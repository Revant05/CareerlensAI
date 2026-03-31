const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');

const rateLimit = require('express-rate-limit');
const errorMiddleware = require('./middleware/error');

dotenv.config();

const app = express();

// Rate Limiting: Prevent Brute Force
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Security & Performance Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// Tightened CORS
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/', apiLimiter);

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerlens';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/roadmap', require('./routes/roadmap'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/recruiter', require('./routes/recruiter'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/message', require('./routes/message'));

app.get('/', (req, res) => {
    res.send('CareerLens AI API is running secure...');
});

// Centralized Error Handler
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
