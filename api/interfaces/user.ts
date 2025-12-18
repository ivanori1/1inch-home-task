/**
 * User Service API Response Interfaces
 */

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface UserResponse extends User {}


