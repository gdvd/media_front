import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {HttpClient} from '@angular/common/http';
import {CatalogueService} from './catalogue.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private httpClient: HttpClient,
              private router: Router,
              private authService: AuthenticationService,
              private catalogueService: CatalogueService,
              private activatedRoute: ActivatedRoute,
              @Inject(DOCUMENT) private document: any) {
  }

  private keywordGeneral: string;
  isConnected: boolean = false;
  private user: usr;
  private currentRoute: string;

  private size: number;

  ngOnInit(): void {
    this.authService.loadToken();
    this.onInfo();
    this.test();
    // currentRoute
    let path = window.location.pathname;
    path = path.replace('/', '');
    this.currentRoute = path;
    // console.log(this.currentRoute);
    /*console.log(window.location.href);
    console.log('Path:' + window.location.pathname);
    console.log('Host:' + window.location.host);
    console.log('Hostname:' + window.location.hostname);
    console.log('Origin:' + window.location.origin);
    console.log('Port:' + window.location.port);
    console.log('Search String:' + window.location.search);*/
  }

  title = 'MediaVideoFront';

  isConnect() {
    return this.isConnected;
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  isUser() {
    return this.authService.isUser();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
    this.test();
  }

  onSubmitKeywordGeneral(data) {
    let kwg = btoa(data.keywordGeneral);
    // let reg = data.regex;
    this.keywordGeneral = '';
    this.catalogueService.getRessource(this.catalogueService.host + '/video/searchtitlecontain/' + kwg)
      .subscribe(datareq => {
        console.log(datareq);
      }, err => {
        console.log(err);
      });

  }

  onInfo() {
    this.catalogueService.getRessource('/infos')
      .subscribe(data => {
        // console.log(data);
      }, err => {
        let message: string = err.error.text;
        if (message.startsWith('The Token has expired')) {
          this.logout();
          // this.document.location.href = '/logout';
        }
      });
  }

  onLogin(data) {
    // console.log(data);
    this.authService.login(data).subscribe(resp => {
      let jwt = resp.headers.get('authorization');
      this.authService.saveToken(jwt);
      this.router.navigateByUrl('/video');
      this.test();
    }, err => {
      console.log(err);
    });
  }

  test() {
    this.catalogueService.getRessource('/infos')
      .subscribe(data => {
          console.log(data);
          this.user = <usr>data;
          this.subtest();
          return this.isConnected;
        }, err => {
          this.user = <usr>err;
          this.subtest();
          return this.isConnected;
        }
      );
  }

  subtest() {
    if (this.user.state === 'Connected') {
      // console.log('Connected');
      this.isConnected = true;
    } else {
      console.log('Disconnected');
      this.isConnected = false;
    }
  }
  onVideo(){
    this.currentRoute = 'video';
    this.router.navigateByUrl('/video');
  }
   onExport() {
    this.currentRoute = 'export';
    this.router.navigateByUrl('/export');
  }

   onConfig() {
    this.currentRoute = 'config';
    this.router.navigateByUrl('/config');
  }

   onAdmin() {
    this.currentRoute = 'admin';
    this.router.navigateByUrl('/admin');
  }
   onManagment() {
    this.currentRoute = 'managmentfiles';
    this.router.navigateByUrl('/managmentfiles');
  }

  decr(valuesize: string) {

  }

  dataChange(valuesize: string) {

  }

  incr(valuesize: string) {

  }
}


interface usr {
  info: string;
  name: string;
  navigator: string;
  state: string;
  tokenLimit: string;
  url: string;
}
