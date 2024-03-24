import { Product } from "../Product";
import { OrderItem } from "./OrderItem";

export interface OrderItemDetails{
    product:Product,
    orderItem:OrderItem
}