require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const startScheduler = require('./scheduler/eventScheduler');

const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Scheduler
startScheduler();

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Root route for API status
app.get('/api/health', (req, res) => {
    res.send('API is healthy');
});

// SERVE FRONTEND IN PRODUCTION
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Sydney Events API is running. Please visit the frontend URL for the web platform.');
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
