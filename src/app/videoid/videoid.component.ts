import {Component, HostListener, OnInit} from '@angular/core';
import {CatalogueService} from '../catalogue.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {CookieService} from 'ngx-cookie-service';
import {UpdateurlService} from '../updateurl.service';
import {Subscription} from 'rxjs';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-videoid',
  templateUrl: './videoid.component.html',
  styleUrls: ['./videoid.component.css']
})
export class VideoidComponent implements OnInit {

  isShow: boolean;
  topPosToStartShowing = 500;

  public state_title: boolean;
  public titleVideo: string;

  public seriename: string;
  public country: string = '';

  public nameArtist: string;
  public namereadySel: number;
  public keywordNameIsSel: number;
  public showNameready: Boolean;
  public roleIs: string[];
  public roleList: Roles;
  public showListRole: boolean;

  public state_name: boolean = false;
  public state_language: boolean = false;
  public state_keyword: boolean = false;
  public state_keywords: boolean = false;
  public state_kind: boolean = false;
  public state_country: boolean = false;
  public state_type: boolean = false;
  public state_season: boolean = false;
  public state_episode: boolean = false;
  public state_score: boolean = false;
  public state_year: boolean = false;
  public state_duration: boolean = false;
  public state_width: boolean = false;
  public state_import: boolean = false;
  public state_pagesize: boolean = false;
  public state_sort: boolean = false;
  public state_seriename: boolean = false;
  private listUserIsShow: boolean = false;

  charsready: string[];
  charsreadyName: string[];
  charsreadySel: number;
  showcharsready: Boolean;

  keywordTitleIs: string[];
  keywordsTitleIs: string[];
  keywordTitleIsSel: number;
  keywordsTitleIsSel: number;
  keywordTitleSerieIsSel: number;
  keywordCountryIsSel: number;
  keywordfilmIsSel: number;
  keywordsfilmIsSel: number;

  showkeywordTitleIs: Boolean;
  showkeywordsTitleIs: Boolean;
  showkeywordTitleSerieIs: Boolean;
  showkeywordCountryIs: Boolean;
  showkeywordNameIs: boolean;

  // private page: number;
  private size: number;
  private tablepage: MyPageVideo;
  scoreMin: number;
  scoreMax: number;
  pageSize: number;
  pageNumber: number;
  yearMin: number;
  yearMax: number;
  durationMin: number;
  durationMax: number;
  widthMin: number;
  widthMax: number;
  seasonMin: any;
  seasonMax: any;
  episodeMin: any;
  episodeMax: any;
  requestRun: boolean;
  askrequestRun: boolean = false;
  typeName: TypeName[];
  showTypeIs: Boolean;
  showImportIs: Boolean;
  showKindIs: Boolean;
  showKindIsNot: Boolean;
  isMenuScoreShow: boolean;
  private yearMayNull: boolean;
  private scoreMayNull: boolean;
  // private httpClient: any;
  private idtypeinstr: string;
  private showRoleIs: boolean;
  private rolesKey: string;

  listUserScore: UserLight[];
  RemainingListUserScore: UserLightWithScore[];
  // Use for Roles
  objectKeys = Object.keys;
  private state_scoreUsers: boolean;
  private scoreUsers: string;
  private scoreUsersMaynull: string;
  private scoreUsersMin: string;
  private scoreUsersMax: string;
  public listIdVneToName: Vnelight[];
  listeMmi: MyMediaInfo[];
  private importStr: string = '';
  private valueInit: number = 0;
  private valueInitReference: number;
  private listVideoKind: VideoKind[] = [];
  private listVideoKindNot: VideoKind[] = [];
  private kindStr: string = '';
  private keywordsStr = '';
  private languagesStr = '';
  private listKeyword: KeywordAndVFSize[] = [];
  keywordfilm: string = '';
  keywordsfilm: string = '';
  languagesfilm: string = '';
  private showkeywordfilmIs: boolean;
  private showkeywordsfilmIs: boolean;
  private showkeywordslanguageIs: boolean = false;
  keysToInternalFunction: boolean = true;
  private lastKeyIsAnArrow: boolean = false;
  private charsreadyKeyworsSel: number = 1;
  private charsreadyKeyworsSelLanguage: number = 1;
  private lkeywords: KeywordAndVFSize[] = [];
  private lkeywordsToShow: KeywordAndVFSize[] = [];
  private lkeywordsIsShow = false;
  private lLanguages: MyMediaLanguageAndNbMmi[] = [];
  private lLanguagesToShow: MyMediaLanguageAndNbMmi[] = [];
  private lLanguagesIsShow = false;
  public listWindowOpen: string[] = [];
  private href: string;
  private kindNotStr: string = '';
  private language: string = '';
  private sortList: string[];
  private sortValue: number = 2;
  private sortOrder: boolean = false;
  // private sortIsNotActive: boolean = false;
  private scoreuser: number;
  private commentScoreUser: string = '';
  private userId: number;
  private oneclicks: number = 0;
  private userToSort: UsertoSort;
  private subscription: Subscription;
  private messagesurl: any[] = [];
  private usrsel: string;
  private userSel4Score: string;

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    // console.log('[scroll]', scrollPosition);
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  constructor(
    private catalogueService: CatalogueService,
    private route: ActivatedRoute,
    private router: Router,
    private appComponent: AppComponent,
    private cookieService: CookieService,
    private updateurl : UpdateurlService,
    public fb: FormBuilder) {
    this.subscription = this.updateurl.getMessage().subscribe(messageurl => {
      if (messageurl) {
        this.messagesurl.push(messageurl);
        console.log('****************', messageurl.text);
        this.valueInit=0;
        this.initWithUrl();

        // this.addToBasket(message.text);
      } else {
        // clear messages when empty message received
        this.messagesurl = [];
      }
    });
  }

