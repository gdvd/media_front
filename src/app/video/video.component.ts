import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CatalogueService} from '../catalogue.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  paths;
  idVideo;
  infoVideo;
  listVideowithName;
  ligneVideoHidden: boolean = false;
  idSelctioned: String;
  keyword: string = '';
  allInfo;

  constructor(private httpClient: HttpClient, private catalogueService:CatalogueService) {
  }

  ngOnInit() {
    this.idSelctioned = '';
    this.infoVideo = null;
    this.ligneVideoHidden = false;
    // this.httpClient.get('http://localhost:8085/path/allkeys')
    this.catalogueService.getRessource(this.catalogueService.host+'/path/allkeys')
      .subscribe(data => {
        this.paths = data;
      }, err => {
        console.log(err);
      });
  }

  onGetOnePath(p: string) {
    this.idSelctioned = '';
    this.ligneVideoHidden = false;
    let url = this.catalogueService.host+'/path/' + escape(p);
    this.catalogueService.getRessource(url)
      .subscribe(data => {
        this.idVideo = data;
        this.infoVideo = null;
        this.listVideowithName = [];
        for (let id of this.idVideo) {
          let uri = this.catalogueService.host+'/video/videoByIdToInfo/' + id + '/name';
          this.catalogueService.getRessource(uri)
            .subscribe(data => {
              this.listVideowithName.push(data);
            }, err => {
              console.log(err);
            });
        }
        ;
      }, err => {
        console.log(err);
      });
  }

  getAllInfo(id) {
    let url = this.catalogueService.host+'/video/videoByIdToInfo/' + id + '/default';
    this.catalogueService.getRessource(url)
      .subscribe(data => {
        this.ligneVideoHidden = true;
        this.idSelctioned = id;
        this.infoVideo = data;
      }, err => {
        console.log(err);
      });
  }

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

  onSubmitKeyword() {
    console.log('KeyWord asked! : '+this.keyword+' AllInfo : '+this.allInfo);
  }
}
