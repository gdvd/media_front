import {Component, OnInit} from '@angular/core';
import {CatalogueService} from '../catalogue.service';

@Component({
  selector: 'app-filmography',
  templateUrl: './filmography.component.html',
  styleUrls: ['./filmography.component.css']
})
export class FilmographyComponent implements OnInit {


  constructor(private catalogueService: CatalogueService,) {
  }

  // private switchOne:string;
  private textFilterOne: string = '';
  private nameOne: string = '';
  private nmOne: string = '';
  private radioexactmodel: boolean = true;
  private loa: OneActor[];
  public filmos: OneFilmpgraphy[];
  public filmoResult: ResultFilmLight;
  public showresult: boolean;
  public showfiltername: boolean = true;
  private waitingwork: boolean = false;
  private idsearch: string;
  private listIdVneToName: Vnelight[];

  ngOnInit() {
    let s: Sort = {
      col: '',
      asc: false,
    };
    let f: Filmlight[] = [];
    let r: ResultFilmLight = {
      name: 'result',
      sort: s,
      filmo: f,
    };
    this.filmoResult = r;
    this.setShowResult();
    this.getListIdVneToName();
  }

  private getListIdVneToName() {
    this.catalogueService.getRessource('/videouser/lVneIdToName')
      .subscribe(data => {
        this.listIdVneToName = null;
        //@ts-ignore
        this.listIdVneToName = data;
      }, err => {
        console.log(err);
      });
  }

  cleanFilter() {
    // console.log('Clean filter ' + number);
    this.textFilterOne = '';
    this.nameOne = '';
    this.nmOne = '';
    this.loa = null;
  }

  cleanAll() {
    this.textFilterOne = '';
    this.nameOne = '';
    this.nmOne = '';
    this.loa = null;
    this.filmos=[];
    this.showresult = false;
  }

  searchName(textFilter: string) {
    // if (!this.waitingwork) {
    //   this.waitingwork = true;
    if (textFilter.length > 2 && !this.waitingwork) {
      this.nameOne = textFilter;
      this.nmOne = textFilter;
      // console.log('search with name : ' + textFilter + ' and checkbox exact is '+this.radioexactmodel);
      this.requestForName(textFilter);
      //   this.waitingwork = false;
    }
    // }
  }

  requestForName(name: string) {
    if (!this.waitingwork) {
      this.waitingwork = true;
      let mybool = this.radioexactmodel ? 1 : 0;
      // console.log('mybool : ' + mybool);
      this.catalogueService.postRessourceWithData('/filmographyuser/searchname/'
        + mybool, name)
        .subscribe(data => {
          //@ts-ignore
          this.loa = data;
          // console.log(this.loa);
          this.waitingwork = false;
        }, err => {
          console.log(err);
          this.waitingwork = false;
        });
    }
  }

  selectActor(idnm: string) {
    // console.log(idnm);
    // if (!this.waitingwork) {
    //   this.waitingwork = true;
    if (idnm.length > 7 && idnm.length < 11) {
      let test = false;
      if (this.filmos != null && this.filmos.length >= 1) {
        for (let a of this.filmos) {
          if (a.idNm === idnm) {
            test = true;
            break;
          }
        }
      }
      if (!test) {
        this.requestForFilmographyWithIdnm(idnm);
      } else {
        console.log('This actor already exist in list');
      }
    }
    //   this.waitingwork = false;
    // }
  }

  requestForFilmographyWithIdnm(idnm: string) {
    if (!this.waitingwork) {
      this.idsearch = idnm;
      this.waitingwork = true;
      this.catalogueService.getRessource('/filmographyuser/filmographywithidnm/' + idnm)
        .subscribe(data => {
          //@ts-ignore
          let oneActorTmp: OneFilmpgraphy = data;
          let sort: Sort = {
            col: '',
            asc: false,
          };
          oneActorTmp.sort = sort;
          let oneActor = this.resetOneFilter(oneActorTmp);
          for (let a of this.loa) {
            if (a.idNm === idnm) {
              let url = a.urlImg;
              oneActor.urlImg = url;
              break;
            }
          }
          // console.log(oneActor);
          if (this.filmos == null) {
            this.filmos = [];
          }
          this.filmos = this.filmos.concat(oneActor);
          this.setShowResult();
          this.waitingwork = false;
          this.cleanFilter();
        }, err => {
          console.log(err);
          this.waitingwork = false;
        });

    } else {
      console.log('Cancel');
    }
  }

