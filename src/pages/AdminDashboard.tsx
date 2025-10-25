import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Activity, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Staff',
      value: '24',
      description: 'Active employees',
      icon: Users,
      trend: '+2 this month',
    },
    {
      title: 'Total Patients',
      value: '1,234',
      description: 'Registered patients',
      icon: UserPlus,
      trend: '+48 this week',
    },
    {
      title: 'Active Visits',
      value: '56',
      description: 'Ongoing consultations',
      icon: Activity,
      trend: '12 today',
    },
    {
      title: 'System Health',
      value: '99.9%',
      description: 'Uptime this month',
      icon: TrendingUp,
      trend: 'All systems operational',
    },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <p className="text-xs text-accent mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-success" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New staff member added</p>
                    <p className="text-xs text-muted-foreground">Dr. Sarah Johnson joined as Cardiologist</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-warning" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">System update scheduled</p>
                    <p className="text-xs text-muted-foreground">Maintenance window: Tonight 2-4 AM</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New patient registrations</p>
                    <p className="text-xs text-muted-foreground">15 new patients registered today</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-accent/10 transition-colors">
                  <p className="text-sm font-medium">Add New Staff Member</p>
                  <p className="text-xs text-muted-foreground">Invite and onboard new employees</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-accent/10 transition-colors">
                  <p className="text-sm font-medium">Generate Reports</p>
                  <p className="text-xs text-muted-foreground">View analytics and insights</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-accent/10 transition-colors">
                  <p className="text-sm font-medium">Manage Permissions</p>
                  <p className="text-xs text-muted-foreground">Configure role-based access</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
