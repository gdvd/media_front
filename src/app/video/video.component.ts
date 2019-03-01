import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  paths;
  idVideo;

  constructor(private httpClient:HttpClient) { }

  ngOnInit() {
    this.httpClient.get("http://localhost:8085/path/allkeys")
      .subscribe(data=>{
        this.paths=data;
        console.log(data);
      }, err=>{
        console.log(err);
      });
  }

  onGetOnePath(p: string) {
    this.httpClient.get("http://localhost:8085/path/"+escape(p))
      .subscribe(data=>{
        this.paths=data;
        console.log(data);
      }, err=>{
        console.log(err);
      });
  }
}
