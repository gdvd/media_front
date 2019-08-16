import {Component, OnInit, HostListener} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CatalogueService} from '../catalogue.service';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {CookieService} from 'ngx-cookie-service';
import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  private tablepage: page;
  private textFilter: string;
  private page: number;
  private size: number;
  private toSort: string;
  private valueSizePage;
  private listIdVneToName: vnelight[];
  private vneName = '';
  private myOrder = '';
  private limdb = 'http://www.imdb.com';
  private listTypeName: string[];
  private listTypeNameWithId: typeName[];
  private typenameForm: FormGroup;
  private vnenameForm: FormGroup;
  private choice: any;
  private checkboxFlag: boolean = true;
  private numberActorsWanted: number = 4;//NumberActorsWanted
  private limiteOfWriters: number = 4;

  constructor(private httpClient: HttpClient,
              private catalogueService: CatalogueService,
              private router: Router,
              private appComponent: AppComponent,
              private cookieService: CookieService,
              private fb: FormBuilder) {
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
    this.toSort = 'title';
    this.textFilter = '';
    this.myOrder = 'naup';
    this.getPageMmi();
    this.getListIdVneToName();
    this.getAlltyname();
    this.getAlltynameWithId();

    this.typenameForm = this.fb.group({
      listTypeNameWithId: [0]
    });
    this.vnenameForm = this.fb.group({
      listIdVneToName: [0]
    });
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

  setvalueformVneName(event) {
    this.vneName = event.target.value;
    this.page = 1;
    this.getPageMmi();
  }

  cleanFilter() {
    this.textFilter = '';
    this.page = 1;
    this.getPageMmi();
  }

  cleanAllFilter() {
    this.textFilter = '';
    this.vneName = '';
    this.page = 1;
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
        '/managment/listMmiForLoginPP?page=' + (this.page - 1)
        + '&vneName=' + this.vneName + '&size='
        + this.size + strToSort, '%' + this.textFilter + '%')
        .subscribe(data => {
          //@ts-ignore
          this.tablepage = data;
          if (this.tablepage.content.length == 1) {
            this.myOrder = 'nothing';
          }
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
          }
          if (this.myOrder != 'nothing') {
            this.reorderpage();
          }
        }, err => {
          console.log(err);
        });
    } else {
      this.catalogueService.postRessourceWithData(
        '/managment/listMmiForLoginWithNamePP?page=' + (this.page - 1) + '&size='
        + this.size + strToSort, '%' + this.textFilter + '%')
        .subscribe(data => {
          //@ts-ignore
          this.tablepage = data;
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
    }
  }


  checkboxchange(event) {
    this.page = 1;
    this.textFilter = '';
    let elem: HTMLElement = event.target.parentNode.parentNode;
    //@ts-ignore
    let te: HTMLElement = elem.getElementsByClassName('filtertitle');
    if (this.checkboxFlag == true) {
      te[0].placeholder = 'Filter on title';
    } else {
      te[0].placeholder = 'Filter on name';
    }
    this.getPageMmi();
  }

  textFilterChange() {
    this.page = 1;
    this.getPageMmi();
    // console.log(this.textFilter);
  }

  test() { // ?page=0&size=10&pos=40
    event.stopPropagation();
    this.catalogueService.getRessource('/managment/lVneIdToName')
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
    var mytable: mmi[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: mmi[] = [];
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
    var mytable: mmi[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: mmi[] = [];
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
    var mytable: mmi[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: mmi[] = [];
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
    var mytable: mmi[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: mmi[] = [];
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
    var mytable: mmi[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: mmi[] = [];
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
    var mytable: mmi[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: mmi[] = [];
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
        // delete mmi of mytable[nb]
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
    var mytable: mmi[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: mmi[] = [];
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
        // delete mmi of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

  private sortByBitrateDesc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: mmi[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: mmi[] = [];
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
        // delete mmi of mytable[nb]
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
    var mytable: mmi[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: mmi[] = [];
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
        // delete mmi of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

  private sortBySizeDesc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: mmi[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: mmi[] = [];
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
        // delete mmi of mytable[nb]
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

  private getNameOfVne(ele: mmi) {
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
    var mytable: mmi[] = this.tablepage.content;
    let conv = this.listIdVneToName;
    if (mytable.length > 1) {
      var mynewtable: mmi[] = [];
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
        // delete mmi of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

  private sortByVneDesc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable: mmi[] = this.tablepage.content;
    if (mytable.length > 1) {
      var mynewtable: mmi[] = [];
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
        // delete mmi of mytable[nb]
        mytable.splice(nb, 1);
      }
    }
    this.tablepage.content = mynewtable;
  }

  private getListIdVneToName() {
    this.catalogueService.getRessource('/managment/lVneIdToName')
      .subscribe(data => {
        this.listIdVneToName = null;
        //@ts-ignore
        this.listIdVneToName = data;
        this.sortListIdVneToName(this.listIdVneToName);
      }, err => {
        console.log(err);
      });
  }

  private sortListIdVneToName(listToSort: vnelight[]){
    var mynewtable: vnelight[] = [];
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


  getMoreInfo(ele: mmi) {
    ele.state = 2;
    /*    let lvsp: videoSupportPaths[] = ele.videoSupportPaths;
        for(let vsp of lvsp){
          console.log(vsp.title, this.getnameVneWithId(vsp.id_video_name_export));
        }*/
  }

  removeMoreInfo(ele: mmi) {
    ele.state = 1;
  }

  getTitles(ele: mmi) {
    let lvsp: videoSupportPaths[] = ele.videoSupportPaths;
    var titles: onetitle[] = [];
    for (let vsp of lvsp) {
      let mytitle: onetitle = {
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
      console.log(text);
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

  gotosearch(ele: mmi) {
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

  private linkMmi(mylink: string, ele: mmi) {
    if (mylink != '' && ele != null) {
      ele.state = 2;
      var vf: videoFilms;
      this.catalogueService.postRessourceWithData('/managment/getVideoFilm/'
        + ele.idMyMediaInfo, (mylink))
        .subscribe(data => {
          console.log(data);
          //@ts-ignore
          vf = data;
          console.log(ele);
          var eletbl: mmi[] = [];
          for (let mmi of this.tablepage.content) {
            if (mmi.state == 2) {
              eletbl = eletbl.concat(mmi);
            }
          }
          // ele.state = 3;
          console.log(eletbl);
          this.linkIdttWithIdmmi(vf, eletbl);
        }, err => {
          console.log(err);
        });
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
  callEdit(ele: mmi) {
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
        // console.log(data);
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
    this.catalogueService.getRessource('/video/getAllTypeName')
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
    this.catalogueService.getRessource('/video/getAllTypeNameWithId')
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


  linkIdttWithIdmmi(vf: videoFilms, eletbl: mmi[]) {
    var idvf = vf.idVideo;
    let ele = eletbl[0];
    if (idvf != '' && ele.idMyMediaInfo != '') {
      this.catalogueService.getRessource('/video/linkIdttWithIdmmi/' + ele.idMyMediaInfo + '/' + idvf)
        .subscribe(data => {
          if (data != null) {
            //@ts-ignore
            let vf: videoFilms = data;
            // console.log(vf);
            if (vf != null) {
              ele.myressearch = null;
              this.catalogueService.getRessource('/video/gettypemmiwithidmmi/' + ele.idMyMediaInfo)
                .subscribe(data => {
                  //@ts-ignore
                  let typemmi: typeMmi = data;
                  ele.typeMmi = typemmi;
                  // console.log('eletbl.length : ' + eletbl.length);
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
      if (vfa.length = 1) {
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

  togglesearch(ele: mmi) {
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



}

interface onetitle {
  title: string,
  namevne: string
}

interface onePath {
  pa;
  active: boolean;
}

interface vnelight {
  idVideoNameExport: number;
  nameExport: string;
}

interface page {
  content: mmi[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  sort: object;
  pageable: object;
  size: number;
  totalElements: number;
  totalPages: number
}

interface mmi {
  state: number,
  editTypeName: number,
  search: number,
  idMyMediaInfo: string,
  format: string,
  codecId: string,
  fileSize: number,
  duration: number,
  height: number,
  width: number,
  bitrate: number,
  typeMmi: typeMmi,
  videoSupportPaths: videoSupportPaths[],
  myMediaAudios: myMediaAudio[],
  myMediaComments: [],
  myMediaTexts: MyMediaText[],
  myMediaVideos: [],
  myressearch: resultSearch[]
}

interface videoSupportPaths {
  active: boolean;
  dateModif: string;
  id: idvsp;
  id_video_name_export: number;
  pathGeneral: string;
  title: string;
  type: string
}

interface idvsp {
  idMyMediainfo: string;
  idVideoNameExport: number;
  title: string;
  pathGeneral: string
}

interface myMediaAudio {
  bitrate: number,
  duration: number,
  format: string,
  channels: string,
  forced: boolean,
  myMediaLanguage: MyMediaLanguage
}

/*interface MyMediaLanguage {
  idLanguage: number
  language: string
}*/

interface MyMediaLanguage {
  idLanguage: number
  language: string
}

interface MyMediaText {
  id: object,
  codecId: string,
  format: string,
  internal: boolean,
  myMediaLanguage: MyMediaLanguage
}

interface resultSearch {
  info: string,
  state: boolean,
  link: string,
  name: string,
  urlImg: string,
  video: boolean
}

interface typeMmi {
  idTypeMmi: number,
  season: number,
  episode: number,
  nameSerie: string,
  nameSerieVO: string,
  typeName: typeName,
  videoFilm: videoFilms,
  myMediaInfo: mmi
}

interface typeName {
  idTypeName: number,
  typeName: string,
  typeMmis: typeMmi[]
}

interface videoFilms {
  year: number,
  duration: number,
  scoreOnHundred: number,
  nbOfVote: number,
  idVideo: string,
  dateModifFilm: string,
  videoMoreInformation: VideoMoreInformation,
  typeMmi: typeMmi
  videoComment: VideoComment,
  videoSerie: VideoSerie,
  videoSourceInfo: VideoSourceInfo,
  videoPosters: VideoPoster[];
  videoTrailler: VideoTrailler[],
  videoResumes: VideoResume[],
  videoTitles: VideoTitle[],
  videoUserScores: VideoUserScore[],
  videoKinds: VideoKind[],
  videoLanguages: videoLanguages[],
  videoCountries: VideoCountry[],
  videoKeywordSet: VideoKeyword[],
  videoFilmArtists: VideoFilmArtist[],
  remake: videoFilms,
  children: videoFilms[],
}

interface VideoMoreInformation {
  informap: object[];
}

interface VideoPoster {
  idPoster: number,
  fileName: string,
  idMd5poster: string,
  urlImg: string
}

interface VideoKind {
  idKind: number,
  kindEn: string,
  kindFr: string,
}

interface videoLanguages {
  idVideoLanguage: number,
  language: string,
  urlLanguage: string
}

interface VideoCountry {
  idCountry: number,
  country: string,
  urlCountry: string
}

interface VideoKeyword {
  idKeword: number,
  keywordEn: string,
  keywordFr: string,
}

interface VideoTitle {
  id: idVideoTitle,
  title: string
}

interface idVideoTitle {
  idCountry: number,
  idVideo: string,
}

interface VideoTrailler {
  idTrailler: number,
  trailler: string
}

interface VideoUserScore {

}

interface VideoMoreInformation {

}

interface VideoComment {
  idComment: number,
  comment: string,
}

interface VideoResume {
  idResume: number,
  textResume: string
}

interface VideoSerie {

}

interface VideoSourceInfo {

}

interface VideoFilmArtist {
  idVideoArtist: string,
  idVideoFilm: string,
  actor: boolean,
  director: boolean,
  music: boolean,
  producer: boolean,
  writer: boolean,
  numberOrderActor: number
  videoArtist: videoArtist,
}

interface videoArtist {
  idVideoArtist: string,
  firstLastName: string
}
