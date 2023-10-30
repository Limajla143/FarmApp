import { Address } from "./Address";

export interface ShippingAddress extends Address {  }

export interface OrderItem {
    id: number;
    name: string;
    pictureUrl: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: number;
    buyer: string;
    orderDate: string;
    shipToAddress: ShippingAddress;
    deliveryMethod: number;
    orderItems: OrderItem[];
    subtotal: number;
    orderStatus: string;
    total: number;
}