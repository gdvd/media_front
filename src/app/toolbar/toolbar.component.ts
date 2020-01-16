import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CatalogueService} from '../catalogue.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute,
              private catalogueService: CatalogueService) {
  }

  currentRoute: string = '';

  public href;

  ngOnInit() {
    let p = window.location.href.split('/');
    this.currentRoute = p[p.length - 1];
  }

  onVideo() {
    this.currentRoute = 'video';
    this.router.navigateByUrl('/video');
  }

  onExport() {
    this.currentRoute = 'export';
    this.router.navigateByUrl('/export');
  }

  onConfig() {
    this.currentRoute = 'config';
    this.router.navigateByUrl('/config');
  }

  onAdmin() {
    this.currentRoute = 'admin';
    this.router.navigateByUrl('/admin');
  }

  onManagment() {
    this.currentRoute = 'managmentfiles';
    this.router.navigateByUrl('/managmentfiles');
  }

}
