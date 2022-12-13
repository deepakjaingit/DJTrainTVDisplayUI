import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdPlayComponent } from './play/adplay.component';
import { AdPreviewComponent } from './preview/adpreview.component';
import { TvComponent } from './tv/tv.component';

const routes: Routes = [
  {
    path: 'play',
    component: AdPlayComponent
  },
  {
    path: 'preview',
    component: AdPreviewComponent
  },
  {
    path: 'config',
    component: AdPlayComponent
  },
  {
    path: 'tv',
    component: TvComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
