"use client";
import { BookOpen, CheckCircle, Clock, ExternalLink, Play } from 'lucide-react';

export default function StudyPlanner() {
    const courses = [
        { title: "Advanced SQL Optimization", platform: "AI Career Lab", duration: "4h 20m", status: "not_started", priority: "High" },
        { title: "System Design Fundamentals", platform: "Educative", duration: "12h 00m", status: "in_progress", progress: 65 },
        { title: "Cloud Architecture Patterns", platform: "Coursera", duration: "8h 45m", status: "completed" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Study Planner</h1>
                    <p className="text-gray-400">Personalized learning path to bridge your technical skill gaps.</p>
                </div>
                <button className="btn-primary">Generate New Plan</button>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Active Plan */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <h3 className="text-xl font-bold">Curated Courses</h3>
                    <div className="space-y-4">
                        {courses.map((course, i) => (
                            <div key={i} className="glass-card p-6 flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                        course.status === 'completed' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                                    }`}>
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold group-hover:text-primary transition-colors">{course.title}</h4>
                                        <div className="flex gap-4 mt-1 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                                            <span className="text-gray-600">|</span>
                                            <span>{course.platform}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    {course.status === 'in_progress' && (
                                        <div className="w-32">
                                            <div className="flex justify-between text-[10px] mb-1">
                                                <span>Progress</span>
                                                <span>{course.progress}%</span>
                                            </div>
                                            <div className="h-1 bg-border rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${course.progress}%` }} />
                                            </div>
                                        </div>
                                    )}
                                    <button className={`p-2 rounded-lg ${
                                        course.status === 'completed' ? 'text-accent' : 'text-primary hover:bg-primary/10'
                                    }`}>
                                        {course.status === 'completed' ? <CheckCircle /> : <Play size={20} fill="currentColor" />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="font-bold mb-4">Daily Goal</h3>
                        <div className="text-center py-6">
                            <div className="text-4xl font-black gradient-text">2 / 4 hrs</div>
                            <p className="text-xs text-gray-500 mt-2">Keep it up! You're 50% through today's goal.</p>
                        </div>
                    </div>
                    <div className="glass-card p-6 bg-primary/5 border-primary/20">
                        <h4 className="font-bold mb-2">AI Insight</h4>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Based on your latest interview simulation, we recommend focusing on "Distributed Caching" before your next session.
                        </p>
                        <button className="mt-4 text-primary text-xs font-bold flex items-center gap-1">
                            Explore Topic <ExternalLink size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
