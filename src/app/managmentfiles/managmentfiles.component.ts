import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {CatalogueService} from '../catalogue.service';
import {AppComponent} from '../app.component';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';

@Component({
  selector: 'app-managmentfiles',
  templateUrl: './managmentfiles.component.html',
  styleUrls: ['./managmentfiles.component.css']
})
export class ManagmentfilesComponent implements OnInit {
  private listUser: UserLightAnsSel[] = [];
  private basketOfOneUser: Basket[] = [];
  private currentBasket: BasketNameUser;

  constructor(private httpClient: HttpClient, private router: Router,
              private catalogueService: CatalogueService,
              private fb: FormBuilder, private appComponent: AppComponent) {
  }

  private uploadedFiles;
  private target: Element;
  private tabulation = 'tab1';
  public me: string = '';
  private pathdir: string = '';
  private compute: boolean = false;
  private pref: Preferences;
  private folder: string;
  private resscan: Statescan;
  private nameExport: string;
  private nameExportModif: string;
  private vne: MyNameExport;
  private listmd5: string[];
  private listFilesToExport: FilesReadToExport[];
  private listOfOldPath: string[];
  private listOfNewPath: string[];
  private listOfOldPathToDelete: string[];
  private newextask = false;
  private newExt = '';
  private preftitle: Preferences;
  private prefbackupMo: Preferences;
  private prefbackupSc: Preferences;
  private addcountry: boolean;
  private newCountry: string;
  private scheduledtask: Preferences;
  private frequency: string;
  private editFrequency: boolean;
  private editFrequencyScore: boolean;
  private frequencyScore: number;
  private frequencyMovie: number;
  private inputAddSubscribe: boolean = false;
  private listtoexport: string[];
  private exportForm: FormGroup;
  private onenameExport: string;
  private exportSelected: string;
  private msgret: number;
  private listBasketName: BasketNameUser[] = [];
  private typeExport: string[] = ["AppleScript", "bashScript", "javaOnServer"];
  private exp: string[] = ["AppleScript", "bashScript", "javaOnServer"];

  ngOnInit() {
    // console.log('Load page : ' + this.appComponent.isConnected);
    this.me = '1';
    this.loadPref();
    this.getPrefBackUp();
    this.getAllUser();
    this.addcountry = false;
    this.exportForm = this.fb.group({
      exportForm: [0]
    });
    this.msgret = -1;
  }
  form = new FormGroup({
    type: new FormControl('', Validators.required)
  });
  submit(){
    console.log(this.form.value);
  }

  private loadPref() {
    //Test if connected
    if (this.appComponent.isConnected) {
      this.catalogueService.getRessource('/admin/getpref')
        .subscribe(data => {
          // @ts-ignore
          this.pref = data;
          // console.log(this.pref);
          this.catalogueService.getRessource('/admin/getpreftitle')
            .subscribe(data => {
              // @ts-ignore
              this.preftitle = data;
            }, err => {
              console.log(err);
            });

          // console.log(this.pref);
        }, err => {
          console.log(err);
        });
      this.getPrefSchedule();
      // this.getPrefSubscribe();
    }
  }

  private getPrefBackUp() {
    this.catalogueService.getRessource('/admin/getprefbackupMo')
      .subscribe(data => {
        // @ts-ignore
        this.prefbackupMo = data;
        // console.log(this.prefbackupMo);
        // @ts-ignore
        this.frequencyMovie = this.prefbackupMo.prefmap.frequency;
        //getprefbackupMo
        this.catalogueService.getRessource('/admin/getprefbackupSc')
          .subscribe(data => {
            // @ts-ignore
            this.prefbackupSc = data;
            // console.log(this.prefbackupSc);
            // @ts-ignore
            this.frequencyScore = this.prefbackupSc.prefmap.frequency;
          }, err => {
            console.log(err);
          });
        //getprefbackupSc
      }, err => {
        console.log(err);
      });

  }