  private resetOneFilter(oneActor: OneFilmpgraphy) {
    let aFilter: Filter = {
      isfilter: false,
      showfilter: false,
      yearmin: 1880,
      yearmax: 2025,
      scoremin: 0,
      scoremax: 99,
      yearmaynull: true,
      scoremaynull: true,
      isnotappeared: true,
      andnot: false,
      title: '',
      titltechoice: 1,
      sizefilmowithfilter: 0,
      oneRole: {
        roleactor: true,
        rolewriter: true,
        roledirector: true,
        roleproducer: true,
        rolesoundtrack: true,
        rolethanks: true,
        roleself: true,
      },
    };
    //@ts-ignore
    oneActor.oneFilter = aFilter;
    return oneActor;
  }

  private setShowResult() {
    if (this.filmos != null && this.filmos.length > 0) {
      this.showresult = true;
      this.setResult();
    } else {
      this.showresult = false;
    }
  }

  removeActor(idNm: string) {
    // console.log('Remove actor : ' + idNm);
    for (let i in this.filmos) {
      if (this.filmos[i].idNm === idNm) {
        // @ts-ignore
        this.filmos.splice(i, 1);
        this.setShowResult();
        break;
      }
    }
  }

  filterForActor(idNm: string) {
    // console.log('Filter for actor : ' + idNm);
    for (let oneActor of this.filmos) {
      if (oneActor.idNm === idNm) {
        //@ts-ignore
        oneActor.oneFilter.showfilter = !oneActor.oneFilter.showfilter;
      }
    }
  }


  private setResult() {
    if (this.filmos != null && this.filmos.length > 0) {
      var filmoResultTmp: Filmlight[] = this.filmos[0].filmo.slice();
      for (let h = filmoResultTmp.length - 1; h >= 0; h--) {
        if (!filmoResultTmp[h].showit) {
          filmoResultTmp.splice(h, 1);
        }
      }

      if (this.filmos.length > 1) {
        for (let i = 1; i < this.filmos.length; i++) {// Begin by the second list
          for (let j = filmoResultTmp.length - 1; j >= 0; j--) {
            let testand = false;
            let andnot = this.filmos[i].oneFilter.andnot;
            let testandnot = this.filmos[i].oneFilter.andnot;
            for (let k = 0; k < this.filmos[i].filmo.length; k++) {
              // si oui test = true; break;
              if (filmoResultTmp[j].idTt === this.filmos[i].filmo[k].idTt
                && this.filmos[i].filmo[k].showit) {
                testand = true;
                testandnot = true;
              }
            }
            if (!testand && !andnot) {
              filmoResultTmp.splice(j, 1);
            }
            if (testand && andnot) {
              filmoResultTmp.splice(j, 1);
            }
          }
        }
      }
      this.filmoResult.filmo = filmoResultTmp;
    }
  }

