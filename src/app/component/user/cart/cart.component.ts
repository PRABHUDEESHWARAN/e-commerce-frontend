import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Cart } from 'src/app/model/cart';
import { AuthService } from 'src/app/service/auth.service';
import { CartService } from 'src/app/service/cart/cart.service';
import { of } from 'rxjs';
import { UserService } from 'src/app/service/user/user.service';
import { NotifyService } from 'src/app/service/notify.service';
import { CartItem } from 'src/app/model/CartItem';
import { CartItemDetails } from 'src/app/model/CartItemDetails';
import { ProductsService } from 'src/app/service/products.service';
import { Product } from 'src/app/model/Product';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  constructor(
    private router: Router,
    private authservice: AuthService,
    private cartService: CartService,
    private userService: UserService,
    private notify: NotifyService,
    private productService:ProductsService
  ) {}
  // cart data holder
  cartData?: Cart;
  cartItems:CartItem[]=[];
  cartItemDetails:CartItemDetails[]=[];
  customerId: number = 0;
  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (res) => {
        this.customerId = res.customerId;
        this.cartService.getCartData(this.customerId).subscribe({
          next: (res) => {
            console.log(res);
            this.cartData = res;
            this.cartItems=res.cartItems;
            //get product details and add to cartItemDetails
            this.cartItems.map((data,_value)=>{
              console.log("here");
              this.productService.getProduct(data.productId).subscribe({
                next:(res)=>{
                  console.log("came in");
                  console.log(res);
                  let cartDetail: CartItemDetails = {
                    product: res,
                    index: _value+1,
                    cartItemId:data.id,
                    quantity: data.quantity,
                    totalPrice: data.totalPrice
                  };
                  if(cartDetail.quantity!=0)this.cartItemDetails?.push(cartDetail);
                },
                error:(err)=>{
                  console.log(err);
                  this.notify.showError('Cannot Load Products in CartItems', 'E-Commerce');
                  
                }
              })
              
            })
            this.cartItemDetails = this.cartItemDetails.sort((a, b) => {
              if (a.cartItemId && b.cartItemId) {
                return a.cartItemId - b.cartItemId;
              }
              return 0;
            });

            console.log(Cart);
            
          },
          error: (err) => {
            
            this.notify.showError('Cannot get Cart', 'E-Commerce');
          },
        });
      },
      error: (err) => {
        this.notify.showError('Cannot Load Customer Profile', 'E-Commerce');
      },
    });
  }
  
  removeCartItem(cartItemId:number){
    this.cartService.removeCartItem(cartItemId).subscribe({
      next:(res)=>{
        this.notify.showSuccess(res,"E-Commerce");
        console.log(res);
        this.cartItemDetails=this.cartItemDetails.filter((data)=>{data.cartItemId!=cartItemId});
        this.ngOnInit()
      },
      error:(err)=>{
        console.log("errer here");
        console.log(err);
        
        
        this.notify.showError("Error removing CartItem","E-Commerce");
        
      }
    })


  }
  handlePlus(productId:number){
    this.cartService.addToCart(productId,this.cartData!.id).subscribe({
      next:(res)=>{
        this.cartData=res;
        this.cartItemDetails.filter((data)=>(data.product?.id==productId)).forEach((p)=>{
          p.quantity!+=1;
          p.totalPrice=p.quantity!*p.product!.price;
        });
        
      },
      error:(err)=>{
        this.notify.showError("Error Updating Cart","CarStore");
      }
    })
  }
  handleMinus(cartItemId:number,productId:number){
    this.cartService.reduceCartItem(cartItemId).subscribe({
      next:(res)=>{
        console.log("now here");
        
        console.log(res);
        
        // this.cartData=res;
        // this.cartItemDetails.filter((data)=>(data.cartItemId==cartItemId && data.quantity!=1)).map((p)=>{
        //   p.quantity!-=1;
        //   p.totalPrice=p.quantity!*p.product!.price;
        //   return p;
        // });
        this.cartItemDetails=[]
        this.ngOnInit();
      },
      error:(err)=>{
        this.notify.showError("Cannot reduce CartItem","CarStore");
      }
    })

  }

  handleCheckout(customerId:number){
   this.router.navigate(['user/order',customerId],);
  }
}
