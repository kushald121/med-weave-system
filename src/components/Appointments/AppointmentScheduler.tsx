import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentApi } from '@/lib/api/appointments';
import { staffApi } from '@/lib/api/staff';
import { patientApi } from '@/lib/api/patients';
import { useToast } from '@/hooks/use-toast';

const appointmentSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  doctor_id: z.string().min(1, 'Doctor is required'),
  appointment_date: z.string().min(1, 'Date is required'),
  appointment_time: z.string().min(1, 'Time is required'),
  duration_minutes: z.number().min(15, 'Duration must be at least 15 minutes'),
  reason: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export const AppointmentScheduler = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { hospitalUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      duration_minutes: 30,
    },
  });

  useEffect(() => {
    if (hospitalUser) {
      loadDoctors();
      loadPatients();
    }
  }, [hospitalUser]);

  const loadDoctors = async () => {
    if (!hospitalUser) return;
    try {
      const data = await staffApi.getByRole(hospitalUser.hospital_id, 'doctor');
      setDoctors(data || []);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    }
  };

  const loadPatients = async () => {
    if (!hospitalUser) return;
    try {
      const data = await patientApi.getAll(hospitalUser.hospital_id);
      setPatients(data || []);
    } catch (error) {
      console.error('Failed to load patients:', error);
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    if (!hospitalUser) return;

    setIsSubmitting(true);
    try {
      const appointmentDateTime = `${data.appointment_date}T${data.appointment_time}:00`;
      
      await appointmentApi.create({
        patient_id: parseInt(data.patient_id),
        doctor_id: parseInt(data.doctor_id),
        hospital_id: hospitalUser.hospital_id,
        appointment_date: appointmentDateTime,
        duration_minutes: data.duration_minutes,
        reason: data.reason,
        status: 'scheduled',
        created_by: hospitalUser.id,
      });

      toast({
        title: 'Success',
        description: 'Appointment scheduled successfully',
      });

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to schedule appointment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Appointment</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patient_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.patient_number} - {patient.user?.first_name} {patient.user?.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doctor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          Dr. {doctor.user?.first_name} {doctor.user?.last_name}
                          {doctor.department && ` - ${doctor.department}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="appointment_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointment_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="duration_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Reason for appointment" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
