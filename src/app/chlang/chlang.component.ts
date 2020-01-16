import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CatalogueService} from '../catalogue.service';
import {Subscription} from 'rxjs';
import {MywindowService} from '../mywindow.service';

@Component({
  selector: 'app-chlang',
  templateUrl: './chlang.component.html',
  styleUrls: ['./chlang.component.css']
})
export class ChlangComponent implements OnInit {

  @Input()
  idMd5: string;
  @Input()
  languagesAu: myMediaAudio[];
  @Input()
  languagestx: MyMediaText[];
  @Output()
  windowopen = new EventEmitter<InfoWindow>();

  constructor(private catalogueService: CatalogueService,
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

  lang: boolean = false;
  text: boolean = false;
  dataLang: string = '';
  dataLangOld: string = '';
  datatext: string = '';
  datatextOld: string = '';
  refreshAu: boolean = true;

  messagesWindow: InfoWindow[] = [];
  subscriptionWindow: Subscription;

  ngOnInit() {
  }

  editLanguagesau(languagesAu: myMediaAudio) {
    // console.log(languagesAu.myMediaLanguage.language);
    this.dataLang = languagesAu.myMediaLanguage.language;
    this.dataLangOld = languagesAu.myMediaLanguage.language;
    this.text = false;
    this.lang = !this.lang;
    if (this.lang) {

      let iw: InfoWindow = {
        idMmi: this.idMd5,
        nameWindow: 'chlang',
        codeName: 1,
        status2come: this.lang
      };
      this.windowopen.emit(iw);
    }
  }

  cancelLang() {
    this.lang = false;
  }

  saveLang(au: myMediaAudio) {
    this.lang = false;
    let cl: langtopost = {
      'idMd5': this.idMd5,
      'oldLang': this.dataLangOld,
      'newLlang': this.dataLang
    };
    // console.log(cl);
    this.catalogueService.postRessource('/video/updatelanguage', cl)
      .subscribe(data => {
        // console.log(data);
        for (let a in this.languagesAu) {
          if (this.languagesAu[a] == au) {
            //@ts-ignore
            this.languagesAu[a] = data;
          }
        }
      }, err => {
        console.log(err);
      });
  }


  editLanguagestx(languagestx: MyMediaText) {
    // console.log(languagestx);
    this.datatext = languagestx.myMediaLanguage.language;
    this.datatextOld = languagestx.myMediaLanguage.language;
    this.lang = false;
    this.text = !this.text;
  }

  cancelText() {
    this.text = false;
  }

  saveText(tx: MyMediaText) {
    this.text = false;
    // console.log(this.text);
    let cl: langtopost = {
      'idMd5': this.idMd5,
      'oldLang': this.datatextOld,
      'newLlang': this.datatext
    };
    this.catalogueService.postRessource('/video/updatetext', cl)
      .subscribe(data => {
        // console.log(data);
        for (let t in this.languagestx) {
          if (this.languagestx[t] == tx) {
            //@ts-ignore
            this.languagesAu[t] = data;
          }
        }
      }, err => {
        console.log(err);
      });
  }

  private messageWindowOpen(messagesWindow: InfoWindow) {
    if (messagesWindow.status2come) {
      if (messagesWindow.idMmi != this.idMd5) {
        this.lang = false;
      } else {
        if (messagesWindow.nameWindow === 'chlang') {

        }else{
          this.lang = false;
        }
      }
    }
  }
}
