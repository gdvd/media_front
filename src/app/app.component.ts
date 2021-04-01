import {Component, Inject, OnInit} from '@angular/core';
import {Event as NavigationEvent, ParamMap} from '@angular/router';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {HttpClient} from '@angular/common/http';
import {CatalogueService} from './catalogue.service';
import {DOCUMENT, PlatformLocation} from '@angular/common';
import {Subscription} from 'rxjs';
import {MessageService} from './message-service.service';
import {UpdateurlService} from './updateurl.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private route: ActivatedRoute | null;
  private orgId: string;
  private currentUrl: string;
  private subscriptionurl: any;
  private messages: any[] = [];
  private updateurls: any[] = [];
  private subscription: Subscription;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private authService: AuthenticationService,
              private catalogueService: CatalogueService,
              private updateurl: UpdateurlService,
              private activatedRoute: ActivatedRoute,
              @Inject(DOCUMENT) private document: any,
              private messageService: MessageService) {

    this.subscriptionurl = this.updateurl.getMessage().subscribe(messageurl => {
      if (messageurl != undefined) {
        if (messageurl) {
          this.updateurls.push(messageurl.text);
        } else {
          this.updateurls = [];
        }
      }
    });

    // subscribe to home component messages
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message) {
        this.messages.push(message);
        // console.log(message.text);
        this.addToBasket(message.text);
      } else {
        // clear messages when empty message received
        this.messages = [];
      }
    });
