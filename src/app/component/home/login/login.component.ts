import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { NotifyService } from 'src/app/service/notify.service';
import { UserService } from 'src/app/service/user/user.service';
import { Login } from 'src/app/model/Login';
import { User } from 'src/app/model/User';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notify: NotifyService,
    private userService:UserService,
    private fb: FormBuilder
  ) {}
  usernameError: string = '';

  loginForm: FormGroup = this.fb.group({
    username: ['',[Validators.required,Validators.nullValidator,Validators.minLength(3),Validators.pattern('[A-Za-z ]{3,}')]],
    password: ['',[Validators.required,Validators.minLength(6),Validators.pattern('^(?=.*\\d)[0-9a-zA-Z@#$%]{6,}$')]],
  });
 
  ngOnInit() {
    this.authService.isLoggedIn().subscribe((res) => {
      this.authService.isAuthenticated = res.valid;
      this.authService.isAdmin = res.role == 'ADMIN' ? true : false;
      if (this.authService.isAuthenticated && this.authService.isAdmin) {
        this.router.navigate(['admin/dashboard']);
      } else if (this.authService.isAuthenticated) {
        this.router.navigate(['products']);
      }
    });
  }

  loginUser(form: FormGroup) {
    this.authService.loginUser(form.value).subscribe((res) => {
      localStorage.setItem('TOKEN', res.token);
      this.authService.isAuthenticated = res.token ? true : false;
      console.log(res.role);
      console.log(this.authService.isAuthenticated);

      if (this.authService.isAuthenticated && res.role == 'ADMIN') {
        this.authService.isAdmin = true;
        this.router.navigate(['admin/dashboard']);
        this.notify.showSuccess(
          `Welcome ${form.value['username']}!`,
          'E-Commerce'
        );
      } else if (this.authService.isAuthenticated && res.role == 'USER') {
        console.log('came here');

        this.router.navigate(['products']);
        this.notify.showSuccess(
          `Welcome ${form.value['username']}!`,
          'E-Commerce'
        );
      } else {
        this.notify.showError(
          'Error in your username or password',
          'E-Commerce'
        );
      }
    });
  }
}
