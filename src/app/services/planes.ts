import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/core/services/supabase';

@Injectable({
  providedIn: 'root'
})
export class PlanesService {

  private bucket = 'planes-imagenes'; // CAMBIAR SI USAS OTRO NOMBRE

  constructor(private supabase: SupabaseService) {}

  async getPlanesPublicos() {
    return await this.supabase.getClient()
      .from('planes_moviles')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true });
  }

  async getPlanesByAsesor(asesorId: string) {
    return await this.supabase.getClient()
      .from('planes_moviles')
      .select('*')
      .eq('created_by', asesorId)
      .order('created_at', { ascending: false });
  }

  async createPlan(payload: any) {
    return await this.supabase.getClient()
      .from('planes_moviles')
      .insert(payload)
      .select();
  }

  async updatePlan(id: string, payload: any) {
    return await this.supabase.getClient()
      .from('planes_moviles')
      .update(payload)
      .eq('id', id)
      .select();
  }

  async deletePlan(id: string) {
    return await this.supabase.getClient()
      .from('planes_moviles')
      .delete()
      .eq('id', id);
  }

  // ============================
  //   📁 IMAGENES
  // ============================

  async uploadImage(file: File) {
    const name = `${Date.now()}-${file.name}`;

    const { error } = await this.supabase.getClient()
      .storage
      .from(this.bucket)
      .upload(name, file, { upsert: true });

    if (error) throw error;

    const { data } = this.supabase.getClient()
      .storage
      .from(this.bucket)
      .getPublicUrl(name);

    return { publicUrl: data.publicUrl };
  }

  async deleteImageByUrl(url: string) {
    try {
      const filePath = url.split(`${this.bucket}/`)[1];
      if (!filePath) return;

      await this.supabase.getClient()
        .storage
        .from(this.bucket)
        .remove([filePath]);

    } catch (e) {
      console.warn('No se pudo borrar imagen', e);
    }
  }
}
