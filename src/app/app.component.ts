import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {HttpClient} from '@angular/common/http';
import {CatalogueService} from './catalogue.service';
import {DOCUMENT} from '@angular/common';
import {Subscription} from 'rxjs';
import {MessageService} from './message-service.service';

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
              @Inject(DOCUMENT) private document: any,
              private messageService: MessageService) {
    // subscribe to home component messages
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message) {
        this.messages.push(message);
        // console.log('Message recu');
        // console.log(message.text);
        this.addToBasket(message.text);
      } else {
        // clear messages when empty message received
        this.messages = [];
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  messages: any[] = [];
  subscription: Subscription;

  private keywordGeneral: string;
  isConnected: boolean = false;
  private user: Usr;
  private currentRoute: string;
  private myLocalBaskets: LocalBasket[];
  private baskets: Basket[] = [];
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
    path = path.replace('/', '');
    this.currentRoute = path;
    this.getAllBaskets('');
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
    this.test();
  }

/*  onSubmitKeywordGeneral(data) {
    let kwg = btoa(data.keywordGeneral);
    // let reg = data.regex;
    this.keywordGeneral = '';
    this.catalogueService.getRessource(this.catalogueService.host + '/video/searchtitlecontain/' + kwg)
      .subscribe(datareq => {
        console.log(datareq);
      }, err => {
        console.log(err);
      });
  }*/

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
          this.user = <Usr>data;
          this.nameBasketUsed = this.user.name;
          this.subtest();
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

  onFilmography() {
    this.currentRoute = 'filmography';
    this.router.navigateByUrl('/filmography');
  }

  onVideo() {
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

  private getAllBaskets(basketName: string) {
    this.catalogueService.getRessource('/videouser/getbaskets/')
      .subscribe(data => {
        //@ts-ignore
        this.baskets = data;
        // console.log(this.baskets);
        let basketlenght = this.baskets.length;
        if (basketlenght > 1) {
          console.log('The basket contain '+ basketlenght +' elements');
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
          }else{
            if (basketlenght == 0) {
              // console.log('The basket is empty');
              this.myLocalBaskets=[];
            }
          }
        }
        if(basketName!='' && this.myLocalBaskets.length>1){
          // console.log('last basketName'+basketName);
          var test=false;
          for(var b of this.myLocalBaskets){
            if(b.localBasketName===basketName){
              test=true;
            }
          }
          if(test){
            for(var b of this.myLocalBaskets){
              if(b.localBasketName===basketName){
                b.selection=true;
                this.getfilenameofidsbasket(basketName);
              }else{
                b.selection=false;
              }
            }
          }
        }
      }, err => {
        console.log(err);
      });
  }

  private addToBasket(text: string) {
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
                this.getAllBaskets('');
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
            this.getAllBaskets('');
            // console.log(this.baskets);
          }, err => {
            console.log(err);
          });
      }
    }else{
      this.catalogueService.postRessourceWithData('/videouser/addtobasket/' + text,
        this.nameBasketUsed)
        .subscribe(data => {
          //@ts-ignore
          this.baskets = data;
          this.getAllBaskets('');
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
      if (this.myLocalBaskets[i].localBasketName === localBasketName) {
        this.myLocalBaskets[i].selection = true;
      } else {
        this.myLocalBaskets[i].selection = false;
      }
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
        this.getAllBaskets(this.nameBasketUsed);
      }, err => {
        console.log(err);
      });

  }

  namebasketchange() {
    for (let b of this.myLocalBaskets) {
      if (b.localBasketName === this.nameBasketUsed) {
        b.selection = true;
      } else {
        b.selection = false;
      }
    }
  }

  deleteOneId(idMmi: string, basketName: string) {
    this.catalogueService.postRessourceWithData('/videouser/deleteOneId/' + idMmi,
      basketName)
      .subscribe(data => {
        // console.log('delete : ' + idMmi + ' name : ' + basketName + ' is deleted');
        this.getAllBaskets(basketName);
      }, err => {
        console.log(err);
      });
  }

}
/*

interface localBasket {
  selection: boolean,
  localBasketName: string,
  localBasketComment: string,
  localIdsMmi: string[],
  localBasketContent: BasketInfo
}

interface usr {
  info: string;
  name: string;
  navigator: string;
  state: string;
  tokenLimit: string;
  url: string;
}

interface basket {
  dateModif: string,
  id: IdBasket,
  basketName: basketName
}

interface basketName {
  basketName: string,
  comment: string,
  idBasketName: number
}

interface IdBasket {
  idBasketName: number,
  idMyMediaInfo: string,
  idMyUser: number
}

interface BasketInfo {
  basketName: string,
  comment: string,
  userId: number,
  basketInfoElements: BasketInfoElement[]
}

interface BasketInfoElement {
  idMmi: string,
  basketInfoPahs: BasketInfoPahs[]
}


interface BasketInfoPahs {
  title: string,
  path: string,
  nameExport: string
}
*/
