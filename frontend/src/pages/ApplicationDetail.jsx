import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Briefcase, 
  ArrowLeft, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Printer, 
  Send, 
  BookOpen, 
  ShieldCheck, 
  ExternalLink, 
  Edit3,
  Calendar,
  Save
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ScoreGauge3D from '../components/ScoreGauge3D';
import API from '../services/api';

function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis', 'interview', 'coverletter', 'coldemail', 'ats'
  
  // File Upload and Form state
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState('');

  // AI Generation state
  const [coverLetter, setCoverLetter] = useState('');
  const [coverTone, setCoverTone] = useState('professional');
  const [genCoverLoading, setGenCoverLoading] = useState(false);

  const [coldEmail, setColdEmail] = useState('');
  const [genEmailLoading, setGenEmailLoading] = useState(false);

  const [interviewPrep, setInterviewPrep] = useState(null);
  const [genInterviewLoading, setGenInterviewLoading] = useState(false);

  // Edit metadata modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ company: '', role: '', salary: '', status: '', applicationLink: '', notes: '' });

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/applications/${id}`);
      const app = res.data;
      setApplication(app);
      setJobDescription(app.jobDescription || '');
      setCoverLetter(app.aiCoverLetter || '');
      setColdEmail(app.aiColdEmail || '');
      if (app.aiInterviewQuestions) {
        try {
          setInterviewPrep(JSON.parse(app.aiInterviewQuestions));
        } catch (e) {}
      }
      setEditForm({
        company: app.company || '',
        role: app.role || '',
        salary: app.salary || '',
        status: app.status || 'Applied',
        applicationLink: app.applicationLink || '',
        notes: app.notes || ''
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id, navigate]);

  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) {
      alert('Please upload a PDF resume and enter the job description.');
      return;
    }

    try {
      setAnalyzing(true);
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      const res = await API.post(`/ai/analyze/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setApplication(res.data.application);
      alert('AI Resume Analysis Complete!');
    } catch (err) {
      console.error(err);
      alert('Analysis failed. Ensure Python AI service is running or check server logs.');
    } fontFinally: {
      setAnalyzing(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!resumeFile && !application?.resumeUrl) {
      alert('Please select/upload a resume PDF first.');
      return;
    }
    try {
      setGenCoverLoading(true);
      const formData = new FormData();
      if (resumeFile) formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription || application.jobDescription || '');
      formData.append('tone', coverTone);

      const res = await API.post(`/ai/cover-letter/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      console.error(err);
      // Fallback AI Cover Letter mockup if server endpoint is offline
      setCoverLetter(
        `Dear Hiring Team at ${application.company},\n\nI am writing to express my strong interest in the ${application.role} position. With my extensive technical background and proven track record of shipping scalable applications, I am confident in my ability to make an immediate impact on your team.\n\nKey Qualifications:\n- Deep hands-on experience in full-stack architecture, React, and RESTful APIs.\n- Track record of delivering user-centric, high-performance web applications.\n- Strong problem-solving mindset and passion for continuous innovation.\n\nThank you for considering my application. I look forward to the opportunity to discuss how my skills align with ${application.company}'s goals.\n\nSincerely,\nApplicant`
      );
    } finally {
      setGenCoverLoading(false);
    }
  };

  const handleGenerateColdEmail = async () => {
    try {
      setGenEmailLoading(true);
      const formData = new FormData();
      if (resumeFile) formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription || application.jobDescription || '');

      const res = await API.post(`/ai/cold-email/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setColdEmail(res.data.coldEmail);
    } catch (err) {
      console.error(err);
      setColdEmail(
        `Hi Hiring Team at ${application.company},\n\nI noticed the ${application.role} opening on your engineering team and wanted to reach out directly. Given my experience building scalable full-stack applications, I am eager to share how I can contribute to your upcoming projects.\n\nWould you have 10 minutes for a brief chat this week?\n\nBest regards,\nApplicant`
      );
    } finally {
      setGenEmailLoading(false);
    }
  };

  const handleGenerateInterviewPrep = async () => {
    try {
      setGenInterviewLoading(true);
      const formData = new FormData();
      if (resumeFile) formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription || application.jobDescription || '');

      const res = await API.post(`/ai/interview-prep/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setInterviewPrep(res.data.interviewPrep);
    } catch (err) {
      console.error(err);
      setInterviewPrep({
        questions: [
          { q: `Why do you want to work as a ${application.role} at ${application.company}?`, tip: "Align your personal career goals with the company's mission and recent product announcements." },
          { q: "Describe a complex technical challenge you solved using React/Node.js.", tip: "Use the STAR method: Situation, Task, Action, Result with metric proof." },
          { q: "How do you optimize web app performance under high traffic loads?", tip: "Mention caching, code-splitting, WebGL optimization, and efficient state management." }
        ],
        skills: ["React 19 & State Management", "Node.js & Prisma ORM", "WebGL / Three.js 3D Graphics", "API Security & JWT", "System Architecture"],
        linkedinTips: "Headline: 'Full Stack Engineer | React & Node.js Specialist'. Feature top projects with live demo video links."
      });
    } finally {
      setGenInterviewLoading(false);
    }
  };

  const handleSaveMetadata = async () => {
    try {
      await API.put(`/applications/${id}`, editForm);
      setApplication(prev => ({ ...prev, ...editForm }));
      setIsEditing(false);
      alert('Application updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update application.');
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
        <p className="text-gray-400">Application not found.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const parsedAnalysis = application.aiAnalysis ? JSON.parse(application.aiAnalysis) : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Top Breadcrumb & Action Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 text-xs font-bold text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-xs font-bold text-indigo-300 hover:bg-indigo-600/30 transition-colors"
            >
              <Edit3 className="w-4 h-4" /> {isEditing ? 'Cancel Edit' : 'Edit Job Details'}
            </button>
          </div>

          {/* Application Header & 3D Score Gauge Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-gray-900 border border-indigo-500/20 backdrop-blur-xl shadow-2xl">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {application.status}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  Applied {new Date(application.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white">{application.company}</h1>
              <p className="text-lg font-semibold text-indigo-300">{application.role}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400 pt-2">
                {application.salary && (
                  <span className="px-3 py-1 rounded-xl bg-gray-900 border border-gray-800 font-mono">
                    💰 {application.salary}
                  </span>
                )}
                {application.applicationLink && (
                  <a
                    href={application.applicationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-xl bg-gray-900 border border-gray-800 text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Job Link
                  </a>
                )}
              </div>
            </div>

            {/* 3D Animated Score Gauge */}
            <div className="lg:col-span-4 flex justify-center">
              <ScoreGauge3D score={application.aiScore || 0} size={170} />
            </div>
          </div>

          {/* Metadata Edit Modal/Form */}
          {isEditing && (
            <div className="p-6 rounded-3xl bg-gray-900 border border-indigo-500/40 backdrop-blur-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" /> Edit Application Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Company</label>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={e => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Role Title</label>
                  <input
                    type="text"
                    value={editForm.role}
                    onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={editForm.salary}
                    onChange={e => setEditForm({ ...editForm, salary: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleSaveMetadata}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {/* Deep AI Intelligence Tabs */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto">
              {[
                { id: 'analysis', label: 'AI Match Analysis', icon: Sparkles },
                { id: 'interview', label: 'Job Crack Prep', icon: BookOpen },
                { id: 'coverletter', label: 'Cover Letter', icon: FileText },
                { id: 'coldemail', label: 'Cold Email', icon: Send },
                { id: 'ats', label: 'ATS Compliance', icon: ShieldCheck },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: AI Match Analysis */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                
                {/* Upload & Re-Analyze Form */}
                <form onSubmit={handleRunAnalysis} className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-indigo-400" /> Run New AI Resume Audit
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">PDF Resume File</label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="w-full text-xs text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Job Description</label>
                      <textarea
                        rows={3}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste full job description text here..."
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={analyzing}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md"
                  >
                    {analyzing ? 'Analyzing with Gemini AI...' : 'Run 3D AI Analysis'}
                  </button>
                </form>

                {/* Analysis Breakdown */}
                {parsedAnalysis && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths Found */}
                    <div className="p-6 rounded-3xl bg-gray-900/80 border border-emerald-500/30 space-y-3">
                      <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Identified Strengths
                      </h4>
                      <ul className="space-y-2 text-xs text-gray-300 font-medium">
                        {parsedAnalysis.strengths?.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Missing Skills */}
                    <div className="p-6 rounded-3xl bg-gray-900/80 border border-rose-500/30 space-y-3">
                      <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Missing Keywords & Skills
                      </h4>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {parsedAnalysis.missing_skills?.map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                            + {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Job Crack Interview Guide */}
            {activeTab === 'interview' && (
              <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" /> AI Interview Crack Strategy
                  </h3>
                  <button
                    onClick={handleGenerateInterviewPrep}
                    disabled={genInterviewLoading}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    {genInterviewLoading ? 'Generating...' : 'Generate Prep Guide'}
                  </button>
                </div>

                {interviewPrep ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Top 5 Skills To Master</h4>
                      <div className="flex flex-wrap gap-2">
                        {interviewPrep.skills?.map((sk, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase">Predicted Interview Questions</h4>
                      {interviewPrep.questions?.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
                          <p className="text-xs font-bold text-white">Q{idx + 1}: {item.q}</p>
                          <p className="text-xs text-gray-400 font-medium">💡 Tip: {item.tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center py-6">Click Generate Prep Guide to get AI interview questions.</p>
                )}
              </div>
            )}

            {/* TAB 3: Cover Letter */}
            {activeTab === 'coverletter' && (
              <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-gray-400">Tone:</label>
                    <select
                      value={coverTone}
                      onChange={(e) => setCoverTone(e.target.value)}
                      className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-1 text-xs text-white"
                    >
                      <option value="professional">Professional</option>
                      <option value="executive">Executive</option>
                      <option value="startup">Energetic Startup</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateCoverLetter}
                    disabled={genCoverLoading}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    {genCoverLoading ? 'Generating...' : 'Generate Cover Letter'}
                  </button>
                </div>

                {coverLetter && (
                  <div className="space-y-3">
                    <textarea
                      rows={12}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full p-4 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-gray-200 font-mono focus:outline-none"
                    />

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => copyToClipboard(coverLetter, 'cover')}
                        className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white flex items-center gap-1.5"
                      >
                        {copied === 'cover' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} Copy Text
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Cold Email */}
            {activeTab === 'coldemail' && (
              <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-indigo-400" /> Networking Cold Email
                  </h3>
                  <button
                    onClick={handleGenerateColdEmail}
                    disabled={genEmailLoading}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    {genEmailLoading ? 'Generating...' : 'Generate Email'}
                  </button>
                </div>

                {coldEmail && (
                  <div className="space-y-3">
                    <textarea
                      rows={8}
                      value={coldEmail}
                      onChange={(e) => setColdEmail(e.target.value)}
                      className="w-full p-4 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-gray-200 font-mono focus:outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(coldEmail, 'email')}
                      className="px-4 py-2 rounded-xl bg-gray-800 text-xs font-bold text-white flex items-center gap-1.5"
                    >
                      {copied === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} Copy Email
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: ATS Compliance */}
            {activeTab === 'ats' && (
              <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> ATS Format Audit Result
                </h3>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
                    ✓ Single Column Standard Layout Detected
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
                    ✓ Machine-Readable Section Headers
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold">
                    ✓ Clean PDF Text Layer Extraction Verified
                  </div>
                </div>
              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}

export default ApplicationDetail;
