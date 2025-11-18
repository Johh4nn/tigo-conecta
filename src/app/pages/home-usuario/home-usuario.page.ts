import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from 'src/app/core/services/auth';

@Component({
  selector: 'app-home-usuario',
  templateUrl: './home-usuario.page.html',
  styleUrls: ['./home-usuario.page.scss'],
  standalone: false
})
export class HomeUsuarioPage implements OnInit, OnDestroy {
  profile: UserProfile | null = null;
  private sub: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub = this.authService.profile$.subscribe(p => {
      this.profile = p;
      if (!p) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async logout() {
    await this.authService.signOut();
  }

  // Navegación desde Home Usuario
  goToCatalogo() {
    this.router.navigateByUrl('/catalogo-publico');
  }

  goToMisContrataciones() {
    this.router.navigateByUrl('/mis-contrataciones');
  }

  goToChatList() {
    this.router.navigateByUrl('/chat'); // ajusta ruta si tienes otra
  }
}