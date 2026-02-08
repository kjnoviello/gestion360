export interface Client {
    id: string;
    name: string;
    phone: string;
    company?: string;
    address?: string;
    createdAt: number;
}