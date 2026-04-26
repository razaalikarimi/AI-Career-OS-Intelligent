import Link from 'next/link';
import { ArrowRight, Zap, Shield, Cpu, Target, Rocket } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen selection:bg-primary/30">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border px-8 py-4 flex justify-between items-center">
                <div className="text-xl font-bold gradient-text">AI Career OS</div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#intelligence" className="hover:text-white transition-colors">AI Intelligence</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Enterprise</a>
                </div>
                <div className="flex gap-4">
                    <button className="text-sm font-semibold px-4 py-2 hover:text-primary transition-colors">Sign In</button>
                    <Link href="/dashboard" className="btn-primary">
                        Get Started <ArrowRight className="ml-2" size={16} />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-8 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] -z-10 rounded-full" />
                
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-xs font-bold text-primary animate-bounce">
                        <Zap size={14} /> NEW: GPT-4o Powered Interview Lab
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight">
                        The Operating System for <br />
                        <span className="gradient-text">Your Career Growth.</span>
                    </h1>
                    
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        An enterprise-grade platform that uses advanced AI to analyze your resume, 
                        map skill gaps, and simulate high-stakes interviews with real-time feedback.
                    </p>
                    
                    <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
                        <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
                            Start Free Analysis
                        </Link>
                        <button className="glass-card text-lg px-8 py-4 flex items-center gap-2">
                            Book a Demo <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="max-w-6xl mx-auto mt-20 p-2 glass-card rounded-2xl animate-in zoom-in-95 duration-1000">
                    <div className="w-full aspect-video bg-[#0a0a0c] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center relative">
                        <div className="text-primary/20 font-bold text-4xl uppercase tracking-[1em]">Dashboard Preview</div>
                        {/* Decorative elements to look like a UI */}
                        <div className="absolute inset-4 grid grid-cols-12 gap-4 opacity-10">
                            <div className="col-span-3 bg-white h-32 rounded-lg" />
                            <div className="col-span-3 bg-white h-32 rounded-lg" />
                            <div className="col-span-3 bg-white h-32 rounded-lg" />
                            <div className="col-span-3 bg-white h-32 rounded-lg" />
                            <div className="col-span-8 bg-white h-64 rounded-lg" />
                            <div className="col-span-4 bg-white h-64 rounded-lg" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 px-8 bg-[#0a0a0c]">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureCard 
                            icon={<Cpu className="text-primary" />}
                            title="Resume Intelligence"
                            desc="Deep semantic analysis of your career history to identify hidden strengths and ATS bottlenecks."
                        />
                        <FeatureCard 
                            icon={<Target className="text-accent" />}
                            title="Skill Gap Detection"
                            desc="Real-time mapping against industry standards for top-tier companies like Google and Netflix."
                        />
                        <FeatureCard 
                            icon={<Rocket className="text-yellow-500" />}
                            title="Interview Simulation"
                            desc="Immersive mock sessions with adaptive difficulty and behavioral analysis."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="space-y-4 p-8 glass-card">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                {icon}
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
                {desc}
            </p>
        </div>
    );
}
