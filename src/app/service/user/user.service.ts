import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from 'src/app/model/Address';
import { Customer } from 'src/app/model/Customer';
import { Profile } from 'src/app/model/Profile';
import { Order } from 'src/app/model/order/Order';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient) { }
  baseURL = `http://localhost:8080`;



  //get user details as profile {userId,firstname,lastname,username,role,mobile,email,customerId,address,cartid}

  getUserProfile():Observable<Profile>{
    console.log('came here');
    
    return this.httpClient.get<Profile>(`${this.baseURL}/profile`,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('TOKEN')}`
      },
      params:{
        token: localStorage.getItem('TOKEN')|| '',
      }
      
    });
  }

  getUserAddress(customerId:number):Observable<Address[]>{
    return this.httpClient.post<Address[]>(`${this.baseURL}/api/customer/addresses/${customerId}`,null,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('TOKEN')}`
      },
      
      
    })
  }

  getUserOrders(customerId:number):Observable<Order[]>{
    return this.httpClient.get<Order[]>(`${this.baseURL}/api/order/all/${customerId}`,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('TOKEN')}`
      }
    })
  }


  deleteUser(customerId:number):Observable<string>{
    return this.httpClient.delete(`${this.baseURL}/api/customer/${customerId}`,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem('TOKEN')}`
      },responseType:'text'
    })
  }
  getAllUsers():Observable<Customer[]>{
    return this.httpClient.get<Customer[]>(`${this.baseURL}/api/customer/all`,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('TOKEN')}`
      }
    })
  }

}
