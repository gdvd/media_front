import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {urlwebsite} from '../environments/dataProject';
import {CatalogueService} from './catalogue.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // public portBO = '8086';

  host: string = 'http://'+urlwebsite.urllocal+':'+ urlwebsite.portBO;
  jwt: string;
  userName: string;
  roles: Array<string>;

  constructor(private http: HttpClient) {
  }

  login(data) {
    console.log(this.host + '/login');
    console.log(data);
    return this.http.post(this.host + '/login', data,
      {observe: 'response'});
  }

  saveToken(jwt: string) {
    localStorage.setItem('token', jwt);
    this.jwt = jwt;
    this.parseJWT();
  }

  parseJWT() {
    let jwtHelper = new JwtHelperService();
    let objJWT = jwtHelper.decodeToken(this.jwt);
    this.userName = '';
    this.userName = objJWT.obj;
    this.roles = [];
    this.roles = objJWT.roles;
  }

  isAdmin() {
    return this.roles.indexOf('ADMIN') >= 0;
  }

  isUser() {
    return this.roles.indexOf('USER') >= 0;
  }

  isAuthenticated() {
    return this.roles && (this.isAdmin() || this.isUser());
  }

  loadToken() {
    this.jwt = localStorage.getItem('token');
    if (this.jwt) {
      this.parseJWT();
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.initParams();
  }

  initParams() {
    this.jwt = undefined;
    this.userName = undefined;
    this.roles = [];
  }
}
