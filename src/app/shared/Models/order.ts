import { OrderItems } from "./orderItems";

export interface Order {
    name: string;
    email: string;
    state: string;
    city: string;
    street: string;
    phone: string;
    total: number;
    items: OrderItems[];
}
