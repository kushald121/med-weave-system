import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Pill,
  FileText,
  Settings,
  LogOut,
  Hospital,
  UserCircle,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { hospitalUser, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getNavigationItems = () => {
    const role = hospitalUser?.role;

    const commonItems = [
      { icon: LayoutDashboard, label: 'Dashboard', path: `/${role}` },
    ];

    const roleSpecificItems: Record<string, any[]> = {
      admin: [
        { icon: Users, label: 'Staff Management', path: '/admin/staff' },
        { icon: Hospital, label: 'Hospital Settings', path: '/admin/settings' },
        { icon: ClipboardList, label: 'Reports', path: '/admin/reports' },
      ],
      doctor: [
        { icon: Users, label: 'My Patients', path: '/doctor/patients' },
        { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
        { icon: Stethoscope, label: 'Consultations', path: '/doctor/consultations' },
        { icon: FileText, label: 'Prescriptions', path: '/doctor/prescriptions' },
      ],
      pharmacist: [
        { icon: Pill, label: 'Prescriptions', path: '/pharmacist/prescriptions' },
        { icon: ClipboardList, label: 'Inventory', path: '/pharmacist/inventory' },
      ],
      receptionist: [
        { icon: Users, label: 'Patients', path: '/receptionist/patients' },
        { icon: Calendar, label: 'Appointments', path: '/receptionist/appointments' },
        { icon: UserCircle, label: 'Registration', path: '/receptionist/register' },
      ],
      patient: [
        { icon: UserCircle, label: 'My Profile', path: '/patient/profile' },
        { icon: FileText, label: 'Medical History', path: '/patient/history' },
        { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
        { icon: Pill, label: 'Prescriptions', path: '/patient/prescriptions' },
      ],
    };

    return [...commonItems, ...(roleSpecificItems[role || ''] || [])];
  };

  const navItems = getNavigationItems();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Hospital className="h-8 w-8 text-sidebar-foreground" />
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">HIMS</h1>
              <p className="text-xs text-sidebar-foreground/80 capitalize">{hospitalUser?.role || 'User'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                window.location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="border-b bg-card">
          <div className="px-8 py-6">
            <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
