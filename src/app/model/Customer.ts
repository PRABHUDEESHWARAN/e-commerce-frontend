import { Address } from "./Address";
import { Order } from "./order/Order";

export interface Customer{
    id:number,
    userId:number,
    firstname:string,
    lastname:string,
    email:string,
    password:string,
    mobileNo:number,
    address:Address[],
    cartId:number,
    isLoggedIn:boolean,
    customerOrders:Order[]
}