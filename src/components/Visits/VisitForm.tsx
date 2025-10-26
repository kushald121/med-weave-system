import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { visitApi } from '@/lib/api/visits';
import { useToast } from '@/hooks/use-toast';

const visitSchema = z.object({
  visit_type: z.enum(['consultation', 'follow_up', 'emergency', 'routine_checkup']),
  chief_complaint: z.string().min(1, 'Chief complaint is required'),
  symptoms: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment_plan: z.string().optional(),
  notes: z.string().optional(),
});

type VisitFormData = z.infer<typeof visitSchema>;

interface VisitFormProps {
  patientId: number;
  onSuccess?: (visitId: number) => void;
}

export const VisitForm = ({ patientId, onSuccess }: VisitFormProps) => {
  const { hospitalUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
  });

  const onSubmit = async (data: VisitFormData) => {
    if (!hospitalUser) return;

    setIsSubmitting(true);
    try {
      const visit = await visitApi.create({
        patient_id: patientId,
        doctor_id: hospitalUser.id,
        hospital_id: hospitalUser.hospital_id,
        visit_number: `V${Date.now()}`,
        visit_date: new Date().toISOString(),
        visit_type: data.visit_type,
        chief_complaint: data.chief_complaint,
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        treatment_plan: data.treatment_plan,
        notes: data.notes,
        status: 'active',
        created_by: hospitalUser.id,
      });

      toast({
        title: 'Success',
        description: 'Visit recorded successfully',
      });

      form.reset();
      onSuccess?.(visit.id);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to record visit',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Visit</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="visit_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visit Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visit type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow_up">Follow Up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="routine_checkup">Routine Checkup</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chief_complaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chief Complaint</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Main reason for visit" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="List of symptoms" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Diagnosis details" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatment_plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment Plan</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Treatment recommendations" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Any additional notes" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Record Visit'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
