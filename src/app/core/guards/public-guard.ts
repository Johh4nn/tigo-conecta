// ========== core/guards/public.guard.ts ==========
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';
import { SupabaseService } from '../services/supabase';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const isLoggedIn = await this.supabaseService.isLoggedIn();
    
    if (isLoggedIn) {
      // Esperar a que se cargue el perfil
      await this.waitForProfile();
      
      const profile = this.authService.getCurrentProfile();
      
      // Redirigir según el rol
      if (profile?.rol === 'asesor_comercial') {
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