export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationMeta;
}