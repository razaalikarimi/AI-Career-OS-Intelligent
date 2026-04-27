"use client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

const skillData = [
    { subject: 'Frontend', A: 120, B: 110, fullMark: 150 },
    { subject: 'Backend', A: 98, B: 130, fullMark: 150 },
    { subject: 'Cloud', A: 86, B: 130, fullMark: 150 },
    { subject: 'Database', A: 99, B: 100, fullMark: 150 },
    { subject: 'Security', A: 85, B: 90, fullMark: 150 },
    { subject: 'System Design', A: 65, B: 120, fullMark: 150 },
];

export default function SkillGap() {
    return (
        <div className="space-y-12 page-entry">
            <div className="pb-8 border-b border-border">
                <h1 className="text-3xl font-bold text-primary tracking-tight">Your Skills</h1>
                <p className="text-secondary mt-1 font-medium">Check how your skills match what companies are looking for.</p>
            </div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-7 glass-card p-10 h-[500px]">
                    <h3 className="font-semibold text-xs uppercase tracking-widest text-secondary mb-10">Skill Map</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                            <PolarGrid stroke="#E5E7EB" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 600 }} />
                            <Radar name="Current" dataKey="A" stroke="#000000" fill="#000000" fillOpacity={0.1} />
                            <Radar name="Target" dataKey="B" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.05} />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-10 mt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-black rounded-full" />
                            <span className="text-xs font-bold text-primary uppercase tracking-tighter">Your Level</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-slate-300 rounded-full" />
                            <span className="text-xs font-bold text-secondary uppercase tracking-tighter">Market Level</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-5 space-y-6">
                    <div className="glass-card p-8">
                        <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-6 flex items-center justify-between">
                            Weak Spots
                            <AlertTriangle size={14} className="text-neutral-400" />
                        </h4>
                        <div className="space-y-6">
                            <GapItem title="System Design" diff="-45%" />
                            <GapItem title="Cloud Architecture" diff="-34%" />
                            <GapItem title="Distributed Systems" diff="-28%" />
                        </div>
                    </div>

                    <div className="glass-card p-8 bg-neutral-900 text-white border-none">
                        <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-6">Strong Points</h4>
                        <div className="space-y-6">
                            <GapItem title="Frontend Performance" diff="+15%" positive />
                            <GapItem title="Database Schema Design" diff="+5%" positive />
                        </div>
                        <button className="w-full mt-10 py-3 bg-white text-black rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all">
                            Get Learning Plan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GapItem({ title, diff, positive }) {
    return (
        <div className="flex justify-between items-center group">
            <span className="text-sm font-semibold">{title}</span>
            <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${positive ? 'text-green-500' : 'text-red-500'}`}>{diff}</span>
                <ArrowRight size={12} className="text-neutral-300 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );
}
