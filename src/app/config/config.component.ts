import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  paths;
  pathsOrder: Array<string>;
  myurl: string='';
  allPathsReceive: Array<object>;
  url:string;
  pathsOrderRemote: Array<string>;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.httpClient.get('http://localhost:8085/path/allPaths')
      .subscribe(data => {
        this.paths = data;
        // this.pathsOrder = this.paths.sort(this.sortThings);
        this.pathsOrder = this.paths.sort(this.sortThings2);

      }, err => {
        console.log(err);
      });
  }

  sortThings(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a < b ? -1 : b > a ? 1 : 0;
  }

  sortThings2(a, b){
    var x = Object.keys(a).join('').toLowerCase().split('');
    var y = Object.keys(b).join('').toLowerCase().split('');
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  };

  onSubmitURL() {
    if(this.myurl!='') {
      this.url = 'http://'+this.myurl+':8085/path/allPaths';
      console.log(this.url);
      this.httpClient.get(this.url)
        .subscribe(data => {
          // @ts-ignore
          this.allPathsReceive = data;
          // @ts-ignore
          this.pathsOrderRemote = this.allPathsReceive.sort(this.sortThings2);
          console.log(this.allPathsReceive.length, data);

        }, err => {
          console.log(err);
        });
      this.myurl = '';
    }
    else {
      console.log('Nothing');
    }
  }


  getKey(p) {
    return Object.keys(p);
  }

  getValue(p) {
    // @ts-ignore
    return ((Object.values(p))[0]).length;
  }

  removeAllPathsReceive() {
    this.allPathsReceive=null;
  }
  askDl(id){
    console.log(id);
  }
}