  private myTab(num) {
    this.tabulation = 'tab' + num;
    this.loadPref();
    this.getlisttoexport();
  }

  private submitScanFolder(value: any) {
    // console.log(value.myFolder);
    let data = value.myFolder;
    // let data2 = window.btoa(unescape(encodeURIComponent(data)));
    if (value.myFolder != '') {
      this.catalogueService.postRessource('/managment/scanFolderWithPathdir', data)
        .subscribe(data => {
          // @ts-ignore
          this.resscan = data;
          this.listFilesToExport = [];
          for (var i = 0; i < this.resscan.filesRead.length; i++) {
            //filesreadToExport
            this.listFilesToExport =
              this.listFilesToExport.concat(
                {filePath: this.resscan.filesRead[i], state: 1});
          }
          // console.log(this.listFilesToExport);
        }, err => {
          console.log(err);
        });
    }
  }

  private submitDatasTodb() {
    // console.log('Send data to db');
    if (this.listFilesToExport.length != 0 && this.nameExport != null) {
      this.catalogueService.postRessource('/managment/ifNameExportExist',
        this.nameExport).subscribe(data => {
        // console.log(data);
        if (data == null) {
          this.vne = null;
          this.catalogueService.postRessource('/managment/createNameExport',
            this.nameExport).subscribe(data => {
            // @ts-ignore
            this.vne = data;
            // console.log(this.vne);
            if (this.resscan.filesRead.length != 0) {
              this.createMmiAnVspReturnListOfMd5(0);
            } else {
              console.log('Pb : filesRead is empty');
            }
          }, err => {
            console.log(err);
          });
        } else {
          console.log('This name export exist');
          //@ts-ignore
          this.vne = data;
          // alert('This name already exist, would you like to continue', );
          this.nameExportModif = this.nameExport;
          let target = document.getElementById('modalexport');
          target.setAttribute('style', 'display:block;');
        }
      }, err => {
        console.log(err);
        return false;
      });
    }
  }

  //// -> pour creer mmi et vsp :
  private createMmiAnVspReturnListOfMd5(position: number) {
    let newpos = this.getNextFilePathWithStateOne(position);
    if (newpos < 0) {
      return;
    }
    // console.log('newpos:'+newpos);
    let pathGeneral = this.listFilesToExport[newpos].filePath;
    this.listFilesToExport[newpos].state = 2;
    // Create MMI
    this.catalogueService.postRessource('/managment/createMmiAndGetMd5', pathGeneral)
      .subscribe(data => {
        // @ts-ignore
        let mymmi: mmi = data;
        let md5: string = mymmi.idMyMediaInfo;
        // ====== Create VSP
        let pathGeneral = this.listFilesToExport[newpos].filePath;
        // console.log('this.vne');
        // console.log(this.vne);
        this.catalogueService.postRessource('/managment/createVSP/'
          + this.vne.idVideoNameExport + '/' + md5, pathGeneral)
          .subscribe(data => {
            this.listFilesToExport[newpos].state = 3;
            newpos++;
            newpos = this.getNextFilePathWithStateOne(newpos);
            // ====== make recursive function and if listSize == 0 Then update VNE
            if (newpos < 0) {
              // ===== Update VNE with list of md5, active it, and save !
              this.catalogueService.getRessource('/managment/updateNameExport/'
                + this.vne.idVideoNameExport + '/1/1')
                .subscribe(data => {
                  console.log('Export finish');
                  // console.log(data);
                }, err => {
                  console.log(err);
                });
            } else {
              this.createMmiAnVspReturnListOfMd5(newpos);
            }
          }, err => {
            console.log(err);
          });
      }, err => {
        console.log(err);
      });
  }

  private getNextFilePathWithStateOne(position: number) {
    let size = this.listFilesToExport.length;
    if (size != 0 && position < size) {
      for (var j = position; j < size; j++) {
        if (this.listFilesToExport[j].state == 1) {
          return j;
        }
      }
    }
    return -1;
  }

