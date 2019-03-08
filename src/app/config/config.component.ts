import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CatalogueService} from '../catalogue.service';
import {forEach} from '@angular/router/src/utils/collection';
import {parseHttpResponse} from 'selenium-webdriver/http';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  paths;
  pathsOrder: Array<string>;
  myurl: string = '';
  allPathsReceive: Array<object>;
  url: string;
  pathsOrderRemote: Array<string>;
  dataTmp;

  constructor(private httpClient: HttpClient, private catalogueService: CatalogueService) {
  }

  ngOnInit() {
    this.catalogueService.getRessource(this.catalogueService.host + '/path/allPaths')
      .subscribe(data => {
        this.paths = data;
        this.pathsOrder = this.paths.sort(this.sortThings);
      }, err => {
        // let er = err.headers.get('JWTerror');
        console.log(err);
      });
  }

  askDl(id) {
    if (!this.verrifyIfPathExistInLocal(id)) {
      console.log("************* This path DOESN'T exist");
      this.saveNewPath(id);
    } else {//id existe already -> change the name
      console.log("************* This path EXIST");
    }
  }

  private saveNewPath(id) {
    let id2search = id[0];
    for (let pathRemote of this.pathsOrderRemote) {
      if (Object.keys(pathRemote)[0] === id2search) {
        // @ts-ignore
        let coll:Array<string> = Object.values(pathRemote)[0];
        for(let idremote of coll){
          this.catalogueService.getRessourceDistant(this.myurl, '/video/videoByIdToInfo/'+idremote)
            .subscribe(data => {
              // let dataid = {idremote : data};
              this.catalogueService.postRessource(this.catalogueService.host + '/video/saveid', data)
                .subscribe(datares => {
                    console.log('insert of :'+idremote+' ok');
                }, erres => {
                  console.log(erres);
                  console.log('insert of :'+idremote+' CRASH');
                });
            }, err => {
              console.log(err);
            });
        }
        console.log('---->' + Object.keys(pathRemote));
        let onePathToSend = Object.values(pathRemote)[0];
        console.log(onePathToSend);
        this.catalogueService.patchRessource(this.catalogueService.host + '/path/saveOnePath/' + escape(id2search),
          onePathToSend)
          .subscribe(data => {
            this.dataTmp = data;
          }, err => {
            console.log(err);
          });
        // Search ids
      }
    }
  }

  private sortThings(a, b) {
    var x = Object.keys(a).join('').toLowerCase().split('');
    var y = Object.keys(b).join('').toLowerCase().split('');
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };

  onSubmitURL() {
    if (this.myurl != '') {
      this.catalogueService.getRessourceDistant(this.myurl, '/path/allPaths')
        .subscribe(data => {
          // @ts-ignore
          this.allPathsReceive = data;
          // @ts-ignore
          this.pathsOrderRemote = this.allPathsReceive.sort(this.sortThings);
          console.log(this.allPathsReceive.length, data);

        }, err => {
          console.log(err);
        });
      // this.myurl = '';
    } else {
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
    this.allPathsReceive = null;
  }

  private verrifyIfPathExistInLocal(id: string) {
    for (let nbpath = 0 ;nbpath<this.pathsOrder.length; nbpath++) {
      let obj = (this.getKey(this.pathsOrder[nbpath]))[0];
      console.log(obj);
      if(obj==id){
        return true;
      }
    }
    return false;
  }
}
