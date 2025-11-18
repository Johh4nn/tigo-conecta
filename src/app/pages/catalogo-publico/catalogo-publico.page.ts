import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlanesService } from 'src/app/services/planes';
import { AuthService, UserProfile } from 'src/app/core/services/auth';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ContratacionesService } from 'src/app/services/contrataciones';

@Component({
  selector: 'app-catalogo-publico',
  templateUrl: './catalogo-publico.page.html',
  styleUrls: ['./catalogo-publico.page.scss'],
  standalone: false
})
export class CatalogoPublicoPage implements OnInit, OnDestroy {

  plans: any[] = [];
  loading = false;
  profile: UserProfile | null = null;
  private sub?: Subscription;

  constructor(
    private planesService: PlanesService,
    private authService: AuthService,
    private contratacionesService: ContratacionesService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.sub = this.authService.profile$.subscribe(p => this.profile = p);
    this.loadPlanes();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async loadPlanes() {
    this.loading = true;
    const { data } = await this.planesService.getPlanesPublicos();
    this.plans = data ?? [];
    this.loading = false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/home-usuario']);
  }

  logout() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

  getImageUrl(plan: any) {
    return plan.imagen_url || 'assets/icon/planet-placeholder.png';
  }

  async verDetalles(plan: any) {
    const alert = await this.alertCtrl.create({
      header: 'Detalles del Plan',
      message: `
<b>${plan.nombre_comercial}</b><br>
💰 <b>Precio:</b> $${plan.precio}<br>
📶 <b>Datos:</b> ${plan.datos_moviles}<br>
📞 <b>Minutos:</b> ${plan.minutos_voz}<br>
✉ <b>SMS:</b> ${plan.sms}<br>
🌎 <b>Roaming:</b> ${plan.roaming ?? 'No disponible'}
`,
      buttons: ['OK']
    });

    await alert.present();
  }

  async contratar(plan: any) {
    if (!this.profile) return;

    const payload = {
      usuario_id: this.profile.id,
      plan_id: plan.id,
      estado: "pendiente",
      created_at: new Date()
    };

    const { error } = await this.contratacionesService.create(payload);

    if (error) {
      console.error(error);
      this.showToast("❌ Error al contratar");
      return;
    }

    this.showToast("✅ Contratación registrada");
  }

  async showToast(msg: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000 });
    t.present();
  }
}
