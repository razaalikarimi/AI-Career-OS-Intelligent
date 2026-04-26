"use client";
import { useState, useEffect } from 'react';
import { Mic, Video, Send, User, Cpu, BarChart3, Clock } from 'lucide-react';

export default function InterviewLab() {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am your AI Interviewer. Today we will focus on System Design for a Senior Role. Ready to start?' }
    ]);
    const [input, setInput] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (isSessionActive) {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isSessionActive]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSend = () => {
        if (!input.trim()) return;
        
        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        
        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                role: 'ai', 
                content: "That's a solid start. How would you handle state persistence across multiple nodes in this architecture?" 
            }]);
        }, 1500);
    };

    return (
        <div className="h-[calc(100vh-200px)] flex gap-6">
            {/* Main Interview Area */}
            <div className="flex-1 glass-card flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/50">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <span className="font-semibold text-sm">Session: System Design (L6)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mr-4">
                            <Clock size={16} /> {formatTime(timer)}
                        </div>
                        <button className="p-2 hover:bg-border rounded-lg"><Video size={18} /></button>
                        <button className="p-2 hover:bg-border rounded-lg"><Mic size={18} /></button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                msg.role === 'ai' ? 'bg-primary/20 text-primary' : 'bg-secondary text-gray-400'
                            }`}>
                                {msg.role === 'ai' ? <Cpu size={20} /> : <User size={20} />}
                            </div>
                            <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
                                msg.role === 'ai' ? 'bg-secondary/50 rounded-tl-none' : 'bg-primary text-white rounded-tr-none'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-border bg-secondary/20">
                    <div className="relative">
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                            placeholder="Type your response here..."
                            className="w-full bg-background border border-border rounded-xl p-4 pr-16 focus:outline-none focus:border-primary transition-all resize-none min-h-[100px]"
                        />
                        <button 
                            onClick={handleSend}
                            className="absolute bottom-4 right-4 p-2 bg-primary rounded-lg hover:brightness-110 transition-all"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 text-center uppercase tracking-widest">
                        AI is listening and evaluating your performance in real-time
                    </p>
                </div>
            </div>

            {/* Side Analytics Panel */}
            <div className="w-80 flex flex-col gap-6">
                <div className="glass-card p-6">
                    {!isSessionActive ? (
                        <div className="text-center">
                            <h3 className="font-bold mb-4">Start Session</h3>
                            <button 
                                onClick={() => setIsSessionActive(true)}
                                className="btn-primary w-full"
                            >
                                Begin Mock Interview
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h3 className="font-bold mb-6 flex items-center gap-2">
                                <BarChart3 size={18} className="text-primary" /> Live Feedback
                            </h3>
                            <div className="space-y-6">
                                <Metric label="Clarity" value={85} color="bg-accent" />
                                <Metric label="Technical Depth" value={70} color="bg-primary" />
                                <Metric label="Confidence" value={92} color="bg-yellow-500" />
                                <Metric label="Pacing" value={60} color="bg-blue-500" />
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-border">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">AI Observations</h4>
                                <div className="space-y-3">
                                    <div className="text-xs bg-accent/10 text-accent p-2 rounded border border-accent/20">
                                        ✓ Good use of "Scalability" keywords.
                                    </div>
                                    <div className="text-xs bg-yellow-500/10 text-yellow-500 p-2 rounded border border-yellow-500/20">
                                        ⚠ You could explain the "Why" behind using Redis.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="glass-card p-6 mt-auto">
                    <h3 className="text-sm font-bold mb-2">Pro Tip</h3>
                    <p className="text-xs text-gray-400">
                        In System Design interviews, always start with high-level requirements before diving into database schemas.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Metric({ label, value, color }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">{label}</span>
                <span className="font-bold">{value}%</span>
            </div>
            <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}
