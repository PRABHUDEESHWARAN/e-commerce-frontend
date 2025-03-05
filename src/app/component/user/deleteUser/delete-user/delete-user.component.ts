import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotifyService } from 'src/app/service/notify.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent {
  constructor(private userService:UserService,private notify:NotifyService){}
  deleteForm:FormGroup=new FormGroup({
    id:new FormControl()
  })
  handleDeleteUser(form:FormGroup){
    let text=`Are you sure you want to Delete the User:${form.value['id']} `
    console.log(form.value['id']);
    if(confirm(text)==true)
    {
      this.userService.deleteUser(form.value['id']).subscribe({
        next:(res)=>{
          this.notify.showSuccess("User Deleted Successfully","Info😺")
          this.deleteForm.reset()
        },
        error:(err)=>{
          this.notify.showError("Can't Delete User","Info😿")
          console.log(err.message);
          
        }
  
      })
    }
    
  }
}
