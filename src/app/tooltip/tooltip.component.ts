import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MessageService} from '../message-service.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent implements OnInit {

  @Input()
  element:jobj[];
  @Input()
  titlevideo1:Idvsp[];
  @Input()
  elementsimple:VideoSupportPaths[];
  @Input()
  listIdVneToName: vnelight[];
  @Input()
  idVideo: String;

  @Output()
  filterTTcall = new EventEmitter<String>();

  messages: any[] = [];
  subscription: Subscription;

  res: jobj[];
  constructor(private messageService: MessageService) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message) {
        this.messages.push(message);
      } else {
        // clear messages when empty message received
        this.messages = [];
      }
    });
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.res = [];

    if(this.elementsimple != null && this.titlevideo1 != null){
      for(let vsp of this.elementsimple){
      }
    }else{
      if (this.element != null){
        for (var ele in this.element) {
          let obj:jobj = {
            'key': ele , 'value': this.element[ele]
          };
          this.res = this.res.concat(obj);
          // console.log(this.res);
        }
        // console.log(this.res);
      }
    }
  }
  getName(id: any) {
    for(let idvne of this.listIdVneToName){
      if(idvne.idVideoNameExport == id){
        return idvne.nameExport;
      }
    }
  }
  openWindow(idVideo: String) {
    let link = 'https://www.imdb.com/title/' + idVideo + '/reference';
    console.log('Open new Window with : ' + link);
    window.open(link);
  }

  getTitleVideo(titlevideo: Idvsp[]) {
    return titlevideo[0].title;
  }

  actionAddToBasket(id: string) {
    this.messageService.sendMessage(id);
    this.messageService.clearMessages();
  }
  sendMessage(): void {
    // send message to subscribers via observable subject
  }

  clearMessages(): void {
    // clear messages

  }

  openWithTitleTT(idVideo: String) {
    this.filterTTcall.emit(idVideo);
  }

}
