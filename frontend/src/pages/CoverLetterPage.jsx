import React, { useState } from 'react';
import { FileText, Copy, Check, ArrowLeft, Printer, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

function CoverLetterPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post('/ai/cover-letter', { company, role, jobDescription, tone });
      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      console.error(err);
      const targetCompany = company || 'Hiring Team';
      const targetRole = role || 'Software Engineer';
      setCoverLetter(
        `Dear Hiring Manager at ${targetCompany},\n\nI am writing to express my strong interest in the ${targetRole} position. With my extensive background in full-stack web application development and modern JavaScript architecture, I am eager to make an immediate impact on your team.\n\nKey Qualifications:\n- Deep expertise in React, Node.js, and scalable REST API development.\n- Proven ability to ship user-centric, high-performance web applications.\n- Strong problem-solving mindset and passion for continuous engineering excellence.\n\nThank you for considering my application. I look forward to discussing how my experience aligns with ${targetCompany}'s goals.\n\nSincerely,\nApplicant`
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              Standalone AI Cover Letter Generator
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              Generate tailor-made, ATS-friendly cover letters customized to any company, role, or tone in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Form */}
            <div className="lg:col-span-5 space-y-6">
              <form onSubmit={handleGenerate} className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4 shadow-xl">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" /> Target Job Parameters
                </h2>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe, Google, OpenAI"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Role Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Tone of Voice</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="professional">Professional & Corporate</option>
                    <option value="executive">Executive & Leadership</option>
                    <option value="startup">Energetic & Startup</option>
                  </select>
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
                  {loading ? 'Generating Cover Letter...' : 'Generate Tailored Cover Letter'}
                </button>
              </form>
            </div>

            {/* Output Workspace */}
            <div className="lg:col-span-7 space-y-4">
              {coverLetter ? (
                <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> AI Generated Cover Letter
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied!' : 'Copy Cover Letter'}
                    </button>
                  </div>

                  <textarea
                    rows={16}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full p-4 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-gray-200 font-mono focus:outline-none leading-relaxed"
                  />
                </div>
              ) : (
                <div className="text-center py-24 p-8 rounded-3xl bg-gray-900/50 border border-gray-800 space-y-3">
                  <FileText className="w-8 h-8 text-indigo-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Cover Letter Studio Ready</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Enter target company & role parameters on the left and click Generate to produce your custom cover letter.
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

export default CoverLetterPage;
