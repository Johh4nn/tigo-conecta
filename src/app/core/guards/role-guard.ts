import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot) {
    const expectedRole = route.data['role'] as string;
    const profile = await firstValueFrom(this.auth.profile$);
    if (!profile) {
      this.router.navigate(['/login']);
      return false;
    }
    if (profile.rol !== expectedRole) {
      // redirige según rol o a home
      if (profile.rol === 'asesor_comercial') this.router.navigate(['/home-asesor']);
      else this.router.navigate(['/home-usuario']);
      return false;
    }
    return true;
  }
}
