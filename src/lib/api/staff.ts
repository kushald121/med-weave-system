import { supabase } from '@/lib/supabase';
import { HospitalUser } from '@/types/database.types';

export const staffApi = {
  async getAll(hospitalId: number) {
    const { data, error } = await supabase
      .from('hospital_users')
      .select(`
        *,
        user:user_id (
          email,
          first_name,
          last_name,
          phone
        )
      `)
      .eq('hospital_id', hospitalId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getByRole(hospitalId: number, role: string) {
    const { data, error } = await supabase
      .from('hospital_users')
      .select(`
        *,
        user:user_id (
          email,
          first_name,
          last_name,
          phone
        )
      `)
      .eq('hospital_id', hospitalId)
      .eq('role', role)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async update(id: number, updates: Partial<HospitalUser>) {
    const { data, error } = await supabase
      .from('hospital_users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: number) {
    const { data, error } = await supabase
      .from('hospital_users')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
