import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanesCrudAsesorPageRoutingModule } from './planes-crud-asesor-routing.module';

import { PlanesCrudAsesorPage } from './planes-crud-asesor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PlanesCrudAsesorPageRoutingModule
  ],
  declarations: [PlanesCrudAsesorPage]
})
export class PlanesCrudAsesorPageModule {}
