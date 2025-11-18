import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.formBuilder.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      this.showAlert('Error', 'Por favor completa todos los campos correctamente');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creando cuenta...',
      spinner: 'crescent'
    });
    await loading.present();

    const { nombreCompleto, email, telefono, password } = this.registerForm.value;
    
    const { error } = await this.authService.signUp(email, password, nombreCompleto, telefono);

    await loading.dismiss();

    if (error) {
      console.error('Error en registro:', error);

      // Mensajes amigables según la causa
      let errorMessage = 'Error al crear la cuenta';
      const msg = (error?.message || '').toString().toLowerCase();

      if (msg.includes('already registered') || msg.includes('user already registered')) {
        errorMessage = 'Este correo ya está registrado';
      } else if (msg.includes('email signups are disabled') || msg.includes('signups are disabled')) {
        errorMessage = 'Los registros por correo están deshabilitados. Contacta al administrador.';
      } else if (msg.includes('invalid email')) {
        errorMessage = 'Correo inválido';
      } else if (msg.includes('password')) {
        errorMessage = 'Error en la contraseña';
      }

      this.showAlert('Error', errorMessage);
      return;
    }

    // Mostrar mensaje de éxito
    const alert = await this.alertController.create({
      header: '¡Registro Exitoso!',
      message: 'Tu cuenta ha sido creada. Por favor inicia sesión.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToCatalogo() {
    this.router.navigate(['/catalogo-publico']);
  }

  // Marcar todos los campos como touched para mostrar errores
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Getters para validación en el template
  get nombreCompleto() {
    return this.registerForm.get('nombreCompleto');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get telefono() {
    return this.registerForm.get('telefono');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}