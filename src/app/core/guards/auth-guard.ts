// ========== core/guards/auth.guard.ts ==========
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SupabaseService } from '../services/supabase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const isLoggedIn = await this.supabaseService.isLoggedIn();
    
    if (!isLoggedIn) {
      return this.router.createUrlTree(['/login']);
    }
    
    return true;
  }
}

// ========== core/guards/role.guard.ts ==========

