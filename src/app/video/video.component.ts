import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CatalogueService} from '../catalogue.service';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {CookieService} from 'ngx-cookie-service';


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
  private filter: string;
  private valueSizePage;
  private listIdVneToName: vnelight[];
  private myOrder = '';

  constructor(private httpClient: HttpClient,
              private catalogueService: CatalogueService,
              private router: Router,
              private appComponent: AppComponent,
              private cookieService: CookieService) {
  }
  /*   this.router.navigateByUrl('/');//Re-Route */

  ngOnInit() {
    if(this.cookieService.check('valueSizePage')){
      this.valueSizePage = this.cookieService.get('valueSizePage');
      this.size = parseInt(this.valueSizePage, 10);
    }else{
      this.cookieService.set('valueSizePage', '20' );
      this.size = 10;
    }
    this.page = 1;
    this.toSort = 'title';
    this.textFilter = '';
    this.myOrder = 'naup';
    this.getPageMmi();
    this.getListIdVneToName();
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
  }
  private reorderpage(){
    if(this.myOrder=='naup')this.sortByNameAsc();
    if(this.myOrder=='nadown')this.sortByNameDesc();
    if(this.myOrder=='duup')this.sortByDurationAsc();
    if(this.myOrder=='dudown')this.sortByDurationDesc();
    if(this.myOrder=='dmup')this.sortByDimensionAsc();
    if(this.myOrder=='dmdown')this.sortByDimensionDesc();
    if(this.myOrder=='brup')this.sortByBitrateAsc();
    if(this.myOrder=='brdown')this.sortByBitrateDesc();
    if(this.myOrder=='sizeup')this.sortBySizeAsc();
    if(this.myOrder=='sizedown')this.sortBySizeDesc();
    if(this.myOrder=='vneup')this.sortByVneAsc();
    if(this.myOrder=='vnedown')this.sortByVneDesc();
  }
  setSizeToCookie(nb: number){
    this.cookieService.set('valueSizePage', nb.toString() );
  }

  getPageMmi() {
    let strToSort = '&toSort=' + this.toSort;
    this.catalogueService.postRessourceWithData(
      '/managment/listMmiForLoginPP?page=' + (this.page - 1) + '&size='
      + this.size + strToSort, '%'+this.textFilter+'%')
      .subscribe(data => {
        //@ts-ignore
        this.tablepage = data;
        this.reorderpage();
        /*var i = 0;
        for(let mmi of this.tablepage.content){
          mmi.mminumber=i;
          i++;
        }*/
      }, err => {
        console.log(err);
      });
  }

  textFilterChange() {
    this.getPageMmi();
    console.log(this.textFilter);
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


  inHMS(d) {
    let s = Math.trunc(d % 60);
    let m = Math.trunc(((d - s) / 60) % 60);
    let h = Math.trunc((d - (m * 60) - (s)) / 3600);
    // return '' + h + 'h' + m + 'mn' + s + 'sec (' + d + 'sec)';
    return '' + h + 'h' + m + 'mn' + s + 's';
  }

  inGMK2(ot) {
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
          deci = calStr.substring(2, 4);
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
  // Info in tbl
  private getInfo(ele){
    console.log(ele);
  }
  private getId(ele:mmi){
    console.log('ele.mmi : '+ele.idMyMediaInfo);


  }
  sizeOfArray(ele: mmi) {
    return ele.myMediaTexts.length;
  }

  sortByName() {
    if (this.myOrder != 'naup') {
      this.myOrder = 'naup';
      this.sortByNameAsc();
      console.log('Let\'s go to up');
    }else{
      if(this.myOrder == 'naup') {
        this.myOrder = 'nadown';
        this.sortByNameDesc();
        console.log('Let\'s go to down');
      }
    }
  }
  private sortByNameAsc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable:mmi[] = this.tablepage.content;
    if(mytable.length>1){
      var mynewtable: mmi[] = [];
      while(mytable.length>0){
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].videoSupportPaths[0].title;
        for(var j = 1; j < mytable.length; j++){
          //@ts-ignore
          if((valOne).localeCompare(mytable[j].videoSupportPaths[0].title, 'fr')>0){
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
    var mytable:mmi[] = this.tablepage.content;
    if(mytable.length>1){
      var mynewtable: mmi[] = [];
      while(mytable.length>0){
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].videoSupportPaths[0].title;
        for(var j = 1; j < mytable.length; j++){
          //@ts-ignore
          if((valOne).localeCompare(mytable[j].videoSupportPaths[0].title, 'fr')<0){
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
    console.log('Order by Duration asked');
    if (this.myOrder != 'duup') {
      this.myOrder = 'duup';
      this.sortByDurationAsc();
      console.log('Let\'s go to up');
    }else{
      if(this.myOrder == 'duup') {
        this.myOrder = 'dudown';
        this.sortByDurationDesc();
        console.log('Let\'s go to down');
      }
    }
  }
  private sortByDurationAsc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable:mmi[] = this.tablepage.content;
    if(mytable.length>1){
      var mynewtable: mmi[] = [];
      while(mytable.length>0){
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].duration;
        for(var j = 1; j < mytable.length; j++){
          //@ts-ignore
          if(valOne>mytable[j].duration){
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
    var mytable:mmi[] = this.tablepage.content;
    if(mytable.length>1){
      var mynewtable: mmi[] = [];
      while(mytable.length>0){
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].duration;
        for(var j = 1; j < mytable.length; j++){
          //@ts-ignore
          if(valOne<mytable[j].duration){
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
    console.log('Order by Dimension asked');
    if (this.myOrder != 'dmup') {
      this.myOrder = 'dmup';
      this.sortByDimensionAsc();
      console.log('Let\'s go to up');
    }else{
      if(this.myOrder == 'dmup') {
        this.myOrder = 'dmdown';
        this.sortByDimensionDesc();
        console.log('Let\'s go to down');
      }
    }
  }
  private sortByDimensionAsc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable:mmi[] = this.tablepage.content;
    if(mytable.length>1){
      var mynewtable: mmi[] = [];
      while(mytable.length>0){
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].width;
        for(var j = 1; j < mytable.length; j++){
          //@ts-ignore
          if(valOne>mytable[j].width){
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
    var mytable:mmi[] = this.tablepage.content;
    if(mytable.length>1){
      var mynewtable: mmi[] = [];
      while(mytable.length>0){
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].width;
        for(var j = 1; j < mytable.length; j++){
          //@ts-ignore
          if(valOne<mytable[j].width){
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
    console.log('Order by Bitrate asked');
    if (this.myOrder != 'brup') {
      this.myOrder = 'brup';
      this.sortByBitrateAsc();
      console.log('Let\'s go to up');
    }else{
      if(this.myOrder == 'brup') {
        this.myOrder = 'brdown';
        this.sortByBitrateDesc();
        console.log('Let\'s go to down');
      }
    }
  }
  private sortByBitrateAsc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable:mmi[] = this.tablepage.content;
    if(mytable.length>1){
      var mynewtable: mmi[] = [];
      while(mytable.length>0){
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].bitrate;
        for(var j = 1; j < mytable.length; j++){
          //@ts-ignore
          if(valOne>mytable[j].bitrate){
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
    var mytable:mmi[] = this.tablepage.content;
    if(mytable.length>1){
      var mynewtable: mmi[] = [];
      while(mytable.length>0){
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].bitrate;
        for(var j = 1; j < mytable.length; j++){
          //@ts-ignore
          if(valOne<mytable[j].bitrate){
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
    console.log('Order by Size asked');
    if (this.myOrder != 'sizeup') {
      this.myOrder = 'sizeup';
      this.sortBySizeAsc();
      console.log('Let\'s go to up');
    }else{
      if(this.myOrder == 'sizeup') {
        this.myOrder = 'sizedown';
        this.sortBySizeDesc();
        console.log('Let\'s go to down');
      }
    }
  }
  private sortBySizeAsc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable:mmi[] = this.tablepage.content;
    if(mytable.length>1){
      var mynewtable: mmi[] = [];
      while(mytable.length>0){
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].fileSize;
        for(var j = 1; j < mytable.length; j++){
          //@ts-ignore
          if(valOne > mytable[j].fileSize){
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
    var mytable:mmi[] = this.tablepage.content;
    if(mytable.length>1){
      var mynewtable: mmi[] = [];
      while(mytable.length>0){
        let nb = 0;
        //@ts-ignore
        let valOne = mytable[0].fileSize;
        for(var j = 1; j < mytable.length; j++){
          //@ts-ignore
          if(valOne < mytable[j].fileSize){
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
    console.log('Order by Vne asked');
    if (this.myOrder != 'vneup') {
      this.myOrder = 'vneup';
      this.sortByVneAsc();
      console.log('Let\'s go to up');
    }else{
      if(this.myOrder == 'vneup') {
        this.myOrder = 'vnedown';
        this.sortByVneDesc();
        console.log('Let\'s go to down');
      }
    }
  }
  private getNameOfVne(ele :mmi){
    for(let m in ele.videoSupportPaths){
      for(let i of this.listIdVneToName){
        if(i.idVideoNameExport===ele.videoSupportPaths[m].id_video_name_export)
          return i.nameExport;
      }
    }

    return '0';
  }
  private sortByVneAsc() {// console.log('ä'.localeCompare('z', 'de')); // une valeur négative : en allemand ä est avant z
    var mytable:mmi[] = this.tablepage.content;
    let conv = this.listIdVneToName;
    if(mytable.length>1){
      var mynewtable: mmi[] = [];
      while(mytable.length>0){
        let nb = 0;
        let valOne = mytable[0].videoSupportPaths[0].id_video_name_export;
        for(var j = 1; j < mytable.length; j++){
    //if((valOne).localeCompare(mytable[j].videoSupportPaths[0].title, 'fr')>0){
          if(valOne > mytable[j].videoSupportPaths[0].id_video_name_export){
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
    var mytable:mmi[] = this.tablepage.content;
    if(mytable.length>1){
      var mynewtable: mmi[] = [];
      while(mytable.length>0){
        let nb = 0;
        let valOne = mytable[0].videoSupportPaths[0].id_video_name_export;
        for(var j = 1; j < mytable.length; j++){
          if(valOne < mytable[j].videoSupportPaths[0].id_video_name_export){
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
//=====================================================
  sortByInfo() {
    console.log('Order by Info asked');
  }
  private getListIdVneToName(){
    this.catalogueService.getRessource('/managment/lVneIdToName')
      .subscribe(data => {
        this.listIdVneToName=null;
        //@ts-ignore
        this.listIdVneToName=data;
        console.log(this.listIdVneToName);
      }, err => {
        console.log(err);
      });
  }
}

interface onePath {
  pa;
  active: boolean;
}
interface vnelight{
  idVideoNameExport: number;
  nameExport: string;
}
interface page {
  order: number;
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
  mminumber:number,
  idMyMediaInfo: string,
  textCount: number,
  format: string,
  codecId: string,
  fileSize: number,
  duration: number,
  height: number,
  width: number,
  bitrate: number,
  videoSupportPaths: videoSupportPaths[],
  myMediaAudios: myMediaAudio[],
  myMediaComments: [],
  myMediaTexts: MyMediaText[],
  myMediaVideos: [],
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
interface myMediaAudio {
  bitrate: number,
  duration: number,
  format: string,
  channels: string,
  forced: boolean,
  myMediaLanguage: MyMediaLanguage
}

interface MyMediaLanguage {
  idLanguage: number
  language: string
}
interface idvsp {
  idMyMediainfo: string;
  idVideoNameExport: number;
  title: string;
  pathGeneral: string
}
interface MyMediaLanguage {
  idLanguage: number
  language: string
}
interface MyMediaText{
  id: object,
  codecId: string,
  format: string,
  internal: boolean,
  myMediaLanguage: MyMediaLanguage
}