  /*########### Form ###########*/
  listUser = this.fb.group({
    usrsel: ''
  })

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    //console.log(event.key)
    if (event.key === 'Enter') {
      // console.log('Enter is pressed');
    }
    if (event.key === 'ArrowRight' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown') {
      this.lastKeyIsAnArrow = true;
    } else {
      this.lastKeyIsAnArrow = false;
    }
    if (this.keysToInternalFunction) {
      switch (event.key) {
        case('ArrowRight'):
          this.incr('valuepage');
          break;
        case('ArrowLeft'):
          this.decr('valuepage');
          break;
        case('ArrowUp'):
          // this.incr('valuesize');
          this.pageSize++;
          this.dataChange('pageSize');
          break;
        case('ArrowDown'):
          // this.decr('valuesize');
          this.pageSize--;
          this.dataChange('pageSize');
          break;
      }
    }
  }

  @HostListener('window:click', ['$event.target'])
  onClick(targetElement: HTMLElement) {
    this.testClick(targetElement);
  }

  focusin() {
    this.keysToInternalFunction = false;
  }

  focusout() {
    this.keysToInternalFunction = true;
  }

  ngOnInit() {
    this.requestRun = true;
    this.listIdVneToName = [];
    this.requestRun = false;
    this.pageNumber = 1;
    this.titleVideo = '';
    this.isMenuScoreShow = false;

    this.seriename = '';

    this.seasonMin = 0;
    this.seasonMax = 100;
    this.episodeMin = 0;
    this.episodeMax = 1000;
    this.durationMin = 80;
    this.durationMax = 140;
    this.widthMin = 600;
    this.widthMax = 4000;

    this.yearMayNull = true;
    this.scoreMayNull = true;

    this.namereadySel = 1;
    this.showNameready = false;
    this.keywordNameIsSel = 1;
    this.showkeywordNameIs = false;
    this.showRoleIs = false;
    this.showListRole = false;
    this.roleList = {
      'actor': true,
      'director': true,
      'music': true,
      'producer': true,
      'writer': true,
    };
    this.roleIs = ['actor', 'director', 'music', 'producer', 'writer'];

    this.sortList = ['iddb', 'score', 'year'];
    this.sortValue = 2;
    this.sortOrder = false;
    this.userToSort = {
      'user': 'DB',
      'id': 0,
    };

    this.charsreadySel = 1;
    this.showcharsready = false;
    this.charsready = ['exact', 'except ponct.',
      '1 char error~0.1sec/c', '2 c. errors~1sec/c', '3 c. errors~10sec/c'];
    this.charsreadyName = ['exact', 'except ponct.',
      '1 char error~0.1sec/c', '2 char errors~1sec/c'];
    this.keywordTitleIsSel = 1;
    this.keywordsTitleIsSel = 1;
    this.keywordTitleSerieIsSel = 1;
    this.keywordCountryIsSel = 1;
    this.keywordfilmIsSel = 1;
    this.keywordsfilmIsSel = 1;
    this.showkeywordTitleIs = false;
    this.showkeywordsTitleIs = false;
    this.showkeywordTitleSerieIs = false;
    this.showkeywordCountryIs = false;
    this.keywordTitleIs = ['exact', 'contain', 'begin', 'finish'];

    this.listeMmi = [];



    // Start by counting functions before starting (5 functions here)
    this.valueInit = 0;
    this.valueInitReference = 9;
    this.requestRun = true;
    this.initWithUrl();
    this.appComponent.getNewJwt();
    this.initPageSizeWithCookie();

  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  initWithUrl(){
    this.readOptionsUrl(); //Fct 1
    this.getAllTypeName(); //Fct 2
    this.listForScores(); //Fct 3
    this.getListIdVneToName(); //Fct 4
    this.getAllKinds(); //Fct 5 & 6 & 7
    this.getKeywords(); //Fct 8
    this.getLanguages(); //Fct 9
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  readOptionsUrl() {
    this.pageSize = this.searchAndParseToInt('pageSize',
      5, 1, 99999);
    this.pageNumber = this.searchAndParseToInt('pageNumber',
      1, 1, 99999);
    this.scoreMin = this.searchAndParseToInt('scoreMin',
      0, 0, 99);
    this.scoreMax = this.searchAndParseToInt('scoreMax',
      99, 0, 99);
    this.scoreMayNull = this.route.snapshot.queryParamMap.get('scoreMayNull')==='1';
    this.yearMin = this.searchAndParseToInt('yearMin',
      1880, 1880, 2100);
    this.yearMax = this.searchAndParseToInt('yearMax',
      2100, 1850, 2100);
    this.durationMin = this.searchAndParseToInt('durationMin',
      80, 0, 1000);
    this.durationMax = this.searchAndParseToInt('durationMax',
      140, 0, 1000);
    this.widthMin = this.searchAndParseToInt('widthMin',
      600, 0, 10000);
    this.widthMax = this.searchAndParseToInt('widthMax',
      4000, 0, 10000);

    this.nameArtist = this.searchAndParseToStringWithOption('name',
      'charsNamereadySel', 'keywordNameIsSel', 'rolesKey');

    this.titleVideo = this.searchAndParseToStringWithOption('title',
      'charsreadySel', 'keywordTitleIsSel', '');

    this.keywordfilm = this.searchAndParseToStringWithOption('keywordfilm',
      '', 'keywordfilmIsSel', '');

    this.seriename = this.searchAndParseToStringWithOption('titleserie',
      '', 'keywordTitleSerieIsSel', '');

    this.country = this.searchAndParseToStringWithOption('country',
      '', 'keywordCountryIsSel', '');

    this.seasonMin = this.searchAndParseToInt('seasonMin',
      0, 0, 1000);
    this.seasonMax = this.searchAndParseToInt('seasonMax',
      100, 0, 100);

    this.episodeMin = this.searchAndParseToInt('episodeMin',
      0, 0, 1000);
    this.episodeMax = this.searchAndParseToInt('episodeMax',
      1000, 0, 1000);
    this.getSort();
    this.saveDataScoreUsers();
    this.saveDataImport();
    this.saveDataKind();
    this.saveDataKeywordStr();
    this.saveDataLanguagesStr();
    this.savesortOrder();
    this.start('readOptionsUrl');
  }

  private savesortOrder() {
    let sortUserStr = this.route.snapshot.queryParamMap.get('sortUser');
    if (sortUserStr != undefined) {
      let sortUser = parseInt(sortUserStr);
      this.userToSort = {
        'user': '',
        'id': sortUser,
      };
    }else{
      this.userToSort = {
        'user': 'DB',
        'id': 0,
      }
    }
  }

  private getSort() {
    var sortValue = this.route.snapshot.queryParamMap.get('sortValue');
    var sortOrder = this.route.snapshot.queryParamMap.get('sortOrder');
    if (sortValue != undefined) {
      this.state_sort = true;
      this.sortValue = parseInt(sortValue);
      this.sortOrder = parseInt(sortOrder) == 1;
    } else {
      this.sortOrder = false;
      this.sortValue = 2;

    }
  }

  private searcheAndParseFromListofstring(typename: string) {
    const ltn = this.route.snapshot.queryParamMap.get(typename);
    if (ltn != null && ltn.length != 0 && this.typeName != null
      && this.typeName.length != 0) {
      const ltntbl = ltn.split('-');
      this.typeName.forEach(tn => {
        var test = false;
        ltntbl.forEach(tnUrl => {
          if (tn.idTypeName.toString() === tnUrl) {
            test = true;
          }
        });
        tn.state = test;
      });
      this.state_type = true;
    } else {
      this.typeName.forEach(tn => {
        tn.state = true;
      });
      this.state_type = false;
      // this.typeName = [];
    }
  }

  private saveDataScoreUsers() {
// scoreUsers scoreUsersMin scoreUsersMax scoreUsersMaynull
    this.scoreUsers = this.route.snapshot.queryParamMap.get('scoreUsers');
    if (this.scoreUsers != null && this.scoreUsers.length > 0) {
      this.scoreUsersMin = this.route.snapshot.queryParamMap.get('scoreUsersMin');
      this.scoreUsersMax = this.route.snapshot.queryParamMap.get('scoreUsersMax');
      this.scoreUsersMaynull = this.route.snapshot.queryParamMap.get('scoreUsersMaynull');
    } else {
      this.scoreUsers = '';
    }
  }

  private saveDataImport() {
    this.importStr = this.route.snapshot.queryParamMap.get('importStr');
  }

  private saveDataKind() {
    this.kindStr = this.route.snapshot.queryParamMap.get('kindStr');
    this.kindNotStr = this.route.snapshot.queryParamMap.get('kindNotStr');
  }

  private saveDataKeywordStr() {
    this.keywordsStr = this.route.snapshot.queryParamMap.get('keywordsStr');
    if (this.keywordsStr !== null) {
      console.log(this.keywordsStr);
    } else {
      this.keywordsStr = '';
    }
  }

  private saveDataLanguagesStr() {
    this.languagesStr = this.route.snapshot.queryParamMap.get('languagesStr');
    if (this.languagesStr !== null) {
      console.log(this.languagesStr);
    } else {
      this.languagesStr = '';
    }
  }

  private readUrlToUpdateListUsersScore() {
    if (this.scoreUsers != null && this.scoreUsers != ''
      && this.RemainingListUserScore != null
      && this.RemainingListUserScore.length > 0) {

      var scoreUsersTbl = this.scoreUsers.split('-');
      var scoreUsersMinTbl = this.scoreUsersMin.split('-');
      var scoreUsersMaxTbl = this.scoreUsersMax.split('-');
      var scoreUsersMaynullTbl = this.scoreUsersMaynull.split('-');

      for (let i = 0; i < scoreUsersTbl.length; i++) {
        for (let r of this.RemainingListUserScore) {
          if (r.idMyUser.toString() === scoreUsersTbl[i]) {
            r.scoreMayNull = scoreUsersMaynullTbl[i] == '1';
            r.scoreMin = parseInt(scoreUsersMinTbl[i], 10);
            r.scoreMax = parseInt(scoreUsersMaxTbl[i], 10);
            r.used = true;
          }
        }
      }
      this.updateUrl();
    }
  }

  private readUrlToUpdateImportStr() {
    if (this.importStr != undefined && this.importStr.length > 0) {
      this.state_import = true;
      var importUrlTbl = this.importStr.split('-');
      this.listIdVneToName.forEach(idDb => {
        var test = false;
        importUrlTbl.forEach(idUrl => {
          if ((idDb.idVideoNameExport).toString() === idUrl) {
            test = true;
          }
        });
        idDb.state = test;
      });
      console.log(this.importStr);
      this.updateUrl();
    } else {
      // console.log('Pb : importStr is undefined or length = 0');
    }
  }

  private readUrlToUpdateKindStr() {
    if (this.kindStr != undefined && this.kindStr.length > 0) {
      this.state_kind = true;
      var kindUrlTbl = this.kindStr.split('-');
      var kindNotUrlTbl = this.kindNotStr.split('-');
      this.listVideoKind.forEach(idDb => {
        var test = false;

        kindUrlTbl.forEach(idUrl => {
          if ((idDb.idKind).toString() === idUrl) {
            test = true;
          }
        });
        if (test) {
          idDb.state = 1;
        }

        test = false;
        kindNotUrlTbl.forEach(idUrl => {
          if ((idDb.idKind).toString() === idUrl) {
            test = true;
          }
        });
        if (test) {
          idDb.state = 3;
        }

      });
      this.updateUrl();
      this.start('getAllKinds3');
    } else {
      this.start('getAllKinds3');
      // console.log('Pb : kindStr is undefined or length = 0');
    }
  }

  searchAndParseToStringWithOption(keywordToSearch: string, optionchar: string,
                                   optionKeyword: string, thirdOption: string) {
    var res = this.route.snapshot.queryParamMap.get(keywordToSearch);
    if (res != null) {
      var parsed = decodeURIComponent(escape(window.atob(
        this.route.snapshot.queryParamMap.get(keywordToSearch))));

      if (optionchar != '') {
        var parserOptionSel = this.route.snapshot.queryParamMap.get(optionchar);
        this.setOption(optionchar, parserOptionSel);
      }
      if (thirdOption === 'rolesKey') {
        var thirdOp = this.route.snapshot.queryParamMap.get(thirdOption);
        this.setRolesKey(thirdOp);
      }
      var parseOptionkeywordTitleIsSel = this.route.snapshot.queryParamMap.get(optionKeyword);
      this.setOption(optionKeyword, parseOptionkeywordTitleIsSel);

      this.activeState(keywordToSearch);

      return parsed;
    } else {
      return '';
    }
  }

  searchAndParseToInt(keywordToSearch: string, valueByDefault: number,
                      valueMin: number, valueMax: number) {
    var parsed = parseInt(this.route.snapshot.queryParamMap.get(keywordToSearch), 10);
    if (isNaN(parsed)) {
      parsed = valueByDefault;
    } else {
      if (parsed < valueMin) {
        parsed = valueMin;
      }
      if (parsed > valueMax) {
        parsed = valueMax;
      }
      this.activeState(keywordToSearch);
    }
    return parsed;
  }

  setOption(option: string, value: string) {
    var val = parseInt(value, 10);
    if (isNaN(val)) {
      val = 0;
    }
    switch (option) {
      case('charsreadySel'):
        this.charsreadySel = val;
        break;
      case('charsNamereadySel'):
        this.namereadySel = val;
        break;
      case('keywordTitleIsSel'):
        this.keywordTitleIsSel = val;
        break;
      case('keywordsTitleIsSel'):
        this.keywordsTitleIsSel = val;
        break;
      case('keywordNameIsSel'):
        this.keywordNameIsSel = val;
        break;
      case('keywordTitleSerieIsSel'):
        this.keywordTitleSerieIsSel = val;
        break;
      case('keywordCountryIsSel'):
        this.keywordCountryIsSel = val;
        break;
      case('keywordfilmIsSel'):
        this.keywordfilmIsSel = val;
        break;
      case('keywordsfilmIsSel'):
        this.keywordsfilmIsSel = val;
        break;
    }
  }

  private activeState(keywordToSearch: string) {
    switch (keywordToSearch) {
      case('pageSize' || 'pageNumber'):
        this.state_pagesize = true;
        break;
      case('scoreMin' || 'scoreMax'):
        this.state_score = true;
        break;
      case('seasonMin' || 'seasonMax'):
        this.state_season = true;
        break;
      case('episodeMin' || 'episodeMax'):
        this.state_episode = true;
        break;
      case('yearMin' || 'yearMax'):
        this.state_year = true;
        break;
      case('durationMin' || 'durationMax'):
        this.state_duration = true;
        break;
      case('widthMin' || 'widthMax'):
        this.state_width = true;
        break;
      case('title'):
        this.state_title = true;
        // this.readCookieKeywordTitle();
        break;
      case('titleserie'):
        this.state_seriename = true;
        break;
      case('country'):
        this.state_country = true;
        break;
      case('name'):
        this.state_name = true;
        break;
      case('keywordfilm'):
        this.state_keyword = true;
        break;
    }
  }

  readCookieKeywordTitle(){
    if (this.cookieService.check('keywordTitle')) {
      let val = this.cookieService.get('keywordTitle');
      this.keywordTitleIsSel = parseInt(val, 10);
      console.log('keywordTitle', this.keywordTitleIsSel);
    }else{
      // ...
    }
  }
  /**********************************************************
   ***********************************************************
   ****************** REQUEST VideoID ************************
   ***********************************************************
   **********************************************************/

  private newRequest() {
    if (this.requestRun) {
      // this.href = this.router.url;
      // console.log(this.router.url);
      this.askrequestRun = true;
      return;
    }
    this.requestRun = true;
    const title = this.titleVideo;
    var listType: number[] = [];
    if (this.typeName != undefined && this.typeName != null) {
      this.typeName.forEach(tn => {
        if (tn.state) {
          listType = listType.concat(tn.idTypeName);
        }
      });
    }
    if (this.state_sort) {
      var sortBy = this.sortValue.toString().concat('-').concat(this.sortOrder ? '1' : '0');
      if(this.sortValue==1){ // If Sort = score -> concat userToSort.id in third position
        sortBy = sortBy.concat('-').concat(this.userToSort.id.toString());
      }
    }else{
      var sortBy = '';
    }
    var listUserScore = [];
    if (this.RemainingListUserScore != null && this.RemainingListUserScore.length > 0) {
      this.RemainingListUserScore.forEach(r => {
        if (r.used) {
          listUserScore = listUserScore.concat(r);
        }
      });
    }
    var req: RequestVideo = {
      'title': this.state_title ? title : '',
      'keyword': this.state_title ? this.keywordTitleIsSel : 1,
      'charError': this.state_title ? this.charsreadySel : 0,
      'nameSerie': this.state_seriename ? this.seriename : '',
      'country': this.state_country ? this.country : '',
      'keywordCountryIsSel': this.state_country ? this.keywordCountryIsSel : 0,
      'keywordSerie': this.state_seriename ? this.keywordTitleSerieIsSel : 1,
      'keywordfilm': this.state_keyword ? this.keywordfilm : '',
      'keywordSel': this.state_keyword ? this.keywordfilmIsSel : 1,
      'keywordsStr': this.state_keywords && this.keywordsStr != '' ? this.keywordsStr : '',
      'pageSize': this.pageSize,
      'pageNumber': this.pageNumber - 1,
      'scoreMin': this.state_score ? this.scoreMin : 0,
      'scoreMax': this.state_score ? this.scoreMax : 99,
      'scoreMayNull': this.state_score ? this.scoreMayNull : true,
      'yearMin': this.state_year ? this.yearMin : 1880,
      'yearMax': this.state_year ? this.yearMax : 2100,
      'durationMin': this.state_duration ? this.durationMin : 0,
      'durationMax': this.state_duration ? this.durationMax : 1000,
      'widthMin': this.state_width ? this.widthMin : 0,
      'widthMax': this.state_width ? this.widthMax : 10000,
      'yearMayNull': this.state_year ? this.yearMayNull : true,
      'seasonMin': this.state_season ? this.seasonMin : 0,
      'seasonMax': this.state_season ? this.seasonMax : 100,
      'episodeMin': this.state_episode ? this.episodeMin : 0,
      'episodeMax': this.state_episode ? this.episodeMax : 1000,
      'listType': this.state_type ? listType : [],
      'userLightWithScore': this.state_scoreUsers ? listUserScore : [],
      'roleList': this.state_name ? this.roleList : null,
      'keywordNameIsSel': this.state_name ? this.keywordNameIsSel : 0,
      'charErrorNameIsSel': this.state_name ? this.namereadySel : 0,
      'nameArtist': this.state_name ? this.nameArtist : '',
      'importStr': this.state_import ? this.importStr : '',
      'kindStr': this.state_kind ? this.kindStr : '',
      'kindNotStr': this.state_kind ? this.kindNotStr : '',
      'languagesStr': this.state_language ? this.languagesStr : '',
      'sortBy': this.state_sort ? sortBy : '',
      'ascending': true,
      'reqTitleScoreYear': this.state_title || this.state_score || this.state_year,
      'reqTypeEpisodeSeason': this.state_seriename || this.state_type
        || this.state_episode || this.state_season,
      'reqImportSupportwidthSize': this.state_import,
      'reqNameandroles': this.state_name,
      'reqKeywordKindCountry': this.state_kind || this.state_keyword ||
        this.state_keywords || this.state_country,
      'reqDurationWidthLanguage': this.state_duration || this.state_width || this.state_language,
    };
    console.log(req);
    // console.log(this.titleVideo);
    this.listeMmi = [];
    const t1 = Date.now();
    this.catalogueService.postRessource('/videoid/newRequest'
      , req)
      .subscribe(data => {
        // console.log(this.titleVideo);
        if (this.titleVideo == null || this.titleVideo.startsWith('  ')) {
          //there is a bug right after the request, when titleFilter->'Keyword' change
          this.titleVideo = req.title;
        }
        const millis = Date.now() - t1;
        console.log('Duree : ' + millis + ' ms');
        //@ts-ignore
        this.tablepage = data;
        this.verrifyValueCurrentPage();
        // console.log(data);
        this.requestRun = false;
        if (this.askrequestRun) {
          this.askrequestRun = false;
          this.newRequest();
        } else {
          this.getMmiOfCurrentPage();
        }

      }, err => {
        console.log(err);
        this.appComponent.test();
        this.requestRun = false;
      });
  }

  private getListIdVneToName() {
    this.catalogueService.getRessource('/videouser/lVneIdToName')
      .subscribe(data => {
        this.listIdVneToName = null;
        //@ts-ignore
        this.listIdVneToName = data;
        if (this.listIdVneToName != undefined) {
          this.listIdVneToName.forEach(i => {
            i.state = true;
          });
        }
        this.sortListIdVneToName(this.listIdVneToName);
        // console.log(this.listIdVneToName);
        this.readUrlToUpdateImportStr();
        this.start('getListIdVneToName');
      }, err => {
        this.start('getListIdVneToName');
        console.log(err);
      });
  }

  private getAllKinds() {
    this.catalogueService.getRessource('/videouser/getAllKinds')
      .subscribe(data => {
        //@ts-ignore
        this.listVideoKind = data;
        // console.log(this.listVideoKind);
        // console.log(this.listVideoKind.length);
        if (this.listVideoKind != undefined) {
          this.listVideoKind.forEach(i => {
            i.state = 2;
          });
        }
        this.sortListVideoKind(this.listVideoKind);
        this.readUrlToUpdateKindStr();
        this.start('getAllKinds1');
      }, err => {
        console.log(err);
        this.start('getAllKinds1');
        this.start('getAllKinds2');
        this.start('getAllKinds3');
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

  private sortListVideoKind(listToSort: VideoKind[]) {
    var mynewtable: VideoKind[] = [];
    if (listToSort.length > 1) {
      while (listToSort.length > 0) {
        let nb = 0;
        //@ts-ignore
        let valOne = listToSort[0].kindEn;
        for (var j = 1; j < listToSort.length; j++) {
          //@ts-ignore
          if ((valOne).localeCompare(listToSort[j].kindEn, 'fr') > 0) {
            //@ts-ignore
            valOne = listToSort[j].kindEn;
            nb = j;
          }
        }
        //Add listToSort[nb] to mynewtable
        mynewtable = mynewtable.concat(listToSort[nb]);
        listToSort.splice(nb, 1);
      }
    }
    this.listVideoKind = mynewtable;
    this.start('getAllKinds2');
    // console.log('sortListVideoKind is finish')
  }

  private getMmiOfCurrentPage() {
    var listIdVideofilm: string[] = [];
    if (this.tablepage.content.length != 0) {
      this.tablepage.content.forEach(vf => {
        listIdVideofilm = listIdVideofilm.concat(vf.idVideo);
      });
    }
    const optionReq4support: optionGetMmiWithIdVf = {
      'lidvf': listIdVideofilm,
      'withOptionL1': this.state_season || this.state_episode || this.state_seriename,
      'seasonMin': this.state_season ? this.seasonMin : 0,
      'seasonMax': this.state_season ? this.seasonMax : 100,
      'episodeMin': this.state_episode ? this.episodeMin : 0,
      'episodeMax': this.state_episode ? this.episodeMax : 1000,
      'nameSerie': this.state_seriename ? this.seriename : '',
      'keywordSerie': this.state_seriename ? this.keywordTitleSerieIsSel : 1,

      'withOptionL2': this.state_import,
      'importStr': this.importStr,

      'withOptionL3': this.state_duration || this.state_width || this.state_language,
      'durationMin': this.state_duration ? this.durationMin : 0,
      'durationMax': this.state_duration ? this.durationMax : 1000,
      'widthMin': this.state_width ? this.widthMin : 0,
      'widthMax': this.state_width ? this.widthMax : 10000,
      'languagesStr': this.state_language && this.languagesStr.length != 0 ? this.languagesStr : '',
    };
    this.catalogueService.postRessource('/videoid/getMmiWithIdVideo'
      , optionReq4support)
      .subscribe(data => {
        // @ts-ignore
        let llim: LinkIdvfMmi[] = data;
        this.tablepage.content.forEach(vf => {
          vf.idmmi = [];
          llim.forEach(lim => {
            if (vf.idVideo === lim.idVideo) {
              let lstr: string[] = [];
              lim.lmmi.forEach(i => {
                lstr = lstr.concat(i.idMyMediaInfo);

                let testIfExist = false;
                for (let el of this.listeMmi) {
                  if (el.idMyMediaInfo === i.idMyMediaInfo) {
                    testIfExist = true;
                    break;
                  }
                }
                if (!testIfExist) {
                  this.listeMmi = this.listeMmi.concat(i);
                }
                // this.listeMmi = this.listeMmi.concat(i);

              });
              vf.idmmi = vf.idmmi.concat(lstr);
            }
          });

        });
        // console.log(this.tablepage.content);
        // console.log(this.listeMmi);
      }, err => {
        console.log(err);
      });
  }

  getWidth(idmmi: string) {
    for (let m of this.listeMmi) {
      if (idmmi === m.idMyMediaInfo) {
        return m.width;
      }
    }
  }

  getListMmiPartial(idmmi: string[]) {
    let l: MyMediaInfo[] = [];
    if (idmmi != undefined && idmmi.length > 0) {
      for (let i of idmmi) {
        for (let m of this.listeMmi) {
          if (i === m.idMyMediaInfo) {
            l = l.concat(m);
          }
        }
      }
    }
    return l;
  }

  capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
  }

  getType(idmmi: string) {
    for (let el of this.listeMmi) {
      if (el.idMyMediaInfo === idmmi) {
        return this.capitalize(el.typeMmi.typeName.typeName);
      }
    }
  }

  showHideCharReady() {
    this.showcharsready = !this.showcharsready;
  }

  showHideNameReady() {
    this.showNameready = !this.showNameready;
  }

  changeValueOptionTmp(nameOption: string, valueOption: number) {
    switch (nameOption) {
      case('keywordsfilmIsSel'):
        this.charsreadyKeyworsSel = valueOption;
        this.searchKeyWords(false);
        break;
      case('keywordslanguageIsSel'):
        this.charsreadyKeyworsSelLanguage = valueOption;
        break;
    }
  }

  changeValueOption(nameOption: string, valueOption: number) {
    // this.pageNumber=1;
    switch (nameOption) {
      case('charsreadySel'):
        this.charsreadySel = valueOption;
        break;
      case('keywordTitleIsSel'):
        this.keywordTitleIsSel = valueOption;
        this.cookieService.set('keywordTitle', this.keywordTitleIsSel.toString());
        console.log('Write cookie : keywordTitle : ', this.keywordTitleIsSel.toString())
        break;
      case('keywordsTitleIsSel'):
        this.keywordsTitleIsSel = valueOption;
        break;
      case('keywordTitleSerieIsSel'):
        this.keywordTitleSerieIsSel = valueOption;
        break;
      case('keywordCountryIsSel'):
        this.keywordCountryIsSel = valueOption;
        break;
      case('keywordNameIsSel'):
        this.keywordNameIsSel = valueOption;
        break;
      case('keywordfilmIsSel'):
        this.keywordfilmIsSel = valueOption;
        break;
      case('keywordsfilmIsSel'):
        this.keywordsfilmIsSel = valueOption;
        break;
      case('namereadySel'):
        this.namereadySel = valueOption;
        break;
    }
    this.getNewPageVideo();
  }

  showHidekeywordTitleIs() {
    this.showkeywordTitleIs = !this.showkeywordTitleIs;
  }


  showHidekeywordsTitleIs() {
    this.showkeywordsTitleIs = !this.showkeywordsTitleIs;
  }

  showHidekeywordNameIs() {
    this.showkeywordNameIs = !this.showkeywordNameIs;
  }

  showHideRoleIs() {
    this.showRoleIs = !this.showRoleIs;
  }

  showHidekeywordTitleSerieIs() {
    this.showkeywordTitleSerieIs = !this.showkeywordTitleSerieIs;
  }

  showHidekeywordCountryIs() {
    this.showkeywordCountryIs = !this.showkeywordCountryIs;
  }

  showHidekeywordfilmIs() {
    this.showkeywordfilmIs = !this.showkeywordfilmIs;
  }


  showHidekeywordsfilmIs() {
    this.showkeywordsfilmIs = !this.showkeywordsfilmIs;
  }

  showHidekeywordslanguageIs() {
    this.showkeywordslanguageIs = !this.showkeywordslanguageIs;
  }

  onPaste(testPaste){
    event.preventDefault();
    // var re = /\n/gi;
    var trimMore = /^[\s\uFEFF\xA0]+|[\n]+|[\s\uFEFF\xA0]+$/g;
    console.log(this.titleVideo)
    this.titleVideo = testPaste.replace(trimMore, '');
    this.getNewPageVideo();
  }

  titleChange(forced: boolean) {
    if (this.titleVideo.length > 0 && !this.lastKeyIsAnArrow) {
      var re = /\n/gi;
      this.titleVideo = this.titleVideo.replace(re, '');
    }
    if ((this.titleVideo.length > 2 || forced) && !this.lastKeyIsAnArrow) {
      this.getNewPageVideo();
    }
  }

  nameChange() {
    if (this.nameArtist.length > 0 && !this.lastKeyIsAnArrow) {
      var re = /\n/gi;
      this.nameArtist = this.nameArtist.replace(re, '');
    }
    if (this.nameArtist.length > 3) {
      this.getNewPageVideo();
    }
  }

  serienameChange(force: boolean) {
    if (this.seriename.length > 0 && !this.lastKeyIsAnArrow) {
      var re = /\n/gi;
      this.seriename = this.seriename.replace(re, '');
    }
    if (this.seriename.length > 1 || force) {
      this.getNewPageVideo();
    }
  }

  countryChange(force: boolean) {
    if (this.country.length > 0 && !this.lastKeyIsAnArrow) {
      var re = /\n/gi;
      this.country = this.country.replace(re, '');
    }
    if (this.country.length > 1 || force) {
      this.getNewPageVideo();
    }
  }

  keywordfilmChange() {
    if (this.keywordfilm.length > 0 && !this.lastKeyIsAnArrow) {
      var re = /\n/gi;
      this.keywordfilm = this.keywordfilm.replace(re, '');
    }
    if (this.keywordfilm.length > 2) {
      this.getNewPageVideo();
    }
  }

  getNewPageVideo() {
    this.pageNumber = 1;
    this.getPageVideo();
  }

  getPageVideo() {
    if (this.titleVideo == null) {
      this.titleVideo = '';
    } else if (this.titleVideo.length > 0) {
      var re = /\n/gi;
      this.titleVideo = this.titleVideo.replace(re, '');
    }
    if (this.nameArtist == null) {
      this.nameArtist = '';
    } else if (this.nameArtist.length > 0) {
      var re = /\n/gi;
      this.nameArtist = this.nameArtist.replace(re, '');
    }
    if ((this.charsreadySel + 2) > this.titleVideo.length) {
      this.charsreadySel = 0;
    }
    if ((this.namereadySel + 2) > this.nameArtist.length) {
      this.namereadySel = 0;
    }
    if (this.seriename == null) {
      this.seriename = '';
    }
    if (this.country == null) {
      this.country = '';
    }
    if (this.keywordfilm == null) {
      this.keywordfilm = '';
    }

    this.updateUrl();
    this.newRequest();
  }

  decr(data: string) {
    if (data === 'valuepage') {
      if (this.pageNumber > 1) {
        this.pageNumber--;
      }
      this.getPageVideo();
    }
    if (data === 'valuesize') {
      if (this.pageSize > 1) {
        this.pageSize--;
        this.pageNumber = 1;
        this.getPageVideo();
        // this.setSizeToCookie(this.size);
      }
    }
  }

  incr(data: string) {
    if (data === 'valuepage') {
      if (this.tablepage != null) {
        if (this.pageNumber < this.tablepage.totalPages) {
          this.pageNumber++;
        }
      } /*else {
        this.pageNumber++;
      }*/
      this.getPageVideo();
    }
    if (data === 'valuesize') {
      if (this.tablepage != null) {
        if (this.pageSize < this.tablepage.totalElements) {
          this.pageSize++;
          this.getPageVideo();
          // this.setSizeToCookie(this.size);
        } else {
          this.pageNumber = 1;
          this.getPageVideo();
        }
      }
    }
  }

  /*********************************************************************/
  /*********************************************************************/
  /************************ updateUrl **********************************/
  /***********************************1**********************************/

  /*********************************************************************/



  updateUrl() {
    var title = '';
    if (this.state_title) {
      title = window.btoa(unescape(encodeURIComponent(this.titleVideo)));
    }
    var titleserie = '';
    if (this.state_seriename) {
      titleserie = window.btoa(unescape(encodeURIComponent(this.seriename)));
    }
    var country = '';
    if (this.state_country) {
      country = window.btoa(unescape(encodeURIComponent(this.country)));
    }
    var name = '';
    if (this.state_name) {
      name = window.btoa(unescape(encodeURIComponent(this.nameArtist)));
      this.updateRolesKey();
    }
    var keyword = '';
    if (this.state_keyword) {
      keyword = window.btoa(unescape(encodeURIComponent(this.keywordfilm)));
    }
    if (this.state_import) {
      this.importStr = '';
      if (this.listIdVneToName != undefined && this.listIdVneToName.length > 0) {
        this.listIdVneToName.forEach(i => {
          if (i.state) {
            this.importStr = this.importStr + i.idVideoNameExport + '-';
          }
        });
        if (this.importStr.length > 0) {
          this.importStr = this.importStr.substring(0, this.importStr.length - 1);
        }
      }
    }
    if (this.state_kind) {
      this.kindStr = '';
      this.kindNotStr = '';
      if (this.listVideoKind != undefined && this.listVideoKind.length > 0) {

        this.listVideoKind.forEach(vk => {
          if (vk.state == 1) {
            this.kindStr = this.kindStr + vk.idKind + '-';
          } else if (vk.state == 3) {
            this.kindNotStr = this.kindNotStr + vk.idKind + '-';
          }
        });

        if (this.kindStr.length > 0) {
          this.kindStr = this.kindStr.substring(0, this.kindStr.length - 1);
        }
        if (this.kindNotStr.length > 0) {
          this.kindNotStr = this.kindNotStr.substring(0, this.kindNotStr.length - 1);
        }
      }
    }

    var idtypeinstrLoc = '';
    if (this.state_type) {
      this.typeName.forEach(tn => {
        if (tn.state) {
          idtypeinstrLoc = idtypeinstrLoc + tn.idTypeName + '-';
        }
      });
      if (idtypeinstrLoc.length > 1) {
        idtypeinstrLoc = idtypeinstrLoc.substring(0, idtypeinstrLoc.length - 1);
      }
    }
    if (this.state_keywords && this.keywordsStr != '') {
    }
    this.prepareUpdateUrlScoreUsers();
    this.idtypeinstr = idtypeinstrLoc;
    this.router.navigate(['/videoid'],
      {
        queryParams: {
          scoreMin: this.state_score ? this.scoreMin : null,
          scoreMax: this.state_score ? this.scoreMax : null,
          scoreMayNull: this.state_score ? this.scoreMayNull?'1':'0' : null,
          pageSize: this.state_pagesize ? this.pageSize : null,
          seasonMin: this.state_season ? this.seasonMin : null,
          seasonMax: this.state_season ? this.seasonMax : null,
          episodeMin: this.state_episode ? this.episodeMin : null,
          episodeMax: this.state_episode ? this.episodeMax : null,
          pageNumber: this.state_pagesize ? this.pageNumber : null,
          yearMin: this.state_year ? this.yearMin : null,
          yearMax: this.state_year ? this.yearMax : null,
          title: this.state_title ? title : null,
          scoreUsers: this.state_scoreUsers ? this.scoreUsers : null,
          scoreUsersMin: this.state_scoreUsers ? this.scoreUsersMin : null,
          scoreUsersMax: this.state_scoreUsers ? this.scoreUsersMax : null,
          scoreUsersMaynull: this.state_scoreUsers ? this.scoreUsersMaynull : null,
          durationMin: this.state_duration ? this.durationMin : null,
          durationMax: this.state_duration ? this.durationMax : null,
          widthMin: this.state_width ? this.widthMin : null,
          widthMax: this.state_width ? this.widthMax : null,
          importStr: this.state_import ? this.importStr : null,
          kindStr: this.state_kind ? this.kindStr : null,
          kindNotStr: this.state_kind ? this.kindNotStr : null,
          sortValue: this.sortValue,
          sortOrder: this.sortOrder ? '1' : '0',
          sortUser: this.userToSort.id,
          titleserie: this.state_seriename ? titleserie : null,
          country: this.state_country ? country : null,
          keywordTitleSerieIsSel: this.state_seriename ? this.keywordTitleSerieIsSel : null,
          keywordCountryIsSel: this.state_country ? this.keywordCountryIsSel : null,

          keywordfilm: this.state_keyword ? keyword : null,
          keywordfilmIsSel: this.state_keyword ? this.keywordfilmIsSel : null,

          keywordsStr: this.state_keywords && this.keywordsStr != '' ? this.keywordsStr : null,
          languagesStr: this.state_language ? this.languagesStr : null,

          name: this.state_name ? name : null,
          keywordNameIsSel: this.state_name ? this.keywordNameIsSel : null,
          charsNamereadySel: this.state_name ? this.namereadySel : null,
          rolesKey: this.state_name ? this.rolesKey : null,

          charsreadySel: this.state_title ? this.charsreadySel : null,
          keywordTitleIsSel: this.state_title ? this.keywordTitleIsSel : null,
          typename: this.state_type ? idtypeinstrLoc : null,
        }, /*queryParamsHandling: 'merge'*/
      });
  }

  private prepareUpdateUrlScoreUsers() {
    if (this.RemainingListUserScore != null && this.RemainingListUserScore.length > 0) {
      var test = false;
      var scoreUsers = '';
      var scoreUsersMin = '';
      var scoreUsersMax = '';
      var scoreUsersMaynull = '';
      for (let r of this.RemainingListUserScore) {
        if (r.used) {
          test = true;
          scoreUsers = scoreUsers + r.idMyUser.toString() + '-';
          scoreUsersMin = scoreUsersMin + r.scoreMin.toString() + '-';
          scoreUsersMax = scoreUsersMax + r.scoreMax.toString() + '-';
          scoreUsersMaynull = scoreUsersMaynull
            + (r.scoreMayNull ? '1' : '0') + '-';
        }
      }
      if (test) {
        scoreUsers = scoreUsers.substring(0, scoreUsers.length - 1);
        scoreUsersMin = scoreUsersMin.substring(0, scoreUsersMin.length - 1);
        scoreUsersMax = scoreUsersMax.substring(0, scoreUsersMax.length - 1);
        scoreUsersMaynull = scoreUsersMaynull.substring(0, scoreUsersMaynull.length - 1);
      }
      this.state_scoreUsers = test;
      this.scoreUsers = scoreUsers;
      this.scoreUsersMin = scoreUsersMin;
      this.scoreUsersMax = scoreUsersMax;
      this.scoreUsersMaynull = scoreUsersMaynull;
    }
  }

  dataChange(data: string) {
    /* PageNumber */
    if (data === 'pageNumber') {
      if (this.tablepage != null) {
        if (this.pageNumber > 1) {
          if ((this.pageNumber) >= this.tablepage.totalPages
            && this.tablepage.totalPages > 0) {
            this.pageNumber = this.tablepage.totalPages;
          }
        } else {
          this.pageNumber = 1;
        }
        if (this.pageNumber >= this.tablepage.totalPages
          && this.tablepage.totalPages > 0) {
          this.pageNumber = this.tablepage.totalPages;
        }
        this.getPageVideo();
      } else {
        this.pageNumber = 1;
      }
    }
    /* pageSize */
    if (data === 'pageSize') {
      if (this.pageSize < 1) {
        this.pageSize = 1;
        this.pageNumber = 1;
      }
      this.cookieService.set('pageSize', this.pageSize.toString());
      this.getNewPageVideo();
    }

    /* yearMin */
    if (data === 'yearMin') {
      if (this.yearMin < 1850) {
        this.yearMin = 1850;
      }
      if (this.yearMax < this.yearMin) {
        this.yearMax = this.yearMin;
      }
      // this.testToActivateSort();
      this.getNewPageVideo();
    }
    /* yearMax */
    if (data === 'yearMax') {
      if (this.yearMax > 2100) {
        this.yearMax = 2100;
      }
      if (this.yearMax < this.yearMin) {
        this.yearMin = this.yearMax;
      }
      // this.testToActivateSort();
      this.getNewPageVideo();
    }
    /* YearMayNull */
    if (data === 'yearMayNull') {
      this.yearMayNull = !this.yearMayNull;
      this.getNewPageVideo();
    }

    /* durationMin */
    if (data === 'durationMin') {
      if (this.durationMin < 0) {
        this.durationMin = 0;
      }
      if (this.durationMax < this.durationMin) {
        this.durationMax = this.durationMin;
      }
      this.getNewPageVideo();
    }
    /* durationMax */
    if (data === 'durationMax') {
      if (this.durationMax > 1000) {
        this.durationMax = 1000;
      }
      if (this.durationMax < this.durationMin) {
        this.durationMin = this.durationMax;
      }
      this.getNewPageVideo();
    }


    /* widtMin */
    if (data === 'widthMin') {
      if (this.widthMin < 0) {
        this.widthMin = 0;
      }
      if (this.widthMax < this.widthMin) {
        this.widthMax = this.widthMin;
      }
      this.getNewPageVideo();
    }
    /* widthMax */
    if (data === 'widthMax') {
      if (this.widthMax > 10000) {
        this.widthMax = 10000;
      }
      if (this.widthMax < this.widthMin) {
        this.widthMin = this.widthMax;
      }
      this.getNewPageVideo();
    }

    /* seasonMin */
    if (data === 'seasonMin') {
      if (this.seasonMin < 0) {
        this.seasonMin = 0;
      }
      if (this.seasonMin > this.seasonMax) {
        this.seasonMax = this.seasonMin;
      }
      this.getNewPageVideo();
    }

    /* seasonMax */
    if (data === 'seasonMax') {
      if (this.seasonMax > 100) {
        this.seasonMax = 100;
      }
      if (this.seasonMax < this.seasonMin) {
        this.seasonMin = this.seasonMax;
      }
      this.getNewPageVideo();
    }

    /* episodeMin */
    if (data === 'episodeMin') {
      if (this.episodeMin < 0) {
        this.episodeMin = 0;
      }
      if (this.episodeMin > this.episodeMax) {
        this.episodeMax = this.episodeMin;
      }
      this.getNewPageVideo();
    }

    /* episodeMax */
    if (data === 'episodeMax') {
      if (this.episodeMax > 1000) {
        this.episodeMax = 1000;
      }
      if (this.episodeMax < this.episodeMin) {
        this.episodeMin = this.episodeMax;
      }
      this.getNewPageVideo();
    }

    /* ScoreMin */
    if (data === 'scoreMin') {
      if (this.scoreMin < 0) {
        this.scoreMin = 0;
      }
      if (this.scoreMax < this.scoreMin) {
        this.scoreMax = this.scoreMin;
      }
      // this.testToActivateSort();
      this.getNewPageVideo();
    }
    /* ScoreMax */
    if (data === 'scoreMax') {
      if (this.scoreMax > 99) {
        this.scoreMax = 99;
      }
      if (this.scoreMax < this.scoreMin) {
        this.scoreMin = this.scoreMax;
      }
      // this.testToActivateSort();
      this.getNewPageVideo();
    }
    /* ScoreMayNull */
    if (data === 'scoreMayNull') {
      this.scoreMayNull = !this.scoreMayNull;
      this.getNewPageVideo();
    }
  }

  callfilter(btntype: string) {
    switch (btntype) {
      case 'title': {
        this.state_title = !this.state_title;
        if (!this.state_title) {
          this.getNewPageVideo();
        }else{
          this.readCookieKeywordTitle();
        }
        break;
      }
      case 'name': {
        this.state_name = !this.state_name;
        if (!this.state_name) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'language': {
        this.state_language = !this.state_language;
        if (!this.state_language) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'keyword': {
        this.state_keyword = !this.state_keyword;
        if (!this.state_keyword) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'keywords': {
        this.state_keywords = !this.state_keywords;
        if (!this.state_keywords) {
          this.keywordsfilm = '';
          this.lkeywordsIsShow = false;
          this.getNewPageVideo();
        }
        break;
      }
      case 'kind': {
        this.state_kind = !this.state_kind;
        if (!this.state_kind) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'country': {
        this.state_country = !this.state_country;
        if (!this.state_country) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'type': {
        this.state_type = !this.state_type;
        if (!this.state_type) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'season': {
        this.state_season = !this.state_season;
        if (!this.state_season) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'episode': {
        this.state_episode = !this.state_episode;
        if (!this.state_episode) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'score': {
        this.isMenuScoreShow = false;
        this.RemainingListUserScore.forEach(r => r.used = false);
        this.state_score = !this.state_score;
        if (!this.state_score) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'year': {
        this.state_year = !this.state_year;
        if (!this.state_year) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'duration': {
        this.state_duration = !this.state_duration;
        if (!this.state_duration) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'width': {
        this.state_width = !this.state_width;
        if (!this.state_width) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'import': {
        this.state_import = !this.state_import;
        if (!this.state_import) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'pagesize': {
        this.state_pagesize = !this.state_pagesize;
        break;
      }
      case 'sort': {
        this.state_sort = !this.state_sort;
        this.userToSort = {
          'user': 'DB',
          'id': 0,
        };
        // if (!this.state_sort) {
          this.getNewPageVideo();
        // }
        break;
      }
      case 'seriename': {
        this.state_seriename = !this.state_seriename;
        if (!this.state_seriename) {
          this.getNewPageVideo();
        }
        break;
      }
      case 'sort': {
        this.userToSort = {
          'user': 'DB',
          'id': 0,
        };
        break;
      }

      default: {
        console.log('*** We don\'t know this : ' + btntype + ' !');
      }
    }
    // this.testToActivateSort();
    this.getPageVideo();
  }

  cleanFilterTitle() {
    this.titleVideo = '';
    this.getPageVideo();
  }

  cleanFilterName() {
    this.nameArtist = '';
    this.getPageVideo();
  }

  cleanFilterSeriename() {
    this.seriename = '';
    this.getPageVideo();
  }

  cleanFilterCountry() {
    this.country = '';
    this.getPageVideo();
  }

  cleanFilterKeywordfilm() {
    this.keywordfilm = '';
    this.getPageVideo();
  }

  cleanFilterKeywordsfilm() {
    this.keywordsfilm = '';
    this.lkeywordsIsShow = false;
    this.getPageVideo();
  }

  cleanFilterLanguagesfilm() {
    this.language = '';
    this.lLanguagesIsShow = false;
    this.getPageVideo();
  }

  getUrlImgPoster(ele: VideoFilmWithIdmmi) {
    if (ele.videoPosters.length == 0
      || ele.videoPosters[0].ulrImg == null) {
      return '';
    }
    return ele.videoPosters[0].ulrImg;
  }

  private getAllTypeName() {
    this.catalogueService.getRessource('/videoid/getAllTypeName')
      .subscribe(data => {
        // @ts-ignore
        this.typeName = data;
        this.searcheAndParseFromListofstring('typename');
        this.getPageVideo();
        this.start('getAllTypeName');
      }, err => {
        this.start('getAllTypeName');
        console.log(err);
      });
  }

  changeValueTypename(tn: TypeName) {
    this.typeName.forEach(tnl => {
      if (tn.idTypeName === tnl.idTypeName) {
        tnl.state = !tnl.state;
      }
    });
    this.getNewPageVideo();
  }

  changeValueImport(ivne: Vnelight) {
    this.listIdVneToName.forEach(vne => {
      if (ivne.idVideoNameExport === vne.idVideoNameExport) {
        vne.state = !vne.state;
      }
    });
    this.getNewPageVideo();
  }

  changeValueKind(vk: VideoKind) {
    this.listVideoKind.forEach(ilvk => {
      if (vk.idKind === ilvk.idKind) {
        ilvk.state > 1 ? ilvk.state = 1 : ilvk.state = 2;
      }
    });
    this.getNewPageVideo();
  }

  changeValueNotKind(vk: VideoKind) {
    this.listVideoKind.forEach(ilvk => {
      if (vk.idKind === ilvk.idKind) {
        console.log(vk);
        ilvk.state > 2 ? ilvk.state = 2 : ilvk.state = 3;
        console.log(vk);
      }
    });
    this.getNewPageVideo();
  }

  showHideTypeIs() {
    this.showTypeIs = !this.showTypeIs;
  }

  showHideImportIs() {
    this.showImportIs = !this.showImportIs;
  }

  showHideKindIs() {
    this.showKindIs = !this.showKindIs;
  }

  showHideKindIsNot() {
    this.showKindIsNot = !this.showKindIsNot;
  }

  selectAllType() {
    this.typeName.forEach(tn => tn.state = true);
    this.getNewPageVideo();
  }

  deSelectAllType() {
    this.typeName.forEach(tn => tn.state = false);
    this.pageNumber = 1;
    this.updateUrl();
  }

  selectAllImport() {
    this.listIdVneToName.forEach(i => i.state = true);
    this.getNewPageVideo();
  }

  deSelectAllImport() {
    this.listIdVneToName.forEach(tn => tn.state = false);
    this.pageNumber = 1;
    this.updateUrl();
  }

  selectAllKind() {
    this.listVideoKind.forEach(i => {
      if (i.state == 2) {
        i.state = 1;
      }
    });
    this.getNewPageVideo();
  }

  deSelectAllKind() {
    this.listVideoKind.forEach(i => {
      if (i.state == 1) {
        i.state = 2;
      }
    });
    this.pageNumber = 1;
    this.updateUrl();
  }

  selectAllKindRemaining() {
    this.listVideoKind.forEach(i => {
      if (i.state == 2) {
        i.state = 3;
      }
    });
    this.getNewPageVideo();
  }

  deSelectAllKindRemaining() {
    this.listVideoKind.forEach(i => {
      if (i.state == 3) {
        i.state = 2;
      }
    });
    this.pageNumber = 1;
    this.updateUrl();
  }

  getNumberSelectedType() {
    var nb = 0;
    this.typeName.forEach(tn => {
      if (tn.state) {
        nb++;
      }
    });
    if (this.typeName.length == nb) {
      return 'all';
    }
    return nb;
  }

  getNumberSelectedImport() {
    var nb = 0;
    this.listIdVneToName.forEach(i => {
      if (i.state) {
        nb++;
      }
    });
    if (this.listIdVneToName.length == nb) {
      return 'all';
    }
    return nb;
  }

  getNumberSelectedKind() {
    var nb = 0;
    this.listVideoKind.forEach(i => {
      if (i.state == 1) {
        nb++;
      }
    });
    if (this.listVideoKind.length == nb) {
      return 'all';
    }
    return nb;
  }

  getNumberSelectedKindNot() {
    var nb = 0;
    this.listVideoKind.forEach(i => {
      if (i.state == 3) {
        nb++;
      }
    });
    if (this.listVideoKind.length == nb) {
      return 'all';
    }
    return nb;
  }

  private verrifyValueCurrentPage() {
    // totalPages
    // this.tablepage
    if (this.tablepage.totalPages < this.pageNumber && this.tablepage.totalPages > 0) {
      this.pageNumber = this.tablepage.totalPages;
      this.getPageVideo();
    }
  }

  getKey(j: any) {
    Object.keys(this.roleList[j]);
  }

  getValue(j: any) {
    Object.values(this.roleList[j]);
  }

  changeValueRole(key: string) {
    this.pageNumber = 1;
    this.roleList[key] = !this.roleList[key];
    this.updateRolesKey();
    this.getPageVideo();
  }

  private updateRolesKey() {
    var i = 0;
    var res = '';
    for (let roleListKey in this.roleList) {
      this.roleList[roleListKey] ? res = res + i + '-' : null;
      i++;
    }
    this.rolesKey = res.substring(0, res.length - 1);
  }

  countTrue() {
    var n = 0;
    var m = 0;
    for (let roleListKey in this.roleList) {
      this.roleList[roleListKey] ? n++ : m++;
    }
    return m == 0 ? 'All' : n;
  }

  private setRolesKey(thirdOp: string) {
    if (thirdOp.length != 0) {
      const op = thirdOp.split('-');
      var i = 0;
      for (let roleListKey in this.roleList) {
        this.roleList[roleListKey] = false;
        op.forEach(o => {
          if (o == i.toString()) {
            this.roleList[roleListKey] = true;
          }
        });
        i++;
      }
    }
    //if there is nothing select in url, then select all by default
  }

  private listForScores() {
    // this.listScores;
    this.catalogueService.getRessource('/videoid/getListForScores')
      .subscribe(data => {
        // @ts-ignore
        this.listUserScore = data;
        // @ts-ignore
        this.RemainingListUserScore = data;
        this.RemainingListUserScore.forEach(u => {
          u.used = false;
          u.scoreMin = 0;
          u.scoreMax = 99;
          u.scoreMayNull = false;

        });
        // console.log(this.userToSort);
        if(this.userToSort.id != 0 ){
          this.RemainingListUserScore.forEach(r => {
            if (r.idMyUser == this.userToSort.id) {
              this.userToSort.user=r.login;
            }
          });
        }else{
          this.userToSort.user= 'DB';
        }
        this.readUrlToUpdateListUsersScore();
        //sortOrder=0
        this.start('listForScores');
      }, err => {
        this.start('listForScores');
        console.log(err);
      });
  }

  showHideMenuScore() {
    this.isMenuScoreShow = !this.isMenuScoreShow;
    this.pageNumber = 1;
  }


  userToScoreIsSel(u: UserLightWithScore) {
    this.isMenuScoreShow = false;
    u.used = true;
    this.getPageVideo();
  }

  isRemainingListUserScoreEmpty() {
    var test = true;
    for (let r of this.RemainingListUserScore) {
      if (!r.used) {
        test = false;
        break;
      }
    }
    return test;
  }

  closeUserScore(u: UserLightWithScore) {
    u.used = false;
    this.getPageVideo();
  }

  scoreUserChange(s: string) {
    const action = s.split('-');
    //    action[0]     action[1]
    for (let r of this.RemainingListUserScore) {
      if (r.idMyUser.toString() === action[1]) {
        if (action[0].startsWith('scoreMayNull')) {
          r.scoreMayNull = !r.scoreMayNull;
        }
        if (action[0].startsWith('scoreMin')) {
          if (r.scoreMin < 0) {
            r.scoreMin = 0;
          }
          if (r.scoreMin > r.scoreMax) {
            r.scoreMax = r.scoreMin;
          }
        }
        if (action[0].startsWith('scoreMax')) {
          if (r.scoreMax > 99) {
            r.scoreMax = 99;
          }
          if (r.scoreMax < r.scoreMin) {
            r.scoreMin = r.scoreMax;
          }
        }
        this.getPageVideo();
      }
    }
  }


  private start(init: string) {
    switch (init) {
      case('readOptionsUrl'):
        // console.log('readOptionsUrl ok value=' + this.valueInit);
        this.valueInit++;
        break;
      case('getAllTypeName'):
        // console.log('getAllTypeName ok value=' + this.valueInit);
        this.valueInit++;
        break;
      case('listForScores'):
        // console.log('listForScores ok value=' + this.valueInit);
        this.valueInit++;
        break;
      case('getListIdVneToName'):
        // console.log('getListIdVneToName ok value=' + this.valueInit);
        this.valueInit++;
        break;
      case('getAllKinds1'):
        // console.log('getAllKinds ok value=' + this.valueInit);
        this.valueInit++;
        break;
      case('getAllKinds2'):
        // console.log('getAllKinds ok value=' + this.valueInit);
        this.valueInit++;
        break;
      case('getAllKinds3'):
        // console.log('getAllKinds ok value=' + this.valueInit);
        this.valueInit++;
        break;
      case('getKeywords')://this.start('getKeywords');
        // console.log('getAllKinds ok value=' + this.valueInit);
        this.valueInit++;
        break;
      case('getLanguages')://this.start('getKeywords');
        // console.log('getAllKinds ok value=' + this.valueInit);
        this.valueInit++;
        break;
    }
    if (this.valueInit >= this.valueInitReference) {
      this.requestRun = false;
      this.getPageVideo();
      // this.testToActivateSort();
    }
  }

  keywordsfilmChange(forced: boolean) {
    if (this.keywordsfilm.length > 0 && !this.lastKeyIsAnArrow) {
      var re = /\n/gi;
      this.keywordsfilm = this.keywordsfilm.replace(re, '');
    }
    if (this.keywordsfilm.length > 2) {
      this.searchKeyWords(forced);
    }
  }

  languageChange(forced: boolean) {
    if (this.language.length > 0 && !this.lastKeyIsAnArrow) {
      var re = /\n/gi;
      this.language = this.language.replace(re, '');
    }
    if (this.language.length > 1 || forced) {
      this.searchLanguage(forced);
    }
  }

  searchLanguage(forced: boolean) {
    if (this.language.length < 2 && !forced) {
      return;
    }
    const tosend = window.btoa(this.language);
    this.catalogueService
      .getRessource('/videoid/searchLanguage/'
        + tosend + '/' + this.charsreadyKeyworsSelLanguage)
      .subscribe(data => {
        console.log(data);
        // @ts-ignore
        this.lLanguages = data;
        this.lLanguagesIsShow = true;
        this.listWindowOpen = this.listWindowOpen.concat('window%language');
      }, err => {
        console.log(err);
      });
  }

  searchKeyWords(forced: boolean) {
    if (this.keywordsfilm.length < 3 && !forced) {
      return;
    }
    const tosend = window.btoa(this.keywordsfilm);
    this.catalogueService
      .getRessource('/videoid/searchKeyWords/'
        + tosend + '/' + this.charsreadyKeyworsSel)
      .subscribe(data => {
        console.log(data);
        // @ts-ignore
        this.lkeywords = data;
        this.lkeywordsIsShow = true;
        this.listWindowOpen = this.listWindowOpen.concat('window%keywords');
      }, err => {
        console.log(err);
      });
  }

  closeWindowKeywords() {
    this.lkeywordsIsShow = false;
  }

  closeWindowLanguages() {
    this.lLanguagesIsShow = false;
  }

  addIdToKeywordstr(id: number) {
    if (this.keywordsStr.length != 0) {
      if (!this.keywordsStr.includes(id.toString())) {
        this.keywordsStr = this.keywordsStr.concat('-' + id);
      }
    } else {
      this.keywordsStr = id.toString();
    }
    console.log(this.keywordsStr);
  }

  addIdToLanguagestr(id: number) {
    if (this.languagesStr.length != 0) {
      if (!this.languagesStr.includes(id.toString())) {
        this.languagesStr = this.languagesStr.concat('-' + id);
      }
    } else {
      this.languagesStr = id.toString();
    }
    console.log(this.languagesStr);
    //TODO Update URL

  }

  keywordSelected(k: KeywordAndVFSize) {
    this.lkeywordsIsShow = false;
    this.keysToInternalFunction = true;
    this.listWindowOpen = [];
    //Update keywordsStr
    for (let i in this.lkeywords) {
      if (this.lkeywords[i].idKeyword === k.idKeyword) {
        this.addIdToKeywordstr(k.idKeyword);
        this.lkeywordsToShow = this.lkeywordsToShow.concat(k);
        this.updateUrl();
        this.newRequest();
        break;
      }
    }
  }

  languageSelected(l: MyMediaLanguageAndNbMmi) {
    this.lLanguagesIsShow = false;
    this.keysToInternalFunction = true;
    this.listWindowOpen = [];
    for (let i in this.lLanguages) {
      if (this.lLanguages[i].idLanguage === l.idLanguage) {
        this.addIdToLanguagestr(l.idLanguage);
        this.lLanguagesToShow = this.lLanguagesToShow.concat(l);
        this.updateUrl();
        this.newRequest();
        break;
      }
    }
  }

  public testClick(targetElement: HTMLElement) {
    if (this.listWindowOpen.length) {
      let t0 = targetElement;
      for (let i = 0; i < 11; i++) {
        let t1 = t0.parentElement;
        if (t1 == null) {
          console.log('parentElement is null');
          t0 = null;
          break;
        }
        // console.log('t1 : ', t1, t1.localName, ' i : '+i);
        if (t1.localName === 'body') {
          t0 = t1;
          break;
        }
        if (t1.id.startsWith('window%')
          || t1.id.startsWith('tmmi%')
          || t1.id.startsWith('vf%')
          || t1.id.startsWith('listuser%')
          || t1.id.startsWith('userscore%')) {
          t0 = t1;
          break;
        }
        t0 = t1;
      }
      if (t0 != null) {
        for (let i in this.listWindowOpen) {
          if (t0.id.split('-')[0] !== this.listWindowOpen[i]
              .split('-')[0]
            && (this.listWindowOpen[i].startsWith('tmmi')
              || this.listWindowOpen[i].startsWith('vf')
              || this.listWindowOpen[i].startsWith('userscore'))) {
            let ele = document.getElementById(this.listWindowOpen[i]);
            // setTimeout(() => {  }, 1000);
            ele.style.visibility = 'hidden';
            this.keysToInternalFunction = true;
            this.listWindowOpen.splice(Number(i), 1);
          } else if (t0.id.split('-')[0] !== this.listWindowOpen[i].split('-')[0]
            && this.listWindowOpen[i].startsWith('window')) {
            this.keysToInternalFunction = true;
            this.lkeywordsIsShow = false;
            this.listWindowOpen.splice(Number(i), 1);
          } else if (t0.id.split('-')[0] !== this.listWindowOpen[i].split('-')[0]
            && this.listWindowOpen[i].startsWith('listuser')) {
            this.keysToInternalFunction = true;
            this.listUserIsShow = false;
            this.listWindowOpen.splice(Number(i), 1);
          }
        }
      }
    }
  }

  closeOpenWindows() {
    for (let i in this.listWindowOpen) {
      // console.log(this.listWindowOpen)
      let ele = document.getElementById(this.listWindowOpen[i]);
      if (ele != null) {
        ele.style.visibility = 'hidden';
      }
      this.keysToInternalFunction = true;
      this.listWindowOpen.splice(Number(i), 1);
    }
  }

  deleteKeyword(idKeyword: number) {
    //TODO: delete one keyword in list
    this.keywordsStr = '';
    for (let i in this.lkeywordsToShow) {
      if (this.lkeywordsToShow[i].idKeyword == idKeyword) {
        this.lkeywordsToShow.splice(Number(i), 1);
      }
    }
    this.lkeywordsToShow.forEach(k => {
      this.keywordsStr = this.keywordsStr + k.idKeyword + '-';
    });
    if (this.keywordsStr.length > 0) {
      this.keywordsStr = this.keywordsStr.substring(0, this.keywordsStr.length - 1);
    }
    // console.log(this.keywordsStr);
    this.updateUrl();
    this.newRequest();
  }

  deleteLanguage(idLanguage: number) {
    //TODO: delete one keyword in list
    this.languagesStr = '';
    for (let i in this.lLanguagesToShow) {
      if (this.lLanguagesToShow[i].idLanguage == idLanguage) {
        this.lLanguagesToShow.splice(Number(i), 1);
      }
    }
    this.lLanguagesToShow.forEach(l => {
      this.languagesStr = this.languagesStr + l.idLanguage + '-';
    });
    if (this.languagesStr.length > 0) {
      this.languagesStr = this.languagesStr.substring(0, this.languagesStr.length - 1);
    }
    console.log(this.languagesStr);
    this.updateUrl();
    this.newRequest();
  }

  private getKeywords() {
    //keywordsStr
    if (this.keywordsStr != '') {
      this.lkeywords = [];
      let lidk: string [] = this.keywordsStr.split('-');
      this.catalogueService.postRessource('/videoid/getKeywordsWithId', lidk)
        .subscribe(data => {
          this.state_keywords = true;
          // @ts-ignore
          this.lkeywordsToShow = data;
          console.log(data);
          this.start('getKeywords');
        }, err => {
          console.log(err);
          this.start('getKeywords');
        });

    } else {
      this.start('getKeywords');
    }
  }

  private getLanguages() {
    //keywordsStr
    if (this.languagesStr != '') {
      this.lLanguages = [];
      let lidl: string [] = this.languagesStr.split('-');
      this.catalogueService.postRessource('/videoid/getLanguagesWithId', lidl)
        .subscribe(data => {
          this.state_language = true;
          // @ts-ignore
          this.lLanguagesToShow = data;
          // console.log(data);
          this.start('getLanguages');
        }, err => {
          console.log(err);
          this.start('getLanguages');
        });

    } else {
      this.start('getLanguages');
    }
  }

  changeValueSort(i: number) {
    if (i == 1) {
      this.sortValue = i;
      this.closeOpenWindows();
      this.getNewPageVideo();
    }
    if (i < 0) {
      i = -i;
      if (i == 1) {
        if (!this.listUserIsShow) {
          setTimeout(() => {
            this.listWindowOpen = this.listWindowOpen.concat('listuser%');
            this.listUserIsShow = !this.listUserIsShow;
          }, 200);
        } else {
          this.listUserIsShow = !this.listUserIsShow;
          this.closeOpenWindows();
          this.getNewPageVideo();
        }
      }
      this.sortValue = i;
    }
    this.sortValue = i;
    if (i != 1) {
      this.listUserIsShow = false;
      this.closeOpenWindows();
      this.getNewPageVideo();
    }
  }

  userToSortSelected(user: string, id: number) {
    this.userToSort = {
      'user': user,
      'id': id,
    };
    this.listUserIsShow = false;
    this.closeOpenWindows();
    this.getNewPageVideo();
  }

  toggleSort() {
    this.sortOrder = !this.sortOrder;
    this.getNewPageVideo();
  }

  getLoginUserScore(us: VideoUserScore) {
    let login = '';
    if (this.RemainingListUserScore) {
      this.RemainingListUserScore.forEach(r => {
        if (r.idMyUser == us.id.idMyUser) {
          login = r.login;
        }
      });
      // console.log(us.commentScoreUser)
    }
    return login;
  }

  addModifyScoreUser(vf: VideoFilmWithIdmmi) {
    // console.log(vf);
    this.keysToInternalFunction = false;
    let name = this.appComponent.user.name;
    let isAdmin = this.appComponent.isAdmin();
    console.log('user.name', name)
    console.log('isAdmin', isAdmin)
    let id = 0;
    this.RemainingListUserScore.forEach(u => {
      if (u.login === name) {
        id = u.idMyUser;
      }
    });
    this.userSel4Score=name;
    this.userId = id;
    let test = false;
    vf.videoUserScores.forEach(s => {
      if (s.id.idMyUser == id) {
        test = true;
        this.scoreuser = s.noteOnHundred;
        if (s.commentScoreUser != undefined) {
          this.commentScoreUser = s.commentScoreUser.comment;
        } else {
          this.commentScoreUser = '';
        }
      }
    });
    if (!test) {
      this.scoreuser = 50;
      this.commentScoreUser = '';
    }

    let ele = document.getElementById('userscore%' + vf.idVideo + '%windedit');
    ele.style.visibility = 'visible';
    setTimeout(() => {
      let elem = 'userscore%' + vf.idVideo + '%windedit';
      let test = false;
      this.listWindowOpen.forEach(wo => {
        if (wo === elem) {
          test = true;
        }
      });
      if (!test) {
        this.listWindowOpen = this.listWindowOpen.concat(elem);
      }
    }, 500);
  }
  userSelectedChange($event, idVideo: string){
    //@ts-ignore
    this.userSel4Score = event.target.value;
    console.log('$event', this.userSel4Score)
    console.log('idVideo', idVideo)
  }

  submitScoreUser(idVideo: string) {
    console.log('idVideo', idVideo);
    console.log('this.scoreuser', this.scoreuser);
    console.log('this.commentScoreUser', this.commentScoreUser);
    this.closeOpenWindows();
    if (this.commentScoreUser.length > 1024) {
      this.commentScoreUser = this.commentScoreUser.substring(0, 1024);
    }
    let req: ReqScore = {
      'usr': this.userSel4Score,
      'idtt': idVideo,
      'score': this.scoreuser,
      'comment': this.commentScoreUser
    };
    this.catalogueService.postRessourceWithData('/videouser/postscoreforuser/'
      , req)
      .subscribe(data => {
        //@ts-ignore
        var vf: VideoFilmWithIdmmi = data;
        this.keysToInternalFunction = true;
        for(let i = 0; i<this.tablepage.content.length; i++){
          if(this.tablepage.content[i].idVideo === vf.idVideo){
            this.tablepage.content[i].videoUserScores = vf.videoUserScores
          }
        }
      }, err => {
        console.log(err);
        this.keysToInternalFunction = true;
      });
  }

  returnvf(vfret: VideoFilmWithIdmmi) {
    this.tablepage.content.forEach(vf => {
      if (vf.idVideo === vfret.idVideo) {
        vf.videoTitles = vfret.videoTitles;
        vf.videoKeywordSet = vfret.videoKeywordSet;
      }
    });
  }

  getDirector(ele: VideoFilmWithIdmmi) {
    let dir: string[] = [];
    ele.videoFilmArtists.forEach(c => {
      if (c.director) {
        dir = dir.concat(c.videoArtist.firstLastName);
      }
    });
    return dir.join(', ');
  }

  getWriter(ele: VideoFilmWithIdmmi) {
    let dir: string[] = [];
    ele.videoFilmArtists.forEach(c => {
      if (c.writer) {
        dir = dir.concat(c.videoArtist.firstLastName);
      }
    });
    return dir.join(', ');
  }

  getActor(ele: VideoFilmWithIdmmi) {
    let act: artist[] = [];
    ele.videoFilmArtists.forEach(c => {
      if (c.actor) {
        let a: artist = {
          'name': c.videoArtist.firstLastName,
          'number': c.numberOrderActor,
          'visible': true,
          'idArtist': c.id.idVideoArtist
        };
        act = act.concat(a);
      }
      this.sortActor(act);
    });
    let r = '';
    act.forEach(ac => {
      r = r.concat(', ' + ac.name);
    });

    return r.substring(2);
  }

  getActorTbl(ele: VideoFilmWithIdmmi) {
    let act: artist[] = [];
    ele.videoFilmArtists.forEach(c => {
      if (c.actor) {
        let a: artist = {
          'name': c.videoArtist.firstLastName,
          'number': c.numberOrderActor,
          'visible': true,
          'idArtist': c.id.idVideoArtist
        };
        act = act.concat(a);
      }
      this.sortActor(act);
    });
    return act;
  }


  getDirectorTbl(ele: VideoFilmWithIdmmi) {
    let dir: artist[] = [];
    ele.videoFilmArtists.forEach(c => {
      if (c.director) {
        let a: artist = {
          'name': c.videoArtist.firstLastName,
          'number': 0,
          'visible': true,
          'idArtist': c.id.idVideoArtist
        };
        dir = dir.concat(a);
      }
    });
    return dir;
  }

  getWriterTbl(ele: VideoFilmWithIdmmi) {
    let dir: artist[] = [];
    ele.videoFilmArtists.forEach(c => {
      if (c.writer) {
        let a: artist = {
          'name': c.videoArtist.firstLastName,
          'number': 0,
          'visible': true,
          'idArtist': c.id.idVideoArtist
        };
        dir = dir.concat(a);
      }
    });
    return dir;
  }

  private sortActor(act: artist[]) {
    for (let i = 0; i < (act.length - 1); i++) {
      for (let j = i + 1; j < act.length; j++) {
        if (act[i].number > act[j].number) {
          let tmp = act[j];
          act[j] = act[i];
          act[i] = tmp;
        }
      }
    }
  }

  getAllCountry(ele: VideoFilmWithIdmmi) {
    let coun: string[] = [];
    ele.videoCountries.forEach(c => {
      coun = coun.concat(c.country);
    });
    return coun.join('/');
  }


  actorToggleSize(idVideo: string) {
    let element: HTMLElement = document.getElementById('actor-' + idVideo);
    // console.log(element.style.height);
    if (element.style.height !== 'auto') {
      element.style.height = 'auto';
    } else {
      element.style.height = '1.45em';
    }
  }

  directorToggleSize(idVideo: string) {
    let element = document.getElementById('directorWriter-' + idVideo);
    if (element.style.height !== 'auto') {
      element.style.height = 'auto';
    } else {
      element.style.height = '1.45em';
    }
  }

  writerToggleSize(idVideo: string) {
    let element = document.getElementById('directorWriter-' + idVideo);
    if (element.style.height !== 'auto') {
      element.style.height = 'auto';
    } else {
      element.style.height = '1.5em';
    }
  }

  getAllKindsToShow(ele: VideoFilmWithIdmmi) {
    // ele.videoKinds.forEach()
  }

  filterWithThisName(a: artist) {
    this.oneclicks++;
    if (this.oneclicks > 1) {
      this.state_name = true;
      this.nameArtist = a.name;
      this.getNewPageVideo();
    }
    setTimeout(() => {
      this.oneclicks = 0;
    }, 800);
  }

  openWindow(idVideo: String) {
    let link = 'https://www.imdb.com/title/' + idVideo + '/reference';
    console.log('Open new Window with : ' + link);
    window.open(link);
  }

  addFilterKeywords(k: VideoKeyword) {
    console.log(k);
    this.state_keywords = true;
    let newk: KeywordAndVFSize = {
      'keywordEn': k.keywordEn,
      'idKeyword': k.idKeyword,
      'vfsize': 0,
    };
    this.lkeywords = this.lkeywords.concat(newk);
    this.keywordSelected(newk);
    // this.addIdToKeywordstr(newk.idKeyword);
    // this.lkeywordsToShow = this.lkeywordsToShow.concat(newk);
    // this.updateUrl();
    // this.newRequest();
  }

  pageDown() {
    this.pageNumber++;
    this.dataChange('pageNumber')
  }

  pageUp() {
    this.pageNumber--;
    this.dataChange('pageNumber')
  }

  private initPageSizeWithCookie() {
    if (this.cookieService.check('pageSize')) {
      let val = this.cookieService.get('pageSize');
      this.pageSize = parseInt(val, 10);
    } else {
      this.cookieService.set('pageSize', '5');
      this.pageSize = 5;
    }
  }
  showWithNameSerie(nameSerie: string){
    console.log('nameSerie', nameSerie)
    this.state_seriename = true;
    this.state_title = false;
    this.state_name = false;
    this.seriename = nameSerie;
    this.getNewPageVideo();
  }
}
