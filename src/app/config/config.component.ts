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

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.httpClient.get('http://localhost:8085/path/allkeys')
      .subscribe(data => {
        this.paths = data;
        this.pathsOrder = this.paths.sort(ConfigComponent.sortThings);
        // this.pathsOrder = (this.paths).order;
      }, err => {
        console.log(err);
      });
  }

  static sortThings(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a > b ? -1 : b > a ? 1 : 0;
  }
}
