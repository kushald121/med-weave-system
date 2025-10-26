import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { prescriptionApi } from '@/lib/api/prescriptions';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

const prescriptionItemSchema = z.object({
  medication_name: z.string().min(1, 'Medication name is required'),
  generic_name: z.string().optional(),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  quantity_prescribed: z.number().min(1, 'Quantity must be at least 1'),
  instructions: z.string().optional(),
});

type PrescriptionItem = z.infer<typeof prescriptionItemSchema>;

interface PrescriptionFormProps {
  visitId: number;
  onSuccess?: () => void;
}

export const PrescriptionForm = ({ visitId, onSuccess }: PrescriptionFormProps) => {
  const { hospitalUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      medication_name: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity_prescribed: 1,
    },
  ]);

  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      {
        medication_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        quantity_prescribed: 1,
      },
    ]);
  };

  const removePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const updatePrescription = (index: number, field: keyof PrescriptionItem, value: any) => {
    const updated = [...prescriptions];
    updated[index] = { ...updated[index], [field]: value };
    setPrescriptions(updated);
  };

  const handleSubmit = async () => {
    if (!hospitalUser) return;

    setIsSubmitting(true);
    try {
      for (const prescription of prescriptions) {
        await prescriptionApi.create({
          visit_id: visitId,
          prescribed_by: hospitalUser.id,
          medication_name: prescription.medication_name,
          generic_name: prescription.generic_name,
          dosage: prescription.dosage,
          frequency: prescription.frequency,
          duration: prescription.duration,
          quantity_prescribed: prescription.quantity_prescribed,
          instructions: prescription.instructions,
          status: 'pending',
          created_by: hospitalUser.id,
        });
      }

      toast({
        title: 'Success',
        description: 'Prescriptions created successfully',
      });

      setPrescriptions([
        {
          medication_name: '',
          dosage: '',
          frequency: '',
          duration: '',
          quantity_prescribed: 1,
        },
      ]);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create prescriptions',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Prescriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {prescriptions.map((prescription, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Medication {index + 1}</h4>
                {prescriptions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePrescription(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Medication Name</label>
                  <Input
                    value={prescription.medication_name}
                    onChange={(e) =>
                      updatePrescription(index, 'medication_name', e.target.value)
                    }
                    placeholder="e.g., Amoxicillin"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Generic Name</label>
                  <Input
                    value={prescription.generic_name || ''}
                    onChange={(e) =>
                      updatePrescription(index, 'generic_name', e.target.value)
                    }
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Dosage</label>
                  <Input
                    value={prescription.dosage}
                    onChange={(e) =>
                      updatePrescription(index, 'dosage', e.target.value)
                    }
                    placeholder="e.g., 500mg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Frequency</label>
                  <Input
                    value={prescription.frequency}
                    onChange={(e) =>
                      updatePrescription(index, 'frequency', e.target.value)
                    }
                    placeholder="e.g., 3 times daily"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input
                    value={prescription.duration}
                    onChange={(e) =>
                      updatePrescription(index, 'duration', e.target.value)
                    }
                    placeholder="e.g., 7 days"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    value={prescription.quantity_prescribed}
                    onChange={(e) =>
                      updatePrescription(
                        index,
                        'quantity_prescribed',
                        parseInt(e.target.value)
                      )
                    }
                    min={1}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium">Instructions</label>
                <Textarea
                  value={prescription.instructions || ''}
                  onChange={(e) =>
                    updatePrescription(index, 'instructions', e.target.value)
                  }
                  placeholder="Special instructions for taking the medication"
                />
              </div>
            </Card>
          ))}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={addPrescription}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another Medication
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save All Prescriptions'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
