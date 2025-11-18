import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContratacionesAsesorPageRoutingModule } from './contrataciones-asesor-routing.module';

import { ContratacionesAsesorPage } from './contrataciones-asesor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContratacionesAsesorPageRoutingModule
  ],
  declarations: [ContratacionesAsesorPage]
})
export class ContratacionesAsesorPageModule {}