  toggleShowfiltername(state: number) {
    state == 1 ? this.showfiltername = true : this.showfiltername = false;
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
        result = '' + ve + ',' + deci + units[i];
      } else {
        break;
      }
    }
    return result;
  }

  loadonefilm(idTt: string) {
    // console.log('Loadonefilm : ' + idTt);
    this.findOneTt(idTt);
  }

  public findOneTt(idTt: string) {
    if (!this.waitingwork) {
      this.waitingwork = true;
      if (idTt != '') {
        var vf: VideoFilms;
        this.catalogueService.getRessource('/filmographyuser/getOneVideoFilm/' + idTt)
          .subscribe(data => {
            //@ts-ignore
            vf = data;
            for (var ofilmo of this.filmos) {
              for (var fl of ofilmo.filmo) {
                if (fl.idTt === vf.idVideo) {
                  fl.score = vf.scoreOnHundred;
                  fl.loaded = true;
                  if (vf.scoreOnHundred != 0) {
                    fl.appeared = true;
                  }
                  for (let vfa of vf.videoFilmArtists) {
                    if (vfa.id != null && vfa.id.idVideoArtist === ofilmo.idNm) {
                      fl.actorPos = vfa.numberOrderActor;
                    }
                  }
                  break;
                }
              }
            }
            this.waitingwork = false;
          }, err => {
            console.log(err);
            this.waitingwork = false;
          });
      }
    } else {
      console.log('Cancel');
    }
  }


  changeStatusRole(idNm: string, role: string) {
    for (let oneActor of this.filmos) {
      if (oneActor.idNm === idNm) {
        // console.log('Name : ' + oneActor.name);
        // console.log(oneActor.oneFilter.oneRole);
        if (role === 'roleactor') {
          //@ts-ignore
          oneActor.oneFilter.oneRole.roleactor = !(oneActor.oneFilter.oneRole.roleactor);
        }
        if (role === 'rolewriter') {
          //@ts-ignore
          oneActor.oneFilter.oneRole.rolewriter = !(oneActor.oneFilter.oneRole.rolewriter);
        }
        if (role === 'roleproducer') {
          //@ts-ignore
          oneActor.oneFilter.oneRole.roleproducer = !(oneActor.oneFilter.oneRole.roleproducer);
        }
        if (role === 'roledirector') {
          //@ts-ignore
          oneActor.oneFilter.oneRole.roledirector = !(oneActor.oneFilter.oneRole.roledirector);
        }
        if (role === 'rolesoundtrack') {
          //@ts-ignore
          oneActor.oneFilter.oneRole.rolesoundtrack = !(oneActor.oneFilter.oneRole.rolesoundtrack);
        }
        if (role === 'rolethanks') {
          //@ts-ignore
          oneActor.oneFilter.oneRole.rolethanks = !(oneActor.oneFilter.oneRole.rolethanks);
        }
        if (role === 'roleself') {
          //@ts-ignore
          oneActor.oneFilter.oneRole.roleself = !(oneActor.oneFilter.oneRole.roleself);
        }
        // console.log(oneActor.oneFilter.oneRole);
        if (oneActor.oneFilter.isfilter) {
          this.updatefilmoactor(oneActor.idNm, 0);
        }
      }
    }
  }

  private updatefilmoactor(idNm: string, way: number) {
    for (let oneActor of this.filmos) {
      if (oneActor.idNm === idNm && oneActor.oneFilter.isfilter) {
        let filter = oneActor.oneFilter;
        oneActor.oneFilter.sizefilmowithfilter = 0;
        for (var onefilmo of oneActor.filmo) {
          let testrole = false;
          if (filter.oneRole.roleactor == true && onefilmo.actor) {
            testrole = true;
          }
          if (filter.oneRole.roledirector == true && onefilmo.director) {
            testrole = true;
          }
          if (filter.oneRole.rolewriter == true && onefilmo.writer) {
            testrole = true;
          }
          if (filter.oneRole.roleself == true && onefilmo.self) {
            testrole = true;
          }
          if (filter.oneRole.roleproducer == true && onefilmo.producer) {
            testrole = true;
          }
          if (filter.oneRole.rolesoundtrack == true && onefilmo.soundtrack) {
            testrole = true;
          }
          if (filter.oneRole.rolethanks == true && onefilmo.thanks) {
            testrole = true;
          }
          if(oneActor.oneFilter.yearmin>oneActor.oneFilter.yearmax){
            if(way<0){
              let ymin = oneActor.oneFilter.yearmin;
              oneActor.oneFilter.yearmax = ymin;
            }else{
              let ymax = oneActor.oneFilter.yearmax;
              oneActor.oneFilter.yearmin = ymax;
            }

            // oneActor.oneFilter.yearmin = ymin;
          }
          let testyear = false;
          if ((filter.yearmin <= onefilmo.year && filter.yearmax >= onefilmo.year)
            || onefilmo.year == 0 && oneActor.oneFilter.yearmaynull) {
            testyear = true;
          }
          if(oneActor.oneFilter.scoremin>oneActor.oneFilter.scoremax){
            if(way<0){
              let smin = oneActor.oneFilter.scoremin;
              oneActor.oneFilter.scoremax = smin;
            }else{
              let smax = oneActor.oneFilter.scoremax;
              oneActor.oneFilter.scoremin = smax;
            }
          }
          let testscore = false;
          if ((filter.scoremin <= onefilmo.score && filter.scoremax >= onefilmo.score) ||
            (onefilmo.score == 0 && oneActor.oneFilter.scoremaynull)) {
            testscore = true;
          }

          let testtitle = false;
          if (oneActor.oneFilter.title !== '' && oneActor.oneFilter.titltechoice != 0) {
            if (oneActor.idNm === idNm) {
              if (oneActor.oneFilter.titltechoice == 1) {// begin
                if (this.clean(onefilmo.title).startsWith(oneActor.oneFilter.title.toLowerCase())) {
                  testtitle = true;
                }
              } else {
                if (oneActor.oneFilter.titltechoice == 2) {//'End'
                  if (this.clean(onefilmo.title).endsWith(oneActor.oneFilter.title.toLowerCase())) {
                    testtitle = true;
                  }
                } else {
                  if (oneActor.oneFilter.titltechoice == 3) {//'Content'
                    if (this.clean(onefilmo.title).includes(oneActor.oneFilter.title.toLowerCase())) {
                      testtitle = true;
                    }
                  } else {
                    if (oneActor.oneFilter.titltechoice == 4) {//'Exact'
                      if (this.clean(onefilmo.title) === oneActor.oneFilter.title.toLowerCase()) {
                        testtitle = true;
                      }
                    } else {
                      testtitle = true;
                    }
                  }
                }
              }
            }
          } else {
            testtitle = true;
          }

          if (testrole && testyear && testscore && testtitle) {
            onefilmo.showit = true;
            oneActor.oneFilter.sizefilmowithfilter++;
          } else {
            onefilmo.showit = false;
          }
        }
        this.setResult();
      }
    }
  }

  clean(s: string) {
    var r = s.toLowerCase();
    // r = r.replace(new RegExp(/\s/g),"");
    r = r.replace(new RegExp(/[àáâãäå]/g), 'a');
    r = r.replace(new RegExp(/æ/g), 'ae');
    r = r.replace(new RegExp(/ç/g), 'c');
    r = r.replace(new RegExp(/[èéêë]/g), 'e');
    r = r.replace(new RegExp(/[ìíîï]/g), 'i');
    r = r.replace(new RegExp(/ñ/g), 'n');
    r = r.replace(new RegExp(/[òóôõö]/g), 'o');
    r = r.replace(new RegExp(/œ/g), 'oe');
    r = r.replace(new RegExp(/[ùúûü]/g), 'u');
    r = r.replace(new RegExp(/[ýÿ]/g), 'y');
    // r = r.replace(new RegExp(/\W/g),"");
    return r;
  }

  toggleIsFilter(idNm: string) {
    // console.log('toggleIsFilter');
    for (let oneActor of this.filmos) {
      if (oneActor.idNm === idNm) {
        //@ts-ignore
        oneActor.oneFilter.isfilter = !(oneActor.oneFilter.isfilter);
        // console.log(oneActor);
        if (!oneActor.oneFilter.isfilter) {
          for (let f of oneActor.filmo) {
            f.showit = true;
          }
        } else {
          this.updatefilmoactor(idNm, 0);
        }
      }
    }
    this.setResult();
  }

  toggleIsnotappeared(idNm: string) {
    console.log('toggleIsnotappeared');
    for (let oneActor of this.filmos) {
      if (oneActor.idNm === idNm) {
        //@ts-ignore
        oneActor.oneFilter.isnotappeared = !(oneActor.oneFilter.isnotappeared);
      }
    }
  }

  changeOptionForTitle(idNm: string, option: string) {
    for (let oneActor of this.filmos) {
      if (oneActor.idNm === idNm) {
        if (option === 'Begin') {
          oneActor.oneFilter.titltechoice = 1;
        } else {
          if (option === 'End') {
            oneActor.oneFilter.titltechoice = 2;
          } else {
            if (option === 'Content') {
              oneActor.oneFilter.titltechoice = 3;
            } else {
              if (option === 'Exact') {
                oneActor.oneFilter.titltechoice = 4;
              } else {
                oneActor.oneFilter.titltechoice = 0;
              }
            }
          }
        }
      }
      this.updatefilmoactor(oneActor.idNm, 0);
    }
  }

  setyearmaynull(idNm: string) {
    // updatefilmoactor(oneActor.idNm)
    for (let oneActor of this.filmos) {
      if (oneActor.idNm === idNm) {
        //@ts-ignore
        oneActor.oneFilter.yearmaynull = !(oneActor.oneFilter.yearmaynull);
      }
      this.updatefilmoactor(oneActor.idNm, 0);
    }
  }

  setscoremaynull(idNm: string) {
    for (let oneActor of this.filmos) {
      if (oneActor.idNm === idNm) {
        //@ts-ignore
        oneActor.oneFilter.scoremaynull = !(oneActor.oneFilter.scoremaynull);
      }
      this.updatefilmoactor(oneActor.idNm, 0);
    }
  }

  sortBy(idNm: string, pos: string) {
    // console.log('Sort by : ' + pos + ' to idnm : ' + idNm);
    for (let oneActor of this.filmos) {
      if (oneActor.idNm === idNm) {
        if (oneActor.sort.col === pos) {
          oneActor.sort.asc = !oneActor.sort.asc;
        } else {
          oneActor.sort.col = pos;
        }
        this.updateTable(oneActor);
      }
    }
  }

  private updateTable(oneActor: OneFilmpgraphy) {
    // console.log('update table of : ' + oneActor.name);
    if (oneActor.sort.col === 'pos') {
      this.filterByPos(oneActor);
    } else {
      if (oneActor.sort.col === 'title') {
        this.filterByTitle(oneActor);
      } else {
        if (oneActor.sort.col === 'role') {
          // this.filterByRole(oneActor);
        } else {
          if (oneActor.sort.col === 'year') {
            this.filterByYear(oneActor);
          } else {
            if (oneActor.sort.col === 'score') {
              this.filterByScore(oneActor);
            } else {

            }
          }
        }
      }
    }
  }

  private filterByPos(oneActor: OneFilmpgraphy) {
    let asc = oneActor.sort.asc;
    let tbltmp: Filmlight[] = [];
    if (oneActor.filmo.length > 1) {

      while (oneActor.filmo.length > 0) {
        let nb = 0;
        let valOne = oneActor.filmo[0].pos;
        for (let i = 0; i < oneActor.filmo.length; i++) {
          if (asc) {
            if (valOne > oneActor.filmo[i].pos) {
              valOne = oneActor.filmo[i].pos;
              nb = i;
            }
          } else {
            if (valOne < oneActor.filmo[i].pos) {
              valOne = oneActor.filmo[i].pos;
              nb = i;
            }
          }
        }
        tbltmp = tbltmp.concat(oneActor.filmo[nb]);
        oneActor.filmo.splice(nb, 1);
      }
      oneActor.filmo = tbltmp;
    }
  }

  private filterByYear(oneActor: OneFilmpgraphy) {
    let asc = oneActor.sort.asc;
    let tbltmp: Filmlight[] = [];
    if (oneActor.filmo.length > 1) {

      while (oneActor.filmo.length > 0) {
        let nb = 0;
        let valOne = oneActor.filmo[0].year;
        for (let i = 0; i < oneActor.filmo.length; i++) {
          if (asc) {
            if (valOne > oneActor.filmo[i].year) {
              valOne = oneActor.filmo[i].year;
              nb = i;
            }
          } else {
            if (valOne < oneActor.filmo[i].year) {
              valOne = oneActor.filmo[i].year;
              nb = i;
            }
          }
        }
        tbltmp = tbltmp.concat(oneActor.filmo[nb]);
        oneActor.filmo.splice(nb, 1);
      }
      oneActor.filmo = tbltmp;
    }
  }

  private filterByScore(oneActor: OneFilmpgraphy) {
    let asc = oneActor.sort.asc;
    let tbltmp: Filmlight[] = [];
    if (oneActor.filmo.length > 1) {

      while (oneActor.filmo.length > 0) {
        let nb = 0;
        let valOne = oneActor.filmo[0].score;
        for (let i = 0; i < oneActor.filmo.length; i++) {
          if (asc) {
            if (valOne > oneActor.filmo[i].score) {
              /*if ((valOne).localeCompare(mytable[j].videoSupportPaths[0].title, 'fr') > 0) {*/
              valOne = oneActor.filmo[i].score;
              nb = i;
            }
          } else {
            if (valOne < oneActor.filmo[i].score) {
              valOne = oneActor.filmo[i].score;
              nb = i;
            }
          }
        }
        tbltmp = tbltmp.concat(oneActor.filmo[nb]);
        oneActor.filmo.splice(nb, 1);
      }
      oneActor.filmo = tbltmp;
    }
  }

  private filterByTitle(oneActor: OneFilmpgraphy) {
    let asc = oneActor.sort.asc;
    let tbltmp: Filmlight[] = [];
    if (oneActor.filmo.length > 1) {

      while (oneActor.filmo.length > 0) {
        let nb = 0;
        let valOne = oneActor.filmo[0].title;
        for (let i = 0; i < oneActor.filmo.length; i++) {
          if (asc) {
            if ((valOne).localeCompare(oneActor.filmo[i].title, 'fr') > 0) {
              valOne = oneActor.filmo[i].title;
              nb = i;
            }
          } else {
            if ((valOne).localeCompare(oneActor.filmo[i].title, 'fr') < 0) {
              valOne = oneActor.filmo[i].title;
              nb = i;
            }
          }
        }
        tbltmp = tbltmp.concat(oneActor.filmo[nb]);
        oneActor.filmo.splice(nb, 1);
      }
      oneActor.filmo = tbltmp;
    }
  }

  resultSortBy(col: string) {
    if (this.filmoResult.sort.col === col) {
      this.filmoResult.sort.asc = !this.filmoResult.sort.asc;
    } else {
      this.filmoResult.sort.col = col;
    }
    this.updateTableResult();
  }

  private updateTableResult() {
    if (this.filmoResult.sort.col === 'title') {
      this.filterResultByTitle();
    } else {
      if (this.filmoResult.sort.col === 'year') {
        this.filterResultByYear();
      } else {
        if (this.filmoResult.sort.col === 'score') {
          this.filterResultByScore();
        }
      }
    }
  }

  private filterResultByTitle() {
    // console.log('filterResultByTitle');
    let asc = this.filmoResult.sort.asc;
    let tbltmp: Filmlight[] = [];
    if (this.filmoResult.filmo.length > 1) {

      while (this.filmoResult.filmo.length > 0) {
        let nb = 0;
        let valOne = this.filmoResult.filmo[0].title;
        for (let i = 0; i < this.filmoResult.filmo.length; i++) {
          if (asc) {
            if ((valOne).localeCompare(this.filmoResult.filmo[i].title, 'fr') > 0) {
              valOne = this.filmoResult.filmo[i].title;
              nb = i;
            }
          } else {
            if ((valOne).localeCompare(this.filmoResult.filmo[i].title, 'fr') < 0) {
              valOne = this.filmoResult.filmo[i].title;
              nb = i;
            }
          }
        }
        tbltmp = tbltmp.concat(this.filmoResult.filmo[nb]);
        this.filmoResult.filmo.splice(nb, 1);
      }
      this.filmoResult.filmo = tbltmp;
    }
  }

  private filterResultByYear() {
    // console.log('filterResultByYear');
    let asc = this.filmoResult.sort.asc;
    let tbltmp: Filmlight[] = [];
    if (this.filmoResult.filmo.length > 1) {
      while (this.filmoResult.filmo.length > 0) {
        let nb = 0;
        let valOne = this.filmoResult.filmo[0].year;
        for (let i = 0; i < this.filmoResult.filmo.length; i++) {
          if (asc) {
            if (valOne > this.filmoResult.filmo[i].year) {
              /*if ((valOne).localeCompare(mytable[j].videoSupportPaths[0].title, 'fr') > 0) {*/
              valOne = this.filmoResult.filmo[i].year;
              nb = i;
            }
          } else {
            if (valOne < this.filmoResult.filmo[i].year) {
              valOne = this.filmoResult.filmo[i].year;
              nb = i;
            }
          }
        }
        tbltmp = tbltmp.concat(this.filmoResult.filmo[nb]);
        this.filmoResult.filmo.splice(nb, 1);
      }
      this.filmoResult.filmo = tbltmp;
    }
  }

  private filterResultByScore() {
    // console.log('filterResultByScore');
    let asc = this.filmoResult.sort.asc;
    let tbltmp: Filmlight[] = [];
    if (this.filmoResult.filmo.length > 1) {
      while (this.filmoResult.filmo.length > 0) {
        let nb = 0;
        let valOne = this.filmoResult.filmo[0].score;
        for (let i = 0; i < this.filmoResult.filmo.length; i++) {
          if (asc) {
            if (valOne > this.filmoResult.filmo[i].score) {
              /*if ((valOne).localeCompare(mytable[j].videoSupportPaths[0].title, 'fr') > 0) {*/
              valOne = this.filmoResult.filmo[i].score;
              nb = i;
            }
          } else {
            if (valOne < this.filmoResult.filmo[i].score) {
              valOne = this.filmoResult.filmo[i].score;
              nb = i;
            }
          }
        }
        tbltmp = tbltmp.concat(this.filmoResult.filmo[nb]);
        this.filmoResult.filmo.splice(nb, 1);
      }
      this.filmoResult.filmo = tbltmp;
    }
  }

  andnotname(idNm: string) {
    let nb = 0;
    for (let oneActor of this.filmos) {
      nb++;
      if (oneActor.idNm === idNm && nb > 1) {
        oneActor.oneFilter.andnot = !oneActor.oneFilter.andnot;
        this.setResult();
      }
    }
  }

  calldl(idNm: string) {
    // console.log('calldl' + idNm);
    let listIdtt: string[] = [];
    for (let oneActor of this.filmos) {
      if (oneActor.idNm === idNm) {
        for (let fl of oneActor.filmo) {
          if((!fl.loaded)&&fl.appeared&&fl.showit){
            listIdtt = listIdtt.concat(fl.idTt);
          }
        }
      }
    }
    this.submitListIdtt(listIdtt, idNm);
  }

  getVne(videoSupportPaths: VideoSupportPaths[]) {
    let vnes: string[] = [];
    for (let vsp of videoSupportPaths) {
      let oneIdVne = this.getnameVneWithId(vsp.id.idVideoNameExport);
      vnes = vnes.concat(oneIdVne);
    }
    return vnes.join(' & ');
  }

  private getnameVneWithId(id: number) {
    if (this.listIdVneToName != null) {
      for (let i in this.listIdVneToName) {
        if (id === this.listIdVneToName[i].idVideoNameExport) {
          return this.listIdVneToName[i].nameExport;
        }
      }
    }
  }

  private submitListIdtt(listIdtt: string[], idNm: string) {
    if (listIdtt.length > 0) {
      this.catalogueService.postRessourceWithData('/filmographyuser/loadFilmo/'
        + idNm, listIdtt)
        .subscribe(data => {
          //@ts-ignore
          let lvfl: VideoFilmlight[] = data;
          for (var ofilmo of this.filmos) {
            for (var fl of ofilmo.filmo) {
              for (let vfl of lvfl) {
                if (vfl.idTt === fl.idTt) {
                  if (idNm === ofilmo.idNm) {
                    fl.actorPos = vfl.actorPos;
                  }
                  fl.score = vfl.score;
                  fl.loaded = true;
                }
              }
            }
          }
        }, err => {
          console.log(err);
        });
    }
  }

}
