export interface AgriType {
    agriTypeId: number;
    name: string;
}

export interface AgriTypeParams {
    orderBy: string;
    search?: string;
    pageNumber: number;
    pageSize: number;
}