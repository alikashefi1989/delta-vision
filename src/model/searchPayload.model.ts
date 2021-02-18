export interface ISearchPayload {
    pagination?: {
        page: number; // start from 0
        limit: number;
    };
    sort?: {
        [key: string]: 1 | -1;
    };
    filter?: {};
    search?: string;
}