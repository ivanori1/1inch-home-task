#!/bin/bash

# 🧪 Test Order Service Endpoints
# Order Service runs on http://localhost:3002

echo "=========================================="
echo "🧪 Testing Order Service Endpoints"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. Health Check${NC}"
echo "curl http://localhost:3002/health"
echo ""
curl -s http://localhost:3002/health | jq '.' 2>/dev/null || curl -s http://localhost:3002/health
echo ""
echo ""

echo -e "${BLUE}2. Get Orders for User ID 1${NC}"
echo "curl \"http://localhost:3002/orders?userId=1\""
echo ""
curl -s "http://localhost:3002/orders?userId=1" | jq '.' 2>/dev/null || curl -s "http://localhost:3002/orders?userId=1"
echo ""
echo ""

echo -e "${BLUE}3. Get Orders for Non-existent User (999)${NC}"
echo "curl \"http://localhost:3002/orders?userId=999\""
echo ""
curl -s "http://localhost:3002/orders?userId=999" | jq '.' 2>/dev/null || curl -s "http://localhost:3002/orders?userId=999"
echo ""
echo ""

echo -e "${BLUE}4. Create a New Order${NC}"
echo "curl -X POST http://localhost:3002/orders \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"userId\": 1, \"amount\": 99.99}'"
echo ""
curl -s -X POST http://localhost:3002/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "amount": 99.99}' | jq '.' 2>/dev/null || curl -s -X POST http://localhost:3002/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "amount": 99.99}'
echo ""
echo ""

echo -e "${BLUE}5. Get Orders for User ID 1 Again (to see the new order)${NC}"
echo "curl \"http://localhost:3002/orders?userId=1\""
echo ""
curl -s "http://localhost:3002/orders?userId=1" | jq '.' 2>/dev/null || curl -s "http://localhost:3002/orders?userId=1"
echo ""
echo ""

echo -e "${BLUE}6. Test Error Case - Missing userId${NC}"
echo "curl http://localhost:3002/orders"
echo ""
curl -s http://localhost:3002/orders | jq '.' 2>/dev/null || curl -s http://localhost:3002/orders
echo ""
echo ""

echo "=========================================="
echo "✅ Testing Complete"
echo "=========================================="

