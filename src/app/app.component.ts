import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private router:Router, private authService:AuthenticationService){}
  ngOnInit(): void {
    this.authService.loadToken();
  }
  title = 'MediaVideoFront';
  isAdmin(){
    return this.authService.isAdmin();
  }
  isUser(){
    return this.authService.isUser();
  }
  isAuthenticated(){
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
  }
}
