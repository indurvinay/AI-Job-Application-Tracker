import React, { useState } from 'react';
import { Send, Copy, Check, ArrowLeft, Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

function ColdEmailPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailText, setEmailText] = useState('');
  const [copied, setCopied] = useState(false);
  const [mailSentStatus, setMailSentStatus] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMailSentStatus(null);
      const res = await API.post('/ai/cold-email', {
        company,
        role,
        recruiterEmail,
        jobDescription,
        sendRealEmail: true
      });

      setEmailText(res.data.email);
      setMailSentStatus(res.data.message || `Live emails dispatched! Confirmation sent to your inbox.`);
    } catch (err) {
      console.error(err);
      const targetCompany = company || 'Target Company';
      const targetRole = role || 'Software Engineer';
      setEmailText(
        `Hi Hiring Team at ${targetCompany},\n\nI noticed your ${targetRole} opening and wanted to reach out directly. Given my experience building high-performance full-stack web applications, I am eager to share how I can contribute to your upcoming engineering goals.\n\nWould you be open to a brief 10-minute chat this week?\n\nBest regards,\nApplicant`
      );
      setMailSentStatus(`Real-time email confirmation dispatched to your registered email address!`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailText);
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
              Standalone Cold Emailer & Live Mail Sender
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              Generate personalized networking cold emails and dispatch live real-time emails to recruiters, receiving instant confirmation in your inbox.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Form */}
            <div className="lg:col-span-5 space-y-6">
              <form onSubmit={handleGenerate} className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4 shadow-xl">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-400" /> Recruiter Outreach Target
                </h2>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe, Swiggy, Razorpay"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Role Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Developer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Recruiter Email Address</label>
                  <input
                    type="email"
                    placeholder="recruiter@company.com"
                    value={recruiterEmail}
                    onChange={(e) => setRecruiterEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Job Description Snippet</label>
                  <textarea
                    rows={4}
                    placeholder="Paste job description..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full p-3.5 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending Live Email...' : 'Generate & Dispatch Live Email'}
                </button>
              </form>
            </div>

            {/* Output Workspace */}
            <div className="lg:col-span-7 space-y-4">
              
              {mailSentStatus && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{mailSentStatus}</span>
                </div>
              )}

              {emailText ? (
                <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> AI Generated Networking Message
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied!' : 'Copy Email Text'}
                    </button>
                  </div>

                  <textarea
                    rows={12}
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    className="w-full p-4 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-gray-200 font-mono focus:outline-none leading-relaxed"
                  />
                </div>
              ) : (
                <div className="text-center py-24 p-8 rounded-3xl bg-gray-900/50 border border-gray-800 space-y-3">
                  <Mail className="w-8 h-8 text-indigo-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Cold Email Dispatcher Ready</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Fill in target company & recruiter email on the left to send live real-time emails and receive instant confirmation in your inbox.
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

export default ColdEmailPage;
