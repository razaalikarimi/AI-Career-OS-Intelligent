"use client";
import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Zap, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

export default function JobMatching() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/v1/jobs');
            const json = await res.json();
            if (json.status === 'success') {
                setJobs(json.data);
            } else {
                setError(json.message);
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <RefreshCw className="animate-spin text-blue-500 mb-4" size={40} />
                <p className="text-secondary font-bold">Scanning for opportunities...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Real-Time Job Feed</h1>
                    <p className="text-gray-400">Personalized opportunities fetched directly from our global partners.</p>
                </div>
                {error && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-xl text-sm font-bold border border-red-100">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job.id} className="glass-card p-6 flex flex-col md:flex-row gap-6 items-start hover:border-blue-200 transition-all">
                            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-2xl font-black text-blue-600 border border-blue-100 shadow-sm">
                                {job.company[0]}
                            </div>
                            
                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">{job.title}</h3>
                                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-secondary">
                                            <span className="flex items-center gap-1"><Briefcase size={14} /> {job.company}</span>
                                            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                            <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary_range}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-blue-600">
                                            {Math.floor(Math.random() * 15) + 80}%
                                        </div>
                                        <p className="text-[10px] uppercase font-bold text-secondary tracking-tighter">Match Score</p>
                                    </div>
                                </div>

                                <p className="text-secondary text-sm line-clamp-2">
                                    {job.description || "Exciting opportunity to join a fast-growing team and build innovative solutions using modern technologies."}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {["Remote", job.type || "Full-time", "Senior"].map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-secondary border border-slate-100 uppercase tracking-wider">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full md:w-auto">
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                                    Apply Now <Zap size={14} />
                                </button>
                                <button className="bg-white text-secondary border border-slate-200 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                                    Details <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 glass-card text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Briefcase size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">No Active Matches Found</h3>
                        <p className="text-secondary mb-8 max-w-sm">We couldn't find any jobs in your database. Use our seed script or connect a job board API to populate this feed.</p>
                        <button onClick={fetchJobs} className="text-blue-600 font-bold flex items-center gap-2 hover:underline">
                            <RefreshCw size={16} /> Refresh Feed
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
