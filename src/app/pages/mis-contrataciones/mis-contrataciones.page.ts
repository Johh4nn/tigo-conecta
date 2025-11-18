import { Component, OnInit } from '@angular/core';
import { ContratacionesService } from 'src/app/services/contrataciones';
import { AuthService, UserProfile } from 'src/app/core/services/auth';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mis-contrataciones',
  templateUrl: './mis-contrataciones.page.html',
  styleUrls: ['./mis-contrataciones.page.scss'],
  standalone: false
})
export class MisContratacionesPage implements OnInit {

  profile: UserProfile | null = null;
  contrataciones: any[] = [];
  loading = false;

  constructor(
    private contratacionesService: ContratacionesService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.profile = this.authService.getCurrentProfile();
    if (!this.profile) return;

    await this.cargarContrataciones();
  }

  async cargarContrataciones() {
    this.loading = true;
    const { data, error } = await this.contratacionesService.getByUsuario(this.profile!.id);

    if (error) {
      console.error('Error cargando contrataciones:', error);
      this.presentToast('Error al cargar las contrataciones', 'danger');
    } else {
      this.contrataciones = data ?? [];
    }
    this.loading = false;
  }

  // ¡AQUÍ ESTÁ EL MÉTODO QUE FALTABA!
  async cambiarEstado(contratacion: any, nuevoEstado: 'aprobada' | 'rechazada') {
    const accion = nuevoEstado === 'aprobada' ? 'aprobar' : 'rechazar';

    const alert = await this.alertCtrl.create({
      header: 'Confirmar acción',
      message: `¿Estás seguro de que deseas <strong>${accion}</strong> esta contratación?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, confirmar',
          cssClass: 'text-bold',
          handler: async () => {
            const { error } = await this.contratacionesService.actualizarEstado(
              contratacion.id,
              nuevoEstado
            );

            if (error) {
              this.presentToast(`Error al ${accion} la contratación`, 'danger');
              console.error(error);
            } else {
              this.presentToast(`Contratación ${nuevoEstado} correctamente`, 'success');
              // Actualizar el estado localmente sin recargar todo
              contratacion.estado = nuevoEstado;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Utilidad para mostrar mensajes
  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  // Opcional: color del badge según estado
  getEstadoColor(estado: string): string {
    const colores: Record<string, string> = {
      pendiente: 'warning',
      aprobada: 'success',
      rechazada: 'danger',
      cancelada: 'medium'
    };
    return colores[estado] || 'dark';
  }
}