import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function PharmacistDashboard() {
  return (
    <DashboardLayout title="Pharmacist Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">Awaiting fulfillment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filled Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">Completed prescriptions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Need reordering</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45.2K</div>
              <p className="text-xs text-muted-foreground">Total stock value</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pending Prescriptions</CardTitle>
              <CardDescription>Prescriptions awaiting fulfillment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { patient: 'John Smith', medication: 'Amoxicillin 500mg', qty: '21 tablets', time: '10 mins ago' },
                  { patient: 'Mary Johnson', medication: 'Lisinopril 10mg', qty: '30 tablets', time: '25 mins ago' },
                  { patient: 'Robert Brown', medication: 'Metformin 850mg', qty: '60 tablets', time: '1 hour ago' },
                  { patient: 'Lisa Wilson', medication: 'Atorvastatin 20mg', qty: '30 tablets', time: '2 hours ago' },
                ].map((prescription, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{prescription.patient}</p>
                      <p className="text-sm text-muted-foreground">{prescription.medication}</p>
                      <p className="text-xs text-muted-foreground">{prescription.qty} • {prescription.time}</p>
                    </div>
                    <Button size="sm">Fulfill</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>Medications requiring reorder</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Paracetamol 500mg', current: 45, threshold: 100, status: 'warning' },
                  { name: 'Ibuprofen 400mg', current: 22, threshold: 100, status: 'danger' },
                  { name: 'Omeprazole 20mg', current: 67, threshold: 100, status: 'warning' },
                  { name: 'Aspirin 75mg', current: 15, threshold: 100, status: 'danger' },
                ].map((item, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{item.name}</p>
                      <Badge variant={item.status === 'danger' ? 'destructive' : 'secondary'}>
                        {item.current} left
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.status === 'danger' ? 'bg-destructive' : 'bg-warning'}`}
                        style={{ width: `${(item.current / item.threshold) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-xs text-muted-foreground">Threshold: {item.threshold}</p>
                      <Button size="sm" variant="outline">Reorder</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
