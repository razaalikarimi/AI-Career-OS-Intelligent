"use client";
import { 
  FileText, 
  Target, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  Zap,
  BookOpen,
  ArrowUpRight,
  Star
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { name: 'Profile Score', value: '85/100', icon: Target, trend: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Resumes Analyzed', value: '12', icon: FileText, trend: 'Updated today', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Interview Ready', value: '78%', icon: Zap, trend: '+5%', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Banner - Light Version */}
      <div className="glass-card p-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            <Star size={12} fill="white" /> Pro Member Access
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tight">Welcome back, Ali!</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Your career profile is currently in the top <span className="text-white font-bold italic">15%</span> of developers in your region. 
            Ready to reach the top 5%?
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold text-sm hover:shadow-xl transition-all">
              View Job Matches
            </button>
            <button className="bg-transparent text-white border border-white/30 px-8 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
              Update Skills
            </button>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-8 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <stat.icon size={28} className={stat.color} />
              </div>
              <div className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-1">
                <ArrowUpRight size={14} /> {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1">{stat.name}</p>
              <p className="text-3xl font-black text-primary tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Skill Bars */}
        <div className="lg:col-span-8 glass-card p-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold text-primary">Skill Proficiency Matrix</h3>
              <p className="text-sm text-secondary mt-1">Based on your recent assessments and resume analysis</p>
            </div>
            <button className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
              Full Report
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {[
              { name: 'Backend Engineering', level: 85, color: 'bg-blue-500' },
              { name: 'Cloud Architecture', level: 60, color: 'bg-indigo-500' },
              { name: 'System Design', level: 75, color: 'bg-blue-400' },
              { name: 'Frontend Engineering', level: 45, color: 'bg-slate-400' },
            ].map(skill => (
              <div key={skill.name} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-primary">{skill.name}</span>
                  <span className="text-xs font-bold text-secondary bg-background px-2 py-0.5 rounded border border-border">{skill.level}%</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div 
                    className={`h-full ${skill.color} rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Feed */}
        <div className="lg:col-span-4 glass-card p-8">
          <h3 className="text-lg font-bold text-primary mb-8">Latest Activity</h3>
          <div className="space-y-8">
            {[
              { text: 'Optimized Resume for Senior Role', time: '2h ago', status: 'Completed' },
              { text: 'Mock Interview Session Done', time: 'Yesterday', status: '8.5 Score' },
              { text: 'AWS Cloud Quiz Completed', time: '2 days ago', status: 'Passed' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white ring-4 ring-blue-50"></div>
                  {i !== 2 && <div className="w-0.5 h-12 bg-slate-100 my-1"></div>}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-bold text-primary group-hover:text-blue-600 transition-colors">{activity.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-secondary uppercase">{activity.time}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[10px] font-bold text-blue-500">{activity.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-xs font-bold text-secondary bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
            See all activity
          </button>
        </div>
      </div>
    </div>
  );
}
