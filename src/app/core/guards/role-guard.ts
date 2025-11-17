import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    const expectedRole = route.data['expectedRole'] as string;
    
    // Esperar a que se cargue el perfil
    await this.waitForProfile();
    
    const profile = this.authService.getCurrentProfile();
    
    if (!profile) {
      return this.router.createUrlTree(['/login']);
    }
    
    if (profile.rol !== expectedRole) {
      // Redirigir según el rol
      if (profile.rol === 'asesor_comercial') {
        return this.router.createUrlTree(['/home-asesor']);
      } else {
        return this.router.createUrlTree(['/home-usuario']);
      }
    }
    
    return true;
  }

  private waitForProfile(): Promise<void> {
    return new Promise((resolve) => {
      const checkProfile = () => {
        if (this.authService.getCurrentProfile() !== null) {
          resolve();
        } else {
          setTimeout(checkProfile, 100);
        }
      };
      checkProfile();
    });
  }
}
