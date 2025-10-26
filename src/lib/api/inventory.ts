import { supabase } from '@/lib/supabase';
import { Inventory } from '@/types/database.types';

export const inventoryApi = {
  async getAll(hospitalId: number) {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('hospital_id', hospitalId)
      .is('deleted_at', null)
      .order('medication_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getLowStock(hospitalId: number) {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('hospital_id', hospitalId)
      .is('deleted_at', null)
      .lt('stock_quantity', supabase.rpc('reorder_threshold'))
      .order('stock_quantity', { ascending: true });

    if (error) throw error;
    return data;
  },

  async search(hospitalId: number, query: string) {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('hospital_id', hospitalId)
      .is('deleted_at', null)
      .or(`medication_name.ilike.%${query}%,generic_name.ilike.%${query}%`)
      .order('medication_name', { ascending: true });

    if (error) throw error;
    return data;
  },

  async update(id: number, updates: Partial<Inventory>) {
    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStock(id: number, quantity: number) {
    const { data, error } = await supabase
      .from('inventory')
      .update({ stock_quantity: quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
