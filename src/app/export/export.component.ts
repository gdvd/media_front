import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CatalogueService} from '../catalogue.service';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  public listexports: oneVne[];
  public editOneExport: videoSupportPath[] = null;
  private remoteOneVideoExportPath: videoSupportPath[] = null;
  private allPathsReceive: oneVne[];
  private oneExportRemote: oneVne;
  private myurl: string;
  private url: string;
  public nameExportRemote: any;
  private nameExport;
  private listOldVsp: videoSupportPath[] = null;
  private listRemoteVsp: videoSupportPath[];
  public listUsers: string[];
  public nameExportRemoteRemote: any;
  private listRemoteIdmd5: string[]= [];
  private listremotemmi:mymediainfo[];
  private toupdate: boolean;

  constructor(private httpClient: HttpClient,
              private catalogueService: CatalogueService,
              private appComponent: AppComponent) {
  }

  ngOnInit() {
      this.showTable();
      this.toupdate=true;
  }

  toupdatechange() {
    console.log('update change '+this.toupdate);
    this.toupdate = this.toupdate ? false : true;
  }

  private showTable() {
    this.catalogueService.getRessource('/managment/getAllPath')
      .subscribe(data => {
        // @ts-ignore
        this.listexports = data;
        this.getListUsers();
      }, err => {
        console.log(err);
      });
  }

  private getListUsers() {
    this.catalogueService.getRessource('/export/getListUsers')
      .subscribe(data => {
        //@ts-ignore
        this.listUsers = data;
        // foreach vne
        for (let vne of this.listexports) {
          let visi = false;
          vne.luserToactive = [];
          // foreach login that exists
          for(let nbusr = 0; nbusr < this.listUsers.length; nbusr++){
            var userToActive: userToActive = {
              'toActive': false,
              'login': this.listUsers[nbusr]
            };
            // to each oneUserTonameExport, search for login, if ok, read active or not
            let test = false;
            for(let oneUserTonameExport in vne.userToNameExports){
              //@ts-ignore
              if (userToActive.login === vne.userToNameExports[oneUserTonameExport].myUser.login) {
                test = vne.userToNameExports[oneUserTonameExport].active;

                break;
              }
            }
            if(test){
              userToActive.toActive=true;
              visi = true;
            }
            vne.luserToactive = vne.luserToactive.concat(userToActive);
          }
          vne.visibility=visi;
        }
      }, err => {
        console.log(err);
      });
  }
  deleteExport(e: oneVne) {
    console.log(e);
    console.log(e.nameExport);
    console.log(e.idVideoNameExport);
    if(e!=null){
      this.catalogueService.getRessource('/export/deleteExport/' + e.idVideoNameExport)
        .subscribe(data => {
          this.showTable();
        }, err => {
          console.log(err);
        });
    }
  }
  changeState(e: oneVne) {
    // console.log(e);
    // console.log(e.nameExport);
    // console.log(e.idVideoNameExport);
    if (e.active) {
      console.log(this.listexports);
      this.catalogueService.getRessource('/export/desactivationExport/' + e.idVideoNameExport)
        .subscribe(data => {
          //Refresh tbl
          this.showTable();
        }, err => {
          console.log(err);
        });
    } else {
      this.catalogueService.getRessource('/export/activationExport/' + e.idVideoNameExport)
        .subscribe(data => {
          //Refresh tbl
          this.showTable();
        }, err => {
          console.log(err);
        });
    }
  }

  editExport(e: oneVne) {
    this.editOneExport = e.videoSupportPaths;
    console.log('editOneExport');
    console.log(this.editOneExport);
  }

  editSupport(idMmi: string) {
    // console.log('begin edition');
    if (idMmi == null) {
      return;
    }
    this.catalogueService.getRessource('/export/getOneMmi/' + idMmi)
      .subscribe(data => {
        // @ts-ignore
        let oneMmi: mymediainfo = data;
        console.log(oneMmi);
        let ele = window.document.getElementById(idMmi);
        if (ele.className === 'glyphicon glyphicon-chevron-right') {
          // console.log('right->down');
          ele.className = 'glyphicon glyphicon-chevron-down';
          this.showMmi(oneMmi);
        } else {
          // console.log('down->right');
          ele.className = 'glyphicon glyphicon-chevron-right';
          this.hideMmi(oneMmi);
        }
        //Refresh tbl
      }, err => {
        console.log(err);
      });

  }

  private showMmi(oneMmi: mymediainfo) {
    let ele = window.document.getElementById('mmi' + oneMmi.idMyMediaInfo);
    ele.setAttribute('style', 'display: block');
    let listOfOptionsGeneral: string[] = ['fileSize', 'bitRate', 'codecId', 'duration', 'format',
      'height', 'width', 'Audios', 'texts'];
    this.generateTable(ele, oneMmi, listOfOptionsGeneral);

  }

  private hideMmi(oneMmi: mymediainfo) {
    let ele = window.document.getElementById('mmi' + oneMmi.idMyMediaInfo);
    ele.setAttribute('style', 'display: none');
    ele.removeChild(ele.childNodes[0]);
  }

  private generateTable(ele, oneMmi: mymediainfo, listOfOptions: string[]) {
    console.log('debut du tbl');
    var tbl = document.createElement('table');
    var tblBody = document.createElement('tbody');
    for (var i = 0; i < listOfOptions.length; i++) {
      let ret = '';

      if (listOfOptions[i].toLowerCase() === 'audios') {
        let r: myMediaAudio[] = oneMmi.myMediaAudios;
        for (var k = 0; k < r.length; k++) {
          if (k != 0) {
            ret = ret + ',';
          }
          ret = ret + r[k].myMediaLanguage.language;
        }
      }

      if (listOfOptions[i].toLowerCase() === 'texts') {
        // TODO:Next
      }

      for (var j in oneMmi) { // console.log(i, oneMmi[i]);
        if (j.toLowerCase() === listOfOptions[i].toLowerCase()) {
          ret = oneMmi[j];
          break;
        }
      }
      if (ret != '') {
        var row = document.createElement('tr');
        var cell1 = document.createElement('td');
        var cellText1 = document.createTextNode(listOfOptions[i]);
        cell1.appendChild(cellText1);
        var cell2 = document.createElement('td');
        var cellText2 = document.createTextNode(ret);
        cell2.appendChild(cellText2);
        row.appendChild(cell1);
        row.appendChild(cell2);
        tblBody.appendChild(row);
      }
    }
    tbl.appendChild(tblBody);
    ele.appendChild(tbl);
    tbl.setAttribute('border', '1');
  }

  onSubmitURL() {
    if (this.myurl != '') {
      console.log('request to : ' + this.myurl);
      this.catalogueService.getRessourceRemote(this.myurl, '/managment/getAllPathRemote')
        .subscribe(data => {
          // @ts-ignore
          this.allPathsReceive = data;
          // @ts-ignore
          console.log(this.allPathsReceive);
        }, err => {
          console.log(err);
        });
      // this.myurl = '';
    } else {
      console.log('URL is null !');
    }
  }

  private sortExport(a, b) {
    if (a.nameExport > b.nameExport) {
      return 1;
    } else {
      return -1;
    }
  }

  askDl(p: oneVne) {
    this.oneExportRemote = p;
    console.log(p);
    this.remoteOneVideoExportPath = p.videoSupportPaths;
    this.listRemoteIdmd5 = [];
    for (let vsp of this.remoteOneVideoExportPath) {
      this.listRemoteIdmd5 = this.listRemoteIdmd5.concat(vsp.id.idMyMediainfo);
    }
    // console.log(remoteIdMd5);
    console.log(this.myurl);
    this.catalogueService.postRessourceRemote(this.myurl, '/managment/getAllMmi',
      this.listRemoteIdmd5)
      .subscribe(data => {
        console.log(data);
        //@ts-ignore
        this.listremotemmi = data;
        this.verifyNameExportRemote(this.oneExportRemote.nameExport);
      }, err => {
        console.log(err);
      });
  }

  public verifyNameExportRemote(name: string) {
    console.log('name export remote : ' + name);
    this.catalogueService.postRessource('/managment/ifNameExportExist',
      name).subscribe(data => {
      if (data == null) {
        console.log('This name export remote doesn\'t exist');
        this.closeModal('modalremoteexport');
        if(name.length>1){
          console.log(this.listremotemmi);
          this.catalogueService.postRessource('/managment/createNameExport', name)
            .subscribe(data=>{
              // store vne and utne (data)
              //@ts-ignore
              let myvne:mynameexport = data;
              //################################################ add boolean to updte=no
              let nb = this.toupdate ? 1 : 0;
              this.catalogueService.postRessource('/managment/storemmi/'
                + myvne.idVideoNameExport + '/' + this.oneExportRemote.idVideoNameExport + '/' + nb
                , this.listremotemmi)
                .subscribe(data=>{
                  console.log(data);
                  this.showTable();
                }, err=>{
                  console.log(err);
                });
              // update vne
            }, err=>{
              console.log(err);
            });
        }
      } else {
        //@ts-ignore
        let myvne:mynameexport = data;
        if(this.toupdate==true){
          this.closeModal('modalremoteexport');
          let nb = this.toupdate ? 1 : 0;
          //################################################ add boolean to updte=yes
          this.catalogueService.postRessource('/managment/storemmi/'
            + myvne.idVideoNameExport + '/' + this.oneExportRemote.idVideoNameExport + '/' + nb
            , this.listremotemmi)
            .subscribe(data=>{
              console.log(data);
              this.showTable();
            }, err=>{
              console.log(err);
            });

        }else{
          console.log('This name export remote exist');
          this.nameExportRemoteRemote = name;
          let target = document.getElementById('modalremoteexport');
          target.setAttribute('style', 'display:block;');
        }
      }
    }, err => {
      console.log(err);
    });
  }

  private verifyNameExport(name: string) {
    console.log('name export remote : ' + name);
    this.catalogueService.postRessource('/managment/ifNameExportExist',
      name).subscribe(data => {
      if (data == null) {
        console.log('This name export doesn\'t exist');
      } else {
        console.log('This name export exist');
        this.nameExportRemote = name;
        let target = document.getElementById('modalexport');
        target.setAttribute('style', 'display:block;');
      }
    }, err => {
      console.log(err);
    });
  }


  public update(nameExportRemoteWanted) {
    event.stopPropagation();
    this.closeModal('modalexport');
    // Save listRemoteVsp with this.allPathsReceive
    for (let nbvne of this.allPathsReceive) {
      if (nbvne.nameExport === nameExportRemoteWanted) {
        this.listRemoteVsp = nbvne.videoSupportPaths;
        console.log(this.listRemoteVsp);
      }
    }
    // load the list of oldVsp : listOldVsp
    this.catalogueService.postRessource('/managment/getLisOldVsp', nameExportRemoteWanted)
      .subscribe(data => {
        // @ts-ignore
        this.listOldVsp = data;
        console.log(this.listOldVsp);
      }, err => {
        console.log(err);
      });
  }

  public rename() {
    event.stopPropagation();
    this.closeModal('modalexport');
    this.verifyNameExport(this.nameExportRemote);
  }

  public closeModal(id) {
    let target = document.getElementById(id);
    target.setAttribute('style', 'display:none;');
    document.removeEventListener('click', this.isClicked);
  }

  private removeAllPathsReceive() {
    this.allPathsReceive = null;
    this.myurl = '';
  }

  private isClicked(event) {
    let ele = event.target.parentNode.parentElement;
    let cls = ele.className.substring(0, 5);
    if (cls != 'modal') {
      console.log('TO CLOSE');
    }
  }

  toggleActivationLogin(login: userToActive, idvne) {
    // console.log(login);
    // console.log(idvne);
    let state = login.toActive?'1':'0';
    /*console.log('/managment/toggleActivationLogintonameexport/'
    + idvne + '/' + state);*/
    this.catalogueService.postRessource('/managment/toggleActivationLogintonameexport/'
        + idvne + '/' + state, login.login)
      .subscribe(data => {
        // @ts-ignore
        this.listexports = data;
        console.log(this.listexports);
        this.getListUsers();
      }, err => {
        console.log(err);
      });
  }

  saveAllPaths() {
    console.log('Save all path : ');
    console.log(this.allPathsReceive);
    if(this.allPathsReceive.length!=0){
      this.saveFirstPath(this.allPathsReceive.slice(0,));
    }

  }

    saveFirstPath(listVideoNameExport: oneVne[]){
      if(listVideoNameExport.length!=0){
        let oneVne: oneVne = listVideoNameExport[0];
        this.listRemoteIdmd5 = [];
        for (let vsp of oneVne.videoSupportPaths) {
          this.listRemoteIdmd5 = this.listRemoteIdmd5.concat(vsp.id.idMyMediainfo);
        }
        this.listremotemmi = [];
        this.catalogueService.postRessourceRemote(this.myurl, '/managment/getAllMmi', this.listRemoteIdmd5)
          .subscribe(data => {
            console.log(data);
            //@ts-ignore
            this.listremotemmi = data;
            // this.verifyNameExportRemote(oneVne.nameExport);
            this.catalogueService.postRessource('/managment/ifNameExportExist',
              oneVne.nameExport).subscribe(data => {
              if (data == null) {
                this.catalogueService.postRessource('/managment/createNameExport', oneVne.nameExport)
                  .subscribe(data=>{
                    //@ts-ignore
                    let myvne:mynameexport = data;
                    let nb = this.toupdate ? 1 : 0;
                    this.catalogueService.postRessource('/managment/storemmi/'
                      + myvne.idVideoNameExport + '/' + oneVne.idVideoNameExport + '/' + nb
                      , this.listremotemmi)
                      .subscribe(data=>{
                        console.log(data);
                        listVideoNameExport.splice(0, 1);
                        this.saveFirstPath(listVideoNameExport);
                        if(listVideoNameExport.length==0){
                          console.log('FINISH');
                          this.showTable();
                        }
                      }, err=>{
                        console.log(err);
                      });
                  },err=>{
                    console.log(err);
                  });
              }else{
                console.log('This name export exist');
              }
            }, err=>{
              console.log(err);
            });

          }, err => {
            console.log(err);
          });
        this.showTable();
      }
    }

  updateremote(name: string) {
    this.closeModal('modalremoteexport');
    console.log('name : ' + name);
    this.catalogueService.postRessource('/managment/ifNameExportExist',
      name).subscribe(data => {
      //@ts-ignore
      let myvne: mynameexport = data;
      let nb = this.toupdate ? 1 : 0;
      this.catalogueService.postRessource('/managment/storemmi/'
        + myvne.idVideoNameExport + '/' + this.oneExportRemote.idVideoNameExport + '/' + nb
        , this.listremotemmi)
        .subscribe(data => {
          console.log(data);
          this.showTable();
        }, err => {
          console.log(err);
        });
      console.log(data);
      this.showTable();
    }, err => {
      console.log(err);
    });
  }
}

