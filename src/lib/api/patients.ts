import { supabase } from '@/lib/supabase';
import { Patient } from '@/types/database.types';

export const patientApi = {
  async getAll(hospitalId: number) {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        user:user_id (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('hospital_id', hospitalId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        user:user_id (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data;
  },

  async create(patient: Partial<Patient>) {
    const { data, error } = await supabase
      .from('patients')
      .insert(patient)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, updates: Partial<Patient>) {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async search(hospitalId: number, query: string) {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        user:user_id (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('hospital_id', hospitalId)
      .is('deleted_at', null)
      .or(`patient_number.ilike.%${query}%,contact_number.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
