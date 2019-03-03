import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';


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

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.idSelctioned = '';
    this.infoVideo = null;
    this.ligneVideoHidden = false;
    this.httpClient.get('http://localhost:8085/path/allkeys')
      .subscribe(data => {
        this.paths = data;
        // console.log(data);
      }, err => {
        console.log(err);
      });
  }

  onGetOnePath(p: string) {
    this.idSelctioned = '';
    this.ligneVideoHidden = false;
    this.httpClient.get('http://localhost:8085/path/' + escape(p))
      .subscribe(data => {
        this.idVideo = data;
        this.infoVideo = null;
        this.listVideowithName = [];
        for (let id of this.idVideo) {
          let srturl = 'http://localhost:8085/videoByIdToInfo/name/' + id;
          this.httpClient.get(srturl)
            .subscribe(data => {
              this.listVideowithName.push(data);
            }, err => {
              console.log(err);
            });
        }
        ;
        // console.log(this.listVideowithName);
      }, err => {
        console.log(err);
      });
  }

  getAllInfo(id) {
    this.httpClient.get('http://localhost:8085/videoByIdToInfo/' + id + '/default')
      .subscribe(data => {
        this.ligneVideoHidden = true;
        this.idSelctioned = id;
        this.infoVideo = data;
        // console.log(data);
      }, err => {
        console.log(err);
      });
  }

  getUrlFile(i) {
    let ut = i.urlFile;
    let us = ut[0];
    return Object.values(us);
  }

  getAllKeys(obj) {
    return Object.keys(obj);
  }

  getAllValues(obj) {
    return Object.values(obj);
  }

  inHMS(d) {
    let s = Math.trunc(d % 60);
    let m = Math.trunc(((d - s) / 60) % 60);
    let h = Math.trunc((d - (m * 60) - (s)) / 3600);
    return '' + h + ' h ' + m + ' mn ' + s + ' sec (' + d + 'sec)';
  }

  inGMK(o) {
    // console.log(o);
    let oo = Math.trunc(o % 1024);
    let k = Math.trunc((o / 1024) % 1024);
    let m = Math.trunc(((o - k) / 1024 / 1024) % 1024);
    let g = Math.trunc((o - (m * 1024 * 1024) - (k * 1024)) / 1024 / 1024 / 1024);
    return '' + g + 'Go ' + m + 'Mo ' + k + 'Ko ' + oo + 'o  (' + o + ')';
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
        // console.log('res:' + res + ' ve:' + ve + ' deci:' + deci + ' calStr:' + calStr);
        result = '' + ve + units[i] + deci + ' (' + ot + 'oct)';
      } else {
        break;
      }
    }
    return result;
  }
}