interface oneVne {
  idVideoNameExport: number,
  active: boolean,
  complete: boolean,
  dateModifNameExport: string,
  nameExport: string,
  videoSupportPaths: videoSupportPath[],
  userToNameExports: userToNameExports[]
  luserToactive: userToActive[],
  visibility: boolean
}
interface userToActive{
  login:string,
  toActive: boolean
}
interface userToNameExports {
  active: boolean,
  dateModif: string,
  id: idUserToNameExport,
  oneMyUser: myUser,
  permission: string,
  myUser: myUser
}
interface vneToUsrState{
  idVne: number,
  listuserVneState: userVneState[]
}
interface idUserToNameExport {
  idMyUser: number,
  idVideoNameExport: number
}
interface myUser{
  idMyUser: number,
  login: string,
  active: boolean,
  dateModif: string
}
interface videoSupportPath {
  id: idobjectvsp,
  active: boolean,
  dateModif: string,
  type: string
}

interface idobjectvsp {
  idMyMediainfo: string,
  idVideoNameExport: number,
  pathGeneral: string
  title: string
}

interface mymediainfo {
  idMyMediaInfo: string,
  bitrate: number,
  codecId: string,
  duration: number,
  fileSize: number,
  format: string,
  height: number,
  width,
  textCount: number,
  myMediaAudios: myMediaAudio[],
  myMediaComments: object,
  myMediaTexts: object,
  videoSupportpaths: videoSupportPath[]
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

interface userVneState {
  idVideoNameExport: number,
  active: boolean,
  onelogin: string
}
interface mynameexport {
  active: boolean,
  complete: boolean,
  dateModifNameExport: string,
  idVideoNameExport: number,
  nameExport: string
}
