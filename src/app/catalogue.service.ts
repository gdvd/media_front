import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {urlwebsite} from '../environments/dataProject';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  public  protocol = 'http://';
  public portBO = ':8085';
  public host = this.protocol+urlwebsite.urllocal+this.portBO; //'http://localhost:8085' 'https://localhost:8443'
  // public host = this.protocol+'localhost'+this.portBO; //'http://localhost:8085' 'https://localhost:8443'

  constructor(private http:HttpClient, private authService:AuthenticationService) { }

  getRessource(url) {
    const headers = new HttpHeaders({'authorization': 'Bearer ' + this.authService.jwt});
    // console.log('Works(1) : '+this.host + url);
    return this.http.get(this.host + url, {headers: headers});//, observe: 'response'
  }
  getRessourceWithObserve(url) {
    const headers = new HttpHeaders({'authorization': 'Bearer ' + this.authService.jwt});
    return this.http.get(this.host + url, {headers: headers, observe: 'response'});
  }
  getRessourceRemote(url: string, path:string ) {
    const headers = new HttpHeaders({'authorization':'Bearer ' + this.authService.jwt});
    return this.http.get(this.protocol + url + this.portBO + path, {headers: headers});
  }
  deleteRessource(url) {
    const headers = new HttpHeaders({'authorization': 'Bearer ' + this.authService.jwt});
    return this.http.delete(url, {headers: headers});
  }
  postRessource(url, data) {
    const headers = new HttpHeaders({'authorization': 'Bearer ' + this.authService.jwt});
    return this.http.post(this.host + url, data, {headers: headers});
  }
  postRessourceRemote(url, path , data) {
    const headers = new HttpHeaders({'authorization': 'Bearer ' + this.authService.jwt});
    return this.http.post(this.protocol + url + this.portBO + path, data, {headers: headers});
  }
  postRessourceWithData(url, data){
    const headers = new HttpHeaders({'authorization':'Bearer ' + this.authService.jwt});
    return this.http.post(this.host + url, data, {headers: headers});//, observe: 'response'
  }

  putRessourceWithData(url, data) {
    const headers = new HttpHeaders({'authorization': 'Bearer ' + this.authService.jwt});
    return this.http.put(this.host + url , data, {headers: headers});
  }
  patchRessource(url, data) {
    const headers = new HttpHeaders({'authorization': 'Bearer ' + this.authService.jwt});
    return this.http.patch(this.host + url, data, {headers: headers});
  }


}
