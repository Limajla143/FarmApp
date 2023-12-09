import { Basket } from "./basket";

export interface User {
    email: string;
    token: string;
    username: string;
    basket?: Basket;
    statusId: number;
    role?: string[];
}