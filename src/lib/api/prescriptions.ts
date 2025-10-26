import { supabase } from '@/lib/supabase';
import { Prescription } from '@/types/database.types';

export const prescriptionApi = {
  async getByVisit(visitId: number) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('visit_id', visitId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPending(hospitalId: number) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        visit:visits!prescriptions_visit_id_fkey (
          id,
          visit_number,
          patient:patients!visits_patient_id_fkey (
            id,
            patient_number,
            user:user_id (
              first_name,
              last_name
            )
          ),
          doctor:hospital_users!visits_doctor_id_fkey (
            user:user_id (
              first_name,
              last_name
            )
          )
        )
      `)
      .eq('visit.hospital_id', hospitalId)
      .in('status', ['pending', 'partially_filled'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(prescription: Partial<Prescription>) {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert(prescription)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id: number, status: string) {
    const { data, error } = await supabase
      .from('prescriptions')
      .update({ status: status as any })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
