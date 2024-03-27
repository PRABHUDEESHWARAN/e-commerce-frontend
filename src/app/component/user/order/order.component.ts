import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { TransactionDetails } from 'src/app/model/payment/TransactionDetails';
import { confirmOrderReq } from 'src/app/model/order/confirmOrderReq';
import jsPDF from 'jspdf';
import { NgZone } from '@angular/core';
import { UserService } from 'src/app/service/user/user.service';
declare var Razorpay: any;
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit, OnDestroy{
  constructor(
    private router: Router,
    private notify: NotifyService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private productService: ProductsService,
    private ngZone: NgZone,
    private userService:UserService

  ) {
    this.isStatus=false;
  }
  isStatus:boolean=false;
  orderResponse?: OrderResponse;
  value: string = '';
  orderItemDetails: OrderItemDetails[] = [];
  customerId: number = 0;
  addressData: Address = {
    addressId: 0,
    customerId: 0,
    doorNo: 0,
    city: '',
    state: '',
    pincode: 0,
  };
  ngOnInit() {
    this.customerId = parseInt(
      this.route.snapshot.paramMap.get('customerId') ?? '',
      10
    );
    this.orderService.createOrder(this.customerId).subscribe({
      next: (res) => {
        this.orderResponse = res;
        this.userService.getUserAddress(this.customerId).subscribe({
          next:(res)=>{
            this.orderResponse!.order.address=res[0]
            
          },
          error:(err)=>{
            this.notify.showError("Cannot load default Address","CarStore");
          }
        })
        this.orderResponse.order.orderItem.map((data, _index) => {
          const tempProduct = this.productService
            .getProduct(data.productId)
            .subscribe({
              next: (res) => {
                let orderItemData: OrderItemDetails = {
                  orderItem: data,
                  product: res,
                };
                this.orderItemDetails.push(orderItemData);
              },
              error: (err) => {
                this.notify.showError('Error Fetching Details', 'E-Commerce');
              },
            });
        });
        console.log('came here');
        console.log(this.orderResponse);
      },
      error: (err) => {
        console.log(err);

        this.notify.showError('Cannot create Order', 'E-Commerce');
      },
    });

    
  }
  ngOnDestroy(): void {
    if(this.orderResponse?.order.orderStatus=="Pending")
    {
      this.orderService.cancelOrder(this.orderResponse!.order.id).subscribe({
        next:(res)=>{
          this.orderResponse?.order.orderStatus!="Failed";
          this.orderResponse?.order.transactionId!="Nil";
        },
        error:(err)=>{
          console.log(err);
          
        }
      })
    }
    
  }

  handleAddressSave(orderId: number) {
    const newAddress = {
      customerId: this.customerId,
      doorNo: this.addressData.doorNo,
      city: this.addressData.city,
      state: this.addressData.state,
      pincode: this.addressData.pincode,
    };
    this.orderService.saveAddress(orderId, newAddress).subscribe({
      next: (res) => {
        this.notify.showSuccess('Address Saved Successfully!', 'CarStore');
        this.orderResponse!.order.address = {
          addressId: res.address.addressId,
          customerId: this.customerId,
          doorNo: this.addressData.doorNo,
          city: this.addressData.city,
          state: this.addressData.state,
          pincode: this.addressData.pincode,
        };
      },
      error: (err) => {
        this.notify.showError('Error Saving Address', 'CarStore');
      },
    });
  }

  placeOrder(orderId: number) {
    this.orderService.createTransaction(orderId).subscribe({
      next: (res) => {
        console.log("here"+res);

        this.openTransactionModel(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openTransactionModel(response: TransactionDetails) {
    this.ngZone.run(() => {
      // Your existing code here
      var options = {
        order_id: response.transactionId,
        key_id: response.key,
        amount: response.amount,
        currency: response.currency,
        name: 'FORD CarStore',
        description: 'Payment for Order',
        image:
          'https://assets.turbologo.com/blog/en/2019/10/19084934/ford-logo-illustration.jpg',
        handler: (res: any) => {
          console.log(res);

          if (res != null && res.razorpay_payment_id != null) {
            this.processResponse(res);
          } else {
            
            this.notify.showError('Payment Failed', 'CarStore');
          }
        },
        prefill: {
          name: 'CarStore 🚗',
          email: 'fordcarstore@gmail.com',
          contact: 9499014212,
        },
        notes: {
          address: 'ELCOT SEZ, Chennai',
        },
        theme: {
          color: '#1A88E6',
        },
      };
      var razorPayObject = new Razorpay(options);
      razorPayObject.open();
    });
  }
  processResponse(resp: any) {
    this.ngZone.run(() => {
      // Your existing code here
      this.orderResponse!.order.transactionId = resp.razorpay_payment_id;
      let confirmData: confirmOrderReq = {
        transactionId: this.orderResponse!.order.transactionId,
        orderId: this.orderResponse!.order.id,
      };
      this.orderService.confirmOrder(confirmData).subscribe({
        next: (res) => {
          if (res != null) {
            this.orderResponse!.order = res;
            this.notify.showSuccess('Order Updated : PAID', 'CarStore');
            this.isStatus=true
            this.router.navigateByUrl('user/order/status');
            
          }
        },
        error: (err) => {
          this.notify.showError('Failed Updating Order', 'CarStore');
        },
      });
    });
  }
}
