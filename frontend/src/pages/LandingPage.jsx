import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreeScene from '../components/ThreeScene';
import ScoreGauge3D from '../components/ScoreGauge3D';
import { 
  Sparkles, 
  Briefcase, 
  Zap, 
  FileCheck2, 
  Bot, 
  MailCheck, 
  ArrowRight, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();
  const [demoScore, setDemoScore] = useState(88);
  const [demoRole, setDemoRole] = useState('Senior Full Stack AI Developer');

  const features = [
    {
      icon: Sparkles,
      title: "AI Resume Match Analyzer",
      desc: "Instantly compare your PDF resume against job descriptions to discover match score, missing keywords, and ATS bottlenecks.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Bot,
      title: "Multi-Platform Auto-Apply Engine",
      desc: "Autonomously match and apply to jobs on LinkedIn, Unstop, Naukri, and Indeed. Dynamically tailors resume keywords per job.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: MailCheck,
      title: "Recruiter Cold Mail Dispatcher",
      desc: "Generates and sends personalized networking emails directly to hiring managers and recruiters at target companies.",
      color: "from-sky-500 to-indigo-500"
    },
    {
      icon: Layers,
      title: "Kanban Application Pipeline",
      desc: "Drag and drop job applications across Applied, Interview, Offer, and Rejected stages with live salary sum counters.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileCheck2,
      title: "Instant Multi-Tone Cover Letters",
      desc: "Generate tailor-made cover letters for any job description in Professional, Executive, or Startup tones in seconds.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Job Crack Interview Guide",
      desc: "Get 5 AI-predicted interview questions with STAR answers, top 5 skills to master, and LinkedIn optimization tips per role.",
      color: "from-amber-500 to-rose-500"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden selection:bg-indigo-500 selection:text-white font-sans">
      {/* Ambient Particle Canvas */}
      <ThreeScene variant="hero" />

      {/* Glass Navigation Bar */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-400 tracking-tight">
            NexusJob AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Hero Text */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold shadow-inner">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Autonomous Career Intelligence Suite</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none text-white">
            Land Your Dream Job <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              3x Faster With AI.
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl font-normal leading-relaxed">
            Auto-apply across LinkedIn, Unstop, Naukri, and Indeed. Dynamically tailor resume keywords per job, generate targeted cover letters, and send recruiter cold emails on autopilot.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-all"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-gray-200 bg-gray-900/80 hover:bg-gray-800 border border-gray-800 backdrop-blur-xl transition-all"
            >
              Explore Workspace Demo
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-gray-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Auto Resume Tailoring
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> LinkedIn, Unstop, Naukri & Indeed
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recruiter Cold Mail Dispatch
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Widget Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md p-6 bg-gray-900/80 rounded-3xl border border-gray-800 shadow-2xl backdrop-blur-2xl group hover:border-indigo-500/50 transition-all duration-500">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Live AI Match Score Simulation
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Target Role</label>
                <input
                  type="text"
                  value={demoRole}
                  onChange={(e) => setDemoRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="py-2 flex justify-center">
                <ScoreGauge3D score={demoScore} size={160} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDemoScore(Math.min(98, demoScore + 5))}
                  className="py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold border border-indigo-500/30 transition-colors"
                >
                  + Optimize Keywords
                </button>
                <button
                  onClick={() => setDemoScore(85)}
                  className="py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-bold border border-purple-500/30 transition-colors"
                >
                  Reset Gauge
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Real-World Statistics Counter Bar */}
      <section className="relative z-10 border-y border-gray-800/80 bg-gray-950/70 backdrop-blur-xl py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              15,000+
            </p>
            <p className="text-xs text-gray-400 font-semibold mt-1">Applications Tracked</p>
          </div>
          <div>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              94.8%
            </p>
            <p className="text-xs text-gray-400 font-semibold mt-1">Average ATS Score</p>
          </div>
          <div>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
              $145k+
            </p>
            <p className="text-xs text-gray-400 font-semibold mt-1">Average Salary Tracked</p>
          </div>
          <div>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              3.2x
            </p>
            <p className="text-xs text-gray-400 font-semibold mt-1">More Interview Calls</p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Everything You Need To <span className="text-indigo-400">Dominate</span> Your Job Search
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm font-medium">
            Engineered with multi-platform job integration, automated resume keyword tailoring, and recruiter cold email dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-gray-900/60 rounded-3xl border border-gray-800 hover:border-indigo-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/80 py-8 text-center text-xs text-gray-500 font-medium">
        © 2026 NexusJob AI Autonomous Career Suite. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
