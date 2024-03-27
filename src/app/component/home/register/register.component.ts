import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { NotifyService } from 'src/app/service/notify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notify: NotifyService
  ) {}

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl('',[Validators.required,Validators.maxLength(10)]),
    lastName: new FormControl('',[Validators.required,Validators.maxLength(10)]),
    email: new FormControl('',[Validators.required,Validators.email]),
    mobileNo: new FormControl(null,[Validators.min(10),Validators.required]),
    password: new FormControl('',[Validators.required,Validators.minLength(3),Validators.pattern('^(?=.*\\d)[0-9a-zA-Z@#$%]{6,}$')]),
    role: new FormControl('',[Validators.required]),
    username: new FormControl('',[Validators.required,Validators.nullValidator,Validators.minLength(3),Validators.pattern('[A-Za-z ]{3,}')]),
  });

  registerUser(form: FormGroup) {
    console.log(form.value);
    
    this.authService.registerUser(form.value).subscribe(
      {
        next:(res) => {
          this.router.navigateByUrl('/home/login');
          this.notify.showSuccess(
            'Registration successful, login to continue',
            'E-Commerce'
          );
        },
        error:(error)=>{
          console.log("Inside registration error:")
          console.log(error);
          this.notify.showError("error in registration","Error");
          
        }
        
      }
    );
  
  }
}

// ((res) => {
//   this.router.navigateByUrl('/home/login');
//   this.notify.showSuccess(
//     'Registration successful, login to continue',
//     'E-Commerce'
//   );
// },
// (error)=>{
//   console.log(error);
//   this.notify.showError("error in registration","Error");
  
// }