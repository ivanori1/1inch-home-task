import { Given, When, Then } from "@cucumber/cucumber";
import { TestContext } from "../../testContext";
import { UserService } from "../models/user";
import { OrderService } from "../models/order";
import { UserResponse } from "../interfaces/user";
import { Order, OrderResponse } from "../interfaces/order";

Given('the User Service is available at {string}', async function (this: TestContext, url: string) {
    // Store the User Service base URL for later use
    this.userServiceBaseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    this.logger.info(`User Service base URL set to: ${this.userServiceBaseUrl}`);
});

Given('the Order Service is available at {string}', async function (this: TestContext, url: string) {
    // Store the Order Service base URL for later use
    this.orderServiceBaseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    this.logger.info(`Order Service base URL set to: ${this.orderServiceBaseUrl}`);
});

Given('a user with id {string} exists', async function (this: TestContext, userId: string) {
    // Store the user ID for later use in the scenario
    this.setNote("userId", userId);
    this.logger.info(`User ID ${userId} stored for use in scenario`);
});

When('the client retrieves user {string}', async function (this: TestContext, userId: string) {
    // Strict assertion: Verify API Request Context is available
    if (!this.apiRequestContext) {
        throw new Error("API Request Context is not initialized. Please check hooks configuration.");
    }
    
    // Create UserService instance and retrieve user
    const userService = new UserService(this, this.apiRequestContext, this.userServiceBaseUrl);
    await userService.getUserById(parseInt(userId, 10));
    
    // Store the response data as user response for later validation
    this.setNote("userResponse", this.responseData);
});

When('the client retrieves active orders for user {string}', async function (this: TestContext, userId: string) {
    // Strict assertion: Verify API Request Context is available
    if (!this.apiRequestContext) {
        throw new Error("API Request Context is not initialized. Please check hooks configuration.");
    }
    
    // Create OrderService instance and retrieve active orders
    const orderService = new OrderService(this, this.apiRequestContext, this.orderServiceBaseUrl);
    await orderService.getActiveOrdersByUserId(parseInt(userId, 10));
    
    // Store the response data as orders response for later validation
    this.setNote("ordersResponse", this.responseData);
});

When('the client creates a new order for user {string} with amount {string}', async function (
    this: TestContext,
    userId: string,
    amount: string
) {
    // Strict assertion: Verify API Request Context is available
    if (!this.apiRequestContext) {
        throw new Error("API Request Context is not initialized. Please check hooks configuration.");
    }
    
    // Create OrderService instance and create a new order
    const orderService = new OrderService(this, this.apiRequestContext, this.orderServiceBaseUrl);
    await orderService.createOrder(parseInt(userId, 10), parseFloat(amount));
    
    // Store the response data as order response for later validation
    this.setNote("orderResponse", this.responseData);
});

