export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    salesTax: number;
    agriType: string;
    pictureUrl: string;
    quantity: number;
}

export interface ProductParams {
    pageNumber: number;
    pageSize: number;
    search?: string;
    sort: string;
    agritypes: string[];
}