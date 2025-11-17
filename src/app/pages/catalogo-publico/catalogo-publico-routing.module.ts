import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogoPublicoPage } from './catalogo-publico.page';

const routes: Routes = [
  {
    path: '',
    component: CatalogoPublicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogoPublicoPageRoutingModule {}
