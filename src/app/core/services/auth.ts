import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  id: string;
  email: string;
  nombre_completo?: string;
  telefono?: string;
  rol: 'asesor_comercial' | 'usuario_registrado';
  avatar_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.initAuthListener();
  }

  private initAuthListener() {
    this.supabaseService.currentUser$.subscribe(async (user) => {
      if (user) {
        await this.loadUserProfile(user.id);
      } else {
        this.profileSubject.next(null);
      }
    });
  }

  // Iniciar sesión
  async signIn(email: string, password: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabaseService.getClient()
        .auth.signInWithPassword({ email, password });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error en signIn:', error);
      return { error };
    }
  }

  // Registrarse
  async signUp(email: string, password: string, nombreCompleto: string): Promise<{ error: any }> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .auth.signUp({
          email,
          password,
          options: {
            data: {
              nombre_completo: nombreCompleto
            }
          }
        });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error en signUp:', error);
      return { error };
    }
  }

  // Cerrar sesión
  async signOut(): Promise<void> {
    await this.supabaseService.getClient().auth.signOut();
    this.profileSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Cargar perfil del usuario
  private async loadUserProfile(userId: string): Promise<void> {
    const { data, error } = await this.supabaseService.getClient()
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      console.log('Perfil cargado:', data);
      this.profileSubject.next(data as UserProfile);
    }
  }

  // Obtener perfil actual
  getCurrentProfile(): UserProfile | null {
    return this.profileSubject.value;
  }

  // Verificar si es asesor
  isAsesor(): boolean {
    return this.profileSubject.value?.rol === 'asesor_comercial';
  }

  // Verificar si es usuario registrado
  isUsuarioRegistrado(): boolean {
    return this.profileSubject.value?.rol === 'usuario_registrado';
  }
}