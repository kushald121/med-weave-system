import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { patientApi } from '@/lib/api/patients';
import { useToast } from '@/hooks/use-toast';

export const PatientList = ({ onSelectPatient }: { onSelectPatient?: (patientId: number) => void }) => {
  const { hospitalUser } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPatients();
  }, [hospitalUser]);

  const loadPatients = async () => {
    if (!hospitalUser) return;

    try {
      const data = await patientApi.getAll(hospitalUser.hospital_id);
      setPatients(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load patients',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!hospitalUser || !searchQuery) {
      loadPatients();
      return;
    }

    setLoading(true);
    try {
      const data = await patientApi.search(hospitalUser.hospital_id, searchQuery);
      setPatients(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Search failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patients</CardTitle>
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient number or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : patients.length === 0 ? (
          <p className="text-center text-muted-foreground">No patients found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.patient_number}</TableCell>
                  <TableCell>
                    {patient.user ? `${patient.user.first_name} ${patient.user.last_name}` : 'N/A'}
                  </TableCell>
                  <TableCell>{patient.contact_number}</TableCell>
                  <TableCell>{patient.blood_group || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectPatient?.(patient.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
