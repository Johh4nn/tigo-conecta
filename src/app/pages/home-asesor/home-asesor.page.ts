import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from 'src/app/core/services/auth';

@Component({
  selector: 'app-home-asesor',
  templateUrl: './home-asesor.page.html',
  styleUrls: ['./home-asesor.page.scss'],
  standalone: false
})
export class HomeAsesorPage implements OnInit, OnDestroy {
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

  // Navegación desde Home Asesor
  goToPlanes() {
    this.router.navigateByUrl('/planes-crud-asesor');
  }

  goToContrataciones() {
    this.router.navigateByUrl('/contrataciones-asesor');
  }
}