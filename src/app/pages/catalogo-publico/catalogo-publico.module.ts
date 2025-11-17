import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatalogoPublicoPageRoutingModule } from './catalogo-publico-routing.module';

import { CatalogoPublicoPage } from './catalogo-publico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatalogoPublicoPageRoutingModule
  ],
  declarations: [CatalogoPublicoPage]
})
export class CatalogoPublicoPageModule {}
