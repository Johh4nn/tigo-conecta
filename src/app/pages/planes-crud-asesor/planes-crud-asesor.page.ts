import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanesService } from 'src/app/services/planes';
import { AuthService, UserProfile } from 'src/app/core/services/auth';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planes-crud-asesor',
  templateUrl: './planes-crud-asesor.page.html',
  styleUrls: ['./planes-crud-asesor.page.scss'],
  standalone: false
})
export class PlanesCrudAsesorPage implements OnInit {
  profile: UserProfile | null = null;
  planes: any[] = [];
  loading = false;

  showForm = false;
  form!: FormGroup;
  editingId: string | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private planesService: PlanesService,
    private authService: AuthService,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();  // ⭐ SIEMPRE SE CREA FORMULARIO

    this.profile = this.authService.getCurrentProfile();
    if (!this.profile) {
      this.router.navigateByUrl('/login');
      return;
    }
    if (this.profile.rol !== 'asesor_comercial') {
      this.router.navigateByUrl('/');
      return;
    }

    this.loadPlanes();
  }

  initForm() {
    this.form = this.fb.group({
      nombre_comercial: ['', Validators.required],
      precio: [0, Validators.required],
      segmento: ['', Validators.required],
      publico_objetivo: [''],
      datos_moviles: ['', Validators.required],
      minutos_voz: ['', Validators.required],
      sms: ['', Validators.required],
      velocidad_4g: [''],
      velocidad_5g: [''],
      redes_sociales: [''],
      whatsapp_ilimitado: [false],
      llamadas_internacionales: [''],
      roaming: [''],
      imagen_url: [''],
      activo: [true],
      destacado: [false],
      orden: [0]
    });
  }

  async loadPlanes() {
    if (!this.profile) return;
    this.loading = true;
    const { data } = await this.planesService.getPlanesByAsesor(this.profile.id);
    this.loading = false;
    this.planes = data ?? [];
  }

  newPlan() {
    if (!this.form) return;   // ⚠ PREVENCIÓN

    this.editingId = null;
    this.form.reset({
      nombre_comercial: '',
      precio: 0,
      segmento: '',
      imagen_url: '',
      activo: true,
      destacado: false,
      orden: 0
    });
    this.previewUrl = null;
    this.selectedFile = null;
    this.showForm = true;
  }

  editPlan(plan: any) {
    this.editingId = plan.id;
    this.form.patchValue(plan);
    this.previewUrl = plan.imagen_url ?? null;
    this.selectedFile = null;
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
    this.previewUrl = null;
    this.selectedFile = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (file.size > 5 * 1024 * 1024) {
      alert('Archivo mayor de 5MB');
      return;
    }
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      alert('Formato inválido');
      return;
    }
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.previewUrl = String(reader.result);
    reader.readAsDataURL(file);
  }

  async save() {
    if (this.form.invalid || !this.profile) return;

    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();

    const raw = this.form.value;

    const payload: any = {
      ...raw,
      precio: Number(raw.precio),
      whatsapp_ilimitado: !!raw.whatsapp_ilimitado,
      destacado: !!raw.destacado,
      activo: !!raw.activo,
      created_by: this.profile.id
    };

    if (raw.redes_sociales) {
      try {
        payload.redes_sociales = JSON.parse(raw.redes_sociales);
      } catch {
        payload.redes_sociales = raw.redes_sociales
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    }

    try {
      let uploaded: any = null;

      if (this.selectedFile) {
        uploaded = await this.planesService.uploadImage(this.selectedFile);
        payload.imagen_url = uploaded.publicUrl;
      }

      if (this.editingId) {
        const oldImg = this.planes.find(p => p.id === this.editingId)?.imagen_url;

        await this.planesService.updatePlan(this.editingId, payload);

        if (uploaded && oldImg) {
          await this.planesService.deleteImageByUrl(oldImg);
        }

      } else {
        await this.planesService.createPlan(payload);
      }

      this.cancelForm();
      this.loadPlanes();
    }

    finally {
      await loading.dismiss();
    }
  }

  async deletePlan(plan: any) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar',
      message: '¿Eliminar este plan?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: 'Eliminando...' });
            await loading.present();

            await this.planesService.deletePlan(plan.id);

            if (plan.imagen_url) {
              await this.planesService.deleteImageByUrl(plan.imagen_url);
            }

            this.planes = this.planes.filter(p => p.id !== plan.id);
            loading.dismiss();
          }
        }
      ]
    });
    alert.present();
  }
}