  private createListOfOldPath() {
    this.listOfOldPath = [];
    // @ts-ignore
    for (var k = 0; k < this.vne.videoSupportPaths.length; k++) {
      // @ts-ignore
      this.listOfOldPath = this.listOfOldPath.concat(this.vne.videoSupportPaths[k].pathGeneral + this.vne.videoSupportPaths[k].title);
    }
  }

  private createListOfNewPath() {
    this.listOfNewPath = [];
    for (var l = 0; l < this.listFilesToExport.length; l++) {
      let t = this.listFilesToExport[l].filePath;
      var test: boolean = false;
      for (var m = 0; m < this.listOfOldPath.length; m++) {
        if (t === this.listOfOldPath[m]) {
          test = true;
          break;
        }
      }
      if (!test) {
        this.listOfNewPath = this.listOfNewPath.concat(t);
      }
    }
  }

  private createListOfOldPathToDelete() {
    this.listOfOldPathToDelete = [];
    for (var n = 0; n < this.listOfOldPath.length; n++) {
      let op = this.listOfOldPath[n];
      var test: boolean = false;
      for (var o = 0; o < this.listFilesToExport.length; o++) {
        if (op === this.listFilesToExport[o].filePath) {
          test = true;
          break;
        }
      }
      if (!test) {
        this.listOfOldPathToDelete = this.listOfOldPathToDelete.concat(op);
      }
    }
  }

  private updatelistFilesToExport() {
    // console.log('this.listFilesToExport');
    // console.log(this.listFilesToExport);
    // console.log('this.listOfNewPath');
    // console.log(this.listOfNewPath);
    for (var p = 0; p < this.listFilesToExport.length; p++) {
      var test: boolean = false;
      for (var q = 0; q < this.listOfNewPath.length; q++) {
        if (this.listFilesToExport[p].filePath === this.listOfNewPath[q]) {
          test = true;
          break;
        }
      }
      if (!test) {
        this.listFilesToExport[p].state = 3;
      }
    }
  }

  /*
* Modal Begin
*/
  private update() { // this.vne & this.nameExportModif
    event.stopPropagation();
    this.closeModal('modalexport');
    this.createListOfOldPath();
    // console.log('this.listOfOldPath');
    // console.log(this.listOfOldPath);

    this.createListOfNewPath();
    // console.log('this.listOfNewPath');
    // console.log(this.listOfNewPath);

    this.createListOfOldPathToDelete();
    // console.log('this.listOfOldPathToDelete');
    // console.log(this.listOfOldPathToDelete);

    this.updatelistFilesToExport();
    // console.log('this.listFilesToExport');
    // console.log(this.listFilesToExport);

    // TODO: Next
    // Supp files this.listOfOldPathToDelete
    this.catalogueService.postRessourceWithData('/managment/deleteOldVsp/' + this.vne.idVideoNameExport,
      this.listOfOldPathToDelete)
      .subscribe(data => {
        // Add files this.listOfNewPath
        this.createMmiAnVspReturnListOfMd5(0);
      }, err => {
        console.log(err);
      });
  }

  private rename() {
    event.stopPropagation();
    console.log('Rename ' + this.nameExportModif);
    this.nameExport = this.nameExportModif;
    this.closeModal('modalexport');
  }

  private isClicked(event) {
    let ele = event.target.parentNode.parentElement;
    let cls = ele.className.substring(0, 5);
    if (cls != 'modal') {
      console.log('TO CLOSE');
    }
  }

  private closeModal(id) {
    let target = document.getElementById(id);
    target.setAttribute('style', 'display:none;');
    document.removeEventListener('click', this.isClicked);
  }

// Add Extension
  private openAddExt() {
    console.log('OpenAddExt');
    this.newextask = !this.newextask;
  }

