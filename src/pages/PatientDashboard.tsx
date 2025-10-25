import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Pill, User, Clock, AlertCircle } from 'lucide-react';

export default function PatientDashboard() {
  return (
    <DashboardLayout title="My Dashboard">
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Welcome back, John!</CardTitle>
                <CardDescription className="text-base mt-2">
                  Your health journey at a glance
                </CardDescription>
              </div>
              <Button>Book Appointment</Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Visits</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Next: Tomorrow 10 AM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 ready for pickup</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Documents available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5d</div>
              <p className="text-xs text-muted-foreground">Regular checkup</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg bg-accent/5">
                  <div className="flex items-center justify-between mb-2">
                    <Badge>Tomorrow</Badge>
                    <span className="text-sm text-muted-foreground">10:00 AM</span>
                  </div>
                  <p className="font-medium">Follow-up Consultation</p>
                  <p className="text-sm text-muted-foreground">Dr. Sarah Wilson - Cardiology</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm">View Details</Button>
                    <Button size="sm" variant="outline">Reschedule</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Next Week</Badge>
                    <span className="text-sm text-muted-foreground">Nov 5, 2:30 PM</span>
                  </div>
                  <p className="font-medium">Routine Checkup</p>
                  <p className="text-sm text-muted-foreground">Dr. Michael Brown - General Medicine</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm">View Details</Button>
                    <Button size="sm" variant="outline">Reschedule</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Prescriptions</CardTitle>
              <CardDescription>Current medications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Lisinopril 10mg', dosage: 'Once daily', refills: 2, ready: true },
                  { name: 'Metformin 850mg', dosage: 'Twice daily with meals', refills: 1, ready: true },
                  { name: 'Atorvastatin 20mg', dosage: 'Once daily at bedtime', refills: 3, ready: false },
                ].map((prescription, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{prescription.name}</p>
                        <p className="text-sm text-muted-foreground">{prescription.dosage}</p>
                        <p className="text-xs text-muted-foreground mt-1">{prescription.refills} refills remaining</p>
                      </div>
                      {prescription.ready && (
                        <Badge className="bg-success">Ready</Badge>
                      )}
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-2">
                      {prescription.ready ? 'Pickup Details' : 'Request Refill'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Health Reminders</CardTitle>
            <CardDescription>Important notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Lab Results Available</p>
                  <p className="text-sm text-muted-foreground">Your blood test results from Oct 20 are now available for review</p>
                  <Button size="sm" variant="outline" className="mt-2">View Results</Button>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Vaccination Due</p>
                  <p className="text-sm text-muted-foreground">Your annual flu shot is due this month</p>
                  <Button size="sm" variant="outline" className="mt-2">Schedule</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
