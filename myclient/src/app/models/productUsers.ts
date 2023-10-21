export interface ProductUsers {
    id: number;
    name: string;
    description: string;
    price: number;
    agriType: string;
    pictureUrl: string;
    quantity: number;
}

export interface ProductUsersParams {
    pageNumber: number;
    pageSize: number;
    search?: string;
    sort: string;
    types: string[];
}