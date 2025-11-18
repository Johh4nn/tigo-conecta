import { Component, OnInit } from '@angular/core';
import { ContratacionesService } from 'src/app/services/contrataciones';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-contrataciones-asesor',
  templateUrl: './contrataciones-asesor.page.html',
  styleUrls: ['./contrataciones-asesor.page.scss'],
  standalone: false
})
export class ContratacionesAsesorPage implements OnInit {

  contrataciones: any[] = [];
  loading = false;

  constructor(
    private service: ContratacionesService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    const { data } = await this.service.getPendientes();
    this.contrataciones = data ?? [];
    this.loading = false;
  }

  async cambiarEstado(c: any, estado: string) {
    const loading = await this.loadingCtrl.create({ message: 'Actualizando...' });
    await loading.present();

    await this.service.updateEstado(c.id, estado);

    this.contrataciones = this.contrataciones.filter(x => x.id !== c.id);

    loading.dismiss();

    const toast = await this.toastCtrl.create({
      message: `Contrato ${estado}`,
      duration: 1200,
      color: estado === 'aprobada' ? 'success' : 'danger'
    });

    toast.present();
  }
}
