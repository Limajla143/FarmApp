export interface BasketItem {
    id: number;
    name: string;
    description: string;
    price: number;
    pictureUrl: string;
    types: string;
    quantity: number;
}

export interface Basket {
    id: string;
    items: BasketItem[];
    paymentIntentId?: string;
    clientSecret?: string;
    deliveryMethodId?: string;
}