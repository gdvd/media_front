import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CatalogueService} from '../catalogue.service';
import {Subscription} from 'rxjs';
import {MywindowService} from '../mywindow.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {

  @Input()
  thescore: VideoFilms;
  @Input()
  videoUserScores: VideoUserScore[];
  @Input()
  idmmi: string;
  @Input()
  listUserWithId: userLight[];

  @Output()
  videoFilmModify = new EventEmitter<VideoFilms>();
  @Output()
  windowopen = new EventEmitter<InfoWindow>();

  messagesWindow: InfoWindow[] = [];
  subscriptionWindow: Subscription;

  public dboxpos: boolean;
  public overf: boolean;
  public myscore:number;
  public mycomment: string;
  private nbchar: number;
  private vf:VideoFilms;

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

  ngOnInit() {
    this.dboxpos=false;
    this.myscore = 50;
    this.nbchar=1024;
    this.mycomment='';
    this.overf = false;

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
  toAddScoreuserAndComment() {
    // console.log(this.thescore.idVideo);
    this.myscore = 50;
    this.dboxpos= !this.dboxpos;
    if(this.dboxpos){
      let iw: InfoWindow = {
        idMmi: this.idmmi,
        nameWindow: 'dialoguescore',
        codeName: 4,
        status2come: this.dboxpos
      }
      this.windowopen.emit(iw);
    }
  }

  saveScore() {
    this.dboxpos=false;
    if(this.mycomment.length>1024){
      this.mycomment=this.mycomment.substring(0, 1024);
    }
    let req: ReqScore = {
      'idtt': this.thescore.idVideo,
        'score': this.myscore,
        'comment': this.mycomment
    };
    this.catalogueService.postRessourceWithData('/videouser/postscoreforuser/'
      ,req)
      .subscribe(data => {
        // console.log(data);
        //@ts-ignore
        this.vf=data;
        this.videoFilmModify.emit(this.vf);
      }, err => {
        console.log(err);
      });
  }

  tachange(){
    this.nbchar=1024-this.mycomment.length;
    if(this.nbchar < 0){
      console.log('this.overf = true');
      this.overf = true;
    }else{
      console.log('this.overf = false');
      this.overf = false;
    }
  }
  tachg() {
    this.nbchar=1024-this.mycomment.length;
    if(this.nbchar < 0){
      return this.mycomment.length - 1024 + ' characters will be troncate';
    }else{
      return this.nbchar + ' characters remaining';
    }
  }

  getNameLogin(score: VideoUserScore) {
    // console.log(score);
    // console.log(this.listUserWithId);
    if(this.listUserWithId != null){
      for(let u in this.listUserWithId){
        if(score.id.idMyUser == this.listUserWithId[u].idMyUser){
          return this.listUserWithId[u].login;
        }
      }
    }
  }

  editScoreuserAndComment(score: VideoUserScore) {
    console.log(score);
  }

  openAddScore() {
    console.log('Add score');
  }

  private messageWindowOpen(messagesWindow: InfoWindow) {
    if (messagesWindow.status2come) {
      if (messagesWindow.idMmi != this.idmmi) {
        this.dboxpos = false;
        // this.ele.editTypeName = 0;
      } else {
        if (messagesWindow.nameWindow === 'dialoguescore') {
          // this.ele.editTypeName = 0;
        }else{
          this.dboxpos = false;
        }
      }
    }
  }

}
