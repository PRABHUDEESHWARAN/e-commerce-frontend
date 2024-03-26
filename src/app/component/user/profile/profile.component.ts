import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from 'src/app/model/Profile';
import { Order } from 'src/app/model/order/Order';
import { NotifyService } from 'src/app/service/notify.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  constructor(
    private userService: UserService,
    private notify: NotifyService,
    private router: Router
  ) {
    
  }
  

  userProfile?: Profile;
  userOrders?: Order[];
  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (res) => {
        this.userProfile = res;
        this.notify.showSuccess('Profile loaded Successfully', 'CarStore');
        //get user orders
        this.userService.getUserOrders(this.userProfile!.customerId).subscribe({
          next: (res) => {
            this.userOrders = res;
            this.notify.showSuccess('User Order loaded ✔', 'CarStore');
          },
          error: (err) => {
            this.notify.showError('Error Loading User Orders', 'CarStore');
          },
        });
      },
      error: (err) => {
        this.notify.showError('Error Loading User Profile', 'CarStore');
      },
    });
  }

  handleCheckout(orderId:number){
    this.router.navigate(['user/order/view',orderId])
   }
}
