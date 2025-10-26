import { supabase } from '@/lib/supabase';
import { Appointment } from '@/types/database.types';

export const appointmentApi = {
  async getAll(hospitalId: number, filters?: { doctorId?: number; patientId?: number; status?: string }) {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        patient:patients!appointments_patient_id_fkey (
          id,
          patient_number,
          user:user_id (
            first_name,
            last_name
          )
        ),
        doctor:hospital_users!appointments_doctor_id_fkey (
          id,
          user:user_id (
            first_name,
            last_name
          )
        )
      `)
      .eq('hospital_id', hospitalId)
      .order('appointment_date', { ascending: true });

    if (filters?.doctorId) {
      query = query.eq('doctor_id', filters.doctorId);
    }
    if (filters?.patientId) {
      query = query.eq('patient_id', filters.patientId);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async create(appointment: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, updates: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id: number, status: string) {
    return this.update(id, { status: status as any });
  }
};
