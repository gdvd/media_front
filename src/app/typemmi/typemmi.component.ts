import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {VideoidComponent} from '../videoid/videoid.component';
import {CatalogueService} from '../catalogue.service';
import {AppComponent} from '../app.component';


@Component({
  selector: 'app-typemmi',
  templateUrl: './typemmi.component.html',
  styleUrls: ['./typemmi.component.css']
})
export class TypemmiComponent implements OnInit {
  // private listWindowOpen: string[] = [];
  private nbchar: number;
  private overf: boolean;

  @Input()
  private vf1: VideoFilmWithIdmmi;
  @Input()
  private lmmi1: MyMediaInfo[];
  @Output()
  vfret = new EventEmitter<VideoFilmWithIdmmi>();

  private lmmi: MyMediaInfo[] = [];
  // private showbigsize: boolean = false;
  private limitToShow = 7;
  private showAll = false;
  private type = '';
  private showModifyAudio = false;
  private showModifySubtitle = false;
  private tabulation = 'tab1';
  private tabulationVf = 'tabVF1';
  private valuetoshow: number;
  private editAudio = '';
  private editSubtitle = '';
  private oneComment: string = '';
  private season: number;
  private episode: number;
  private idMmiInEdition: string;
  private idLanguageInEdition: number;
  private titleSerie: string[] = [];
  private titleSerieIsEmpty: number = 0;
  private nameSerieVo: string = '';
  private vfYear: number;
  private vfScore: number;
  private vfImg: string = '';
  private newComment: string;
  private newTitle: string;
  private newKeyword: string;

  constructor(
    private videoid: VideoidComponent,
    private catalogueService: CatalogueService,
    private appComponent: AppComponent
  ) {
  }

  ngOnInit() {
    this.valuetoshow = 0;
    if (this.lmmi1 != null && this.lmmi1.length > 0) {
      if (this.lmmi1.length > 1) {
        if(this.searchIfSeveralEpisode()){
          this.valuetoshow = 3;
        }else{
          this.valuetoshow = 0;
        }
        this.sortOnValuetoshow(this.valuetoshow, false);
      } else {
        this.lmmi = this.lmmi1.slice(0);
      }
      for (let mmi of this.lmmi) {
        if (mmi.videoSupportPaths != null) {
          for (let vsp of mmi.videoSupportPaths) {
            this.videoid.listIdVneToName.forEach(vne => {
              if (vne.idVideoNameExport === vsp.id_video_name_export) {
                vsp.vneName = vne.nameExport;
              }
            });
          }
        }
      }
    } else {
      console.log('lmmi is empty');
    }
    this.getTitleSerie();
    this.myTabVF(1);
  }

  searchIfSeveralEpisode() {
    let testEpiChg = false;
    if (this.lmmi1.length > 1) {
      let testEpi = false;
      let valTest = -1;
      for (let mmi of this.lmmi1) {
        if (mmi.typeMmi != undefined&&mmi.typeMmi.episode!=0) {
          if(valTest!=-1&&valTest!=mmi.typeMmi.episode){
           testEpiChg = true;
            this.type = 'serie'
           break;
          }else{
            valTest = mmi.typeMmi.episode;
          }
        }
      }
    }
    return testEpiChg;
  }

  private invertInlmmi1(i: number, j: number) {
    let tmp = this.lmmi1[j];
    this.lmmi1[j] = this.lmmi1[i];
    this.lmmi1[i] = tmp;
  }

  private sortOnValuetoshow(choice: number, invert: boolean) {
    // console.log('choice', choice, 'invert', invert, 'this.type', this.type);
    switch (choice) {
      case(0):
        this.sortByImageSize(invert);
        break;
      case(1):
        this.sortByFilesize(invert);
        break;
      case(2):
        this.sortByDuration(invert);
        break;
      case(3):
        this.sortByEpisodeAndSeason(invert);
        break;
      case(4):
        this.sortByEpisodeAndSeason(invert);
        break;
      case(5):
        this.sortByEpisodeAndSeason(invert);
        break;
      // case(6):
      //   this.sortByEpisodeAndSeason(invert);
      //   break;
    }
  }

