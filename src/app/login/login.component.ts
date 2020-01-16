import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService:AuthenticationService,
              private router:Router) { }

  ngOnInit() {
  }

  onLogin(data) {
    console.log(data);
    this.authService.login(data).subscribe(resp=>{
      let jwt = resp.headers.get('authorization');
      this.authService.saveToken(jwt);
      this.router.navigateByUrl('/');
    }, err=>{
      console.log(err);
    });
  }
  isAdmin(){
    return this.authService.isAdmin();
  }
  isUser(){
    return this.authService.isUser();
  }
}
