import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ConfigComponent } from './config/config.component';
import { VideoComponent } from './video/video.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ManagmentfilesComponent } from './managmentfiles/managmentfiles.component';
import { ExportComponent } from './export/export.component';
import {CookieService} from 'ngx-cookie-service';
import { TooltipComponent } from './tooltip/tooltip.component';
import { ChlangComponent } from './chlang/chlang.component';
import { ScoreComponent } from './score/score.component';
import { TypemediaComponent } from './typemedia/typemedia.component';
import { FilmographyComponent } from './filmography/filmography.component';
import { VideoidComponent } from './videoid/videoid.component';
import { TypemmiComponent } from './typemmi/typemmi.component';



@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    ExportComponent,
    VideoComponent,
    ToolbarComponent,
    LoginComponent,
    AdminComponent,
    ManagmentfilesComponent,
    ExportComponent,
    TooltipComponent,
    ChlangComponent,
    ScoreComponent,
    TypemediaComponent,
    FilmographyComponent,
    VideoidComponent,
    TypemmiComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule,
    AppRoutingModule, ReactiveFormsModule, BrowserAnimationsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule { }
