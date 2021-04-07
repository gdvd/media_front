import {Component, OnInit} from '@angular/core';
import {CatalogueService} from '../catalogue.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  alluser;
  allroles;
  oneuser = '';
  onepass0 = '';
  onepass1 = '';
  onepass2 = '';
  nickname = '';
  apiKey = '';
  roleslist = [];
  rolesusr = [];
  id: string;
  newroleask = false;
  newrole = '';

  constructor(private httpClient: HttpClient,
              private catalogueService: CatalogueService,
              private appComponent: AppComponent) {
  }

  ngOnInit() {
    if (this.appComponent.isConnected) {
      this.findallusers();
      this.readListOfRoles();
    }
  }

  private findallusers() {
    this.catalogueService.getRessource('/admin/findAllUser')
      .subscribe(data => {
        // console.log(data);
        this.alluser = data;
      }, err => {
        console.log(err);
      });
  }

  editUser(ar) {
    // console.log(ar);
    event.stopPropagation();
    this.readListOfRoles();
    let r = ar.roles;
    // console.log(r, ar);
    document.addEventListener('click', this.isClicked);
    let target = document.getElementById('modaledituser');
    target.setAttribute('style', 'display:block;');
    this.id = ar.id;
    this.oneuser = ar.login;
    this.apiKey = ar.apiKey;
    this.nickname = ar.nickName;
    this.rolesusr = [];
    for (var i = 0; i < r.length; i++) {
      this.rolesusr = this.rolesusr.concat(r[i].role);
    }
    for (var i = 0; i < this.rolesusr.length; i++) {
      let theid = 'oldrole' + this.rolesusr[i];
      document.getElementById(theid).classList.add('selected');
    }
  }

  /*
  * Modal GD Begin
  */
  private openModal(id: string) {
    event.stopPropagation();
    document.addEventListener('click', this.isClicked);
    let target = document.getElementById(id);
    target.setAttribute('style', 'display:block;');
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
    this.eraseField();
    target.setAttribute('style', 'display:none;');
    document.removeEventListener('click', this.isClicked);
    this.id = '';
  }

  private onSubmitUser(data) {
    console.log(data)
    if (this.verrifyData(data)) {
      var datausr: usradmin = {
        'id': '',
        'login': this.oneuser,
        'password': this.onepass1,
        'roles': this.roleslist,
        'apiKey': this.apiKey,
        'nickname': this.nickname
      };
      if (this.savedata(datausr)) {
        this.closeModal('modaluser2');
        console.log('Close Modal');
      } else {
        console.log('Donnees incompletes');
      }
    } else {
      console.log('Donnees incompletes');
    }
  }

  private verrifyData(data) {
    console.log(data)
    let theroleslist = document.getElementById('theroleslist');
    var listid = theroleslist.getElementsByClassName('selected');
    this.roleslist = [];
    for (var i = 0; i < listid.length; i++) {
      this.roleslist = this.roleslist.concat(listid[i].innerHTML); //second console output
    }
    console.log(data, this.roleslist)

    if (data.oneuser.length > 1
      && data.onepass1.length > 1
      && data.onepass2.length > 1
      && this.roleslist.length != 0
      && data.onepass1 == data.onepass2) {
      return true;
    }
    return false;
  }

  eraseField() {
    // console.log('erase now');
    this.oneuser = '';
    this.onepass1 = '';
    this.onepass2 = '';
  }

  /*
  * Modal GD End
  */


  getAllRoles(roles) {
    let res = '';
    for (let r of roles) {
      res = res + (r.role) + ' ';
    }
    return res;
  }

  changeState(role: any) {
    document.getElementById('role-' + role).classList.toggle('selected');
  }

  private savedata(datausr: usradmin) {
    console.log(datausr);
    this.catalogueService.postRessourceWithData('/admin/savenewuser', datausr)
      .subscribe(data => {
        console.log(data);
        this.findallusers();
      }, err => {
        console.log(err);
      });
    return true;
  }

  onSubmitEditUser(data: any) {
    // console.log('onSubmitEditUser Begin', data);
    if (data.oneuser.length > 1
      && this.rolesusr.length != 0
      && data.onepass0.length > 1
      && data.onepass1 == data.onepass2) {
      if (data.onepass1.length > 1
        && data.onepass2.length > 1) {
        var datausrnp: usrnewpassword = {
          'id': this.id,
          'login': this.oneuser,
          'passwordold': this.onepass0,
          'passwordnew': this.onepass1,
          'apiKey': this.apiKey,
          'nickname': this.nickname,
          'roles': this.rolesusr
        };
        console.log('datausrnp', datausrnp);
        this.catalogueService.postRessourceWithData('/admin/changepassworduser', datausrnp)
          .subscribe(data => {
            console.log(data);
            this.closeModal('modaledituser');
            this.onepass0 = '';
            this.findallusers();
          }, err => {
            console.log(err);
          });

      } else {
        var datausr: usradmin = {
          'id': this.id,
          'login': this.oneuser,
          'password': this.onepass0,
          'roles': this.rolesusr,
          'apiKey': this.apiKey,
          'nickname': this.nickname
        };
        // console.log('datausr', datausr);
        this.catalogueService.postRessourceWithData('/admin/changedatauser', datausr)
          .subscribe(data => {
            // console.log(data);
            this.closeModal('modaledituser');
            this.onepass0 = '';
            this.findallusers();
          }, err => {
            console.log(err);
          });
      }
    }
  }

  private readListOfRoles() {
    this.catalogueService.getRessource('/admin/findAllRoles')
      .subscribe(data => {
        // console.log(data);
        this.allroles = data;
      }, err => {
        console.log(err);
      });
  }

  changeStateOld(role) {
    document.getElementById('oldrole' + role).classList.toggle('selected');
    let docroles = document.getElementById('theoldroleslist')
      .getElementsByClassName('selected');
    this.rolesusr = [];
    for (var i = 0; i < docroles.length; i++) {
      this.rolesusr = this.rolesusr.concat(docroles[i].innerHTML);
    }
    // console.log(this.rolesusr);
  }

  changeStatusUser(au) {
    console.log(au);
    this.catalogueService.getRessource('/admin/changestatus/' + encodeURI(au.login))
      .subscribe(data => {
        this.findallusers();
        console.log('reussit');
        console.log(data);
      }, err => {
        console.log(err);
      });
  }

  addRole() {
    this.newroleask = !this.newroleask;
  }

  onSubmitNewRole(value) {
    this.catalogueService.postRessourceWithData('/admin/addnewrole/', encodeURI(value.newrole))
      .subscribe(data => {
        this.readListOfRoles();
      }, err => {
        console.log(err);
      });

    this.newrole = '';
    this.newroleask = false;
  }
}

