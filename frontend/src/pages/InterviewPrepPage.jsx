import React, { useState } from 'react';
import { BookOpen, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

function InterviewPrepPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [prepData, setPrepData] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post('/ai/interview-prep', { company, role, jobDescription });
      setPrepData(res.data.interviewPrep);
    } catch (err) {
      console.error(err);
      const cName = company || 'Target Company';
      const rName = role || 'Full Stack Engineer';
      setPrepData({
        questions: [
          { q: `Why do you want to join ${cName} as a ${rName}?`, tip: "Align your technical career aspirations with the company's product vision and scale." },
          { q: "Describe a complex engineering challenge you solved in React/Node.js.", tip: "Use the STAR method: Situation, Task, Action, Result with quantifiable metrics." },
          { q: "How do you ensure application performance and zero downtime?", tip: "Discuss query optimization, caching strategies, and automated testing." },
          { q: "How do you handle ambiguous project requirements?", tip: "Show initiative: clarify objectives, draft architecture proposals, and iterate." },
          { q: "What is your approach to system design and code maintainability?", tip: "Emphasize modular components, clean API design, and thorough documentation." }
        ],
        skills: ["React 19 & Component Architecture", "Node.js & Express REST APIs", "Database Optimization & Prisma", "System Security & JWT", "Automated Testing"],
        linkedinTips: `Headline: '${rName} | React & Node.js Specialist'. Feature your top project repos with live preview links.`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 text-xs font-bold text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-gray-900 border border-indigo-500/20 backdrop-blur-xl shadow-2xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-300">
              Standalone AI Interview Crack Studio
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              Predict top interview questions, master key skills, and optimize your LinkedIn profile per role.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Form */}
            <div className="lg:col-span-5 space-y-6">
              <form onSubmit={handleGenerate} className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4 shadow-xl">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Target Role Parameters
                </h2>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Razorpay, Swiggy, Stripe"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Role Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Job Description</label>
                  <textarea
                    rows={5}
                    placeholder="Paste job description..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full p-3.5 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition-all"
                >
                  {loading ? 'Generating Interview Guide...' : 'Generate Interview Prep Guide'}
                </button>
              </form>
            </div>

            {/* Output Workspace */}
            <div className="lg:col-span-7 space-y-6">
              {prepData ? (
                <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-6 shadow-xl">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Top 5 Skills To Master</h3>
                    <div className="flex flex-wrap gap-2">
                      {prepData.skills?.map((sk, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Predicted Interview Questions</h3>
                    {prepData.questions?.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
                        <p className="text-xs font-bold text-white">Q{idx + 1}: {item.q}</p>
                        <p className="text-xs text-gray-400 font-medium">💡 Answer Tip: {item.tip}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-1">
                    <h4 className="text-xs font-bold text-purple-300">LinkedIn Optimization Tip</h4>
                    <p className="text-xs text-gray-300 font-medium">{prepData.linkedinTips}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-24 p-8 rounded-3xl bg-gray-900/50 border border-gray-800 space-y-3">
                  <BookOpen className="w-8 h-8 text-indigo-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Interview Studio Ready</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Fill in target company & role details on the left to generate predicted questions and STAR strategy.
                  </p>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default InterviewPrepPage;
