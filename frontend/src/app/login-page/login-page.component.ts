import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service'
import { LoginRequest } from '../models/LoginModels';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl<string>(''),
    password: new FormControl<string>(''),
  });

  constructor(private backendService : BackendService, private router: Router){
  }

  ngOnInit() {
  }

  LoginToBackend(){
    const loginRequest : LoginRequest = this.loginForm.value as LoginRequest;
    this.backendService.LoginRequest(loginRequest).subscribe(
      response => {
        if (response.didSucceed){
          console.log(`Login succeeded!! You have access to GNS3 server.`)
          
          this.backendService.UpdateUsernameAndPassword(loginRequest.username, loginRequest.password)
          this.router.navigate(['/projects'])
        }
      },
      error =>{
        console.log(`Login failed!! You do not have access to GNS3 server.`)
      })
  }

}
