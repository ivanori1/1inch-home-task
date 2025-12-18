/**
 * Order Service API Response Interfaces
 */

export interface Order {
    orderId: number;
    userId: number;
    amount: number;
}

export interface OrderResponse extends Order {}

export interface CreateOrderRequest {
    userId: number;
    amount: number;
}


