# API Testing Exercise - User Checkout Flow

This project demonstrates API testing using Playwright API Testing with Cucumber BDD framework. It includes mock services running in Docker containers.

## Project Structure

```
checkout-flow-exercise/
├── api/
│   ├── config/          # Cucumber configuration and hooks
│   ├── constants.ts      # Test constants
│   ├── features/         # Gherkin feature files
│   ├── interfaces/       # TypeScript interfaces for API responses
│   ├── models/           # Service models (UserService, OrderService)
│   └── steps/            # Step definitions
├── core/
│   ├── clients/          # HTTP client using Playwright
│   ├── enums/            # Enumerations
│   └── utils/            # Utility classes (Logger, SoftAssert)
├── mock-services/        # Docker-based mock services
│   ├── user-service/     # User Service mock
│   └── order-service/     # Order Service mock
├── test-results/         # Test execution results (.gitignore)
├── docker-compose.yml     # Docker Compose configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start mock services:**
   ```bash
   npm run docker:up
   ```
   
   This will start:
   - User Service on `http://localhost:3001`
   - Order Service on `http://localhost:3002`

3. **Verify services are running:**
   ```bash
   # Check User Service
   curl http://localhost:3001/users/1
   
   # Check Order Service
   curl http://localhost:3002/orders?userId=1
   
   # Or check health endpoints
   curl http://localhost:3001/health
   curl http://localhost:3002/health
   ```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests with specific tags:
```bash
npm run test:wip
```

## Test Scenarios

The project includes the following test scenarios:

1. **Get User Information**
   - Retrieves user information by ID
   - Retrieves active orders for the user
   - Validates response status and required fields

2. **Place a new order**
   - Creates a new order for a user
   - Validates response status and required fields

3. **Get orders information** (Scenario Outline)
   - Retrieves active orders for a user
   - Validates specific orders exist with correct orderId, userId, and amount
   - Uses Examples table to test multiple orders

4. **Get orders for non-existent user** (Negative test case)
   - Retrieves orders for a user that doesn't exist
   - Validates that an empty array is returned

## Features

- **Strict Assertions**: All assertions include detailed comments explaining what is being validated
- **Interface-based Validators**: TypeScript interfaces ensure type safety and structure validation
- **Playwright API Testing**: Uses Playwright's APIRequestContext for HTTP requests
- **Cucumber BDD**: Gherkin feature files for readable test scenarios
- **Scenario Outline**: Uses Examples tables for data-driven testing
- **Negative Test Cases**: Includes tests for error scenarios and edge cases
- **Docker Mock Services**: Isolated mock services running in Docker containers
- **Soft Assertions**: Collects multiple assertion failures before throwing errors

## Mock Services

### User Service (Port 3001)

- `GET /users/:id` - Retrieve user information
- `GET /health` - Health check endpoint

### Order Service (Port 3002)

- `GET /orders?userId=:id` - Retrieve active orders for a user
- `POST /orders` - Create a new order
- `GET /health` - Health check endpoint

## Stopping Services

To stop the mock services:
```bash
npm run docker:down
```

To view service logs:
```bash
npm run docker:logs
```

## Environment Variables

You can override service URLs using environment variables:

- `USER_SERVICE_URL` - Default: `http://localhost:3001`
- `ORDER_SERVICE_URL` - Default: `http://localhost:3002`

Create a `.env` file in the root directory to set these values.

## Test Results

Test results are generated in the `test-results/` directory:
- `cucumber-report.html` - HTML test report
- `cucumber-report.json` - JSON test report
- `cucumber-report.xml` - JUnit XML report

## Notes

- All assertions include comments explaining what is being validated
- The HTTP client uses Playwright's APIRequestContext for making requests
- Soft assertions allow multiple validations to run before failing
- Mock services are lightweight Express.js applications running in Alpine Linux containers


