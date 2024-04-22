import { ProductHistory } from "./product-history";

export interface OrderHistory {
    orderId:number;
    orderDate:Date;
    orderTotal:number;
    orderStatus:string;
    deliverystatus:string;
    products:ProductHistory[];
}
