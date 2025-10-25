// Database types based on the schema
export type RoleEnum = 'admin' | 'doctor' | 'pharmacist' | 'receptionist' | 'patient';
export type StatusEnum = 'pending' | 'filled' | 'partially_filled' | 'cancelled' | 'out_of_stock' | 'active' | 'completed' | 'scheduled' | 'confirmed' | 'no_show';
export type GenderEnum = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type VisitTypeEnum = 'consultation' | 'follow_up' | 'emergency' | 'routine_checkup';

export interface Hospital {
  id: number;
  name: string;
  logo_url: string | null;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface User {
  id: number;
  email: string;
  password_hash: string | null;
  first_name: string | null;
  last_name: string | null;
  oauth_provider: 'google' | 'meta' | null;
  oauth_provider_id: string | null;
  phone: string | null;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UserSession {
  id: number;
  user_id: number;
  token_hash: string;
  device_info: Record<string, any> | null;
  ip_address: string | null;
  expires_at: string;
  created_at: string;
  last_used_at: string;
}

export interface HospitalUser {
  id: number;
  hospital_id: number;
  user_id: number;
  role: RoleEnum;
  employee_id: string | null;
  department: string | null;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  deleted_at: string | null;
}

export interface Patient {
  id: number;
  user_id: number | null;
  hospital_id: number;
  patient_number: string;
  date_of_birth: string | null;
  gender: GenderEnum | null;
  contact_number: string | null;
  emergency_contact_name: string | null;
  emergency_contact_number: string | null;
  address: string | null;
  blood_group: string | null;
  allergies: string | null;
  medical_history: string | null;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  deleted_at: string | null;
}

export interface Visit {
  id: number;
  patient_id: number;
  doctor_id: number;
  hospital_id: number;
  visit_number: string;
  visit_date: string;
  visit_type: VisitTypeEnum;
  chief_complaint: string | null;
  symptoms: string | null;
  diagnosis: string | null;
  treatment_plan: string | null;
  notes: string | null;
  status: StatusEnum;
  created_at: string;
  updated_at: string;
  created_by: number | null;
}

export interface MedicalTest {
  id: number;
  visit_id: number;
  test_type: string;
  test_name: string;
  test_date: string;
  result_details: string | null;
  result_values: Record<string, any> | null;
  reference_ranges: Record<string, any> | null;
  image_url: string | null;
  lab_technician_id: number | null;
  status: StatusEnum;
  created_at: string;
  updated_at: string;
  created_by: number | null;
}

export interface Prescription {
  id: number;
  visit_id: number;
  prescribed_by: number;
  medication_name: string;
  generic_name: string | null;
  dosage: string;
  frequency: string;
  duration: string;
  quantity_prescribed: number | null;
  instructions: string | null;
  status: StatusEnum;
  created_at: string;
  updated_at: string;
  created_by: number | null;
}

export interface Inventory {
  id: number;
  hospital_id: number;
  medication_name: string;
  generic_name: string | null;
  category: string | null;
  manufacturer: string | null;
  batch_number: string | null;
  expiry_date: string | null;
  stock_quantity: number;
  reorder_threshold: number;
  unit_price: number | null;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  deleted_at: string | null;
}

export interface PrescriptionFulfillment {
  id: number;
  prescription_id: number;
  inventory_id: number | null;
  pharmacist_id: number;
  quantity_fulfilled: number;
  fulfilled_at: string;
  status: StatusEnum;
  notes: string | null;
  created_at: string;
  created_by: number | null;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  hospital_id: number;
  appointment_date: string;
  duration_minutes: number;
  reason: string | null;
  status: StatusEnum;
  created_at: string;
  updated_at: string;
  created_by: number | null;
}

export interface Bill {
  id: number;
  visit_id: number | null;
  hospital_id: number;
  bill_number: string;
  total_amount: number;
  paid_amount: number;
  status: StatusEnum;
  created_at: string;
  updated_at: string;
}
