import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdPlayComponent } from './adplay.component';
import { TvComponent } from './tv/tv.component';

const routes: Routes = [
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
