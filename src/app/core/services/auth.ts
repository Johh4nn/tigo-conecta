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

  /** =========================================================
   *  LISTENER DE AUTENTICACIÓN
   * ========================================================= */
  private initAuthListener() {
    this.supabaseService.currentUser$.subscribe(async (user) => {
      if (user) {
        await this.loadUserProfile(user.id);
      } else {
        this.profileSubject.next(null);
      }
    });
  }

  /** =========================================================
   *  LOGIN
   * ========================================================= */
  async signIn(email: string, password: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabaseService.getClient()
        .auth.signInWithPassword({ email, password });

      if (error) throw error;
      return { error: null };

    } catch (error) {
      console.error('❌ Error en signIn:', error);
      return { error };
    }
  }

  /** =========================================================
   *  REGISTRO
   * ========================================================= */
  async signUp(email: string, password: string, nombreCompleto: string, telefono?: string): Promise<{ error: any }> {
    try {

      const { data, error } = await this.supabaseService.getClient()
        .auth.signUp({
          email,
          password,
          options: {
            data: {
              nombre_completo: nombreCompleto,
              telefono: telefono ?? ''
            }
          }
        });

      if (error) throw error;

      /** ⚠ Intento de crear perfil cliente ↓
       *  (si falla, el TRIGGER de Supabase lo hará) */
      if (data?.user) {
        await this.supabaseService.getClient()
          .from("perfiles")
          .insert({
            id: data.user.id,
            email,
            nombre_completo: nombreCompleto,
            telefono: telefono ?? "",
            rol: "usuario_registrado"
          })
          .throwOnError();
      }

      return { error: null };

    } catch (error) {
      console.error("❌ Error en signUp:", error);
      return { error };
    }
  }

  /** =========================================================
   *  LOGOUT
   * ========================================================= */
  async signOut(): Promise<void> {
    await this.supabaseService.getClient().auth.signOut();
    this.profileSubject.next(null);
    this.router.navigate(['/login']);
  }

  /** =========================================================
   *  🔥 OBTENER PERFIL COMPLETO DEL USUARIO LOGUEADO
   * ========================================================= */
  async getProfile(): Promise<UserProfile | null> {
    return new Promise(resolve => {
      const sub = this.profile$.subscribe(p => {
        if (p) {
          resolve(p);
          sub.unsubscribe();
        }
      });
      setTimeout(() => resolve(null), 1000);
    });
  }

  /** =========================================================
   *  📥 CARGAR PERFIL EN LA APP
   * ========================================================= */
  private async loadUserProfile(userId: string): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('perfiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error al cargar perfil:', error);
        this.profileSubject.next(null);
        return;
      }

      if (!data) {
        console.warn(`⚠ No existe perfil para: ${userId}`);
        this.profileSubject.next(null);
        return;
      }

      console.log("✔ Perfil cargado:", data);
      this.profileSubject.next(data);

    } catch (err) {
      console.error('❌ Excepción cargando perfil:', err);
      this.profileSubject.next(null);
    }
  }

  /** =========================================================
   *  🚀 OBTENER PERFIL ACTUAL (SINCRONO)
   * ========================================================= */
  getCurrentProfile(): UserProfile | null {
    return this.profileSubject.value;
  }

  /** ROLES */
  isAsesor(): boolean {
    return this.profileSubject.value?.rol === 'asesor_comercial';
  }

  isUsuarioRegistrado(): boolean {
    return this.profileSubject.value?.rol === 'usuario_registrado';
  }
}