Then('the user response should have status HTTP {int} and fields {string}, {string}, {string}', async function (
    this: TestContext,
    expectedStatus: number,
    field1: string,
    field2: string,
    field3: string
) {
    // Get the stored user response
    const userResponse = this.getNote("userResponse") as UserResponse;
    
    // Strict assertion: Verify response exists
    if (!this.lastResponse) {
        throw new Error("No response available. Please make a request first.");
    }
    
    // Strict assertion: Verify HTTP status code matches expected value
    const actualStatus = this.lastResponse.status();
    this.softAssert.assertEquals(
        actualStatus,
        expectedStatus,
        `Expected HTTP status ${expectedStatus}, but got ${actualStatus}`
    );
    
    // Strict assertion: Verify response data exists
    this.softAssert.assertNotNull(
        userResponse,
        "User response data should not be null"
    );
    
    // Clean field names (remove quotes if present)
    const fields = [field1, field2, field3].map(f => f.trim().replace(/"/g, ""));
    
    // Strict assertion: Verify each required field exists in the response
    fields.forEach(field => {
        this.softAssert.assertNotNull(
            (userResponse as any)[field],
            `User response should contain field "${field}"`
        );
    });
    
    // Strict assertion: Verify field types match expected interface
    if (userResponse) {
        // Assert id is a number
        this.softAssert.assertTrue(
            typeof userResponse.id === "number",
            `Field "id" should be a number, but got ${typeof userResponse.id}`
        );
        
        // Assert name is a string
        this.softAssert.assertTrue(
            typeof userResponse.name === "string",
            `Field "name" should be a string, but got ${typeof userResponse.name}`
        );
        
        // Assert email is a string
        this.softAssert.assertTrue(
            typeof userResponse.email === "string",
            `Field "email" should be a string, but got ${typeof userResponse.email}`
        );
        
        // Assert email format is valid (contains @)
        this.softAssert.assertTrue(
            userResponse.email.includes("@"),
            `Field "email" should be a valid email address, but got ${userResponse.email}`
        );
    }
});

Then('the order response should have status HTTP {int} and fields {string}, {string}, {string} in the response', async function (
    this: TestContext,
    expectedStatus: number,
    field1: string,
    field2: string,
    field3: string
) {
    // Get the stored order response
    const orderResponse = this.getNote("orderResponse") as OrderResponse;
    
    // Strict assertion: Verify response exists
    if (!this.lastResponse) {
        throw new Error("No response available. Please make a request first.");
    }
    
    // Strict assertion: Verify HTTP status code matches expected value
    const actualStatus = this.lastResponse.status();
    this.softAssert.assertEquals(
        actualStatus,
        expectedStatus,
        `Expected HTTP status ${expectedStatus}, but got ${actualStatus}`
    );
    
    // Strict assertion: Verify response data exists
    this.softAssert.assertNotNull(
        orderResponse,
        "Order response data should not be null"
    );
    
    // Clean field names (remove quotes if present)
    const fields = [field1, field2, field3].map(f => f.trim().replace(/"/g, ""));
    
    // Strict assertion: Verify each required field exists in the response
    fields.forEach(field => {
        this.softAssert.assertNotNull(
            (orderResponse as any)[field],
            `Order response should contain field "${field}"`
        );
    });
    
    // Strict assertion: Verify field types match expected interface
    if (orderResponse) {
        // Assert orderId is a number
        this.softAssert.assertTrue(
            typeof orderResponse.orderId === "number",
            `Field "orderId" should be a number, but got ${typeof orderResponse.orderId}`
        );
        
        // Assert orderId is positive
        this.softAssert.assertTrue(
            orderResponse.orderId > 0,
            `Field "orderId" should be a positive number, but got ${orderResponse.orderId}`
        );
        
        // Assert userId is a number
        this.softAssert.assertTrue(
            typeof orderResponse.userId === "number",
            `Field "userId" should be a number, but got ${typeof orderResponse.userId}`
        );
        
        // Assert amount is a number
        this.softAssert.assertTrue(
            typeof orderResponse.amount === "number",
            `Field "amount" should be a number, but got ${typeof orderResponse.amount}`
        );
        
        // Assert amount is positive
        this.softAssert.assertTrue(
            orderResponse.amount > 0,
            `Field "amount" should be a positive number, but got ${orderResponse.amount}`
        );
    }
});

// Shared validation logic for order response
function validateOrderResponse(
    context: TestContext,
    expectedOrderId: number | null,
    expectedUserId: number,
    expectedAmount: number
): void {
    // Check if we have a single order response (from creating order) or orders list (from getting orders)
    const orderResponse = context.getNote("orderResponse") as OrderResponse | undefined;
    const ordersResponse = context.getNote("ordersResponse");
    
    let foundOrder: Order | undefined;
    
    // If we have a single order response (from POST /orders)
    if (orderResponse) {
        foundOrder = orderResponse as Order;
    } 
    // If we have orders list (from GET /orders)
    else if (ordersResponse) {
        // Strict assertion: Verify orders response exists
        context.softAssert.assertNotNull(
            ordersResponse,
            "Orders response data should not be null"
        );
        
        // Strict assertion: Verify response is an array
        context.softAssert.assertTrue(
            Array.isArray(ordersResponse),
            `Orders response should be an array, but got ${typeof ordersResponse}`
        );
        
        if (!Array.isArray(ordersResponse)) {
            return;
        }
        
        // If orderId is provided, find by orderId; otherwise just get first order
        if (expectedOrderId !== null) {
            foundOrder = ordersResponse.find((order: Order) => order.orderId === expectedOrderId);
            // Strict assertion: Verify order exists in the list
            context.softAssert.assertNotNull(
                foundOrder,
                `Order with orderId ${expectedOrderId} should exist in the orders list`
            );
        } else {
            // For orders list without specific orderId, we'd need to match by userId and amount
            foundOrder = ordersResponse.find(
                (order: Order) => order.userId === expectedUserId && Math.abs(order.amount - expectedAmount) < 0.01
            );
            context.softAssert.assertNotNull(
                foundOrder,
                `Order with userId ${expectedUserId} and amount ${expectedAmount} should exist in the orders list`
            );
        }
    } else {
        throw new Error("No order response or orders response available. Please make a request first.");
    }
    
    if (!foundOrder) {
        return;
    }
    
    // Strict assertion: Verify orderId (if expected)
    if (expectedOrderId !== null) {
        context.softAssert.assertEquals(
            foundOrder.orderId,
            expectedOrderId,
            `Order orderId should be ${expectedOrderId}, but got ${foundOrder.orderId}`
        );
    } else {
        // For newly created orders, just verify orderId exists and is positive
        context.softAssert.assertTrue(
            foundOrder.orderId > 0,
            `Order orderId should be a positive number, but got ${foundOrder.orderId}`
        );
    }
    
    // Strict assertion: Verify userId matches expected value
    context.softAssert.assertEquals(
        foundOrder.userId,
        expectedUserId,
        `Order userId should be ${expectedUserId}, but got ${foundOrder.userId}`
    );
    
    // Strict assertion: Verify amount matches expected value (with tolerance for floating point)
    context.softAssert.assertTrue(
        Math.abs(foundOrder.amount - expectedAmount) < 0.01,
        `Order amount should be ${expectedAmount}, but got ${foundOrder.amount}`
    );
}

Then('the orders response should be orderId {int}, userId {int} and amount {float}', async function (
    this: TestContext,
    expectedOrderId: number,
    expectedUserId: number,
    expectedAmount: number
) {
    validateOrderResponse(this, expectedOrderId, expectedUserId, expectedAmount);
});

Then('the orders list should be empty', async function (this: TestContext) {
    // Get the stored orders response
    const ordersResponse = this.getNote("ordersResponse");
    
    // Strict assertion: Verify orders response exists
    this.softAssert.assertNotNull(
        ordersResponse,
        "Orders response data should not be null"
    );
    
    // Strict assertion: Verify response is an array
    this.softAssert.assertTrue(
        Array.isArray(ordersResponse),
        `Orders response should be an array, but got ${typeof ordersResponse}`
    );
    
    // Strict assertion: Verify array is empty
    if (Array.isArray(ordersResponse)) {
        this.softAssert.assertEquals(
            ordersResponse.length,
            0,
            `Orders list should be empty, but got ${ordersResponse.length} orders`
        );
    }
});

