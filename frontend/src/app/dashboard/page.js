"use client";
import { useState, useEffect } from 'react';
import { 
  FileText, 
  Target, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  Zap,
  BookOpen,
  ArrowUpRight,
  Star,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/dashboard/stats');
      const json = await res.json();
      if (json.status === 'success') {
        setData(json.data);
      } else {
        setError(json.message);
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { name: 'Skill DNA Score', value: '85/100', icon: Target, trend: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Resumes Analyzed', value: data?.resumes || '0', icon: FileText, trend: 'Real-time', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Interviews Taken', value: data?.interviews || '0', icon: Zap, trend: '+5%', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 glass-card">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Zap size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-primary mb-2">System Sync Failed</h2>
        <p className="text-secondary mb-8 max-w-md">{error}</p>
        <button 
          onClick={fetchStats}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          <RefreshCw size={18} /> Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Banner */}
      <div className="glass-card p-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            <Star size={12} fill="white" /> Live Intelligence Feed
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tight">Welcome back, Ali!</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Your career OS is now connected to your personal cloud. We've synced your latest assessments.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-8 group cursor-pointer relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10">
              <RefreshCw className="animate-spin text-blue-500" />
            </div>}
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
        {/* Activity Feed */}
        <div className="lg:col-span-12 glass-card p-8">
          <h3 className="text-lg font-bold text-primary mb-8">Real-Time Activity Log</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.activities?.length > 0 ? (
              data.activities.map((activity, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <TrendingUp size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">{activity.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-secondary uppercase italic">
                        {new Date(activity.time).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase">
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-secondary font-medium">No recent activity detected. Start by uploading a resume!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
