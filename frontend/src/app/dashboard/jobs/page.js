"use client";
import { Briefcase, MapPin, DollarSign, Zap, ExternalLink } from 'lucide-react';

const jobs = [
    {
        id: 1,
        title: "Senior Full Stack Engineer",
        company: "Netflix",
        location: "Los Gatos, CA (Remote)",
        salary: "$250k - $350k",
        match: 92,
        tags: ["React", "Node.js", "Cassandra"],
        description: "Looking for an engineer to help scale our playback infrastructure using high-performance microservices."
    },
    {
        id: 2,
        title: "Staff Software Engineer",
        company: "Airbnb",
        location: "San Francisco, CA",
        salary: "$300k - $450k",
        match: 88,
        tags: ["System Design", "Go", "AWS"],
        description: "Lead the architectural vision for our core booking engine. Focus on resilience and global scalability."
    },
    {
        id: 3,
        title: "Lead AI Engineer",
        company: "Anthropic",
        location: "Remote",
        salary: "$280k - $400k",
        match: 75,
        tags: ["Python", "PyTorch", "LLMs"],
        description: "Work on the frontier of AI safety and reliability. Scale our training clusters to the next level."
    }
];

export default function JobMatching() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Job Matching</h1>
                    <p className="text-gray-400">Personalized opportunities based on your AI-analyzed career profile.</p>
                </div>
                <div className="glass-card px-4 py-2 flex gap-4 text-sm">
                    <span className="flex items-center gap-1 text-accent"><CheckCircle size={14} /> Profile Optimized</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-300">324 Potential Matches</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {jobs.map((job) => (
                    <div key={job.id} className="glass-card p-6 flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center text-2xl font-bold border border-border">
                            {job.company[0]}
                        </div>
                        
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">{job.title}</h3>
                                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-400">
                                        <span className="flex items-center gap-1"><Briefcase size={14} /> {job.company}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                        <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-black ${job.match > 90 ? 'text-accent' : 'text-primary'}`}>
                                        {job.match}%
                                    </div>
                                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">AI Match Score</p>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm line-clamp-2">
                                {job.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {job.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-secondary rounded text-xs text-gray-300 border border-border">{tag}</span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full md:w-auto">
                            <button className="btn-primary w-full md:w-40 flex items-center gap-2">
                                Apply Now <Zap size={14} />
                            </button>
                            <button className="glass-card py-2 px-4 w-full md:w-40 flex items-center justify-center gap-2 text-sm">
                                View Details <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CheckCircle({ size, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
