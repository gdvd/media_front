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

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.infoVideo=null;
    this.httpClient.get('http://localhost:8085/path/allkeys')
      .subscribe(data => {
        this.paths = data;
        console.log(data);
      }, err => {
        console.log(err);
      });
  }

  onGetOnePath(p: string) {
    this.httpClient.get('http://localhost:8085/path/' + escape(p))
      .subscribe( data => {
        this.idVideo = data;
        console.log(data);
        this.infoVideo=null;
        this.listVideowithName=[];
        for (let id of this.idVideo) {
          let srturl = 'http://localhost:8085/videoByIdToInfo/name/' + id;
          this.httpClient.get(srturl)
            .subscribe(data => {
              this.listVideowithName.push(data);
            }, err => {
              console.log(err);
            });
        };
        console.log(this.listVideowithName)
      }, err => {
        console.log(err);
      });
  }
  getAllInfo(id){
    this.httpClient.get('http://localhost:8085/videoByIdToInfo/'+id+"/default")
      .subscribe(data => {
        this.infoVideo = data;
        console.log(data);
      }, err=>{
        console.log(err);
      });
  }

  getUrlFile(i){
    let ut = i.urlFile;
    let us = ut[0];
    return Object.values(us);
  }
}
/*class MyObject {
  id: string;
  urlFile: any;
  info: any;
  video: any;
  audio: any;
  text: any;

  constructor(id, name, info, video, audio, text){
    this.id = id;
    this.urlFile = name;
    this.info = info;
    this.video = video;
    this.audio = audio;
    this.text = text;
  }
}*/
