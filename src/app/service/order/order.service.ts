import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from 'src/app/model/Address';
import { Order } from 'src/app/model/order/Order';
import { OrderResponse } from 'src/app/model/order/OrderResponse';
import { confirmOrderReq } from 'src/app/model/order/confirmOrderReq';
import { TransactionDetails } from 'src/app/model/payment/TransactionDetails';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpClient: HttpClient) {}
  baseURL = `http://localhost:8080`;

  createOrder(customerId: number): Observable<OrderResponse> {
    console.log('camere here');

    return this.httpClient.post<OrderResponse>(
      `${this.baseURL}/api/order/new/${customerId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
        },
      }
    );
  }
  saveAddress(orderId: number, newAddress: any): Observable<Order> {
    console.log('camere here');

    return this.httpClient.post<Order>(
      `${this.baseURL}/api/order/address/${orderId}`,
      newAddress,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
        },
      }
    );
  }

  createTransaction(orderId: number): Observable<TransactionDetails> {
    return this.httpClient.get<TransactionDetails>(
      `${this.baseURL}/api/payment/transaction/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
        },
      }
    );
  }

  confirmOrder(confirmOrderReq:confirmOrderReq):Observable<Order>{
    return this.httpClient.put<Order>(`${this.baseURL}/api/order/confirm`,confirmOrderReq,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem("TOKEN")}`
      }
    })
  }

  getOrderById(orderId:number):Observable<Order>{
    return this.httpClient.get<Order>(`${this.baseURL}/api/order/${orderId}`,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem("TOKEN")}`
      }
    })
  }

  cancelOrder(orderId:number):Observable<Order>{
    return this.httpClient.patch<Order>(`${this.baseURL}/api/order/cancel/${orderId}`,null,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem("TOKEN")}`
      }
    })
  }
}
