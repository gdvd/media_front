import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
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
              @Inject(DOCUMENT) private document: any) {
  }

  keywordGeneral: string;
  // regex: boolean = false;
  isConnected: boolean = false;
  user: usr;

  ngOnInit(): void {
    this.authService.loadToken();
    this.onInfo();
    this.test();
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
      // this.router.navigateByUrl('/');
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
}

interface usr {
  info: string;
  name: string;
  navigator: string;
  state: string;
  tokenLimit: string;
  url: string;
}
