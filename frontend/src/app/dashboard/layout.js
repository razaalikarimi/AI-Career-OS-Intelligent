"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileSearch, 
  Target, 
  BookOpen, 
  Mic2, 
  Briefcase,
  Settings,
  Bell,
  User
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Intelligence', href: '/dashboard/resume', icon: FileSearch },
    { name: 'Skill Gap', href: '/dashboard/skills', icon: Target },
    { name: 'Study Planner', href: '/dashboard/study', icon: BookOpen },
    { name: 'Interview Lab', href: '/dashboard/interview', icon: Mic2 },
    { name: 'Job Matching', href: '/dashboard/jobs', icon: Briefcase },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface fixed h-full z-20">
        <div className="p-6">
          <h2 className="text-xl font-bold text-accent tracking-tighter">AI Career OS</h2>
        </div>
        
        <nav className="px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-border bg-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black border border-blue-100">
              AR
            </div>
            <div>
              <p className="text-sm font-black text-primary leading-tight">Ali Raza</p>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-primary">
            {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
          </h1>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-secondary hover:bg-background rounded-full transition-colors">
              <Bell size={20} />
            </button>
            <button className="p-2 text-secondary hover:bg-background rounded-full transition-colors">
              <Settings size={20} />
            </button>
            <div className="h-8 w-px bg-border mx-2"></div>
            <button className="btn-primary py-1.5 px-4 text-sm">
              <User size={16} className="mr-2" />
              Profile
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