  private onSubmitNewExt(f) {
    console.log('onSubmitNewExt ' + this.newExt);
    console.log('onSubmitNewExt.length ' + this.newExt.length);
    if (this.newExt.length > 1) {
      console.log('let\'s go');
      this.catalogueService.postRessourceWithData('/managment/addnewext', this.newExt)
        .subscribe(data => {
          this.loadPref();
          this.newExt = '';
        }, err => {
          console.log(err);
        });
    }
    this.newextask = false;
  }

  private actionaddCountry() {
    console.log('Add country');
    this.addcountry = this.addcountry ? false : true;
    this.newCountry = '';
  }

  private deleteCountry(c: string) {
    console.log('Delete asked');
    console.log(c);
    var test = false;
    for (let country of this.preftitle.extset) {
      if (country === c) {
        test = true;
      }
    }
    if (test) {
      console.log('OK we delete ' + c);
      this.catalogueService.postRessourceWithData('/managment/deletecountry',
        c)
        .subscribe(data => {
          this.loadPref();
        }, err => {
          console.log(err);
        });
    } else {
      console.log('NOP we didn\'t delete ' + c);
    }

  }

  private onSubmitNewCountry(value: any) {
    let str: string = value.newCountry;
    console.log('Add country asked');
    console.log(str);
    if (str.length > 1 && str.length < 33) {
      this.catalogueService.postRessourceWithData('/managment/addcountry', value.newCountry)
        .subscribe(data => {
          this.loadPref();
          this.newCountry = '';
          this.addcountry = false;
        }, err => {
          console.log(err);
        });
    } else {
      console.log('error');
      console.log(str.length);
    }
  }

  private updateAllTitles() {
    console.log('Update all titles begin');
    this.catalogueService.getRessource('/managment/updatealltitles')
      .subscribe(data => {
        console.log('Update all titles are finish');
      }, err => {
        console.log(err);
      });
  }

  private getPrefSchedule() {
    this.catalogueService.getRessource('/admin/getValuesScheduledTask')
      .subscribe(data => {
        //@ts-ignore
        this.scheduledtask = data;
        this.frequency = this.getFrequencyTask();
      }, err => {
        console.log(err);
      });

  }

  private getNextTask() {
    if (this.scheduledtask != null) {
      let task = this.scheduledtask.prefmap;
      //@ts-ignore
      let next = task.last;
      return next;
    }
  }

  private getFrequencyTask() {
    if (this.scheduledtask != null) {
      let task = this.scheduledtask.prefmap;
      //@ts-ignore
      let frequency = task.frequency;
      return frequency;
    }
  }

  private editValueFrequencyIdmd5Idtt() {
    this.editFrequency = !this.editFrequency;
  }

  private cancelChFrequency() {
    console.log('cancelChFrequency');
    this.editFrequency = false;
  }

  private cancelChFrequencyScore() {
    console.log('cancelChFrequency');
    this.editFrequencyScore = false;
  }

  private saveChFrequencyIdmd5Idtt() {
    this.editFrequency = false;
    //@ts-ignore
    let f = this.prefbackupMo.prefmap.frequency;
    this.catalogueService.getRessource('/admin/postnewfrequencymovie/'
      + f)
      .subscribe(data => {
        console.log(data);
        //@ts-ignore
        this.prefbackupMo = data;
        // this.frequency = this.getFrequencyTask();
      }, err => {
        console.log(err);
      });
  }

  private editValueFrequencyScore() {
    this.editFrequencyScore = !this.editFrequencyScore;
  }

  private saveChFrequencyScore() {
    this.editFrequencyScore = false;
    //@ts-ignore
    let f = this.prefbackupSc.prefmap.frequency;
    this.catalogueService.getRessource('/admin/postnewfrequencyscore/'
      + f)
      .subscribe(data => {
        console.log(data);
        //@ts-ignore
        this.prefbackupSc = data;
      }, err => {
        console.log(err);
      });
  }

  private addSubscribe() {
    console.log('addSubscribe');
    this.inputAddSubscribe = !this.inputAddSubscribe;
  }

  /*private getPrefSubscribe() {
    this.catalogueService.getRessource('/admin/getPrefSubscribe')
      .subscribe(data=>{
        console.log(data);
      }, err=>{
        console.log(err);
      });
  }*/
  getlisttoexport() {
    this.catalogueService.getRessource('/admin/getlisttoexport/')
      .subscribe(data => {
        // console.log(data);
        //@ts-ignore
        this.listtoexport = data;
      }, err => {
        console.log(err);
      });
  }

  setExportForm(event: Event) {
    //@ts-ignore
    this.exportSelected = event.target.value;
    // console.log(this.exportSelected);
  }

  exportSelection() {
    if (this.exportSelected != null
      && this.exportSelected.length != 0
      && this.listtoexport.includes(this.exportSelected)) {
      // console.log('true');
      this.catalogueService.postRessourceWithData('/admin/executeexport/',
        this.exportSelected)
        .subscribe(data => {
          // console.log(data);
          //@ts-ignore
          this.msgret = data;
        }, err => {
          console.log(err);
        });
    } else {
      console.log('false');
    }
  }

  getAllUser() {
    this.catalogueService.getRessource('/videoid/getListForScores')
      .subscribe(data => {
        // @ts-ignore
        this.listUser = data;
        this.listUser.forEach(u => {
          u.active = false;
        });
      }, err => {
        console.log(err);
      });
  }

  btnSel(lu: UserLightAnsSel) {
    this.listUser.forEach(u => {
      u.active = false;
    });
    lu.active = true;
    // console.log(this.appComponent.baskets);
    this.basketOfOneUser = [];
    this.catalogueService.getRessource('/admin/getBasketsOfUserWithInfo/' + lu.login)
      .subscribe(data => {
        // console.log(data);
        // @ts-ignore
        this.listBasketName = data;
      }, err => {
        console.log(err);
      });
    /*this.appComponent.baskets.forEach(b=>{
      if(b.id.idMyUser==lu.idMyUser){
        this.basketOfOneUser = this.basketOfOneUser.concat(b);
      }
    });
    let lst = this.appComponent.getAllBaskets('', lu.login);
    console.log(lst);*/

  }

  basketSel(lbn: BasketNameUser) {
    this.listBasketName.forEach(b => {
      if (b.basketName === lbn.basketName) {
        b.active = true;
      } else {
        b.active = false;
      }
      // console.log(b);
    });
  }

  onebasketisselected() {
    let test = false;
    this.listBasketName.forEach(b => {
      if (b.active) {
        test = true;
        this.currentBasket = b;
      }
    });
    return test;
  }

  inGMK(size: number) {
    return this.appComponent.inGMK(size);
  }

  onCheckboxGroupChange(nameVne: string, active: boolean) {
    this.seactiveOneImport(nameVne, active);
    this.duplicateIdSearch();
  }

  onCheckboxElementChange(nameVne: string, title: string, path: string,
                          idmmi: string, active: boolean) {
    this.deactiveOneElement(nameVne, title, path, idmmi, active);
    this.duplicateIdSearch();
  }

  getInfo() {
    console.log(this.listBasketName);
  }

  getSizeTotal() {
    let nb = 0;
    this.listBasketName.forEach(b => {
      if (b.active) {
        nb = b.size;
      }
    });
    return this.inGMK(nb);
  }

  private seactiveOneImport(nameVne: string, active: boolean) {
    for (let i = 0; i < this.listBasketName.length; i++) {
      if (this.listBasketName[i].active) {
        for (let j = 0; j < this.listBasketName[i].limportuser.length; j++) {
          if (this.listBasketName[i].limportuser[j].nameVne === nameVne) {
            for (let k = 0; k < this.listBasketName[i].limportuser[j].lmmiuser.length; k++) {
              if (active) {
                this.listBasketName[i].limportuser[j].active = false;
                if (this.listBasketName[i].limportuser[j].lmmiuser[k].active) {
                  this.deactiveOneElement(nameVne,
                    this.listBasketName[i].limportuser[j].lmmiuser[k].title,
                    this.listBasketName[i].limportuser[j].lmmiuser[k].path,
                    this.listBasketName[i].limportuser[j].lmmiuser[k].idmmi,
                    true);
                }
              } else {
                this.listBasketName[i].limportuser[j].active = true;
                if (!this.listBasketName[i].limportuser[j].lmmiuser[k].active) {
                  this.deactiveOneElement(nameVne,
                    this.listBasketName[i].limportuser[j].lmmiuser[k].title,
                    this.listBasketName[i].limportuser[j].lmmiuser[k].path,
                    this.listBasketName[i].limportuser[j].lmmiuser[k].idmmi,
                    false);
                }
              }
            }
          }
        }
      }
    }
  }

