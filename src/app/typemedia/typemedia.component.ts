import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CatalogueService} from '../catalogue.service';
import {MywindowService} from '../mywindow.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-typemedia',
  templateUrl: './typemedia.component.html',
  styleUrls: ['./typemedia.component.css']
})
export class TypemediaComponent implements OnInit {

  @Input()
  ele: MyMediaInfo;
  @Input()
  listTypeNameWithId: TypeName[];

  @Output()
  windowopen = new EventEmitter<InfoWindow>();

  typenameForm: any;
  choice: any;
  private typemmi: TypeMmi;
  public dboxpos: boolean;
  public overf: boolean;
  public mycomment: string;
  public nbchar: number;

  messagesWindow: InfoWindow[] = [];
  subscriptionWindow: Subscription;

  constructor(private catalogueService: CatalogueService,
              private fb: FormBuilder,
              private mywindowService: MywindowService) {
    this.subscriptionWindow = this.mywindowService.getMessage()
      .subscribe(messagesWindow => {
        if (messagesWindow) {
          this.messagesWindow.push(messagesWindow);
          this.messageWindowOpen(messagesWindow);
        } else {
          this.messagesWindow = [];
        }
      });
  }

  ngOnInit() {
    //ele.typeMmi!=null && ele.typeMmi.typeName!=null
    this.typenameForm = this.fb.group({
      listTypeNameWithId: [0]
    });
    if (this.ele.typeMmi != null) {
      //@ts-ignore
      this.typemmi = {
        'idTypeMmi': this.ele.typeMmi.idTypeMmi,
        'episode': this.ele.typeMmi.episode,
        'season': this.ele.typeMmi.season,
        'nameSerie': this.ele.typeMmi.nameSerie,
        'nameSerieVO': this.ele.typeMmi.nameSerieVO,
        'typeName': this.ele.typeMmi.typeName
      };
    } else {
      var tn = this.listTypeNameWithId[0];/*{
        'idTypeName': 0,
          'typeName': '',
          'typeMmis': null
      }*/
      //@ts-ignore
      this.typemmi = {
        'idTypeMmi': 0,
        'episode': 0,
        'season': 0,
        'nameSerie': '',
        'nameSerieVO': '',
        'typeName': tn,
      };
    }
    this.mycomment = '';
    this.nbchar=1024;
  }
  ngOnDestroy() {
    this.subscriptionWindow.unsubscribe();
  }
  sendMessage(): void {
    // send message to subscribers via observable subject
  }

