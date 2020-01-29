import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import { VideoComponent} from './video/video.component';
import {ConfigComponent} from './config/config.component';
import {LoginComponent} from './login/login.component';
import {AdminComponent} from './admin/admin.component';
import {ManagmentfilesComponent} from './managmentfiles/managmentfiles.component';
import {ExportComponent} from './export/export.component';
import {FilmographyComponent} from './filmography/filmography.component';
import {VideoidComponent} from './videoid/videoid.component';

const routes: Routes = [
  {path: 'managmentfiles', component:ManagmentfilesComponent},
  {path: 'export', component:ExportComponent},
  {path: 'video', component: VideoComponent},
  {path: 'filmography', component: FilmographyComponent},
  {path: 'videoid', component: VideoidComponent},
  {path: 'admin', component:AdminComponent},
  {path: 'login', component:LoginComponent},
  {path: 'config', component: ConfigComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
