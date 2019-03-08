import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ConfigComponent } from './config/config.component';
import { VideoComponent } from './video/video.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    VideoComponent,
    ToolbarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
