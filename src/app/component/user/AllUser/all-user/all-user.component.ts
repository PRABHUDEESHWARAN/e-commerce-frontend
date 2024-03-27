import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/model/Customer';
import { NotifyService } from 'src/app/service/notify.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-all-user',
  templateUrl: './all-user.component.html',
  styleUrls: ['./all-user.component.css']
})
export class AllUserComponent implements OnInit{
constructor(private router:Router,private notify:NotifyService,private userService:UserService){}
users:Customer[]=[]
ngOnInit(): void {
  this.userService.getAllUsers().subscribe({
    next:(res)=>{
      this.users=res;
      this.notify.showSuccess("User Data Loaded Successfully!","CarStore");
    },
    error:(err)=>{
      console.log(err);
      
    }
  })
  
}

}
