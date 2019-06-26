import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CatalogueService} from '../catalogue.service';
import {forEach} from '@angular/router/src/utils/collection';
import {AppComponent} from '../app.component';


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

  constructor(private httpClient: HttpClient,
              private catalogueService: CatalogueService,
              private appComponent: AppComponent) {
  }

  ngOnInit() {
    if(this.appComponent.isConnected){
      this.showTable();
    }
  }

  private showTable() {
    this.catalogueService.getRessource('/path/getAllPath')
      .subscribe(data => {
        this.paths = data;
        console.log(data);
        // console.log(this.paths);
        this.pathsOrder = this.paths.sort(this.sortExport);
        // list.sort((a, b) => (a.color > b.color) ? 1 : (a.color === b.color) ? ((a.size > b.size) ? 1 : -1) : -1 )
      }, err => {
        // let er = err.headers.get('JWTerror');
        console.log(err);
      });
  }

  private sortExport(a, b) {
    if (a.nameExport > b.nameExport) {
      return 1;
    } else {
      return -1;
    }
  }

  askDl(p) {
    // console.log(p);
    if (!this.verrifyIfPathExistInLocal(p.id)) {
      // This path DOESN'T exist
      this.saveNewPath(p);
    } else {//id existe already -> change the name
      // console.log("************* This path EXIST");
    }
  }

  private saveNewPath(pathRemoteToSave) {
    if (pathRemoteToSave === null) {
      return;
    }
    // ask to create in DB MediaPath, the value at the end of URL to force or not
    this.catalogueService.postRessourceWithData('/path/beforetosave/0', pathRemoteToSave)
      .subscribe(data => {
        // console.log(data);
        if (data == 64 || data == 51) {
          // console.log('-----------');
          // console.log(pathRemoteToSave.videoids);
          // this.importIdsVideo(pathRemoteToSave);
          // UpDate MediaPath in active
          // /updatePath/{id}/{state}
          let state:number = 1;
          this.catalogueService.putRessourceWithData('/path/updatePath/'+pathRemoteToSave.id, state)
            .subscribe(data=>{
              console.log('import reussi');
              //Refresh tbl
              this.showTable();
            }, err=>{
              console.log(err);
            });
        }
        // Next with other return value (test same path...) si in mediaPathServiceImpl, fct beforetosave
      }, err => {
        console.log(err);
      });
    // @ts-ignore
    /*let coll: Array<string> = pathRemoteToSave.videoids;
    for (let idremote of coll) {
      this.catalogueService.getRessourceRemote(this.myurl, '/video/getById/' + idremote /!*+ '/light'*!/)
        .subscribe(data => {
          // let dataid = {idremote : data};
          console.log(data);
          /!*this.catalogueService.postRessource(this.catalogueService.host + '/video/saveid', data)
            .subscribe(datares => {
              console.log('insert of :' + idremote + ' ok');
            }, erres => {
              // console.log('insert of :'+idremote+' CRASH');
            });*!/
        }, err => {
          console.log(err);
        });
      this.catalogueService.getRessourceRemote(this.myurl, '/video/videoByIdLight/' + idremote /!*+ '/light'*!/)
        .subscribe(data => {
          // let dataid = {idremote : data};
          console.log(data);
          /!*this.catalogueService.postRessource(this.catalogueService.host + '/video/saveid', data)
            .subscribe(datares => {
              console.log('insert of :' + idremote + ' ok');
            }, erres => {
              // console.log('insert of :'+idremote+' CRASH');
            });*!/
        }, err => {
          console.log(err);
        });
      console.log('Importer les donnees id : '+ idremote);
    }*/
    // console.log('---->' + Object.keys(pathRemote));
    // let onePathToSend = Object.values(pathRemote)[0];
    /*this.catalogueService.patchRessource(this.catalogueService.host + '/path/saveOnePath/' + escape(pathRemoteToSave.nameExport),
      pathRemoteToSave)
      .subscribe(data => {
        this.dataTmp = data;
        //Refresh Tbl
        this.showTable();
      }, err => {
        console.log(err);
      });*/
    // Search ids


    //   }
    // }
  }
  private importIdsVideo(mediaVideo) {
    ////Begin id's import
    // console.log(videos);
    let videos = mediaVideo.videoids;
    let nameExport = escape(mediaVideo.nameExport);
    if(this.myurl==='')return;
    videos.forEach((video) => {
      /*this.catalogueService.getRessourceRemote(this.myurl, '/video/getVideoByIdLight/'+video)
        .subscribe(data => {
          this.catalogueService.postRessourceWithData('/video/saveVideoLight/'+nameExport, data)
            .subscribe(data => {

            }, err => {
              console.log(err);
            });
        }, err => {
          console.log(err);
        });
      this.catalogueService.getRessourceRemote(this.myurl,'/video/getVideoById/'+video)
        .subscribe(data => {
          this.catalogueService.postRessourceWithData('/video/saveVideo/'+nameExport, data)
            .subscribe(data => {

            }, err => {
              console.log(err);
            });
        }, err => {
          console.log(err);
        });*/
      //// End id's import
    });
  }

  private sortPaths(a, b) {
    var aa = a.nameExport.toLowerCase().split('');
    var bb = b.nameExport.toLowerCase().split('');
    if (aa < bb) {
      return -1;
    }
    if (aa > bb) {
      return 1;
    }
    return 0;
  };

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
      this.catalogueService.getRessourceRemote(this.myurl, '/path/getAllPath')
        .subscribe(data => {
          // @ts-ignore
          this.allPathsReceive = data;
          // @ts-ignore
          this.pathsOrderRemote = this.allPathsReceive.sort(this.sortExport);
          // console.log(this.allPathsReceive.length, data);

        }, err => {
          console.log(err);
        });
      // this.myurl = '';
    } else {
      console.log('URL null');
    }
  }

  changeState(p){
    console.log(p.nameExport);
    if(p.active){
      this.catalogueService.getRessource('/path/desactivation/'+p.id)
        .subscribe(data => {
          //Refresh tbl
          this.showTable();
        }, err => {
          console.log(err);
        });
    }else{
      this.catalogueService.getRessource( '/path/activation/'+p.id)
        .subscribe(data => {
          //Refresh tbl
          this.showTable();
        }, err => {
          console.log(err);
        });
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
    this.pathsOrderRemote = null;
    this.myurl = '';
  }

  private verrifyIfPathExistInLocal(id: string) { // this.paths vs onePath:id:string
    for (let nbpath = 0; nbpath < this.paths.length; nbpath++) {
      // let obj = (this.getKey(this.pathsOrder[nbpath]))[0];
      let obj = (this.paths[nbpath]).id;
      // console.log(obj);
      if (obj == id) {
        return true;
      }
    }
    return false;
  }
}
