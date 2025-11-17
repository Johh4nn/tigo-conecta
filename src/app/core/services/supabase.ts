import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    // Escuchar cambios en la autenticación
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      this.currentUserSubject.next(session?.user ?? null);
    });

    // Cargar usuario actual
    this.loadUser();
  }

  private async loadUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    this.currentUserSubject.next(user);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async isLoggedIn(): Promise<boolean> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return !!session;
  }
}