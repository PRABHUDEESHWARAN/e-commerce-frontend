import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrderResponse } from 'src/app/model/order/OrderResponse';
import { NotifyService } from 'src/app/service/notify.service';
import { OrderService } from 'src/app/service/order/order.service';
import { ActivatedRoute } from '@angular/router';
import { data } from 'src/assets/data';
import { OrderItemDetails } from 'src/app/model/order/orderItemDetails';
import { ProductsService } from 'src/app/service/products.service';
import { productData } from 'src/assets/productData';
import { Address } from 'src/app/model/Address';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  

  constructor(private router:Router,private notify:NotifyService,private orderService:OrderService,private route:ActivatedRoute,private productService:ProductsService){

  }
  orderResponse?:OrderResponse;
  value:string=''
  Exdata=data;
  ExPData=productData;
  orderItemDetails:OrderItemDetails[]=[]
  customerId:number=0;
  addressData:Address={
    addressId:0,
    customerId:0,
    doorNo:0,
    city:'',
    state:'',
    pincode:0
  }
  ngOnInit() {
    this.customerId=parseInt(this.route.snapshot.paramMap.get('customerId')?? '',10);
    this.orderService.createOrder(this.customerId).subscribe({
      next:(res)=>{
        this.orderResponse=res;
        this.orderResponse.order.orderItem.map((data,_index)=>{
          const tempProduct=this.productService.getProduct(data.productId).subscribe({
            next:(res)=>{
              let orderItemData:OrderItemDetails={
                orderItem:data,
                product:res
              }
              this.orderItemDetails.push(orderItemData);
            },
            error:(err)=>{
              this.notify.showError("Error Fetching Details","E-Commerce");
            }
          })
          
        })
        console.log('came here');
        console.log(this.orderResponse);
        
      },
      error:(err)=>{
        console.log(err);
        
        this.notify.showError("Cannot create Order","E-Commerce");
        
      }
    })
  }
  handleAddressSave(){
    this.orderResponse!.order.address=this.addressData;
  }

}
