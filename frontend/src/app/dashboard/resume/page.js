"use client";
import { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Loader2, 
  ArrowRight, 
  ShieldCheck, 
  PieChart, 
  Layers, 
  Lightbulb,
  AlertTriangle,
  Zap
} from 'lucide-react';

export default function ResumeIntelligence() {
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState('idle');
    const [analysis, setAnalysis] = useState(null);
    const [activeTab, setActiveTab] = useState('score');

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        setStatus('uploading');
        const formData = new FormData();
        formData.append('resume', file);
        try {
            const response = await fetch('/api/v1/resumes/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (result.status === 'success') {
                pollStatus(result.data.resumeId);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            setStatus('idle');
            setIsUploading(false);
        }
    };

    const pollStatus = (id) => {
        setStatus('processing');
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/v1/resumes/${id}/status`);
                const result = await response.json();
                if (result.data && result.data.status === 'completed') {
                    setAnalysis(result.data);
                    setStatus('completed');
                    setIsUploading(false);
                    clearInterval(interval);
                }
            } catch (error) {
                console.error('Polling failed:', error);
            }
        }, 3000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 page-entry">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-primary tracking-tight">Intelligence Engine</h2>
                    <p className="text-secondary mt-1 font-medium">Extracting career DNA through neural analysis.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-border shadow-sm">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" />
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-wider pr-2">Used by 10k+ Devs</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Side Control */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="glass-card p-10 text-center relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-100 group-hover:rotate-6 transition-transform duration-500">
                                <Upload className="text-accent" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Feed the Engine</h3>
                            <p className="text-sm text-secondary mb-10 leading-relaxed px-4">
                                Our AI processes PDF, DOCX, and Text formats to generate your profile.
                            </p>
                            <input type="file" id="resumeUpload" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} />
                            <button 
                                onClick={() => document.getElementById('resumeUpload').click()}
                                disabled={isUploading}
                                className="btn-primary w-full py-4"
                            >
                                {isUploading ? <Loader2 className="animate-spin mr-2" /> : <FileText className="mr-2" />}
                                {isUploading ? 'Analyzing...' : 'Upload Resume'}
                            </button>
                        </div>
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                    </div>

                    <div className="glass-card p-6 bg-slate-900 text-white border-none">
                        <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-blue-400">System Capability</h4>
                        <ul className="space-y-4">
                            {[
                                'Semantic Skill Extraction',
                                'Contextual Experience Scoring',
                                'Industry Benchmark Analysis',
                                'Keyword Optimization Engine'
                            ].map(item => (
                                <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Analysis Dashboard */}
                <div className="col-span-12 lg:col-span-8">
                    {status === 'idle' ? (
                        <div className="glass-card h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 border-dashed border-2 bg-slate-50/30">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl border border-border">
                                <FileText size={48} className="text-slate-200" />
                            </div>
                            <h4 className="text-xl font-bold text-primary mb-3">Engine Awaiting Input</h4>
                            <p className="text-secondary max-w-sm mx-auto leading-relaxed">
                                Upload your professional resume to begin the deep-scan and receive your career score.
                            </p>
                        </div>
                    ) : status === 'completed' && analysis ? (
                        <div className="space-y-6">
                            {/* Tabs Navigation */}
                            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
                                {[
                                    { id: 'score', label: 'ATS Score', icon: PieChart },
                                    { id: 'skills', label: 'Skill DNA', icon: Layers },
                                    { id: 'insights', label: 'AI Insights', icon: Lightbulb }
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                            activeTab === tab.id 
                                            ? 'bg-white text-accent shadow-sm' 
                                            : 'text-secondary hover:text-primary'
                                        }`}
                                    >
                                        <tab.icon size={18} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content: Score */}
                            {activeTab === 'score' && (
                                <div className="glass-card p-10 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                                        <div>
                                            <h3 className="text-4xl font-black text-primary tracking-tight">{analysis.ats_score}%</h3>
                                            <p className="text-secondary font-bold uppercase tracking-widest text-[10px] mt-1">Optimization Level</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold text-primary">{analysis.education_level}</p>
                                                <p className="text-xs text-secondary">Verified Profile Type</p>
                                            </div>
                                            <div className="w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-500/20">
                                                A+
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-4">Neural Summary</h4>
                                            <p className="text-primary text-lg font-medium leading-relaxed italic">
                                                "{analysis.summary}"
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Experience</p>
                                                <p className="text-2xl font-black text-primary">{analysis.experience_years} Years</p>
                                            </div>
                                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Confidence</p>
                                                <p className="text-2xl font-black text-green-600">98%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab Content: Skills */}
                            {activeTab === 'skills' && (
                                <div className="glass-card p-10 animate-in fade-in zoom-in-95 duration-500">
                                    <h3 className="text-xl font-bold mb-8">Skill Proficiency Matrix</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {['JavaScript', 'React', 'Node.js', 'PostgreSQL'].map((skill, i) => (
                                            <div key={skill} className="space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <span className="font-bold text-primary">{skill}</span>
                                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Lvl {5-i}</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-accent rounded-full" 
                                                        style={{ width: `${100 - (i * 15)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                                        <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                                        <div>
                                            <h4 className="font-bold text-amber-900 text-sm mb-1">Detected Skill Gaps</h4>
                                            <p className="text-xs text-amber-700 leading-relaxed">
                                                Based on current market trends for Senior Roles, you are missing <strong>System Design</strong> and <strong>Kubernetes</strong>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab Content: Insights */}
                            {activeTab === 'insights' && (
                                <div className="glass-card p-10 animate-in fade-in zoom-in-95 duration-500">
                                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                                        AI Recommendations
                                        <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-1 rounded-full uppercase font-black">Beta</span>
                                    </h3>
                                    <div className="space-y-6">
                                        {[
                                            { t: 'Optimize Action Verbs', d: 'Replace "Handled" with "Architected" or "Orchestrated" in your experience section.' },
                                            { t: 'Quantify Achievements', d: 'Add metrics (e.g., "Improved performance by 40%") to your last role at Google.' },
                                            { t: 'Formatting Alert', d: 'Your resume uses a 2-column layout which is harder for some older ATS systems to parse.' }
                                        ].map((insight, i) => (
                                            <div key={i} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:border-accent/30 transition-all cursor-default">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                                    <Lightbulb className="text-accent" size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-primary text-sm mb-1">{insight.t}</h4>
                                                    <p className="text-xs text-secondary leading-relaxed">{insight.d}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="glass-card h-full min-h-[500px] flex flex-col items-center justify-center p-12">
                            <div className="relative w-24 h-24 mb-10">
                                <div className="absolute inset-0 border-4 border-accent/10 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Zap className="text-accent animate-pulse" size={32} />
                                </div>
                            </div>
                            <h4 className="text-2xl font-black text-primary mb-3">Neural Processing...</h4>
                            <p className="text-secondary text-center max-w-sm font-medium">
                                We're cross-referencing your experience with 50,000+ industry standards.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
