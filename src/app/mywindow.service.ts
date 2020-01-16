import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MywindowService {
  private subject = new Subject<any>();

  constructor() { }

  sendMessage(message: InfoWindow) {
    this.subject.next( message );
  }

  clearMessages() {
    this.subject.next();
  }

  getMessage(): Observable<InfoWindow> {
    return this.subject.asObservable();
  }

}
