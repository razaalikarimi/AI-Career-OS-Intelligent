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
  User,
  Zap,
  ChevronRight
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyze Resume', href: '/dashboard/resume', icon: FileSearch },
    { name: 'Your Skills', href: '/dashboard/skills', icon: Target },
    { name: 'Study Plan', href: '/dashboard/study', icon: BookOpen },
    { name: 'Interview Prep', href: '/dashboard/interview', icon: Mic2 },
    { name: 'Find Jobs', href: '/dashboard/jobs', icon: Briefcase },
  ];

  return (
    <div className="flex min-h-screen bg-background font-sans selection:bg-blue-100 selection:text-blue-600">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-white fixed h-full z-20 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/10 transition-transform duration-500">
              <Zap size={20} fill="white" />
            </div>
            <h2 className="text-xl font-bold text-primary tracking-tight">AI Career OS</h2>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4 mt-2">Menu</p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
              >
                <Icon size={18} className={isActive ? 'text-primary' : 'text-secondary'} />
                <span className="flex-1">{item.name}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border bg-neutral-50/50">
          <div className="p-4 bg-white border border-border rounded-xl group cursor-pointer">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-primary font-bold border border-border group-hover:bg-neutral-200 transition-all">
                  AR
                </div>
                <div>
                  <p className="text-sm font-bold text-primary leading-tight">Ali Raza</p>
                  <p className="text-[10px] font-semibold text-secondary uppercase tracking-widest">Pro Member</p>
                </div>
                <ChevronRight size={14} className="ml-auto text-neutral-300" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-border bg-white/70 backdrop-blur-xl sticky top-0 z-30 px-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Navigation</span>
            <ChevronRight size={12} className="text-neutral-300" />
            <h1 className="text-sm font-semibold text-primary uppercase tracking-wider">
              {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">System Online</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-secondary hover:bg-neutral-50 rounded-lg transition-all relative">
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2.5 text-secondary hover:bg-neutral-50 rounded-lg transition-all">
                <Settings size={18} />
              </button>
            </div>
            
            <div className="h-6 w-px bg-border"></div>
            
            <button className="btn-primary py-2 px-6 text-[11px] uppercase tracking-widest flex items-center gap-2">
              <User size={14} />
              My Profile
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
