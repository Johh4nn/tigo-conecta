import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/core/services/supabase';

@Injectable({
  providedIn: 'root'
})
export class ContratacionesService {

  constructor(private supabase: SupabaseService) {}

  // 📌 Crear nueva contratación
  async create(payload: any) {
    return await this.supabase.getClient()
      .from('contrataciones')
      .insert(payload)
      .select()
      .single();
  }

  // 📌 Obtener contrataciones del usuario logueado
  async getByUsuario(usuarioId: string) {
    return await this.supabase.getClient()
      .from('contrataciones')
      .select(`
        *,
        planes_moviles:plan_id(nombre_comercial, precio)
      `)
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false });
  }

  // 📌 Obtener contrataciones pendientes (ASESOR)
  async getPendientes() {
    return await this.supabase.getClient()
      .from('contrataciones')
      .select(`
        *,
        perfiles:usuario_id(nombre_completo, email),
        planes_moviles:plan_id(nombre_comercial, precio)
      `)
      .eq('estado', 'pendiente')
      .order('created_at', { ascending: false });
  }

  // 📌 Cambiar estado (APROBADA / RECHAZADA / CANCELADA)
  async actualizarEstado(id: string, estado: string) {
    return await this.supabase.getClient()
      .from('contrataciones')
      .update({ estado })
      .eq('id', id)
      .select()
      .single();
  }

  // ⚠ COMPATIBILIDAD → Muchos ya usan "updateEstado"
  async updateEstado(id: string, estado: string) {
    return this.actualizarEstado(id, estado);
  }
}
