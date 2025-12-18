const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// 🔍 DEBUG: Log all incoming requests
app.use((req, res, next) => {
    console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.path}`, req.query);
    next();
});

// Mock order data - active orders by userId
const orders = {
    1: [
        {
            orderId: 1,
            userId: 1,
            amount: 49.99
        }
    ]
};

// Calculate nextOrderId dynamically based on existing orders
function calculateNextOrderId() {
    let maxOrderId = 0;
    for (const userId in orders) {
        if (Array.isArray(orders[userId])) {
            orders[userId].forEach(order => {
                if (order.orderId > maxOrderId) {
                    maxOrderId = order.orderId;
                }
            });
        }
    }
    return maxOrderId + 1;
}

// Counter for new order IDs - calculated dynamically
let nextOrderId = calculateNextOrderId();
console.log(`🔍 DEBUG: Initialized nextOrderId to ${nextOrderId} based on existing orders`);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// GET /orders?userId=:id - Retrieve active orders for a user
app.get('/orders', (req, res) => {
    const userId = parseInt(req.query.userId);
    console.log(`🔍 DEBUG: Someone asked for orders for user ID: ${userId}`);
    
    if (!userId) {
        console.log(`❌ DEBUG: Missing userId parameter (400 Bad Request)`);
        return res.status(400).json({ error: 'userId query parameter is required' });
    }
    
    const userOrders = orders[userId] || [];
    console.log(`🔍 DEBUG: Found ${userOrders.length} orders:`, userOrders);
    console.log(`✅ DEBUG: Returning orders (200 OK)`);
    res.status(200).json(userOrders);
});

// POST /orders - Create a new order
app.post('/orders', (req, res) => {
    const { userId, amount } = req.body;
    console.log(`🔍 DEBUG: Someone wants to create an order`);
    console.log(`🔍 DEBUG: Request body:`, { userId, amount });
    
    // Validate request body
    if (!userId || amount === undefined) {
        console.log(`❌ DEBUG: Missing required fields (400 Bad Request)`);
        return res.status(400).json({ error: 'userId and amount are required' });
    }
    
    // Create new order
    const newOrder = {
        orderId: nextOrderId++,
        userId: userId,
        amount: amount
    };
    console.log(`🔍 DEBUG: Creating new order:`, newOrder);
    
    // Add to orders list for the user
    if (!orders[userId]) {
        orders[userId] = [];
    }
    orders[userId].push(newOrder);
    
    console.log(`✅ DEBUG: Order created successfully (200 OK)`);
    res.status(200).json(newOrder);
});

// Start server
app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});


