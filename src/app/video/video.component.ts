import {Component, OnInit, HostListener} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CatalogueService} from '../catalogue.service';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {CookieService} from 'ngx-cookie-service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MessageService} from '../message-service.service';
import {Subscription} from 'rxjs';
import {MywindowService} from '../mywindow.service';
import {forEach} from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  public tablepage: MyPage;
  public textFilter: string;
  public page: number;
  public size: number;
  private toSort: string;
  private valueSizePage;
  public listIdVneToName: Vnelight[];
  private listUserWithId: UserLight[];
  private vneName = '';
  private myOrder = '';
  private limdb = 'http://www.imdb.com';
  private listTypeName: string[];
  private listTypeNameWithId: TypeName[];
  public typenameForm: FormGroup;
  private vnenameForm: FormGroup;
  private lLogin: FormGroup;
  private listuserstosub: string[];
  private choice: any;
  public checkboxFlag: boolean = true;
  public checkboxfilterFlag: boolean = true;
  private numberActorsWanted: number = 4;//NumberActorsWanted
  private limiteOfWriters: number = 4;
  private toggleaddsub: boolean = false;
  private askName: boolean = false;
  public subscribe: PreferencesSubscribe;
  public lpsws: PreferenceSubscribeWithScore[];
  private listchevrondown: number[];
  private filtertt: string;
  private waitingwork: boolean = false;
  private ltitileWithIdtt: TitileWithIdttt[];

  public dboxpos: boolean;
  public overf: boolean;
  public mycomment: string;
  public nbchar: number;
  public dboxid: string;
  public dboxremake: boolean;
  public nbremake: string;
  public allremarkes: boolean;

  messages: any[] = [];
  subscription: Subscription;

  messagesWindow: InfoWindow[] = [];
  subscriptionWindow: Subscription;

  constructor(private httpClient: HttpClient,
              private catalogueService: CatalogueService,
              private router: Router,
              private appComponent: AppComponent,
              private cookieService: CookieService,
              private fb: FormBuilder,
              private messageService: MessageService,
              private mywindowService: MywindowService
  ) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message) {
        this.messages.push(message);
      } else {
        this.messages = [];
      }
    });

    this.subscriptionWindow = this.mywindowService.getMessage()
      .subscribe(messagesWindow => {
        if (messagesWindow) {
          this.messagesWindow.push(messagesWindow);
          this.messageWindowOpen(messagesWindow);
        } else {
          this.messagesWindow = [];
        }
      });
  }

  /*   this.router.navigateByUrl('/');//Re-Route */
  ngOnInit() {
    if (this.cookieService.check('valueSizePage')) {
      this.valueSizePage = this.cookieService.get('valueSizePage');
      this.size = parseInt(this.valueSizePage, 10);
    } else {
      this.cookieService.set('valueSizePage', '5');
      this.size = 10;
    }
    this.page = 1;
    this.toSort = 'dateModif';
    this.textFilter = '';
    this.myOrder = 'naup';
    this.filtertt = '';
    this.getListIdVneToName();
    this.getAlltyname();
    this.getAlltynameWithId();
    this.vneName = '';

    if (this.cookieService.check('valueFiltersupport')) {
      this.vneName = this.cookieService.get('valueFiltersupport');
    } else {
      this.cookieService.set('valueFiltersupport', '');
    }
    this.getPageMmi();

    this.typenameForm = this.fb.group({
      listTypeNameWithId: [0]
    });
    this.vnenameForm = this.fb.group({
      listIdVneToName: [0]
    });
    this.lLogin = this.fb.group({
      listuserstosub: [0]
    });
    this.lpsws = [];
    this.listchevrondown = [];
    this.getListUserWithId();
    this.getAllSubscribes();
    this.getlistuserstosub();
    this.dboxpos = false;
    this.dboxremake = false;
    this.dboxid = '';
    this.mycomment = '';
    this.nbchar = 1024;
    this.appComponent.getNewJwt();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.incr('valuepage');
    }
    if (event.key === 'ArrowLeft') {
      this.decr('valuepage');
    }
  }

  getListUserWithId() {
    this.catalogueService.getRessource('/videouser/listUserWithId')
      .subscribe(data => {
        //@ts-ignore
        this.listUserWithId = data;
      }, err => {
        console.log(err);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionWindow.unsubscribe();
  }

  sendMessage(): void {
    // send message to subscribers via observable subject
  }

  clearMessages(): void {
    // clear messages

  }

  setvalueformVneName(event) {
    this.vneName = event.target.value;
    this.cookieService.set('valueFiltersupport', this.vneName);
    this.page = 1;
    this.getPageMmi();
  }

  cleanFilter() {
    this.textFilter = '';
    this.filtertt = '';
    this.cookieService.set('valueFiltersupport', '');
    this.page = 1;
    this.toggleSelectorVne(true);
    this.getPageMmi();
  }

  cleanAllFilter() {
    this.cookieService.set('valueFiltersupport', '');
    this.textFilter = '';
    this.vneName = '';
    this.page = 1;
    this.toggleSelectorVne(true);
    this.getPageMmi();
  }

  incr(data: string) {
    if (data === 'valuepage') {
      if (this.tablepage != null) {
        if (this.page < this.tablepage.totalPages) {
          this.page++;
        }
      } else {
        this.page++;
      }
      this.getPageMmi();
    }
    if (data === 'valuesize') {
      if (this.tablepage != null) {
        if (this.size < this.tablepage.totalElements) {
          this.size++;
          this.page = 1;
          this.getPageMmi();
          this.setSizeToCookie(this.size);
        }
      }
    }
  }

  decr(data: string) {
    if (data === 'valuepage') {
      if (this.page > 1) {
        this.page--;
      }
      this.getPageMmi();
    }
    if (data === 'valuesize') {
      if (this.size > 2) {
        this.size--;
        this.page = 1;
        this.getPageMmi();
        this.setSizeToCookie(this.size);
      }
    }
  }

  dataChange(data: string) {
    if (data === 'valuepage') {
      if (this.page < 1) {
        this.page = 1;
      }
      if (this.page >= this.tablepage.totalPages) {
        this.page = this.tablepage.totalPages;
      }
      this.getPageMmi();
      console.log(this.page);
    }
    if (data === 'valuesize') {
      if (this.size < 2) {
        this.size = 1;
      }
      this.getPageMmi();
      this.setSizeToCookie(this.size);
    }
  }

  private reorderpage() {
    if (this.myOrder == 'naup') {
      this.sortByNameAsc();
    }
    if (this.myOrder == 'nadown') {
      this.sortByNameDesc();
    }
    if (this.myOrder == 'duup') {
      this.sortByDurationAsc();
    }
    if (this.myOrder == 'dudown') {
      this.sortByDurationDesc();
    }
    if (this.myOrder == 'dmup') {
      this.sortByDimensionAsc();
    }
    if (this.myOrder == 'dmdown') {
      this.sortByDimensionDesc();
    }
    if (this.myOrder == 'brup') {
      this.sortByBitrateAsc();
    }
    if (this.myOrder == 'brdown') {
      this.sortByBitrateDesc();
    }
    if (this.myOrder == 'sizeup') {
      this.sortBySizeAsc();
    }
    if (this.myOrder == 'sizedown') {
      this.sortBySizeDesc();
    }
    if (this.myOrder == 'vneup') {
      this.sortByVneAsc();
    }
    if (this.myOrder == 'vnedown') {
      this.sortByVneDesc();
    }
  }

  setSizeToCookie(nb: number) {
    this.cookieService.set('valueSizePage', nb.toString());
  }

  getPageMmi() {
    //limit of stop orderBy...
    if (this.size > 500) {
      this.myOrder = 'nothing';
    } else {
      if (this.myOrder == 'nothing') {
        this.myOrder = 'naup';
      }
    }
    let strToSort = '&toSort=' + this.toSort;
    if (this.checkboxFlag == true) {
      this.catalogueService.postRessourceWithData(
        '/videouser/listMmiForLoginPP?page=' + (this.page - 1)
        + '&vneName=' + this.vneName + '&size='
        + this.size + strToSort + '&filename=' + this.checkboxfilterFlag
        + '&filtertt=' + this.filtertt
        , '%' + this.textFilter + '%')
        .subscribe(data => {
          // console.log(data);
          //@ts-ignore
          this.tablepage = data;
          var lMmi: number[] = [];
          this.tablepage.content.forEach(c => {
            if (c.typeMmi != null) {
              lMmi = lMmi.concat(c.typeMmi.idTypeMmi);
            }
          });
          // console.log(lMmi);
          this.catalogueService.postRessourceWithData(
            '/videouser/getVideoFilmWithMmi', lMmi)
            .subscribe(data => {
              var newLinks: LinkVfTmmi[];
              // @ts-ignore
              newLinks = data;
              // console.log(newLinks);
              if (this.tablepage.content.length != 0) {
                this.tablepage.content.forEach(c => {
                  if (c.typeMmi != null) {
                    newLinks.forEach(l => {
                      if (c.typeMmi.idTypeMmi === l.link) {
                        c.typeMmi.videoFilm = l.vf;
                      }
                    });
                  }
                });
                if (this.tablepage.content.length == 1) {
                  this.myOrder = 'nothing';
                }
                this.ltitileWithIdtt = [];
                for (let mmi of this.tablepage.content) {
                  // console.log(mmi);
                  if (mmi != null) {
                    if (mmi.videoSupportPaths.length > 1) {
                      mmi.state = 1;
                    } else {
                      mmi.state = 1;
                    }
                    if (mmi.typeMmi != null) {
                      if (mmi.typeMmi.videoFilm != null) {
                        mmi.search = 3;
                        mmi.state = 3;
                      } else {
                        mmi.search = 0;
                      }
                    } else {
                      mmi.search = 0;
                    }
                  }
                  mmi.editTypeName = 0;
                  if (mmi.typeMmi != null
                    && mmi.typeMmi.videoFilm != null
                    && mmi.typeMmi.videoFilm.remake != null) {
                    for (let id in mmi.typeMmi.videoFilm.remake.remakes) {
                      mmi.typeMmi.videoFilm.remake.active = true;
                      mmi.typeMmi.videoFilm.remake.titles = [];
                      let rem: TitileWithIdttt = {
                        idtt: mmi.typeMmi.videoFilm.remake.remakes[id],
                        title: ''
                      };
                      this.ltitileWithIdtt = this.ltitileWithIdtt.concat(rem);
                    }
                  }
                }
                this.ltitileWithIdtt = this.mergeListTitleWithIdtt(this.ltitileWithIdtt);
                this.searchTitltForListTitleWithIdtt(this.ltitileWithIdtt);
                if (this.myOrder != 'nothing') {
                  this.reorderpage();
                }
              }else{
                this.myOrder = 'nothing';
              }
            }, err => {
              console.log(err);
            });
        }, err => {
          console.log(err);
        });
    } else {
      this.catalogueService.postRessourceWithData(
        '/videouser/listMmiForLoginWithNamePP?page=' + (this.page - 1) + '&size='
        + this.size + strToSort, '%' + this.textFilter + '%')
        .subscribe(data => {
          //@ts-ignore
          this.tablepage = data;

          var lMmi: number[] = [];
          this.tablepage.content.forEach(c => {
            if (c.typeMmi != null) {
              lMmi = lMmi.concat(c.typeMmi.idTypeMmi);
            }
          });
          this.catalogueService.postRessourceWithData(
            '/videouser/getVideoFilmWithMmi', lMmi)
            .subscribe(data => {
              var newLinks: LinkVfTmmi[];
              // @ts-ignore
              newLinks = data;
              this.tablepage.content.forEach(c => {
                if (c.typeMmi != null) {
                  newLinks.forEach(l => {
                    if (c.typeMmi.idTypeMmi === l.link) {
                      c.typeMmi.videoFilm = l.vf;
                    }
                  });
                }
              });
              if (this.tablepage.content.length == 1) {
                this.myOrder = 'nothing';
              }
              for (let mmi of this.tablepage.content) {
                // console.log(mmi);
                if (mmi != null) {
                  if (mmi.videoSupportPaths.length > 1) {
                    mmi.state = 1;
                  } else {
                    mmi.state = 0;
                  }
                  if (mmi.typeMmi != null) {
                    if (mmi.typeMmi.videoFilm != null) {
                      mmi.search = 3;
                      mmi.state = 3;
                    } else {
                      mmi.search = 0;
                    }
                  } else {
                    mmi.search = 0;
                  }
                }
                mmi.editTypeName = 0;
              }
              if (this.myOrder != 'nothing') {
                this.reorderpage();
              }
            }, err => {
              console.log(err);
            });
        }, err => {
          console.log(err);
        });
    }
  }


  /*  checkboxchange() {
      this.page = 1;

      if (this.checkboxFlag == true) {
        this.toggleSelectorVne(true);
      } else {
        this.toggleSelectorVne(false);
      }
      this.getPageMmi();
    }*/
  checkboxchange2(value: boolean) {
    this.page = 1;
    this.checkboxFlag = value;
    if (value) {
      this.toggleSelectorVne(true);
    } else {
      this.toggleSelectorVne(false);
    }
    this.getPageMmi();
  }

  toggleSelectorVne(test: boolean) {
    let te: HTMLElement = document.getElementById('filtertitle');
    let sw: HTMLElement = document.getElementById('selectvne');
    if (test) {
      //@ts-ignore
      te.placeholder = 'Filter on title';
      //@ts-ignore
      sw.disabled = false;
    } else {
      //@ts-ignore
      te.placeholder = 'Filter on name';
      //@ts-ignore
      sw.disabled = true;
      // document.getElementById('switchtitlename').textContent = 'name';
    }
  }

  textFilterChange() {
    this.filtertt = '';
    this.page = 1;
    this.getPageMmi();
  }

  test() { // ?page=0&size=10&pos=40
    event.stopPropagation();
    this.catalogueService.getRessource('/videouser/lVneIdToName')
      .subscribe(data => {
        console.log(data);
      }, err => {
        console.log(err);
      });
  }

  // Info in tbl
  private getInfo(ele) {
    console.log(ele);
  }

//============================================================================
  sortByName() {
    if (this.myOrder != 'naup' && this.myOrder != 'nothing') {
      this.myOrder = 'naup';
      this.sortByNameAsc();
      // console.log('Let\'s go to up');
    } else {
      if (this.myOrder == 'naup') {
        this.myOrder = 'nadown';
        this.sortByNameDesc();
        // console.log('Let\'s go to down');
      }
    }
  }

  private sortByNameAsc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: MyMediaInfo[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: MyMediaInfo[] = [];
      while (mytable.length > 0) {
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].videoSupportPaths[0].title;
        for (var j = 1; j < mytable.length; j++) {
          //@ts-ignore
          if ((valOne).localeCompare(mytable[j].videoSupportPaths[0].title, 'fr') > 0) {
            //@ts-ignore
            valOne = mytable[j].videoSupportPaths[0].title;
            nb = j;
          }
        }
        //Add mytable[nb] to mynewtable
        mynewtable = mynewtable.concat(mytable[nb]);
        // delete mmi of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

  private sortByNameDesc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: MyMediaInfo[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: MyMediaInfo[] = [];
      while (mytable.length > 0) {
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].videoSupportPaths[0].title;
        for (var j = 1; j < mytable.length; j++) {
          //@ts-ignore
          if ((valOne).localeCompare(mytable[j].videoSupportPaths[0].title, 'fr') < 0) {
            //@ts-ignore
            valOne = mytable[j].videoSupportPaths[0].title;
            nb = j;
          }
        }
        //Add mytable[nb] to mynewtable
        mynewtable = mynewtable.concat(mytable[nb]);
        // delete mmi of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

  sortByDuration() {
    // console.log('Order by Duration asked');
    if (this.myOrder != 'duup' && this.myOrder != 'nothing') {
      this.myOrder = 'duup';
      this.sortByDurationAsc();
      // console.log('Let\'s go to up');
    } else {
      if (this.myOrder == 'duup') {
        this.myOrder = 'dudown';
        this.sortByDurationDesc();
        // console.log('Let\'s go to down');
      }
    }
  }

  private sortByDurationAsc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: MyMediaInfo[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: MyMediaInfo[] = [];
      while (mytable.length > 0) {
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].duration;
        for (var j = 1; j < mytable.length; j++) {
          //@ts-ignore
          if (valOne > mytable[j].duration) {
            //@ts-ignore
            valOne = mytable[j].duration;
            nb = j;
          }
        }
        //Add mytable[nb] to mynewtable
        mynewtable = mynewtable.concat(mytable[nb]);
        // delete mmi of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

  private sortByDurationDesc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: MyMediaInfo[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: MyMediaInfo[] = [];
      while (mytable.length > 0) {
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].duration;
        for (var j = 1; j < mytable.length; j++) {
          //@ts-ignore
          if (valOne < mytable[j].duration) {
            //@ts-ignore
            valOne = mytable[j].duration;
            nb = j;
          }
        }
        //Add mytable[nb] to mynewtable
        mynewtable = mynewtable.concat(mytable[nb]);
        // delete mmi of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

  //==================================================
  sortByDimension() {
    // console.log('Order by Dimension asked');
    if (this.myOrder != 'dmup' && this.myOrder != 'nothing') {
      this.myOrder = 'dmup';
      this.sortByDimensionAsc();
      // console.log('Let\'s go to up');
    } else {
      if (this.myOrder == 'dmup') {
        this.myOrder = 'dmdown';
        this.sortByDimensionDesc();
        // console.log('Let\'s go to down');
      }
    }
  }

  private sortByDimensionAsc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: MyMediaInfo[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: MyMediaInfo[] = [];
      while (mytable.length > 0) {
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].width;
        for (var j = 1; j < mytable.length; j++) {
          //@ts-ignore
          if (valOne > mytable[j].width) {
            //@ts-ignore
            valOne = mytable[j].width;
            nb = j;
          }
        }
        //Add mytable[nb] to mynewtable
        mynewtable = mynewtable.concat(mytable[nb]);
        // delete mmi of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

  private sortByDimensionDesc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: MyMediaInfo[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: MyMediaInfo[] = [];
      while (mytable.length > 0) {
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].width;
        for (var j = 1; j < mytable.length; j++) {
          //@ts-ignore
          if (valOne < mytable[j].width) {
            //@ts-ignore
            valOne = mytable[j].width;
            nb = j;
          }
        }
        //Add mytable[nb] to mynewtable
        mynewtable = mynewtable.concat(mytable[nb]);
        // delete MyMediaInfo of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

//=====================================================
  sortByBitrate() {
    // console.log('Order by Bitrate asked');
    if (this.myOrder != 'brup' && this.myOrder != 'nothing') {
      this.myOrder = 'brup';
      this.sortByBitrateAsc();
      // console.log('Let\'s go to up');
    } else {
      if (this.myOrder == 'brup') {
        this.myOrder = 'brdown';
        this.sortByBitrateDesc();
        // console.log('Let\'s go to down');
      }
    }
  }

  private sortByBitrateAsc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: MyMediaInfo[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: MyMediaInfo[] = [];
      while (mytable.length > 0) {
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].bitrate;
        for (var j = 1; j < mytable.length; j++) {
          //@ts-ignore
          if (valOne > mytable[j].bitrate) {
            //@ts-ignore
            valOne = mytable[j].bitrate;
            nb = j;
          }
        }
        //Add mytable[nb] to mynewtable
        mynewtable = mynewtable.concat(mytable[nb]);
        // delete MyMediaInfo of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

  private sortByBitrateDesc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: MyMediaInfo[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: MyMediaInfo[] = [];
      while (mytable.length > 0) {
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].bitrate;
        for (var j = 1; j < mytable.length; j++) {
          //@ts-ignore
          if (valOne < mytable[j].bitrate) {
            //@ts-ignore
            valOne = mytable[j].bitrate;
            nb = j;
          }
        }
        //Add mytable[nb] to mynewtable
        mynewtable = mynewtable.concat(mytable[nb]);
        // delete MyMediaInfo of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

//=====================================================
  sortBySize() {
    // console.log('Order by Size asked' && this.myOrder != 'nothing');
    if (this.myOrder != 'sizeup' && this.myOrder != 'nothing') {
      this.myOrder = 'sizeup';
      this.sortBySizeAsc();
      // console.log('Let\'s go to up');
    } else {
      if (this.myOrder == 'sizeup') {
        this.myOrder = 'sizedown';
        this.sortBySizeDesc();
        // console.log('Let\'s go to down');
      }
    }
  }

  private sortBySizeAsc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: MyMediaInfo[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: MyMediaInfo[] = [];
      while (mytable.length > 0) {
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].fileSize;
        for (var j = 1; j < mytable.length; j++) {
          //@ts-ignore
          if (valOne > mytable[j].fileSize) {
            //@ts-ignore
            valOne = mytable[j].fileSize;
            nb = j;
          }
        }
        //Add mytable[nb] to mynewtable
        mynewtable = mynewtable.concat(mytable[nb]);
        // delete MyMediaInfo of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

  private sortBySizeDesc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: MyMediaInfo[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: MyMediaInfo[] = [];
      while (mytable.length > 0) {
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].fileSize;
        for (var j = 1; j < mytable.length; j++) {
          //@ts-ignore
          if (valOne < mytable[j].fileSize) {
            //@ts-ignore
            valOne = mytable[j].fileSize;
            nb = j;
          }
        }
        //Add mytable[nb] to mynewtable
        mynewtable = mynewtable.concat(mytable[nb]);
        // delete MyMediaInfo of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

//=====================================================
  sortByVne() {
    // console.log('Order by Vne asked');
    if (this.myOrder != 'vneup' && this.myOrder != 'nothing') {
      this.myOrder = 'vneup';
      this.sortByVneAsc();
      // console.log('Let\'s go to up');
    } else {
      if (this.myOrder == 'vneup') {
        this.myOrder = 'vnedown';
        this.sortByVneDesc();
        // console.log('Let\'s go to down');
      }
    }
  }

  private getNameOfVne(ele: MyMediaInfo) {
    for (let m in ele.videoSupportPaths) {
      for (let i of this.listIdVneToName) {
        if (i.idVideoNameExport === ele.videoSupportPaths[m].id_video_name_export) {
          return i.nameExport;
        }
      }
    }

    return '0';
  }

  private sortByVneAsc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: MyMediaInfo[] = this.tablepage.content;
    let conv = this.listIdVneToName;
    if (mytable.length > 1) {
      var mynewtable: MyMediaInfo[] = [];
      while (mytable.length > 0) {
        let nb = 0;
        let valOne = mytable[0].videoSupportPaths[0].id_video_name_export;
        for (var j = 1; j < mytable.length; j++) {
          //if((valOne).localeCompare(mytable[j].videoSupportPaths[0].title, 'fr')>0){
          if (valOne > mytable[j].videoSupportPaths[0].id_video_name_export) {
            valOne = mytable[j].videoSupportPaths[0].id_video_name_export;
            nb = j;
          }
        }
        //Add mytable[nb] to mynewtable
        mynewtable = mynewtable.concat(mytable[nb]);
        // delete MyMediaInfo of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

  private sortByVneDesc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: MyMediaInfo[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: MyMediaInfo[] = [];
      while (mytable.length > 0) {
        let nb = 0;
        let valOne = mytable[0].videoSupportPaths[0].id_video_name_export;
        for (var j = 1; j < mytable.length; j++) {
          if (valOne < mytable[j].videoSupportPaths[0].id_video_name_export) {
            valOne = mytable[j].videoSupportPaths[0].id_video_name_export;
            nb = j;
          }
        }
        //Add mytable[nb] to mynewtable
        mynewtable = mynewtable.concat(mytable[nb]);
        // delete MyMediaInfo of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

  private getListIdVneToName() {
    this.catalogueService.getRessource('/videouser/lVneIdToName')
      .subscribe(data => {
        this.listIdVneToName = null;
        //@ts-ignore
        this.listIdVneToName = data;
        this.sortListIdVneToName(this.listIdVneToName);
        // console.log(this.listIdVneToName)
      }, err => {
        console.log(err);
      });
  }

  private sortListIdVneToName(listToSort: Vnelight[]) {
    var mynewtable: Vnelight[] = [];
    if (listToSort.length > 1) {
      while (listToSort.length > 0) {
        let nb = 0;
        //@ts-ignore
        let valOne = listToSort[0].nameExport;
        for (var j = 1; j < listToSort.length; j++) {
          //@ts-ignore
          if ((valOne).localeCompare(listToSort[j].nameExport, 'fr') > 0) {
            //@ts-ignore
            valOne = listToSort[j].nameExport;
            nb = j;
          }
        }
        //Add listToSort[nb] to mynewtable
        mynewtable = mynewtable.concat(listToSort[nb]);
        listToSort.splice(nb, 1);
      }
    }
    this.listIdVneToName = mynewtable;
  }

  private getnameVneWithId(id: number) {
    if (this.listIdVneToName != null) {
      for (let i in this.listIdVneToName) {
        if (id === this.listIdVneToName[i].idVideoNameExport) {
          return this.listIdVneToName[i].nameExport;
        }
      }
    }
  }


  getMoreInfo(ele: MyMediaInfo) {
    ele.state = 2;
  }

  removeMoreInfo(ele: MyMediaInfo) {
    ele.state = 1;
  }

  getTitles(ele: MyMediaInfo) {
    let lvsp: VideoSupportPaths[] = ele.videoSupportPaths;
    var titles: Onetitle[] = [];
    for (let vsp of lvsp) {
      let mytitle: Onetitle = {
        'title': vsp.title,
        'namevne': this.getnameVneWithId(vsp.id_video_name_export)
      };
      titles = titles.concat(mytitle);
    }
    return titles;
  }

  showSelectedText($event) {
    var text = '';
    if (window.getSelection) {
      text = window.getSelection().toString();
      //@ts-ignore
    } else if (document.selection && document.selection.type != 'Control') {
      //@ts-ignore
      text = document.selection.createRange().text;
      console.log(text);
    }
    if (text === '') {
      return;
    } else {
      let element = $event.target.parentNode.parentElement.parentElement;
      let idelement = element.getElementsByClassName('titlemmi')[0].id;
      // console.log(element);
      let val = {'keys': text, 'ele': idelement};
      this.onSubmitSearch(val);
    }
  }

  gotosearch(ele: MyMediaInfo) {
    ele.search = 1;
  }

  onSubmitSearch(value: any) {
    for (let mmi of this.tablepage.content) {
      if (mmi.idMyMediaInfo === value.ele) {
        mmi.search = 0;
        //TODO Add tmmi
        let idmmi = 0;
        if (mmi.typeMmi != null) {
          idmmi = mmi.typeMmi.idTypeMmi;
        }
        this.catalogueService.postRessourceWithData('/video/requesttoimdb/'
          + idmmi, (value.keys))
          .subscribe(data => {
            mmi.search = 2;
            //@ts-ignore
            mmi.myressearch = data;
          }, err => {
            console.log(err);
          });
        break;
      }
    }
  }

  private linkMmi(mylink: string, ele: MyMediaInfo) {
    if (!this.waitingwork) {
      this.waitingwork = true;
      if (mylink != '' && ele != null) {
        ele.state = 2;
        var vf: VideoFilms;
        this.catalogueService.postRessourceWithData('/managment/getVideoFilm/'
          + ele.idMyMediaInfo, (mylink))
          .subscribe(data => {
            this.waitingwork = false;
            //@ts-ignore
            vf = data;
            var eletbl: MyMediaInfo[] = [];
            for (let mmi of this.tablepage.content) {
              if (mmi.state == 2) {
                eletbl = eletbl.concat(mmi);
              }
            }
            this.linkIdttWithIdmmi(vf, eletbl);
          }, err => {
            this.waitingwork = false;
            console.log(err);
          });
      }
    }
  }

  closesearchImdbresult(idMyMediaInfo: string) {
    for (let mmi of this.tablepage.content) {
      if (mmi.idMyMediaInfo === idMyMediaInfo) {
        mmi.search = 0;
      }
    }
  }

  // Edit typeName
  callEdit(ele: MyMediaInfo) {
    // console.log(ele.typeMmi);
    if (ele.typeMmi == null || ele.typeMmi.typeName.idTypeName == 0) {
      //@ts-ignore
      var tm: typeMmi = {
        'idTypeMmi': 0,
        'episode': 0, 'season': 0,
        'nameSerie': '', 'nameSerieVO': '',
        'myMediaInfo': ele,
        'typeName': this.listTypeNameWithId[0]
      }; // Init with film
      ele.typeMmi = tm;
    }
    this.choice = ele.typeMmi.typeName.idTypeName;
    ele.editTypeName = 1;
  }

  submitChangeTypeMmi(eletypeMmi, id) {
    let vf = eletypeMmi.videoFilm;
    var tm = {
      'idTypeMmi': eletypeMmi.idTypeMmi,
      'episode': eletypeMmi.episode,
      'season': eletypeMmi.season,
      'nameSerie': eletypeMmi.nameSerie,
      'nameSerieVO': eletypeMmi.nameSerieVO,
      'myMediaInfo': [],
      'videoFilms': eletypeMmi.videoFilm,
      'typeName': eletypeMmi.typeName
    };
    this.catalogueService.postRessource('/video/savetypemmi/'
      + id + '/' + eletypeMmi.videoFilm.idVideo, tm)
      .subscribe(data => {
        for (let mmi of this.tablepage.content) {
          if (mmi.idMyMediaInfo === id) {
            //@ts-ignore
            mmi.typeMmi = data;
            mmi.typeMmi.videoFilm = vf;
            mmi.editTypeName = 0;
            break;
          }
        }
      }, err => {
        console.log(err);
      });

  }

  cancelTypeName(ele) {
    console.log(ele);
    ele.editTypeName = 0;
    if (ele.typeMmi.idTypeMmi == 0) {
      //@ts-ignore
      let tn: typeName = {
        'idTypeName': 0,
        'typeName': ''
      };
      ele.typeMmi.typeName = tn;
    }
  }

  getAlltyname() {
    this.listTypeName = [];
    this.catalogueService.getRessource('/videouser/getAllTypeName')
      .subscribe(data => {
        if (data != []) {
          for (let i in data) {
            this.listTypeName = this.listTypeName.concat(data[i]);
          }
        }
      }, err => {
        console.log(err);
      });
  }


  getAlltynameWithId() {
    this.listTypeNameWithId = [];
    this.catalogueService.getRessource('/videouser/getAllTypeNameWithId')
      .subscribe(data => {
        if (data != null) {
          //@ts-ignore
          this.listTypeNameWithId = data;
        }
      }, err => {
        console.log(err);
      });

  }

  closeSearchImdb(idMyMediaInfo: string) {
    for (let mmi of this.tablepage.content) {
      if (mmi.idMyMediaInfo === idMyMediaInfo) {
        mmi.search = 0;
      }
    }
  }


  linkIdttWithIdmmi(vf: VideoFilms, eletbl: MyMediaInfo[]) {
    var idvf = vf.idVideo;
    let ele = eletbl[0];
    if (idvf != '' && ele.idMyMediaInfo != '') {
      this.catalogueService.getRessource('/video/linkIdttWithIdmmi/' + ele.idMyMediaInfo + '/' + idvf)
        .subscribe(data => {
          if (data != null) {
            //@ts-ignore
            let vf: videoFilms = data;
            if (vf != null) {
              ele.myressearch = null;
              this.catalogueService.getRessource('/video/gettypemmiwithidmmi/' + ele.idMyMediaInfo)
                .subscribe(data => {
                  //@ts-ignore
                  let typemmi: typeMmi = data;
                  ele.typeMmi = typemmi;

                  //TODO: UpdateVideoFilm
                  ele.typeMmi.videoFilm=vf;

                  eletbl.splice(0, 1);
                  if (eletbl.length > 0) {
                    this.linkIdttWithIdmmi(vf, eletbl);
                  }
                }, err => {
                  console.log(err);
                });
              ele.state = 3;
              ele.search = 3;
            } else {
              console.log(vf);
            }
          }
        }, err => {
          console.log(err);
        });
    }
  }

  actors1toN(videoFilmArtists: VideoFilmArtist[]) {
    let n = this.numberActorsWanted;//NumberActorsWanted
    n++;
    var vfa: VideoFilmArtist[] = [];
    for (let act of videoFilmArtists) {
      if (act.actor == true) {
        if (act.numberOrderActor <= n) {
          vfa = vfa.concat(act);
        }
      }
    }
    //SORT by number
    var actors: videoArtist[] = [];
    if (vfa.length > 1) {
      while (vfa.length > 1) {
        var act = vfa[0].numberOrderActor;
        var nb = 0;
        for (var i = 1; i < vfa.length; i++) {
          if (act > vfa[i].numberOrderActor) {
            act = vfa[i].numberOrderActor;
            nb = i;
          }
        }
        actors = actors.concat(vfa[nb].videoArtist);
        vfa.splice(nb, 1);
      }
    } else {
      if (vfa.length == 1) {
        actors = actors.concat(vfa[0].videoArtist);
      }
    }
    return actors;
  }

  directors(videoFilmArtists: VideoFilmArtist[]) {
    var directors: videoArtist[] = [];
    for (let dir of videoFilmArtists) {
      if (dir.director == true) {
        directors = directors.concat(dir.videoArtist);
      }
    }
    return directors;
  }

  writers(videoFilmArtists: VideoFilmArtist[]) {
    var writers: videoArtist[] = [];
    for (let dir of videoFilmArtists) {
      if (dir.writer == true) {
        writers = writers.concat(dir.videoArtist);
      }
    }
    return writers;
  }

  getImg(urlImg) {
    return urlImg[0].ulrImg;
  }

  nmclicked(nm: string) {
    // console.log(nm);
  }

  nmdbclicked(nm: videoArtist) {
    this.textFilter = nm.firstLastName;
    this.checkboxFlag = false;
    this.page = 1;
    this.getPageMmi();
  }

  togglesearch(ele: MyMediaInfo) {
    console.log(ele);
    if (ele.search == 3) {
      for (let mmi of this.tablepage.content) {
        if (mmi.idMyMediaInfo === ele.idMyMediaInfo) {
          mmi.search = 1;
        }
      }
    } else if (ele.search <= 1 && ele.typeMmi != null) {
      if (ele.typeMmi.videoFilm != null) {
        for (let mmi of this.tablepage.content) {
          if (mmi.idMyMediaInfo === ele.idMyMediaInfo) {
            mmi.search = 3;
          }
        }
      }
    }
    console.log(ele);
  }


  onVideoFilmModify($event: any) {
    //@ts-ignore
    let eleRemote: videoFilms = $event;
    for (var ele of this.tablepage.content) {
      if (ele.typeMmi != null &&
        ele.typeMmi.videoFilm != null) {
        if (ele.typeMmi.videoFilm.idVideo == eleRemote.idVideo) {
          ele.typeMmi.videoFilm = eleRemote;
        }
      }
    }
  }

  myswiperight() {
    this.decr('valuepage');
  }

  myswipeleft() {
    this.incr('valuepage');
  }

  onTouch(args: any) {
    console.log(
      'Touch point: [' + args.getX() + ', ' + args.getY() +
      '] activePointers: ' + args.getActivePointers().length);
  }

  /*  checkboxfilterchange($event: Event) {
      this.page = 1;
      this.getPageMmi();
    }*/

  checkboxfilterchange2(value: boolean) {
    this.checkboxfilterFlag = value;
    this.page = 1;
    this.getPageMmi();
  }

  actionAddToBasket(id: string) {
    this.messageService.sendMessage(id);
    this.messageService.clearMessages();
  }

  addSub() {
    this.toggleaddsub = !this.toggleaddsub;
    if (this.toggleaddsub) {
      let date = new Date();
      let datestr = date.toString();
      this.subscribe = {
        'id': null,
        'active': true,
        'idToSub': this.listuserstosub[0],
        'name': '',
        'valueMin': 60,
        'valueMax': 99,
        'nbOfresultMin': 6,
        'nbOfresultMax': 10,
        'dateModif': date,
      };
    }
  }

  private getlistuserstosub() {
    this.catalogueService.getRessource('/videouser/listuserstosub')
      .subscribe(data => {
        //@ts-ignore
        this.listuserstosub = data;
      }, err => {
        console.log(err);
      });
  }

  setlistuserstosub(event) {
    this.subscribe.idToSub = event.target.value;
    if (this.subscribe.idToSub === 'name') {
      this.askName = true;
    } else {
      this.askName = false;
    }
  }

  askAddSub() {
    this.toggleaddsub = false;
    this.catalogueService.postRessourceWithData('/videouser/subscribe', this.subscribe)
      .subscribe(data => {
        //@ts-ignore
        var psws: PreferenceSubscribeWithScore = data;

        var test = false;
        if (this.lpsws.length != 0) {
          for (let nbpswspresent in this.lpsws) {
            if (this.lpsws[nbpswspresent].preferencesSubscribe.idToSub ===
              psws.preferencesSubscribe.idToSub) {
              this.lpsws[nbpswspresent] = psws;
              test = true;
            }
          }
        }
        if (!test) {
          this.lpsws = this.lpsws.concat(psws);
        }
      }, err => {
        console.log(err);
      });
  }

  private getAllSubscribes() {
    this.catalogueService.getRessource('/videouser/getallsubscribes')
      .subscribe(data => {
        //@ts-ignore
        this.lpsws = data;
      }, err => {
        console.log(err);
      });
  }

  getDateSub(psws: PreferenceSubscribeWithScore) {
    if (psws.dateask == 0) {
      return 'now <-> ' + this.datestr(psws.datePrevious);
    } else {

      if (psws.dateask > 0) {
        return this.datestr(psws.dateModif)
          + ' <-> ' + this.datestr(psws.datePrevious);
      }
    }
  }

  private datestr(date: Date) {
    var d = new Date(date);

    var datestring =
      d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    return datestring;
  }

  submitvalidation(psws: PreferenceSubscribeWithScore) {
    let id = psws.preferencesSubscribe.id;
    this.catalogueService.getRessource('/videouser/validationsubscribe/' + id)
      .subscribe(data => {
        //@ts-ignore
        this.insertPSinList(data);
      }, err => {
        console.log(err);
      });
  }

  nextDate(psws: PreferenceSubscribeWithScore) {
    if (psws.dateask > 0) {
      psws.dateask = psws.dateask - 1;
      this.getOneSubscribe(psws);
    }
  }

  previousDate(psws: PreferenceSubscribeWithScore) {
    psws.dateask = psws.dateask + 1;
    this.getOneSubscribe(psws);
  }

  getstatechevron(psws: PreferenceSubscribeWithScore) {
    let id = 'idSub-' + psws.preferencesSubscribe.id;
    let spanchevron = document.getElementById(id);
    if (spanchevron == null) {
      return false;
    }
    return spanchevron.className === 'glyphicon glyphicon-chevron-right' ? false : true;
  }

  getOneSubscribe(psws: PreferenceSubscribeWithScore) {
    if (psws.dateask >= 0) {
      this.catalogueService.getRessource('/videouser/getOneSubscribe/' +
        psws.dateask + '/' + psws.preferencesSubscribe.id)
        .subscribe(data => {
          //@ts-ignore
          this.insertPSinList(data);
        }, err => {
          console.log(err);
        });
    }
  }

  private insertPSinList(data: PreferencesSubscribe/*, statechevron: boolean*/) {
    if (this.lpsws != null) {
      if (this.lpsws.length != 0) {
        var test = false;
        for (let pos in this.lpsws) {
          //@ts-ignore
          if (this.lpsws[pos].preferencesSubscribe.id == data.preferencesSubscribe.id) {
            test = true;
            //@ts-ignore
            this.lpsws[pos] = data;
          }
        }
        if (!test) {
          //@ts-ignore
          this.lpsws = this.lpsws.concat(data);
        }
      } else {
        //@ts-ignore
        this.lpsws = this.lpsws.concat(data);
      }
    } else {
      this.lpsws = [];
      //@ts-ignore
      this.lpsws = this.lpsws.concat(data);
    }
  }

  toggleContentSub(id: number) {
    let pos = this.getPosChevron(id);
    if (pos >= 0) {
      this.listchevrondown.splice(pos, 1);
    } else {
      this.listchevrondown = this.listchevrondown.concat(id);
    }
  }

  getPosChevron(id: number) {
    return this.listchevrondown.indexOf(id);
  }

  posChevronDown(id: number) {
    return this.getPosChevron(id) >= 0;
  }

  refreshSub() {
    // console.log('refresh sub');
    this.lpsws = [];
    this.getAllSubscribes();
  }

  filteron(idVideoFilm: string) {
    this.checkboxFlag = true;
    this.checkboxfilterFlag = false;
    this.vneName = '';
    this.toggleSelectorVne(false);
    this.filtertt = idVideoFilm;
    this.textFilter = idVideoFilm;
    this.getPageMmi();
  }

  oneIdTTisCall(event) {
    this.filteron(event);
  }

  onewindowopen(event: InfoWindow) {
    this.mywindowService.sendMessage(event);
    this.mywindowService.clearMessages();
  }

  saveComment(idVideo: string) {
    if (this.mycomment.length > 0) {
      this.dboxpos = false;
      if (this.mycomment.length > 1024) {
        this.mycomment = this.mycomment.substring(0, 1023);
      }
      this.catalogueService.postRessourceWithData('/videouser/postcommentvideo/'
        + idVideo, this.mycomment)
        .subscribe(data => {
          console.log(data);
          // return one videoFilm -> dispatch in all current page
          for (let mmi of this.tablepage.content) {
            if (mmi.typeMmi != null) {
              if (mmi.typeMmi.videoFilm != null
                && mmi.typeMmi.videoFilm.idVideo == idVideo) {
                //@ts-ignore
                mmi.typeMmi.videoFilm = data;
              }
            }
          }
        }, err => {
          console.log(err);
        });
    }
  }

  tachange() {
    this.nbchar = 1024 - this.mycomment.length;
    if (this.nbchar < 0) {
      this.overf = true;
    } else {
      this.overf = false;
    }
  }

  togglecommentbox(idMyMediaInfo: string) {
    if (!this.dboxpos) {
      this.mycomment = '';
      this.dboxpos = true;
      this.dboxid = idMyMediaInfo;
      let iw: InfoWindow = {
        idMmi: idMyMediaInfo,
        nameWindow: 'commentvideo',
        codeName: 3,
        status2come: true
      };
      //TODO:send msg
      this.onewindowopen(iw);
    } else {
      if (idMyMediaInfo == this.dboxid) {
        this.dboxpos = false;
        this.dboxid = '';
      } else {
        this.mycomment = '';
        this.dboxid = idMyMediaInfo;
      }
    }
  }

  tachg() {
    this.nbchar = 1024 - this.mycomment.length;
    if (this.nbchar < 0) {
      return this.mycomment.length - 1024 + ' characters will be troncate';
    } else {
      return this.nbchar + ' characters remaining';
    }
  }

  private messageWindowOpen(messagesWindow: InfoWindow) {
    if (messagesWindow.status2come) {
      this.dboxid = messagesWindow.idMmi;
      this.mycomment = '';
      this.nbremake = '';
      if (messagesWindow.nameWindow === 'commentvideo') {
        this.dboxpos = true;
        this.dboxremake = false;
      } else {
        if (messagesWindow.nameWindow === 'remakevideo') {
          this.dboxpos = false;
          this.dboxremake = true;
        } else {
          this.dboxpos = false;
          this.dboxremake = false;
        }
      }

    }
  }

  toggleremakebox(idMyMediaInfo: string) {
    if (!this.dboxremake) {
      this.nbremake = '';
      let iw: InfoWindow = {
        idMmi: idMyMediaInfo,
        nameWindow: 'remakevideo',
        codeName: 6,
        status2come: true
      };
      this.onewindowopen(iw);
    } else {
      if (idMyMediaInfo == this.dboxid) {
        this.dboxremake = false;
        this.dboxid = '';
      } else {
        this.mycomment = '';
        this.dboxid = idMyMediaInfo;
      }
    }
  }

  saveIdTT(idVideo: string) {
    if (this.nbremake.length > 7) {
      this.dboxremake = false;
      this.dboxid = '';
      this.catalogueService.getRessource('/video/setremake/' + idVideo + '/' + this.nbremake)
        .subscribe(data => {
          //@ts-ignore
          let rem: Remake = data;
          rem.active = false;
          rem.titles = [];
          for (let mmi of this.tablepage.content) {
            if (mmi.typeMmi != null && mmi.typeMmi.videoFilm != null) {
              for (let i = 0; i < rem.remakes.length; i++) {
                if (rem.remakes[i] === mmi.typeMmi.videoFilm.idVideo) {
                  let rem2: Remake = {
                    active: rem.active,
                    idVideo: mmi.typeMmi.videoFilm.idVideo,
                    remakes: rem.remakes.slice(),
                    titles: []
                  };
                  mmi.typeMmi.videoFilm.remake = rem2;
                }
              }
            }

          }
          for (let re of rem.remakes) {
            let twi = {
              idtt: re,
              title: ''
            };
            this.ltitileWithIdtt = this.ltitileWithIdtt.concat(twi);
          }
          this.ltitileWithIdtt = this.mergeListTitleWithIdtt(this.ltitileWithIdtt);
          this.searchTitltForListTitleWithIdtt(this.ltitileWithIdtt);
        }, err => {
          console.log(err);
        });

    } else {
      console.log('Wrong id, nbremake : ' + this.nbremake);
    }
  }

  private mergeListTitleWithIdtt(ltwi: TitileWithIdttt[]) {
    if (ltwi.length > 1) {
      for (let i = 0; i < ltwi.length - 1; i++) {
        for (let j = ltwi.length - 1; j > i; j--) {
          if (ltwi[i].idtt === ltwi[j].idtt) {
            ltwi.splice(j, 1);
          }
        }
      }
    }
    return ltwi;
  }

  private searchTitltForListTitleWithIdtt(ltitileWithIdtt: TitileWithIdttt[]) {
    if (ltitileWithIdtt.length > 0) {
      this.searchTitltForListTitleWithIdttRecurvive(ltitileWithIdtt, 0);
    }
  }

  private searchTitltForListTitleWithIdttRecurvive(ltitileWithIdtt: TitileWithIdttt[], pos: number) {

    if (ltitileWithIdtt[pos].title == '') {
      let test = false;
      for (let id of this.tablepage.content) {
        if (id.typeMmi != null
          && id.typeMmi.videoFilm != null
          && id.typeMmi.videoFilm.idVideo === ltitileWithIdtt[pos].idtt) {
          ltitileWithIdtt[pos].title = id.typeMmi.videoFilm.videoTitles[0].title;
          test = true;
          break;
        }
      }
      if (!test) {
        this.catalogueService.postRessource('/videouser/getTitleWithId',
          ltitileWithIdtt[pos])
          .subscribe(data => {
            //@ts-ignore
            let ti: TitileWithIdttt = data;
            for (let idti of this.ltitileWithIdtt) {
              if (idti.idtt === ti.idtt) {
                idti.title = ti.title;
              }
            }
            if (ltitileWithIdtt.length > (pos + 1)) {
              pos = pos + 1;
              this.searchTitltForListTitleWithIdttRecurvive(ltitileWithIdtt, pos);
            } else {
              this.ltitileWithIdtt = ltitileWithIdtt;
              this.updatetitlesforremake();
            }
          }, err => {
            console.log(err);
          });
      } else {
        if (ltitileWithIdtt.length > (pos + 1)) {
          pos = pos + 1;
          this.searchTitltForListTitleWithIdttRecurvive(ltitileWithIdtt, pos);
        } else {
          this.ltitileWithIdtt = ltitileWithIdtt;
          this.updatetitlesforremake();
        }
      }
    } else {
      if (ltitileWithIdtt.length > (pos + 1)) {
        pos = pos + 1;
        this.searchTitltForListTitleWithIdttRecurvive(ltitileWithIdtt, pos);
      } else {
        this.ltitileWithIdtt = ltitileWithIdtt;
        this.updatetitlesforremake();
      }
    }

  }

  getTitle(remake: Remake, idVideo: string) {
    let lstr: string[] = [];
    for (let rem of remake.remakes) {
      if (rem != idVideo) {
        for (let ti of this.ltitileWithIdtt) {
          if (ti.idtt === rem) {
            lstr = lstr.concat(ti.title);
          }
        }
      }
    }
    this.allremarkes = true;
    return lstr;
  }

  private updatetitlesforremake() {
    for (let mmi of this.tablepage.content) {
      if (mmi.typeMmi != null
        && mmi.typeMmi.videoFilm != null
        && mmi.typeMmi.videoFilm.remake != null
        && mmi.typeMmi.videoFilm.remake.remakes.length != 0) {
        mmi.typeMmi.videoFilm.remake.active = false;
        mmi.typeMmi.videoFilm.remake.titles = [];
        let tblstr: string[] = [];
        for (let rem of mmi.typeMmi.videoFilm.remake.remakes) {
          if (rem !== mmi.typeMmi.videoFilm.idVideo) {
            let str = this.gettitlewithidvf(rem);
            if (str != '') {
              tblstr = tblstr.concat(str);
            }
          }
        }
        mmi.typeMmi.videoFilm.remake.titles = tblstr;
        mmi.typeMmi.videoFilm.remake.active = true;
      }
    }
  }

  private gettitlewithidvf(rem: string) {
    for (let str of this.ltitileWithIdtt) {
      if (str.idtt == rem) {
        return str.title;
      }
    }
    return '';
  }

}
