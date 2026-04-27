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
    { name: 'Intelligence Engine', href: '/dashboard/resume', icon: FileSearch },
    { name: 'Skill Matrix', href: '/dashboard/skills', icon: Target },
    { name: 'Neural Planner', href: '/dashboard/study', icon: BookOpen },
    { name: 'Interview Lab', href: '/dashboard/interview', icon: Mic2 },
    { name: 'Job Matching', href: '/dashboard/jobs', icon: Briefcase },
  ];

  return (
    <div className="flex min-h-screen bg-background font-sans selection:bg-blue-100 selection:text-blue-600">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-white fixed h-full z-20 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:rotate-12 transition-transform duration-500">
              <Zap size={20} fill="white" />
            </div>
            <h2 className="text-xl font-black text-primary tracking-tighter uppercase">Career OS</h2>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4 mt-2">Main Terminal</p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
              >
                <Icon size={18} className={isActive ? 'text-accent' : 'text-secondary'} />
                <span className="flex-1">{item.name}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-lg shadow-blue-500"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border bg-slate-50/50">
          <div className="glass-card p-4 bg-white border border-border/50 relative overflow-hidden group cursor-pointer">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black border border-blue-100 group-hover:scale-110 transition-transform">
                  AR
                </div>
                <div>
                  <p className="text-sm font-black text-primary leading-tight">Ali Raza</p>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Pro System</p>
                </div>
                <ChevronRight size={14} className="ml-auto text-slate-300" />
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
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">System</span>
            <ChevronRight size={12} className="text-slate-300" />
            <h1 className="text-sm font-black text-primary uppercase tracking-wider">
              {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Link Active</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-secondary hover:bg-slate-50 rounded-xl transition-all relative">
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2.5 text-secondary hover:bg-slate-50 rounded-xl transition-all">
                <Settings size={18} />
              </button>
            </div>
            
            <div className="h-8 w-px bg-border"></div>
            
            <button className="btn-primary py-2 px-6 text-xs uppercase tracking-widest">
              <User size={14} className="mr-2" />
              Identity
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