  private sortByImageSize(invert: boolean) {
    var len = this.lmmi1.length;
    if (len > 1) {
      for (let i = 0; i < len - 1; i++) {
        let newpos = i;
        let valmin = -1;
        valmin = this.lmmi1[i].width;
        for (let j = i + 1; j < len; j++) {
          let valj = 0;
          valj = this.lmmi1[j].width;
          if (invert) {
            if (valmin < valj) {
              valmin = valj;
              newpos = j;
            }
          } else {
            if (valmin > valj) {
              valmin = valj;
              newpos = j;
            }
          }

        }
        if (newpos != i) {
          this.invertInlmmi1(i, newpos);
        }
      }
    }
    this.lmmi = this.lmmi1.slice(0);
  }

  private sortByFilesize(invert: boolean) {
    var len = this.lmmi1.length;
    if (len > 1) {
      for (let i = 0; i < len - 1; i++) {
        let newpos = i;
        let valmin = -1;
        valmin = this.lmmi1[i].fileSize;
        for (let j = i + 1; j < len; j++) {
          let valj = 0;
          valj = this.lmmi1[j].fileSize;
          if (invert) {
            if (valmin < valj) {
              valmin = valj;
              newpos = j;
            }
          } else {
            if (valmin > valj) {
              valmin = valj;
              newpos = j;
            }
          }

        }
        if (newpos != i) {
          this.invertInlmmi1(i, newpos);
        }
      }
    }
    this.lmmi = this.lmmi1.slice(0);
  }

  private sortByDuration(invert: boolean) {
    var len = this.lmmi1.length;
    if (len > 1) {
      for (let i = 0; i < len - 1; i++) {
        let newpos = i;
        let valmin = -1;
        valmin = this.lmmi1[i].duration;
        for (let j = i + 1; j < len; j++) {
          let valj = 0;
          valj = this.lmmi1[j].duration;
          if (invert) {
            if (valmin < valj) {
              valmin = valj;
              newpos = j;
            }
          } else {
            if (valmin > valj) {
              valmin = valj;
              newpos = j;
            }
          }

        }
        if (newpos != i) {
          this.invertInlmmi1(i, newpos);
        }
      }
    }
    this.lmmi = this.lmmi1.slice(0);
  }

  private sortByEpisodeAndSeason(invert: boolean) {
    var len = this.lmmi1.length;
    if (len > 1) {

      for (let i = 0; i < len - 1; i++) {
        let newpos = i;
        let valmin = -1;
        if (this.lmmi1[i].typeMmi != undefined) {
          valmin = this.lmmi1[i].typeMmi.season * 1000 + this.lmmi1[i].typeMmi.episode;
        }
        for (let j = i + 1; j < len; j++) {
          let valj = 0;
          if (this.lmmi1[j].typeMmi != undefined) {
            valj = this.lmmi1[j].typeMmi.season * 1000 + this.lmmi1[j].typeMmi.episode;
          }
          if (invert) {
            if (valmin < valj) {
              valmin = valj;
              newpos = j;
            }
          } else {
            if (valmin > valj) {
              valmin = valj;
              newpos = j;
            }
          }

        }
        if (newpos != i) {
          this.invertInlmmi1(i, newpos);
        }
      }
    }
    this.lmmi = this.lmmi1.slice(0);
  }

  toggleShow() {
    this.showAll = !this.showAll;
  }

  getInfoLanguage(myMediaAudios: MyMediaAudio[]) {
    let glyohicon = 'glyphicon glyphicon-volume-up ';
    if (myMediaAudios.length != 0) {
      let test = false;
      for (let ma of myMediaAudios) {
        // if (ma.myMediaLanguage.language === 'fr') {
        if (ma.myMediaLanguage.language.startsWith('fr')) {
          test = true;
        }
      }
      if (test && myMediaAudios.length > 1) {
        return glyohicon + 'colorlightgreen';
      } else {
        if (test) {
          return glyohicon + 'colorgreen';
        } else {
          return glyohicon + 'colorred';
        }
      }
    }
    return 'glyphicon glyphicon-volume-up';
  }

