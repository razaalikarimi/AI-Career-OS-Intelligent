"use client";
import { useState, useRef, useEffect } from 'react';
import { Mic, Video, ShieldAlert, Play, StopCircle, MessageSquare, Code, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useProctoring } from './useProctoring';

export default function InterviewLab() {
    const [step, setStep] = useState('landing'); // landing, permissions, ongoing, finished
    const [sessionId, setSessionId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [isProctoringActive, setIsProctoringActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [violations, setViolations] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const MAX_QUESTIONS = 5;
    const [isFinishing, setIsFinishing] = useState(false);
    const [report, setReport] = useState(null);
    
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Attach stream when video element is available in 'ongoing' step
    useEffect(() => {
        if (step === 'ongoing' && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [step]);

    const handleViolation = async (type, severity, metadata = {}) => {
        const msg = `${type.replace('_', ' ').toUpperCase()} Detected!`;
        if (!violations.includes(msg)) {
            setViolations(prev => [msg, ...prev]);
            // Log to backend
            if (sessionId) {
                try {
                    await fetch(`/api/v1/interviews/sessions/${sessionId}/violation`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type, severity, metadata: metadata || {} })
                    });
                } catch (err) {
                    console.error('Failed to log violation:', err);
                }
            }
        }
    };

    useProctoring(videoRef, sessionId, handleViolation, isProctoringActive);

    // Roles for simulation
    const roles = [
        { id: '1', title: 'Senior Frontend Engineer', color: 'bg-blue-50' },
        { id: '2', title: 'Backend Systems Architect', color: 'bg-indigo-50' },
        { id: '3', title: 'Full Stack Developer', color: 'bg-emerald-50' }
    ];

    const startInterview = async (roleId) => {
        try {
            const res = await fetch('/api/v1/interviews/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobRoleId: roleId })
            });
            const result = await res.json();
            if (result.status === 'success') {
                setSessionId(result.data.id);
                setStep('permissions');
            }
        } catch (err) {
            console.error('Failed to start session', err);
        }
    };

    const [deviceInfo, setDeviceInfo] = useState(null);

    const analyzeDevice = async () => {
        const info = {
            os: navigator.platform,
            browser: navigator.userAgent,
            cores: navigator.hardwareConcurrency,
            memory: navigator.deviceMemory,
            screenRes: `${window.screen.width}x${window.screen.height}`,
            isTouch: 'ontouchstart' in window
        };

        // Detect Virtual Cameras (Simplified check)
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        const hasVirtual = videoDevices.some(d => d.label.toLowerCase().includes('obs') || d.label.toLowerCase().includes('virtual'));
        
        info.videoDevices = videoDevices.length;
        info.hasVirtualCamera = hasVirtual;
        
        setDeviceInfo(info);
        if (hasVirtual) {
            handleViolation('virtual_camera_detected', 'high');
        }
        return info;
    };

    const requestPermissions = async () => {
        try {
            const info = await analyzeDevice();
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
            
            // Log device info to backend
            if (sessionId) {
                await fetch(`/api/v1/interviews/sessions/${sessionId}/violation`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'device_info', severity: 'low', metadata: info })
                });
            }

            setStep('ongoing');
            beginInterview();
        } catch (err) {
            alert('Camera and Microphone access are required for proctoring.');
        }
    };

    const beginInterview = async () => {
        const res = await fetch(`/api/v1/interviews/sessions/${sessionId}/start`, { method: 'POST' });
        const result = await res.json();
        setCurrentQuestion(result.data.question);
        setIsProctoringActive(true);
    };

    const [isListening, setIsListening] = useState(false);
    const [answerText, setAnswerText] = useState('');

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            setAnswerText(transcript);
        };

        recognition.start();
    };

    const submitAnswer = async () => {
        setIsUploading(true);
        const res = await fetch(`/api/v1/interviews/sessions/${sessionId}/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionId: 'mock-id', answer: answerText })
        });
        
        if (questionCount + 1 >= MAX_QUESTIONS) {
            finishInterview();
        } else {
            const result = await res.json();
            setCurrentQuestion(result.data.question);
            setQuestionCount(prev => prev + 1);
            setAnswerText('');
        }
        setIsUploading(false);
    };

    const finishInterview = async () => {
        setIsFinishing(true);
        setStep('finished');
        setIsProctoringActive(false);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        // Mocking report fetching for now, but backend worker will process it
        setTimeout(async () => {
            setReport({
                score: 85,
                technical: 88,
                communication: 92,
                confidence: 80,
                risk: violations.length > 2 ? 'Medium' : 'Low',
                feedback: "Excellent performance. You demonstrated deep knowledge of microservices and state management. Communication was proactive and structured."
            });
            setIsFinishing(false);
        }, 3000);
    };

    return (
        <div className="max-w-6xl mx-auto page-entry">
            {step === 'landing' && (
                <div className="space-y-8 text-center py-10">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-4xl font-black text-primary mb-4 tracking-tight">AI Interview Room</h2>
                        <p className="text-secondary text-lg">Practice your interviews with AI. Pick a job and start talking!</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 pt-10">
                        {roles.map(role => (
                            <div key={role.id} className="glass-card p-8 group cursor-pointer hover:border-accent transition-all">
                                <div className={`w-16 h-16 ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                                    <MessageSquare className="text-accent" size={32} />
                                </div>
                                <h3 className="font-bold text-primary mb-2">{role.title}</h3>
                                <p className="text-xs text-secondary mb-8">HR + Technical + DSA</p>
                                <button 
                                    onClick={() => startInterview(role.id)}
                                    className="w-full btn-primary py-3"
                                >
                                    Start Session
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {step === 'permissions' && (
                <div className="glass-card max-w-xl mx-auto p-12 text-center">
                    <ShieldAlert size={64} className="text-accent mx-auto mb-8 animate-pulse" />
                    <h3 className="text-2xl font-black text-primary mb-4">Wait! One Last Step</h3>
                    <p className="text-secondary mb-10 leading-relaxed">
                        We need to see and hear you for the interview. 
                        Our AI will also check for phones or extra help.
                    </p>
                    <button 
                        onClick={requestPermissions}
                        className="btn-primary w-full py-4"
                    >
                        Allow Camera & Mic
                    </button>
                </div>
            )}

            {step === 'ongoing' && (
                <div className="grid grid-cols-12 gap-8 h-[700px]">
                    {/* Left: Question & Interaction */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                        <div className="glass-card flex-1 p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-red-100">
                                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                    Live Proctoring
                                </div>
                            </div>

                            <div className="h-full flex flex-col justify-center">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-accent font-black uppercase tracking-widest text-xs">AI Interviewer</span>
                                    <span className="text-secondary font-black text-xs uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">Question {questionCount + 1} / {MAX_QUESTIONS}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-primary leading-snug">
                                    {currentQuestion || "Preparing your first question..."}
                                </h3>
                                
                                <div className="mt-12 space-y-4">
                                    <textarea 
                                        className="w-full bg-slate-50 border border-border rounded-2xl p-6 h-40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium text-primary"
                                        placeholder="Type your response here or use voice input..."
                                        value={answerText}
                                        onChange={(e) => setAnswerText(e.target.value)}
                                    ></textarea>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={submitAnswer}
                                            disabled={isUploading || !answerText}
                                            className="flex-1 btn-primary py-4 disabled:opacity-50"
                                        >
                                            {isUploading ? <Loader2 className="animate-spin" /> : 'Submit Answer'}
                                        </button>
                                        <button 
                                            onClick={toggleListening}
                                            className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-primary hover:bg-slate-200'}`}
                                        >
                                            <Mic size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Camera & Proctoring Logs */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                        <div className="glass-card aspect-video relative overflow-hidden bg-slate-900 border-none rounded-3xl">
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    muted 
                                    className="w-full h-full object-cover"
                                />
                            <div className="absolute inset-0 border-[20px] border-transparent pointer-events-none border-t-white/10 border-l-white/10"></div>
                            {/* Face Mesh Simulation Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                <div className="w-48 h-64 border border-accent rounded-full border-dashed animate-pulse"></div>
                            </div>
                        </div>

                        <div className="glass-card flex-1 p-6 overflow-y-auto">
                            <h4 className="text-xs font-black text-secondary uppercase tracking-widest mb-6 flex items-center justify-between">
                                Security Feed
                                <span className="text-green-500">Secure</span>
                            </h4>
                            <div className="space-y-4">
                                {violations.length === 0 ? (
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 p-4 bg-slate-50 rounded-xl">
                                        <CheckCircle size={16} className="text-green-500" />
                                        No violations detected.
                                    </div>
                                ) : (
                                    violations.map((v, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs font-bold text-red-600 p-4 bg-red-50 rounded-xl border border-red-100">
                                            <AlertTriangle size={16} />
                                            {v}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {step === 'finished' && (
                <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="glass-card p-10 text-center bg-gradient-to-br from-white to-blue-50">
                        {isFinishing ? (
                            <div className="py-20 flex flex-col items-center">
                                <Loader2 className="animate-spin text-accent mb-6" size={48} />
                                <h3 className="text-2xl font-black text-primary mb-2">Generating Neural Report...</h3>
                                <p className="text-secondary">Our AI is analyzing your performance and proctoring data.</p>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <div>
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                                        <CheckCircle className="text-green-500" size={40} />
                                    </div>
                                    <h3 className="text-4xl font-black text-primary tracking-tight">Interview Completed</h3>
                                    <p className="text-secondary mt-2 font-medium">Your evaluation is ready for review.</p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Overall Score', val: `${report.score}%`, color: 'text-blue-600' },
                                        { label: 'Technical', val: `${report.technical}%`, color: 'text-indigo-600' },
                                        { label: 'Communication', val: `${report.communication}%`, color: 'text-emerald-600' },
                                        { label: 'Proctoring Risk', val: report.risk, color: report.risk === 'Low' ? 'text-green-600' : 'text-amber-600' }
                                    ].map(stat => (
                                        <div key={stat.label} className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                                            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">{stat.label}</p>
                                            <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-left p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-4">AI Deep Feedback</h4>
                                    <p className="text-primary leading-relaxed font-medium">
                                        "{report.feedback}"
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setStep('landing')}
                                        className="flex-1 btn-primary py-4"
                                    >
                                        Back to Dashboard
                                    </button>
                                    <button className="flex-1 bg-white border border-border text-primary font-bold py-4 rounded-xl hover:bg-slate-50 transition-all">
                                        Download PDF Report
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
