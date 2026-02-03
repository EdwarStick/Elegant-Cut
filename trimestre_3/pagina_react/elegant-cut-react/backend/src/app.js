const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Auth routes at root level for frontend compatibility
app.use('/auth', authRoutes);

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API de Barbería Elegant Cut - Sistema Consolidado',
        version: '2.0.0',
        endpoints: {
            auth: '/auth',
            api: '/api',
            health: '/api/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

// Error handler (debe ser el último middleware)
app.use(errorHandler);

module.exports = app;
