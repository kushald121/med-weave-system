import { supabase } from '@/lib/supabase';
import { Visit } from '@/types/database.types';

export const visitApi = {
  async getAll(hospitalId: number, filters?: { doctorId?: number; patientId?: number }) {
    let query = supabase
      .from('visits')
      .select(`
        *,
        patient:patients!visits_patient_id_fkey (
          id,
          patient_number,
          user:user_id (
            first_name,
            last_name
          )
        ),
        doctor:hospital_users!visits_doctor_id_fkey (
          id,
          user:user_id (
            first_name,
            last_name
          )
        )
      `)
      .eq('hospital_id', hospitalId)
      .order('visit_date', { ascending: false });

    if (filters?.doctorId) {
      query = query.eq('doctor_id', filters.doctorId);
    }
    if (filters?.patientId) {
      query = query.eq('patient_id', filters.patientId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        patient:patients!visits_patient_id_fkey (
          id,
          patient_number,
          date_of_birth,
          gender,
          blood_group,
          allergies,
          user:user_id (
            first_name,
            last_name
          )
        ),
        doctor:hospital_users!visits_doctor_id_fkey (
          id,
          user:user_id (
            first_name,
            last_name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(visit: Partial<Visit>) {
    const { data, error } = await supabase
      .from('visits')
      .insert(visit)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, updates: Partial<Visit>) {
    const { data, error } = await supabase
      .from('visits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
