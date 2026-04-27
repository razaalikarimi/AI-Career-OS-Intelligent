"use client";
import { useState, useEffect } from 'react';
import { 
  FileText, 
  Target, 
  TrendingUp, 
  Zap,
  ArrowUpRight,
  Star,
  RefreshCw,
  Clock,
  ExternalLink
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
    { name: 'Your Score', value: '85/100', icon: Target, color: 'text-neutral-900', bg: 'bg-neutral-50' },
    { name: 'Total Resumes', value: data?.resumes || '0', icon: FileText, color: 'text-neutral-900', bg: 'bg-neutral-50' },
    { name: 'Total Interviews', value: data?.interviews || '0', icon: Zap, color: 'text-neutral-900', bg: 'bg-neutral-50' },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-white border border-border rounded-xl">
        <h2 className="text-xl font-semibold text-primary mb-2">Something went wrong</h2>
        <p className="text-secondary mb-6 max-w-sm">We couldn't load your data. Please try again.</p>
        <button 
          onClick={fetchStats}
          className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-neutral-800 transition-all"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 page-entry">
      {/* Simple Header */}
      <div className="flex justify-between items-end pb-8 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Summary</h1>
          <p className="text-secondary mt-1 font-medium">A quick look at how you are doing.</p>
        </div>
        <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-semibold bg-white border border-border rounded-lg hover:bg-neutral-50 transition-all">Download Info</button>
            <button className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-neutral-800 transition-all">Edit Profile</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6 flex flex-col justify-between h-40">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} border border-border flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 flex items-center gap-1">
                +12% Up
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-secondary uppercase tracking-widest mb-1">{stat.name}</p>
              <p className="text-3xl font-bold text-primary tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-8 glass-card overflow-hidden">
          <div className="px-8 py-6 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold text-primary">Your Activity</h3>
            <Clock size={16} className="text-secondary" />
          </div>
          <div className="divide-y divide-border">
            {data?.activities?.length > 0 ? (
              data.activities.map((activity, i) => (
                <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-neutral-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-primary transition-colors"></div>
                    <div>
                      <p className="text-sm font-semibold text-primary">{activity.text}</p>
                      <p className="text-[11px] text-secondary font-medium mt-0.5">
                        {new Date(activity.time).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded uppercase tracking-widest border border-border">
                    {activity.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-8 py-12 text-center text-secondary">
                <p className="text-sm font-medium">Nothing to show yet. Try uploading a resume!</p>
              </div>
            )}
          </div>
          <div className="px-8 py-4 bg-neutral-50 border-t border-border">
            <button className="text-[11px] font-bold text-secondary hover:text-primary uppercase tracking-widest flex items-center gap-2">
              See All Activity <ArrowUpRight size={12} />
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-primary text-white p-8 rounded-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-2 tracking-tight">Expert Tip</h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-6 font-medium">You have great Python skills! Learn a bit about AWS to get higher paying jobs.</p>
                    <button className="text-xs font-bold bg-white text-black px-4 py-2 rounded-lg hover:bg-neutral-200 transition-all">Learn AWS</button>
                </div>
                <Star className="absolute -bottom-4 -right-4 text-white/5" size={120} />
            </div>

            <div className="glass-card p-6">
                <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Quick Shortcuts</h4>
                <div className="space-y-2">
                    {['Upload Resume', 'Practice Interview', 'Job Matches'].map(link => (
                        <button key={link} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 text-sm font-medium text-primary border border-transparent hover:border-border transition-all">
                            {link} <ChevronRight size={14} className="text-secondary" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
