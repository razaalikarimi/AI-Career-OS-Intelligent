"use client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';

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
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Skill Gap Analysis</h1>
                <p className="text-gray-400">Comparing your current profile against industry benchmark for Senior Roles.</p>
            </div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-7 glass-card p-8 h-[500px]">
                    <h3 className="font-bold mb-6 flex items-center gap-2">
                        <Target className="text-primary" /> Profile vs. Benchmark
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                            <PolarGrid stroke="#262626" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <Radar name="You" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                            <Radar name="Benchmark" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-8 mt-4 text-xs font-medium">
                        <span className="flex items-center gap-2 text-primary"><div className="w-3 h-3 bg-primary rounded-full" /> Your Profile</span>
                        <span className="flex items-center gap-2 text-accent"><div className="w-3 h-3 bg-accent rounded-full" /> Industry Standard</span>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-5 space-y-6">
                    <div className="glass-card p-6 border-l-4 border-l-red-500">
                        <div className="flex items-center gap-3 mb-4 text-red-500 font-bold">
                            <AlertTriangle size={20} /> Critical Gaps
                        </div>
                        <ul className="space-y-4">
                            <GapItem title="System Design" diff="-45%" />
                            <GapItem title="Cloud Architecture" diff="-34%" />
                            <GapItem title="Distributed Systems" diff="-28%" />
                        </ul>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-accent">
                        <div className="flex items-center gap-3 mb-4 text-accent font-bold">
                            <TrendingUp size={20} /> Strongest Skills
                        </div>
                        <ul className="space-y-4">
                            <GapItem title="Frontend Performance" diff="+15%" positive />
                            <GapItem title="Database Schema Design" diff="+5%" positive />
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GapItem({ title, diff, positive }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">{title}</span>
            <span className={positive ? 'text-accent' : 'text-red-500'}>{diff}</span>
        </div>
    );
}