  clearMessages(): void {
    // clear messages

  }
  submitChangeTypeMmi(typeMmi: TypeMmi, idMyMediaInfo: string) {
    //@ts-ignore
    this.typemmi = {
      'idTypeMmi': this.ele.typeMmi.idTypeMmi,
      'episode': this.ele.typeMmi.episode,
      'season': this.ele.typeMmi.season,
      'nameSerie': this.ele.typeMmi.nameSerie,
      'nameSerieVO': this.ele.typeMmi.nameSerieVO,
      'typeName': this.ele.typeMmi.typeName
    };
    console.log(this.typemmi);
    console.log(this.ele.idMyMediaInfo);
    let idVideo = '';
    if (this.ele.typeMmi.videoFilm != null) {
      // console.log(this.ele.typeMmi.videoFilm.idVideo);
      idVideo = this.ele.typeMmi.videoFilm.idVideo;
    }
    this.catalogueService.postRessource('/video/savetypemmi?idMmi='
      + this.ele.idMyMediaInfo + '&' + 'idVideo=' + idVideo, this.typemmi)
      .subscribe(data => {
        this.ele.editTypeName = 0;
        console.log(data);
      }, err => {
        console.log(err);
      });
  }
  cancelTypeName(ele: MyMediaInfo) {
    ele.editTypeName = 0;
  }
  setvalueformtype(event: Event) {
    //@ts-ignore
    let idtype = event.target.value;// new idTypeName
    for (let typename of this.listTypeNameWithId) {
      if (typename.idTypeName == idtype) {
        this.ele.typeMmi.typeName = typename;
        return;
      }
    }
  }
  getinfommi(ele: MyMediaInfo) {
    console.log(ele);
  }
  inHMS(d) {
    let s = Math.trunc(d % 60);
    let m = Math.trunc(((d - s) / 60) % 60);
    let h = Math.trunc((d - (m * 60) - (s)) / 3600);
    // return '' + h + 'h' + m + 'mn' + s + 'sec (' + d + 'sec)';
    return '' + h + 'h' + m + 'mn' + s + 's';
  }
  public inGMK2(ot) {
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
          deci = calStr.substring(2, 3);
        } else {
          if (calStr.length == 3) {
            deci = calStr.substring(2, 3);
          } else {
            deci = '';
          }
        }
        // result = '' + ve + units[i] + deci + ' (' + ot + 'oct)';
        result = '' + ve + ',' + deci + units[i];
        // result = '' + ve + units[i] + deci;
      } else {
        break;
      }
    }
    return result;
  }

  editele(ele: MyMediaInfo) {
    if (ele.editTypeName == 0 || ele.editTypeName == 2) {
      if (ele.typeMmi == null) {
        this.choice = this.typemmi.typeName.idTypeName;
        this.ele.typeMmi = this.typemmi;
      } else {
        this.choice = ele.typeMmi.typeName.idTypeName;
      }
      ele.editTypeName = 1;
      let iw: InfoWindow = {
        idMmi: this.ele.idMyMediaInfo,
        nameWindow: 'editele',
        codeName: 2,
        status2come: ele.editTypeName>0
      }
      this.windowopen.emit(iw);
    } else {
      ele.editTypeName = 0;
    }
  }

  editeleplus(ele: MyMediaInfo) {
    if (ele.editTypeName == 0 || ele.editTypeName == 1) {
      ele.editTypeName = 2;
      let iw: InfoWindow = {
        idMmi: this.ele.idMyMediaInfo,
        nameWindow: 'editeleplus',
        codeName: 3,
        status2come: ele.editTypeName>0
      };
      this.windowopen.emit(iw);
    } else {
      ele.editTypeName = 0;
    }
  }

  getNameSerie(ele: MyMediaInfo) {
    if (ele.typeMmi != null) {
      if (ele.typeMmi.nameSerieVO != '') {
        return ele.typeMmi.nameSerieVO;
      }
    }
  }

  getNbSerie(ele: MyMediaInfo) {
    if (ele.typeMmi != null) {
      if (ele.typeMmi.episode != 0 || ele.typeMmi.season != 0) {
        let s = ele.typeMmi.season;
        let ep = ele.typeMmi.episode;
        if (ep != 0 || s != 0) {
          let nb = 'S';
          if (s < 10) {
            nb = nb + '0';
          }
          nb = nb + s + 'E';
          if (ep < 10) {
            nb = nb + '0';
          }
          nb = nb + ep;
          return nb;
        }
      }
    }
  }


  eraseLinkMmiTmmi(ele: MyMediaInfo) {
    console.log('eraseLinkMmiTmmi to erase, with idMd5 : ' + ele.idMyMediaInfo);
    this.catalogueService.getRessource('/video/eraseLinkMmiTmmi/'
      + ele.typeMmi.idTypeMmi +
      '/'+ele.idMyMediaInfo)
      .subscribe(data => {
        //@ts-ignore
        this.ele = data;
        // this.ele.editTypeName=0;
        console.log(data);
      }, err => {
        console.log(err);
      });
  }

  eraseTmmi(ele: MyMediaInfo) {
    console.log('eraseTmmi to erase, with idMd5 : ' + ele.idMyMediaInfo);
    let idv = '';
    if(ele.typeMmi.videoFilm==null){
      idv = '0';
    }else{
      idv = ele.typeMmi.videoFilm.idVideo;
    }
    this.catalogueService.getRessource('/video/eraseTmmi/'
      + ele.typeMmi.idTypeMmi + '/' + idv +
      '/'+ele.idMyMediaInfo)
      .subscribe(data => {
        //@ts-ignore
        this.ele = data;
        // this.ele.editTypeName=0;
        console.log(data);
      }, err => {
        console.log(err);
      });
  }

  eraseLinkTmmiVideofilm(ele: MyMediaInfo) {
    console.log('eraseLinkTmmiVideofilm to erase, with idMd5 : ' + ele.idMyMediaInfo);
    this.catalogueService.getRessource('/video/eraseLinkTmmiVideofilm/'
      + ele.typeMmi.idTypeMmi + '/' + ele.typeMmi.videoFilm.idVideo +
      '/'+ele.idMyMediaInfo)
      .subscribe(data => {
        //@ts-ignore
        this.ele = data;
        // this.ele.editTypeName=0;
        console.log(data);
      }, err => {
        console.log(err);
      });
  }

  toggleactiveidMmi(idMyMediaInfo: string) {
    console.log('Disable idMyMediaInfo : '+idMyMediaInfo);
    this.catalogueService.getRessource('/admin/toggleactiveidMmi/'
      + idMyMediaInfo )
      .subscribe(data => {
        //@ts-ignore
        this.ele = data;
        console.log(data);
      }, err => {
        console.log(err);
      });
  }

  saveComment(idMmi: string) {
    if (this.mycomment.length > 0) {
      this.dboxpos = false;
      if (this.mycomment.length > 1024) {
        this.mycomment = this.mycomment.substring(0, 1023);
      }
      this.catalogueService.postRessourceWithData('/videouser/postcommentforuser/'
        + idMmi, this.mycomment)
        .subscribe(data => {
          console.log(data);
          //@ts-ignore
          this.ele=data;
        }, err => {
          console.log(err);
        });
    }
  }

  tachange() {
    this.nbchar=1024-this.mycomment.length;
    if(this.nbchar < 0){
      // console.log('this.overf = true');
      this.overf = true;
    }else{
      // console.log('this.overf = false');
      this.overf = false;
    }
  }

  togglecommentbox() {
    this.dboxpos = !this.dboxpos;
    let iw: InfoWindow = {
      idMmi: this.ele.idMyMediaInfo,
      nameWindow: 'commentmedia',
      codeName: 1,
      status2come: this.dboxpos
    }
    this.windowopen.emit(iw);
  }
  tachg() {
    this.nbchar=1024-this.mycomment.length;
    if(this.nbchar < 0){
      return this.mycomment.length - 1024 + ' characters will be troncate';
    }else{
      return this.nbchar + ' characters remaining';
    }
  }

  private messageWindowOpen(messagesWindow: InfoWindow) {
    if (messagesWindow.status2come) {
      if (messagesWindow.idMmi != this.ele.idMyMediaInfo) {
        this.dboxpos = false;
        this.ele.editTypeName = 0;
      } else {
        if (messagesWindow.nameWindow === 'commentmedia') {
          this.ele.editTypeName = 0;
        }else{
          this.dboxpos = false;
          if (messagesWindow.nameWindow === 'editeleplus') {
            this.ele.editTypeName = 2;
          }else{
            if (messagesWindow.nameWindow === 'editele') {
              this.ele.editTypeName = 1;
            }else{
              this.ele.editTypeName = 0;
            }
          }
        }
      }
    }
  }

  onewindowopen($event: InfoWindow) {
    this.windowopen.emit($event);
  }
}
