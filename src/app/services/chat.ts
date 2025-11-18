import { Injectable } from '@angular/core';
import { SupabaseService } from '../core/services/supabase';

@Injectable({ providedIn: 'root' })
export class ChatService {

  constructor(private supabase: SupabaseService) {}

  private isUUID(v: string) {
    return /^[0-9a-fA-F-]{36}$/.test(v);
  }

  async sendMessage(payload: any) {
    if (!this.isUUID(payload.contratacion_id))
      throw new Error("❌ contratacion_id inválido");

    if (!this.isUUID(payload.usuario_id))
      throw new Error("❌ usuario_id inválido");

    // Verificar que el usuario tiene permisos para esta contratación
    const { data: contratacion, error: contratacionError } = await this.supabase.getClient()
      .from("contrataciones")
      .select("usuario_id, asesor_asignado")
      .eq("id", payload.contratacion_id)
      .single();

    if (contratacionError || !contratacion) {
      throw new Error("❌ Contratación no encontrada");
    }

    // Verificar permisos: usuario debe ser el dueño de la contratación O el asesor asignado
    const esUsuarioContratacion = contratacion.usuario_id === payload.usuario_id;
    const esAsesorAsignado = contratacion.asesor_asignado === payload.usuario_id;

    if (!esUsuarioContratacion && !esAsesorAsignado) {
      throw new Error("❌ No tienes permisos para enviar mensajes en esta contratación");
    }

    return await this.supabase.getClient()
      .from("mensajes_chat")
      .insert(payload)
      .select("*, perfiles(nombre_completo)")
      .single();
  }

  async getMessagesByContratacion(id: string, usuarioId: string) {
    // Primero verificar permisos
    const { data: contratacion, error: contratacionError } = await this.supabase.getClient()
      .from("contrataciones")
      .select("usuario_id, asesor_asignado")
      .eq("id", id)
      .single();

    if (contratacionError || !contratacion) {
      throw new Error("❌ Contratación no encontrada");
    }

    // Verificar permisos
    const esUsuarioContratacion = contratacion.usuario_id === usuarioId;
    const esAsesorAsignado = contratacion.asesor_asignado === usuarioId;

    if (!esUsuarioContratacion && !esAsesorAsignado) {
      throw new Error("❌ No tienes permisos para ver los mensajes de esta contratación");
    }

    return await this.supabase.getClient()
      .from("mensajes_chat")
      .select(`
        *,
        perfiles:usuario_id(nombre_completo,email)
      `)
      .eq("contratacion_id", id)
      .order("created_at", { ascending: true });
  }

  onMessagesRealtime(id: string, cb: (payload: any) => void) {
    return this.supabase.getClient()
      .channel(`chat_${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mensajes_chat", filter: `contratacion_id=eq.${id}` },
        cb
      )
      .subscribe();
  }
}