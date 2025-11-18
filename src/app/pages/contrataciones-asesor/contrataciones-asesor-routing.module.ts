import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContratacionesAsesorPage } from './contrataciones-asesor.page';

const routes: Routes = [
  {
    path: '',
    component: ContratacionesAsesorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContratacionesAsesorPageRoutingModule {}
