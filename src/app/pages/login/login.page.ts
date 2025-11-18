import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth';
import { firstValueFrom, of } from 'rxjs';
import { filter, take, timeout, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.showAlert('Error', 'Por favor completa todos los campos correctamente');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    const { email, password } = this.loginForm.value;
    const { error } = await this.authService.signIn(email, password);

    await loading.dismiss();

    if (error) {
      this.showAlert('Error', 'Credenciales incorrectas');
      return;
    }

    // Esperar perfil de forma robusta (espera hasta que profile$ emita no-null o hace fallback)
    try {
      const profile = await firstValueFrom(
        this.authService.profile$.pipe(
          filter(p => p !== null),
          take(1),
          timeout(3000),
          catchError(() => of(null))
        )
      );

      if (profile && profile.rol === 'asesor_comercial') {
        this.router.navigate(['/home-asesor']);
      } else {
        this.router.navigate(['/home-usuario']);
      }
    } catch {
      this.router.navigate(['/home-usuario']);
    }
  }

  goToCatalogo() {
    this.router.navigate(['/catalogo-publico']);
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}