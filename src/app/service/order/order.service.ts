import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse } from 'src/app/model/order/OrderResponse';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) {}
  baseURL = `http://localhost:8080`;



  createOrder(customerId:number):Observable<OrderResponse>{
    console.log('camere here');
    
    return this.httpClient.post<OrderResponse>(`${this.baseURL}/api/order/new/${customerId}`,null,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
      },
    });
  }
}
