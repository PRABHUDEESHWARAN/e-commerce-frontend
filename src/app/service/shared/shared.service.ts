import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }
  private activeProductSubject=new BehaviorSubject<string>('');
  activeProduct$=this.activeProductSubject.asObservable();
  private activeUserSubject=new BehaviorSubject<string>('');
  activeUser$=this.activeUserSubject.asObservable();

  setActiveProductTool(product:string){
      this.activeProductSubject.next(product);
  }
  resetActiveProduct(){
    this.activeProductSubject.next('');
  }
  setActiveUserTool(user:string){
      this.activeProductSubject.next(user);
  }
  resetActiveUser(){
    this.activeProductSubject.next('');
  }
}