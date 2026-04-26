"use client";
import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ResumeIntelligence() {
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState('idle');
    const [analysis, setAnalysis] = useState(null);
    const [resumeId, setResumeId] = useState(null);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setStatus('uploading');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await fetch('http://localhost:5000/api/v1/resumes/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (result.status === 'success') {
                setResumeId(result.data.resumeId);
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
                const response = await fetch(`http://localhost:5000/api/v1/resumes/${id}/status`);
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
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Page Title Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-8">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Resume Analysis</h2>
                    <p className="text-secondary mt-1">Advanced AI-powered ATS scoring and skill extraction</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 text-sm text-secondary bg-surface px-4 py-2 rounded-lg border border-border">
                        <ShieldCheck size={18} className="text-accent" />
                        <span>GDPR Compliant</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Left Side: Upload Controls */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="glass-card p-8 text-center">
                        <div className="w-16 h-16 bg-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-accent/10">
                            <Upload className="text-accent" size={28} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Upload Resume</h3>
                        <p className="text-sm text-secondary mb-8 leading-relaxed">
                            Upload your resume in PDF or Word format for detailed analysis.
                        </p>
                        
                        <input 
                            type="file" 
                            id="resumeUpload" 
                            className="hidden" 
                            accept=".pdf,.doc,.docx"
                            onChange={handleUpload}
                        />
                        
                        <button 
                            onClick={() => document.getElementById('resumeUpload').click()}
                            disabled={isUploading}
                            className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                isUploading 
                                ? 'bg-background text-secondary cursor-not-allowed border border-border' 
                                : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/10'
                            }`}
                        >
                            {isUploading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                            {isUploading ? 'Analyzing...' : 'Select File'}
                        </button>
                    </div>

                    <div className="glass-card p-6 bg-primary text-white border-none overflow-hidden relative">
                        <div className="relative z-10">
                            <h4 className="font-bold mb-4">Why ATS Score?</h4>
                            <p className="text-sm text-white/80 leading-relaxed mb-6">
                                75% of resumes are rejected by ATS before they reach a human. Our scanner uses the same logic.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-medium bg-white/10 p-2 rounded-lg">
                                    <CheckCircle size={14} className="text-white" />
                                    Keyword Match Analysis
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium bg-white/10 p-2 rounded-lg">
                                    <CheckCircle size={14} className="text-white" />
                                    Formatting Verification
                                </div>
                            </div>
                        </div>
                        {/* Decorative Circle */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                    </div>
                </div>

                {/* Right Side: Results Area */}
                <div className="col-span-12 lg:col-span-8">
                    {status === 'idle' && (
                        <div className="glass-card h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-dashed border-2">
                            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6">
                                <FileText size={40} className="text-border" />
                            </div>
                            <h4 className="text-lg font-bold text-primary mb-2">No Analysis Yet</h4>
                            <p className="text-secondary max-w-xs mx-auto">
                                Once you upload your resume, AI insights and ATS score will appear here.
                            </p>
                        </div>
                    )}

                    {status === 'uploading' || status === 'processing' ? (
                        <div className="glass-card h-full min-h-[400px] flex flex-col items-center justify-center p-12">
                            <div className="relative w-24 h-24 mb-8">
                                <div className="absolute inset-0 border-4 border-accent/10 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="text-accent animate-pulse" size={32} />
                                </div>
                            </div>
                            <h4 className="text-xl font-bold text-primary mb-2">Analyzing your Profile</h4>
                            <p className="text-secondary text-center max-w-sm">
                                Our AI is currently extracting skills and calculating your ATS compatibility score.
                            </p>
                        </div>
                    ) : null}

                    {status === 'completed' && analysis && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* Score Card */}
                            <div className="glass-card p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2 block">Resume Score</span>
                                        <h3 className="text-3xl font-bold text-primary">{analysis.education_level || 'Professional Profile'}</h3>
                                    </div>
                                    <div className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border">
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-accent">{analysis.ats_score}%</p>
                                            <p className="text-[10px] font-bold text-secondary uppercase">ATS Compatibility</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-xl">
                                            A
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 py-8 border-y border-border/50">
                                    <div>
                                        <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <FileText size={16} className="text-accent" />
                                            Professional Summary
                                        </h4>
                                        <p className="text-secondary text-sm leading-relaxed">
                                            {analysis.summary}
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <ShieldCheck size={16} className="text-accent" />
                                            Key Metrics
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-background rounded-xl border border-border">
                                                <p className="text-[10px] text-secondary font-bold uppercase mb-1">Experience</p>
                                                <p className="font-bold text-primary">{analysis.experience_years} Years</p>
                                            </div>
                                            <div className="p-4 bg-background rounded-xl border border-border">
                                                <p className="text-[10px] text-secondary font-bold uppercase mb-1">Status</p>
                                                <p className="font-bold text-green-600">Optimized</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 flex justify-between items-center">
                                    <p className="text-xs text-secondary italic">Analysis generated by GPT-4o Career Intelligence</p>
                                    <button className="text-accent text-sm font-bold flex items-center gap-1 hover:underline">
                                        Download PDF Report <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Skill Gaps Card */}
                            <div className="glass-card p-6 border-l-4 border-l-red-500">
                                <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                                    Critical Skill Gaps
                                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase font-bold">Action Required</span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Kubernetes', 'Microservices', 'System Design', 'CI/CD Pipelines'].map(skill => (
                                        <span key={skill} className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-medium text-secondary flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <button className="mt-6 w-full py-2 bg-background border border-border rounded-lg text-sm font-bold text-primary hover:bg-accent hover:text-white hover:border-accent transition-all">
                                    Generate Learning Path for these Skills
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
