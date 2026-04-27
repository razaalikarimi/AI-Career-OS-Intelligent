"use client";
import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Zap, ExternalLink, RefreshCw, AlertCircle, Search, Globe, ChevronRight } from 'lucide-react';

export default function JobMatching() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('India');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async (q = '', loc = '') => {
        try {
            setLoading(true);
            const url = q ? `/api/v1/jobs?q=${encodeURIComponent(q)}&location=${encodeURIComponent(loc || location)}` : '/api/v1/jobs';
            const res = await fetch(url);
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

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(searchQuery, location);
    };

    return (
        <div className="space-y-12 page-entry">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-border">
                <div className="max-w-2xl">
                    <h1 className="text-3xl font-bold text-primary tracking-tight">Jobs for You</h1>
                    <p className="text-secondary mt-1 font-medium">Fresh job listings from across the web.</p>
                </div>
            </div>

            {/* Simple Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-white border border-border rounded-lg shadow-sm focus-within:border-primary transition-colors">
                    <Search className="text-neutral-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="What job are you looking for?" 
                        className="w-full bg-transparent outline-none text-sm font-medium text-primary placeholder:text-neutral-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64 flex items-center gap-3 px-4 py-2.5 bg-white border border-border rounded-lg shadow-sm focus-within:border-primary transition-colors">
                    <Globe className="text-neutral-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="City or Country" 
                        className="w-full bg-transparent outline-none text-sm font-medium text-primary placeholder:text-neutral-400"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <button 
                    type="submit"
                    className="bg-primary text-white px-10 py-2.5 rounded-lg font-semibold hover:bg-neutral-800 transition-all shadow-sm"
                >
                    Search
                </button>
            </form>

            {error && (
                <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
                    <AlertCircle size={18} />
                    <span className="text-sm font-semibold">{error}</span>
                </div>
            )}

            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <RefreshCw className="animate-spin text-neutral-400 mb-4" size={32} />
                        <p className="text-secondary font-semibold text-xs uppercase tracking-widest">Looking for jobs...</p>
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="divide-y divide-border">
                        {jobs.map((job) => (
                            <div key={job.id} className="p-8 flex flex-col md:flex-row gap-8 items-start hover:bg-neutral-50 transition-all group cursor-pointer">
                                <div className="w-14 h-14 bg-neutral-100 rounded-lg flex items-center justify-center text-xl font-bold text-neutral-500 border border-border">
                                    {job.company[0]}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="min-w-0 pr-4">
                                            <h3 className="text-xl font-bold text-primary truncate group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                            <p className="text-sm font-semibold text-secondary mt-1">{job.company}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 uppercase tracking-widest">
                                                {job.source || 'Verified'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm font-medium text-secondary">
                                        <span className="flex items-center gap-2"><MapPin size={16} className="text-neutral-400" /> {job.location}</span>
                                        <span className="flex items-center gap-2"><DollarSign size={16} className="text-neutral-400" /> {job.salary_range}</span>
                                        <span className="flex items-center gap-2"><Briefcase size={16} className="text-neutral-400" /> {job.type || 'Full-time'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 w-full md:w-auto">
                                    <a 
                                        href={job.url || "#"} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all no-underline"
                                    >
                                        Apply Now <ChevronRight size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
                            <Search size={32} className="text-neutral-300" />
                        </div>
                        <h3 className="text-lg font-bold text-primary mb-1">No jobs found</h3>
                        <p className="text-secondary text-sm mb-8 max-w-sm font-medium">Try searching for a different job title or city.</p>
                        <button onClick={() => fetchJobs(searchQuery)} className="bg-primary text-white px-8 py-2.5 rounded-lg font-semibold">
                             Clear search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
