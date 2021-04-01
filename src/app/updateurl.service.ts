import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateurlService {

  constructor() { }

  private subjecturl = new Subject<any>();

  sendMessage(message: string) {
    this.subjecturl.next({ text: message });
  }

  clearMessages() {
    this.subjecturl.next();
  }

  getMessage(): Observable<any> {
    return this.subjecturl.asObservable();
  }
}