  private deactiveOneElement(
    nameVne: string, title: string, path: string, idmmi: string, active: boolean) {
    for (let i = 0; i < this.listBasketName.length; i++) {
      if (this.listBasketName[i].active) {
        for (let j = 0; j < this.listBasketName[i].limportuser.length; j++) {
          if (this.listBasketName[i].limportuser[j].nameVne === nameVne) {
            for (let k = 0; k < this.listBasketName[i].limportuser[j].lmmiuser.length; k++) {
              //Search element to (des)activate and update size
              if (this.listBasketName[i].limportuser[j].lmmiuser[k].idmmi === idmmi &&
                this.listBasketName[i].limportuser[j].lmmiuser[k].title === title &&
                this.listBasketName[i].limportuser[j].lmmiuser[k].path === path) {
                if (active) {
                  this.listBasketName[i].limportuser[j].lmmiuser[k].active = false;
                  this.listBasketName[i].limportuser[j].size =
                    this.listBasketName[i].limportuser[j].size -
                    this.listBasketName[i].limportuser[j].lmmiuser[k].size;
                  this.listBasketName[i].size =
                    this.listBasketName[i].size -
                    this.listBasketName[i].limportuser[j].lmmiuser[k].size;
                  if (this.listBasketName[i].limportuser[j].size == 0) {
                    this.listBasketName[i].limportuser[j].active = false;
                  }
                } else {
                  this.listBasketName[i].limportuser[j].lmmiuser[k].active = true;
                  this.listBasketName[i].limportuser[j].size =
                    this.listBasketName[i].limportuser[j].size +
                    this.listBasketName[i].limportuser[j].lmmiuser[k].size;
                  this.listBasketName[i].size =
                    this.listBasketName[i].size +
                    this.listBasketName[i].limportuser[j].lmmiuser[k].size;
                  this.listBasketName[i].limportuser[j].active = true;
                }
              }
            }
          }
        }
      }
    }
  }

  private duplicateIdSearch() {
    let lidDbl: string[] = [];
    let lid: string[] = [];
    for (let i = 0; i < this.listBasketName.length; i++) {
      for (let j = 0; j < this.listBasketName[i].limportuser.length; j++) {
        if (this.listBasketName[i].limportuser[j].active) {
          for (let k = 0; k < this.listBasketName[i].limportuser[j].lmmiuser.length; k++) {
            if (this.listBasketName[i].limportuser[j].lmmiuser[k].active) {
              let id = this.listBasketName[i].limportuser[j].lmmiuser[k].idmmi;
              if(lid.includes(id)){
                if(! lidDbl.includes(id)) lidDbl = lidDbl.concat(id)
              }else{
                lid = lid.concat(id)
              }
            }
          }
        }
      }
    }
    this.applyColorForDuplicates(lidDbl);
  }

  private applyColorForDuplicates(lidDbl: string[]) {
    var eles = document.querySelectorAll('[id*=\'element-\']');
    eles.forEach(e => {
      let i = e.id.split('-')[1];
      if (lidDbl.length > 0 && lidDbl.includes(i)) {
        // console.log('Several duplicates');
        e.setAttribute('style', 'color: #d02e3b;');
      } else {
        e.setAttribute('style', 'color: currentColor;');
      }
    });
  }

}