/*
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      // this.orgId = params.get('id');
      //business logic what changes you want on the page with this new data.
    });

    this.router.events.subscribe((val: NavigationStart) => {
      // console.log('router.events', this.currentRoute);
      // console.log('this.router.url', this.router.url);
      // this.currentRoute = this.router.url;
      if (val.navigationTrigger === 'popstate') {
        if (val.url.startsWith('/videoid')
          && val.url.split('?').length > 0) {
          console.log('====let\'s go to :', val.url);
          let url: string = val.url.toString();
          this.updateurl.sendMessage(url);
          this.updateurl.clearMessages();
        }
        // https://angular.io/api/router/Router
        // console.log('val', val.url, 'val.id', val.id)
        this.router.navigateByUrl[val.url, val.id];
        // this.router.navigateByUrl(val.url, {replaceUrl: true, skipLocationChange: true});
        // this.router.navigateByUrl(val.url, {skipLocationChange: true});
        // this.router.navigateByUrl(val.url, {replaceUrl: true});
        // this.router.navigateByUrl(val.url)
        // this.router.navigate[val.url];
      }
    });

    /!*router.events
      .pipe(
        // The "events" stream contains all the navigation events. For this demo,
        // though, we only care about the NavigationStart event as it contains
        // information about what initiated the navigation sequence.
        filter(
          (event: NavigationEvent) => {

            return (event instanceof NavigationStart);

          }
        )
      )
      .subscribe(
        (event: NavigationStart) => {

          console.group('NavigationStart Event');
          // Every navigation sequence is given a unique ID. Even "popstate"
          // navigations are really just "roll forward" navigations that get
          // a new, unique ID.
          console.log('navigation id:', event.id);
          console.log('route:', event.url);
          this.currentUrl=event.url;
          // The "navigationTrigger" will be one of:
          // --
          // - imperative (ie, user clicked a link).
          // - popstate (ie, browser controlled change such as Back button).
          // - hashchange
          // --
          // NOTE: I am not sure what triggers the "hashchange" type.
          console.log('trigger:', event.navigationTrigger);

          // This "restoredState" property is defined when the navigation
          // event is triggered by a "popstate" event (ex, back / forward
          // buttons). It will contain the ID of the earlier navigation event
          // to which the browser is returning.
          // --
          // CAUTION: This ID may not be part of the current page rendering.
          // This value is pulled out of the browser; and, may exist across
          // page refreshes.
          if (event.restoredState) {

            console.warn(
              'restoring navigation id:',
              event.restoredState.navigationId
            );

          }

          console.groupEnd();

        }
      );*!/
*/
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
    this.subscriptionurl.unsubscribe();
  }


  isConnected: boolean = false;
  public user: Usr;
  private currentRoute: string;
  public myLocalBaskets: LocalBasket[];
  baskets: Basket[] = [];
  public showBasket: boolean = false;
  private nameBasketUsed: string;
  private basketInfo: BasketInfo;
  public titleApp = 'MediaVideo';

  ngOnInit(): void {
    this.authService.loadToken();
    this.onInfo();
    this.test();
    // currentRoute
    let path = window.location.pathname;
    // path = path.replace('/', '');
    this.currentRoute = path;

    // console.log(this.currentRoute);
    // console.log(window.location.href);
    // console.log('Path:' + window.location.pathname);
    // console.log('Host:' + window.location.host);
    // console.log('Hostname:' + window.location.hostname);
    // console.log('Origin:' + window.location.origin);
    // console.log('Port:' + window.location.port);
    // console.log('Search String:' + window.location.search);
  }


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
    this.baskets = [];
    this.test();
  }

  onInfo() {
    this.catalogueService.getRessource('/info')
      .subscribe(data => {
        // console.log(data);
      }, err => {
        let message: string = err.error.text;
        if (message != undefined && message.startsWith('The Token has expired')) {
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
      this.onVideoid();
      this.test();
      this.getAllBaskets('', this.user.name)
    }, err => {
      console.log(err);
    });
  }

  getNewJwt() {
    this.catalogueService.getRessourceWithObs('/infoJWT')
      .subscribe(resp => {
          // console.log(resp.headers.get('authorization'));
          let jwt = resp.headers.get('authorization');
          this.authService.saveToken(jwt);
          this.test();
        }, err => {
          return this.isConnected;
        }
      );
  }

  test() {
    this.catalogueService.getRessource('/info')
      .subscribe(resp => {
          console.log(resp);
          this.user = <Usr>resp;
          this.nameBasketUsed = this.user.name;
          this.subtest();
        this.getAllBaskets('', this.user.name);
          return this.isConnected;
        }, err => {
          this.user = <Usr>err;
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

  onVideoid() {
    this.currentRoute = 'videoid';
    this.showRoute(this.currentRoute);
    this.router.navigateByUrl('/videoid');
  }

  onFilmography() {
    this.currentRoute = 'filmography';
    this.showRoute(this.currentRoute);
    this.router.navigateByUrl('/filmography');
  }

  onVideo() {
    this.currentRoute = 'video';
    this.showRoute(this.currentRoute);
    this.router.navigateByUrl('/video');
  }

  onExport() {
    this.currentRoute = 'export';
    this.showRoute(this.currentRoute);
    this.router.navigateByUrl('/export');
  }

  onConfig() {
    this.currentRoute = 'config';
    this.showRoute(this.currentRoute);
    this.router.navigateByUrl('/config');
  }

  onAdmin() {
    this.currentRoute = 'admin';
    this.showRoute(this.currentRoute);
    this.router.navigateByUrl('/admin');
  }

  onManagment() {
    this.currentRoute = 'managmentfiles';
    this.showRoute(this.currentRoute);
    this.router.navigateByUrl('/managmentfiles');
  }

  myswipeup($event) {
    console.log('myswipeup');
    console.log($event);
  }

  myswipedown($event) {
    console.log('myswipedown');
    console.log($event);

  }

  godown($event) {
    console.log('godown');
    console.log($event);
  }

  mypanleft($event) {
    console.log('mypanleft');
    console.log($event);
  }

  mypanright($event) {
    console.log('mypanright');
    console.log($event);
  }

  mypanmove($event) {
    console.log('mypanmove');
    console.log($event);
  }

  mypanstart($event) {
    console.log('mypanstart');
    console.log($event);
  }

  mypanup($event) {
    // console.log('mypanup');
    // console.log($event.distance);

    var html = document.documentElement;
    html.scrollTop += $event.distance / 20;

    // let d = $event.distance;
    // let o = window.pageYOffset;
    // document.documentElement.scroll(0, o-d);
    // document.scrollingElement.scroll(-300, 0);
  }

  mypandown($event) {
    // console.log('mypandown');
    // console.log($event.distance);

    var html = document.documentElement;
    html.scrollTop -= $event.distance / 20;

    // let d = $event.distance;
    // document.documentElement.scroll(0, d);
    // document.scrollingElement.scroll(300, 0);
    // document.documentElement.scrollTop = 500;
  }

  actionBasket() {
    // console.log('Action basket');
    this.showBasket = !this.showBasket;
    if (this.showBasket) {

    }
  }

  public getAllBaskets(basketName: string, name: string) {
    // console.log('name', name)
    this.catalogueService.getRessource('/videouser/getbaskets/'+name)
      .subscribe(data => {
        //@ts-ignore
        this.baskets = data;
        // console.log(this.baskets);
        let basketlenght = this.baskets.length;
        if (basketlenght > 1) {
          // console.log('The basket contain ' + basketlenght + ' elements');
          //get the name of the last basket used
          let nameBasketMostRecent = this.baskets[this.findTheBasketTheMostRecent()]
            .basketName.basketName;
          this.makeLocalBasket(nameBasketMostRecent);
          this.nameBasketUsed = nameBasketMostRecent;
          this.getfilenameofidsbasket(nameBasketMostRecent);
        } else {
          if (basketlenght == 1) {
            console.log('The basket contain only one element');
            this.nameBasketUsed = this.baskets[0].basketName.basketName;
            this.makeLocalBasket(this.nameBasketUsed);
            this.getfilenameofidsbasket(this.nameBasketUsed);
          } else {
            if (basketlenght == 0) {
              // console.log('The basket is empty');
              this.myLocalBaskets = [];
            }
          }
        }
        if (basketName != '' && this.myLocalBaskets.length > 1) {
          // console.log('last basketName'+basketName);
          var test = false;
          for (var b of this.myLocalBaskets) {
            if (b.localBasketName === basketName) {
              test = true;
            }
          }
          if (test) {
            for (var b of this.myLocalBaskets) {
              if (b.localBasketName === basketName) {
                b.selection = true;
                this.getfilenameofidsbasket(basketName);
              } else {
                b.selection = false;
              }
            }
          }
        }
        return this.myLocalBaskets;
      }, err => {
        console.log(err);
      });
  }

  public addToBasket(text: string) {
    var testid = false;
    var testname = false;
    if (this.myLocalBaskets.length > 0) {
      for (var localBasket of this.myLocalBaskets) {
        if (localBasket.localBasketName === this.nameBasketUsed) {
          testname = true;
          for (let idmmi of localBasket.localIdsMmi) {
            if (idmmi === text) {
              testid = true;
              break;
            }
          }
          if (!testid) {
            console.log('/videouser/addtobasket/' + text);
            this.catalogueService.postRessourceWithData('/videouser/addtobasket/' + text,
              this.nameBasketUsed)
              .subscribe(data => {
                //@ts-ignore
                this.baskets = data;
                this.getAllBaskets('', this.user.name);
              }, err => {
                console.log(err);
              });
          } else {
            console.log('This id is in the already basket');
          }
        }
      }
      if (!testname) {
        this.catalogueService.postRessourceWithData('/videouser/addtobasket/' + text,
          this.nameBasketUsed)
          .subscribe(data => {
            //@ts-ignore
            this.baskets = data;
            this.getAllBaskets('', this.user.name);
            // console.log(this.baskets);
          }, err => {
            console.log(err);
          });
      }
    } else {
      this.catalogueService.postRessourceWithData('/videouser/addtobasket/' + text,
        this.nameBasketUsed)
        .subscribe(data => {
          //@ts-ignore
          this.baskets = data;
          this.getAllBaskets('', this.user.name);
        }, err => {
          console.log(err);
        });
    }
  }

  private findTheBasketTheMostRecent() {
    var pos = 0;
    if (this.baskets.length > 1) {
      var bask = this.baskets[0];
      for (var i = 1; i < this.baskets.length; i++) {
        if ((bask.dateModif).localeCompare(this.baskets[i].dateModif, 'fr') < 0) {
          //@ts-ignore
          bask = this.baskets[i];
          pos = i;
        }
      }
    } else {
      if (this.baskets.length == 1) {
        pos = 1;
      }
    }
    return pos;
  }

  private makeLocalBasket(nameBasketMostRecent: string) {
    this.myLocalBaskets = [];
    //@ts-ignore
    var bask: localBasket = {
      'selection': this.baskets[0].basketName.basketName == nameBasketMostRecent,
      'localBasketName': this.baskets[0].basketName.basketName,
      'localBasketComment': this.baskets[0].basketName.comment,
      'localIdsMmi': [this.baskets[0].id.idMyMediaInfo],
      'localBasketContent': null
    };
    this.myLocalBaskets = this.myLocalBaskets.concat(bask);
    if (this.baskets.length > 1) {
      for (let i = 1; i < this.baskets.length; i++) {
        let bn = this.baskets[i].basketName.basketName;
        var test = false;
        for (var j = 0; j < this.myLocalBaskets.length; j++) {
          if (this.myLocalBaskets[j].localBasketName === bn) {
            this.myLocalBaskets[j].localIdsMmi =
              this.myLocalBaskets[j].localIdsMmi.concat(this.baskets[i].id.idMyMediaInfo);
            test = true;
            break;
          }
        }
        if (!test) {
          var bask: LocalBasket = {
            'selection': this.baskets[i].basketName.basketName == nameBasketMostRecent,
            'localBasketName': this.baskets[i].basketName.basketName,
            'localBasketComment': this.baskets[i].basketName.comment,
            'localIdsMmi': [this.baskets[i].id.idMyMediaInfo],
            'localBasketContent': null
          };
          this.myLocalBaskets = this.myLocalBaskets.concat(bask);
        }
      }

    }
  }

  selectbasketdir(localBasketName: string) {
    this.nameBasketUsed = localBasketName;
    this.getfilenameofidsbasket(localBasketName);
    for (let i = 0; i < this.myLocalBaskets.length; i++) {
      this.myLocalBaskets[i].selection =
        this.myLocalBaskets[i].localBasketName === localBasketName;
    }

  }

  private getfilenameofidsbasket(nameBasketWanted: string) {
    if (nameBasketWanted != '') {
      this.catalogueService.postRessourceWithData('/videouser/getfilenameofidsbasket/',
        nameBasketWanted)
        .subscribe(data => {
          //@ts-ignore
          this.basketInfo = data;
          for (var lb of this.myLocalBaskets) {
            if (lb.localBasketName === nameBasketWanted) {
              lb.localBasketContent = this.basketInfo;
              break;
            }
          }
          // console.log(this.basketInfo);
        }, err => {
          console.log(err);
        });
    }
    // console.log(this.myLocalBaskets);
  }

  deleteBasket(localBasketName: string) {
    console.log('Delete basket : ' + localBasketName);
    this.catalogueService.postRessourceWithData('/videouser/deletelocalbasketname/',
      localBasketName)
      .subscribe(data => {
        console.log(localBasketName + ' is delete');
        this.getAllBaskets(this.nameBasketUsed, this.user.name);
      }, err => {
        console.log(err);
      });

  }

  namebasketchange() {
    for (let b of this.myLocalBaskets) {
      b.selection = b.localBasketName === this.nameBasketUsed;
    }
  }

  deleteOneId(idMmi: string, basketName: string) {
    this.catalogueService.postRessourceWithData('/videouser/deleteOneId/' + idMmi,
      basketName)
      .subscribe(data => {
        // console.log('delete : ' + idMmi + ' name : ' + basketName + ' is deleted');
        this.getAllBaskets(basketName, this.user.name);
      }, err => {
        console.log(err);
      });
  }

  private showRoute(currentRoute: string) {
    console.log(currentRoute);
  }

  public inGMK(ot) {
    var res = ot;
    let units = ['o', 'Ko', 'Mo', 'Go', 'To'];
    var result: string = '';
    for (var i = 1; i <= units.length; i++) {
      res = res / 1024;
      if (Math.trunc(res) != 0) {
        let ve = Math.trunc(res);
        let cal: number = (res - ve);
        let calStr: string = cal + '';
        let deci: string;
        if (calStr.length > 4) {
          deci = calStr.substring(2, 3);
        } else {
          if (calStr.length == 3) {
            deci = calStr.substring(2, 3);
          } else {
            deci = '';
          }
        }
        // result = '' + ve + units[i] + deci + ' (' + ot + 'oct)';
        result = '' + ve + ',' + deci + units[i];
        // result = '' + ve + units[i] + deci;
      } else {
        break;
      }
    }
    return result;
  }
}
