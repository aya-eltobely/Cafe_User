export interface Cart {
    productId:number;
    productName:string;
    productPrice:number;
    quantity:number;
    subTotal:number;
    contentType?:string;
    imageData?:string;
    fileName?:string;
}
