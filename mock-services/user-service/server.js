const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// 🔍 DEBUG: Log all incoming requests
app.use((req, res, next) => {
    console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Mock user data
const users = {
    1: {
        id: 1,
        name: "Ivan",
        email: "ivan@example.com"
    }
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// GET /users/:id - Retrieve user info
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    console.log(`🔍 DEBUG: Someone asked for user ID: ${userId}`);
    
    const user = users[userId];
    console.log(`🔍 DEBUG: Found user:`, user);
    
    if (user) {
        console.log(`✅ DEBUG: Returning user data (200 OK)`);
        res.status(200).json(user);
    } else {
        console.log(`❌ DEBUG: User not found (404)`);
        res.status(404).json({ error: 'User not found' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});