import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CatalogueService} from '../catalogue.service';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  paths;
  paths2;
  pathsWithState;
  allPaths;
  allPathsToMap;
  idVideo;
  infoVideo;
  listVideowithName;
  ligneVideoHidden: boolean = false;
  idSelctioned: String;
  keyword: string = '';
  allInfo;
  private headers: any;

  constructor(private httpClient: HttpClient,
              private catalogueService: CatalogueService,
              private router: Router,
              private appComponent: AppComponent) {
  }

  ngOnInit() {
    this.idSelctioned = '';
    this.infoVideo = null;
    this.ligneVideoHidden = false;
    if (this.appComponent.isConnected) {
      // this.httpClient.get('http://localhost:8085/path/allkeys')
      let subscription = this.catalogueService.getRessource('/path/getAllPathActive')
        .subscribe(data => {
          console.log(data);
          this.paths = data;
          this.paths2 = [];
          for (let s of this.paths) {
            let p: onePath = {pa: s, active: true};
            this.paths2 = this.paths + p;
          }
          /*        for(let p2 of this.paths){
                    console.log(p2.nameExport);
                    console.log(p2.active);
                  }*/
        }, err => {
          console.log(err);//JWTerror
          if (err.error.message === 'Forbidden') {
            this.router.navigateByUrl('/');//Re-Route
          }
          /*console.log(err.headers.get('JWTerror'));*/
        });
    }
  }

  onGetOnePath(p) {
    this.idSelctioned = '';
    this.ligneVideoHidden = false;
    this.infoVideo = null;
    this.listVideowithName = [];
    for (let id of p.videoids) {
      this.catalogueService.getRessource('/video/videoByIdLightToDoc/' + id)
        .subscribe(data => {
          this.listVideowithName.push(data);
        }, err => {
          console.log(err);
        });
    }
  }

  onGetOnePath2(p) {
    this.idSelctioned = '';
    this.ligneVideoHidden = false;
    this.infoVideo = null;
    this.listVideowithName = [];
    this.catalogueService.postRessourceWithData('/video/videoByIdLightToDocs/', p.videoids)
      .subscribe(data => {
        this.listVideowithName = data;
      }, err => {
        console.log(err);
      });
  }

  getAllInfo(id) {
    for (let infovi of this.listVideowithName) {
      if (infovi.id === id) {
        // console.log(this.ObjectToArray(infovi.info[0]));
        // console.log(infovi);
        this.infoVideo = infovi;
        // console.log(Object.keys(infovi.info).map(e=>infovi.info[e]));
        this.ligneVideoHidden = true;
        this.idSelctioned = id;
        break;
      }
    }

  }

  /*  ObjectToArray(obj) {
      if (typeof(obj) === 'object') {
        var keys = Object.keys(obj);
        var allObjects = keys.every(x => typeof(obj[x]) === 'object');
        if (allObjects) {
          return keys.map(x => this.ObjectToArray(obj[x]));
        } else {
          var o = {};
          keys.forEach(x => {
            o[x] = this.ObjectToArray(obj[x])
          });
          return o;
        }
      } else {
        return obj;
      }
    }*/
  getUrlFile(i) {
    let ut = i.urlFile;
    let us = ut[0];
    return Object.values(us);
  }

  inHMS(d) {
    let s = Math.trunc(d % 60);
    let m = Math.trunc(((d - s) / 60) % 60);
    let h = Math.trunc((d - (m * 60) - (s)) / 3600);
    return '' + h + 'h' + m + 'mn' + s + 'sec (' + d + 'sec)';
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
        result = '' + ve + units[i] + deci + ' (' + ot + 'oct)';
      } else {
        break;
      }
    }
    return result;
  }

  onSubmitKeyword(data) {
    let req: string = data.keyword;
    console.log(req);
    this.catalogueService.getRessource('/video/findInTitle/' + escape(req))
      .subscribe(data => {
        console.log(data);

        // this.allPathsToMap= datareq;
        // let url = this.catalogueService.host+'/path/findTitle/' + escape(data.keyword);
        // let mypaths = this.allPaths
        // console.log('Format de donnes');
        // console.log(this.allPathsToMap);
        // this.catalogueService.postRessourceWithData(url, this.allPathsToMap)
        //   .subscribe(datareq2 => {
        //     // console.log('--------Retour des datas------');
        //     // console.log(datareq2);
        //   },err=>{
        //     console.log(err);
        //   });
      }, err => {
        console.log(err);
      });
    /*console.log('KeyWord asked! : '+data.keyword);
    if(data.allInfo == true){
    console.log(data.allInfo);
    }else{
      console.log('Nothing checked');
    }*/
  }

  getKey(p) {
    return Object.keys(p);
  }

  getValue(p) {
    return Object.values(p);
  }
}

interface onePath {
  pa;
  active: boolean;
}