  getInfoText(myMediaTexts: MyMediaText[]) {
    let glyphicon = 'glyphicon glyphicon-subtitles ';
    if (myMediaTexts.length != 0) {
      let test = false;
      for (let ma of myMediaTexts) {
        // if (ma.myMediaLanguage.language === 'fr') {
        if (ma.myMediaLanguage.language.startsWith('fr')) {
          test = true;
        }
      }
      if (test && myMediaTexts.length > 1) {
        return glyphicon + 'colorlightgreen';
      } else {
        if (test) {
          return glyphicon + 'colorgreen';
        } else {
          return glyphicon + 'colorred';
        }
      }
    }
    return glyphicon;
  }

  searchContinuite(i: number, season: boolean) {
    /*font season in red if next-previous > 0 &
    * font episode in red if next-previous > 1*/
    if (i > 0) {
      if (season) {
        if (this.lmmi[i - 1].typeMmi.season != undefined
          && this.lmmi[i].typeMmi.season != undefined) {
          if (this.lmmi[i].typeMmi.season
            - this.lmmi[i - 1].typeMmi.season > 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        if (this.lmmi[i - 1].typeMmi.episode != undefined
          && this.lmmi[i].typeMmi.episode != undefined) {
          if (this.lmmi[i].typeMmi.episode
            - this.lmmi[i - 1].typeMmi.episode > 1) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  getColor(i: number, isSeason: boolean) {
    switch (i) {
      case(3):
        'blue';
        break;
      case(4):
        'red';
        break;
      case(5):
        'green';
        break;
      default:
        'black';
    }
  }


  getInfos(mmi: MyMediaInfo) {
    console.log(this.inHM(mmi.duration));
    console.log(this.inGMK(mmi.fileSize));
    console.log(mmi.width + '*' + mmi.height);
    if (mmi.videoSupportPaths != undefined) {
      mmi.videoSupportPaths.forEach(vsp => {
        console.log(vsp.vneName);
        console.log(vsp.title);
      });
    }
  }

  inHMS(d) {
    let s = Math.trunc(d % 60);
    let m = Math.trunc(((d - s) / 60) % 60);
    let h = Math.trunc((d - (m * 60) - (s)) / 3600);
    // return '' + h + 'h' + m + 'mn' + s + 'sec (' + d + 'sec)';
    return '' + h + 'h' + m + 'mn' + s + 's';
  }

  inHM(d) {
    let s = Math.trunc(d % 60);
    let m = Math.trunc(((d - s) / 60) % 60);
    let h = Math.trunc((d - (m * 60) - (s)) / 3600);
    let mstr = m.toString();
    if (m < 10) {
      mstr = '0' + mstr;
    }
    let hstr = h.toString();
    return hstr + 'h' + mstr;
  }

  public inGMK(ot) {
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

  getDurationMinMax() {
    if (this.lmmi != undefined) {
      let dmin = this.lmmi[0].duration;
      let dmax = this.lmmi[0].duration;
      this.lmmi.forEach(m => {
        if (m.duration < dmin) {
          dmin = m.duration;
        }
        if (m.duration > dmax) {
          dmax = m.duration;
        }
      });
      if (this.lmmi.length > 1) {
        let dminStr = this.inHM(dmin);
        let dmaxStr = this.inHM(dmax);
        if (dminStr !== dmaxStr) {
          return this.inHM(dmin) + '~' + this.inHM(dmax);
        } else {
          return dmaxStr;
        }
      } else {
        return this.inHM(dmin);
      }

    }
  }

  changevaluetoshow(event, mmi: MyMediaInfo) {
    if (event.altKey && event.shiftKey) {
      document.getSelection().removeAllRanges();
      // console.log('altKey & shiftKey')
      if (mmi != null) {
        let ele = document.getElementById(event.target.id + '%windedit');
        if (ele != null) {
          this.oneComment = '';
          this.editSubtitle = '';
          this.editAudio = '';
          this.newComment = '';
          this.newTitle = '';
          this.newKeyword = '';
          this.videoid.keysToInternalFunction = false;
          ele.style.visibility = 'visible';
          setTimeout(() => {
            this.videoid.listWindowOpen = this.videoid.listWindowOpen
              .concat(event.target.id + '%windedit');
          }, 500);
        }
      } else {
        let ele = document.getElementById(event.target.id + '%windedit');
        if (ele != null) {
          let ele = document.getElementById(event.target.id + '%windedit');
          this.videoid.keysToInternalFunction = false;
          ele.style.visibility = 'visible';
          setTimeout(() => {
            this.videoid.listWindowOpen = this.videoid.listWindowOpen
              .concat(event.target.id + '%windedit');
          }, 500);
        } else {
          console.log('PB');
        }
      }
    } else {
      if (event.altKey) {
        // console.log('altKey')
        document.getSelection().removeAllRanges();
        if (mmi != null) {
          console.log(mmi);
        } else {
          console.log(this.vf1);
        }
      } else if (event.shiftKey) {
        // console.log('shiftKey')
        if (mmi != null) {
          this.valuetoshow++;
          this.valuetoshow = this.type === 'serie' ? this.valuetoshow % 6 : this.valuetoshow % 3;
          this.sortOnValuetoshow(this.valuetoshow, false);
        }
        /*this.valuetoshow++;
        this.valuetoshow = this.type === 'serie' ? this.valuetoshow % 6 : this.valuetoshow % 3;
        this.sortOnValuetoshow(this.valuetoshow, true);*/
      } else {
        // console.log('Simpleclick')

      }
    }
  }

  getEllementToShow(mmi: MyMediaInfo) {
    let info = '';
    /*0: imagesize
      1: filesize
      2: duration*/
    switch (this.valuetoshow) {
      case(0):
        info = mmi.width + '*' + mmi.height;
        break;
      case(1):
        info = this.inGMK(mmi.fileSize);
        break;
      case(2):
        info = this.inHM(mmi.duration);
        break;
      case(3):
        info = mmi.width + '*' + mmi.height;
        break;
      case(4):
        info = this.inGMK(mmi.fileSize);
        break;
      case(5):
        info = this.inHM(mmi.duration);
        break;
    }
    // this.sortOnValuetoshow(this.valuetoshow);
    return info;
  }

  getinfommiinlog(mmi: MyMediaInfo) {
    console.log(mmi);
  }

  open($event: MouseEvent) {
    console.log($event);
  }

  getType() {
    if (this.lmmi[0].typeMmi != undefined) {
      return this.lmmi[0].typeMmi.typeName.typeName;
    } else {
      return 'Video';
    }
  }

  getLangAudio(myMediaAudios: MyMediaAudio[]) {
    let au = '';
    if (myMediaAudios.length > 0) {
      myMediaAudios.forEach(a => {
        au = au + ' ' + a.myMediaLanguage.language;
      });
      au = au.substring(1);
    }
    return au;
  }

  getLangtext(myMediaAudios: MyMediaText[]) {
    let au = '';
    if (myMediaAudios.length > 0) {
      myMediaAudios.forEach(a => {
        au = au + ' ' + a.myMediaLanguage.language;
      });
      au = au.substring(1);
    }
    return au;
  }


  changeType(number: number, mmi: MyMediaInfo) {
    this.oneComment = '';
    this.editSubtitle = '';
    this.editAudio = '';
    if (number == 4) {
      this.initSeasonEpisodeNb(mmi);
    }
    /*let ele = document.getElementById('litoshow');
    for (let i = 0; i < ele.children.length; i++) {
      if (number == i) {
        // console.log('to visible', ele.children[i])
      } else {
        // console.log('to INvisible', ele.children[i])

      }
    }*/
  }

  initSeasonEpisodeNb(mmi: MyMediaInfo) {
    if (mmi.typeMmi != undefined) {
      this.season = mmi.typeMmi.season;
      this.episode = mmi.typeMmi.episode;
      this.nameSerieVo = mmi.typeMmi.nameSerieVO;
    } else {
      this.nameSerieVo = '';
      this.season = 0;
      this.episode = 0;
    }
  }

  myTab(num: number, mmi: MyMediaInfo) {
    if (num == 4) {
      this.initSeasonEpisodeNb(mmi);
    }
    this.tabulation = 'tab' + num;
    this.showModifySubtitle = false;
    this.showModifyAudio = false;
    this.newComment = '';
    this.newTitle = '';
    this.newKeyword = '';
  }

  myTabVF(num: number) {
    switch (num) {
      case(1):
        this.vfYear = this.vf1.year;
        break;
      case(2):
        this.vfScore = this.vf1.scoreOnHundred;
        break;
      case(3):
        if (this.vf1.videoPosters != undefined && this.vf1.videoPosters.length != 0) {
          this.vfImg = this.vf1.videoPosters[0].ulrImg;
        }
        break;
      case(4):
        if (this.vf1.videoComment == undefined || this.vf1.videoComment == null) {
          this.newComment = '';
        } else {
          this.newComment = this.vf1.videoComment.comment;
        }
        break;
      case(5):
        this.newTitle = '';
        break;
      case(6):
        this.newKeyword = '';
        break;

    }
    // console.log('myTabVF', num);
    this.tabulationVf = 'tabVF' + num;
  }

  changeAudio(audio: MyMediaAudio) {
    this.idMmiInEdition = audio.id.idMyMediaInfo;
    this.idLanguageInEdition = audio.id.idLanguage;
    this.editAudio = audio.myMediaLanguage.language;
    this.showModifyAudio = true;
  }

  changeSubtitle(sub: MyMediaText) {
    this.idMmiInEdition = sub.id.idMyMediaInfo;
    this.idLanguageInEdition = sub.id.idMyMediaLanguage;
    this.editSubtitle = sub.myMediaLanguage.language;
    this.showModifySubtitle = true;
  }

  submitNewAudio() {
    if (this.editAudio !== ''
      && this.idMmiInEdition !== ''
      && this.idLanguageInEdition > 0) {
      const newAudio: NewLanguage = {
        language: this.editAudio,
        idMmiInEdition: this.idMmiInEdition,
        idLanguageInEdition: this.idLanguageInEdition
      };
      this.catalogueService.postRessource('/videoid/submitNewAudio', newAudio)
        .subscribe(data => {
          console.log(data);
          // @ts-ignore
          let newMmi: MyMediaInfo = data;
          for (let nb in this.lmmi) {
            if (this.lmmi[nb].idMyMediaInfo === newMmi.idMyMediaInfo) {
              this.lmmi[nb] = newMmi;
            }
          }
          console.log(data);
        }, err => {
          console.log(err);
        });
      this.showModifyAudio = false;
      this.editAudio = '';
      this.idMmiInEdition = '';
      this.idLanguageInEdition = 0;
      this.videoid.closeOpenWindows();
    } else {
      console.log('Data incomplete in submitNewAudio()');
      console.log(this.editAudio, this.idMmiInEdition, this.idLanguageInEdition);
    }
  }

  submitNewSubtitle() {
    if (this.editSubtitle !== ''
      && this.idMmiInEdition !== ''
      && this.idLanguageInEdition > 0) {
      const newAudio: NewLanguage = {
        language: this.editSubtitle,
        idMmiInEdition: this.idMmiInEdition,
        idLanguageInEdition: this.idLanguageInEdition
      };
      this.catalogueService.postRessource('/videoid/submitNewSubtitle', newAudio)
        .subscribe(data => {
          // @ts-ignore
          let newMmi: MyMediaInfo = data;
          for (let nb in this.lmmi) {
            if (this.lmmi[nb].idMyMediaInfo === newMmi.idMyMediaInfo) {
              this.lmmi[nb] = newMmi;
            }
          }
          console.log(data);
        }, err => {
          console.log(err);
        });
      this.showModifySubtitle = false;
      this.editSubtitle = '';
      this.idMmiInEdition = '';
      this.idLanguageInEdition = 0;
      this.videoid.closeOpenWindows();
    } else {
      console.log('Data incomplete in submitNewSubtitle()');
      console.log(this.editAudio, this.idMmiInEdition, this.idLanguageInEdition);
    }
  }

  cancelNewAudio() {
    this.showModifyAudio = false;
    this.editAudio = '';
  }

  cancelNewSubtitle() {
    this.showModifySubtitle = false;
    this.editSubtitle = '';
  }

  submitcomment(mmi: MyMediaInfo) {
    console.log('To submit : ', this.oneComment);
    if (this.oneComment.length > 0) {
      if (this.oneComment.length > 1024) {
        this.oneComment = this.oneComment.substring(0, 1023);
      }
      this.catalogueService.postRessourceWithData('/videouser/postcommentforuser/'
        + mmi.idMyMediaInfo, this.oneComment)
        .subscribe(data => {
          // @ts-ignore
          let newMmi: MyMediaInfo = data;
          for (let nb in this.lmmi) {
            if (this.lmmi[nb].idMyMediaInfo === newMmi.idMyMediaInfo) {
              this.lmmi[nb] = newMmi;
            }
          }
          console.log(data);

        }, err => {
          console.log(err);
        });
      this.oneComment = '';
      this.videoid.closeOpenWindows();
    }
  }

  tachange() {
    this.nbchar = 1024 - this.oneComment.length;
    if (this.nbchar < 0) {
      // console.log('this.overf = true');
      this.overf = true;
    } else {
      // console.log('this.overf = false');
      this.overf = false;
    }
  }

  tachg() {
    this.nbchar = 1024 - this.oneComment.length;
    if (this.nbchar < 0) {
      return this.oneComment.length - 1024;
    } else {
      return this.nbchar;
    }
  }

  cancelserienumber(mmi: MyMediaInfo) {
    // console.log('Close');
    if (mmi.typeMmi != undefined) {
      this.season = mmi.typeMmi.season;
      this.episode = mmi.typeMmi.episode;
      this.nameSerieVo = mmi.typeMmi.nameSerieVO;
    } else {
      this.season = 0;
      this.episode = 0;
      this.nameSerieVo = '';
    }
  }

  submitserienumber(mmi: MyMediaInfo) {
    // console.log('submitserienumber');
    // console.log(this.season, this.episode, this.nameSerieVo,
    //   mmi.idMyMediaInfo, mmi.typeMmi.idTypeMmi);
    if (mmi.idMyMediaInfo !== '' && mmi.typeMmi.idTypeMmi != undefined
      && mmi.typeMmi.idTypeMmi > 0) {
      const tosend: SubmitSerie = {
        season: this.season,
        episode: this.episode,
        nameSerieVo: this.nameSerieVo,
        idMyMediaInfo: mmi.idMyMediaInfo,
        idTypemmi: mmi.typeMmi.idTypeMmi
      };
      this.catalogueService.postRessourceWithData('/videoid/submitserienumber',
        tosend)
        .subscribe(data => {
          // @ts-ignore
          let newMmi: MyMediaInfo = data;
          for (let nb in this.lmmi1) {
            if (this.lmmi1[nb].idMyMediaInfo === newMmi.idMyMediaInfo) {
              this.lmmi1[nb] = newMmi;
              this.ngOnInit();
            }
          }
          // this.sortOnValuetoshow(this.valuetoshow, false);
        }, err => {
          console.log(err);
        });
      this.videoid.closeOpenWindows();
    }
  }

  cancelcomment() {
    console.log('cancelcomment');
    this.oneComment = '';
  }

  getTitleSerie() {
    this.lmmi.forEach(m => {
      if (m.typeMmi.nameSerieVO !== null) {
        if (m.typeMmi.nameSerieVO !== '') {
          if (this.titleSerie.length != 0) {
            let test = false;
            this.titleSerie.forEach(ts => {
              if (m.typeMmi.nameSerieVO === ts) {
                test = true;
              }
            });
            if (!test) {
              this.titleSerie = this.titleSerie.concat(m.typeMmi.nameSerieVO);
            }
          } else {
            this.titleSerie = this.titleSerie.concat(m.typeMmi.nameSerieVO);
          }
        } else {
          this.titleSerieIsEmpty += 1;
        }
      }
    });
    // console.log('this.titleSeie', this.titleSerie)
    // console.log('this.titleSerieIsEmpty', this.titleSerieIsEmpty)
  }

  saveTitleForCurrentVF(ts: string) {
    // console.log('Save', ts, 'vf.id', this.vf1.idVideo)
    this.catalogueService.postRessource(
      '/videoid/saveTitleForCurrentVF/' + this.vf1.idVideo, ts)
      .subscribe(data => {
        // console.log(data);
        this.titleSerie = [];
        //@ts-ignore
        this.lmmi1 = data;
        this.ngOnInit();
      }, err => {
        console.log(err);
      });
  }

  saveYearInDb() {
    if (this.vfYear > 1880 && this.vfYear < 2100) {
      console.log('this.vfYear', this.vfYear);
      this.catalogueService.getRessource(
        '/videoid/saveyear/' + this.vf1.idVideo + '/' + this.vfYear)
        .subscribe(data => {
          this.videoid.closeOpenWindows();
          console.log(data);
          // @ts-ignore
          this.vf1 = data;
          this.videoid.ngOnInit();
        }, err => {
          this.videoid.closeOpenWindows();
          console.log(err);
        });
    } else {
      this.vfYear = 0;
    }
  }

  saveScoreInDb() {
    if (this.vfScore >= 0 && this.vfScore < 100) {
      console.log('this.vfScore', this.vfScore);
      this.catalogueService.getRessource(
        '/videoid/saveScore/' + this.vf1.idVideo + '/' + this.vfScore)
        .subscribe(data => {
          this.videoid.closeOpenWindows();
          console.log(data);
          // @ts-ignore
          this.vf1 = data;
          this.videoid.ngOnInit();
        }, err => {
          this.videoid.closeOpenWindows();
          console.log(err);
        });
    } else {
      this.vfScore = 50;
    }
  }

  saveImgInDb() {
    if (this.vfImg.length > 10 && this.vfImg.length < 256) {
      console.log('this.vfImg', this.vfImg);
      this.catalogueService.postRessource(
        '/videoid/saveurlImg/' + this.vf1.idVideo, this.vfImg)
        .subscribe(data => {
          this.videoid.closeOpenWindows();
          console.log(data);
          // @ts-ignore
          this.vf1 = data;
          this.videoid.ngOnInit();
        }, err => {
          this.videoid.closeOpenWindows();
          console.log(err);
        });
    } else {
      this.vfImg = '';
    }
  }

  submitNewComment() {
    console.log(this.newComment);
    this.catalogueService.postRessource('/videoid/newComment/'
      + this.vf1.idVideo, this.newComment)
      .subscribe(data => {
        console.log(data);
        this.videoid.closeOpenWindows();
        //@ts-ignore
        this.vf1 = data;
      }, err => {
        console.log(err);
        this.videoid.closeOpenWindows();
      });
  }

  saveNewTitleInDb() {
    console.log(this.newTitle);
    this.catalogueService.postRessource('/videoid/newTitle/'
      + this.vf1.idVideo, this.newTitle)
      .subscribe(data => {
        console.log(data);
        this.videoid.closeOpenWindows();
        //@ts-ignore
        this.vf1 = data;
        this.vfret.emit(this.vf1);
      }, err => {
        console.log(err);
        this.videoid.closeOpenWindows();
      });
  }

  saveNewKeywordInDb() {
    console.log(this.newKeyword);
    this.catalogueService.postRessource('/videoid/newKeyword/'
      + this.vf1.idVideo, this.newKeyword)
      .subscribe(data => {
        console.log(data);
        this.videoid.closeOpenWindows();
        //@ts-ignore
        this.vf1 = data;
        this.vfret.emit(this.vf1);
      }, err => {
        console.log(err);
        this.videoid.closeOpenWindows();
      });
  }

  actionAddToBasket2(idMyMediainfo: string) {
    this.appComponent.addToBasket(idMyMediainfo);
  }

  getInfoSupports() {
    // this.lmmi
    // console.log(this.lmmi)
    // duration & fileSize
    let size = 0;
    let duration = 0;
    this.lmmi.forEach(e => {
      size = size + e.fileSize;
      duration = duration + e.duration;
    })
    return 'Total : '+this.inGMK(size) + ' | '+ this.inHM(duration);
  }
}
