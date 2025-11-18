import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanesCrudAsesorPage } from './planes-crud-asesor.page';

const routes: Routes = [
  {
    path: '',
    component: PlanesCrudAsesorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanesCrudAsesorPageRoutingModule {}
