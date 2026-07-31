import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Bot, 
  Mail, 
  ShieldCheck, 
  Plus
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function Profile() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'vinay20developer@gmail.com';

  const [resumes, setResumes] = useState(() => {
    return JSON.parse(localStorage.getItem('user_resumes') || '[]').length > 0
      ? JSON.parse(localStorage.getItem('user_resumes'))
      : [
          { id: 1, name: 'FullStack_Specialist_2026.pdf', version: 'v2.1', active: true, skills: ['React 19', 'Node.js', 'Prisma', 'System Architecture'], date: '2026-07-28' },
          { id: 2, name: 'Frontend_React_Developer.pdf', version: 'v1.4', active: false, skills: ['React', 'Tailwind CSS', 'TypeScript'], date: '2026-07-20' }
        ];
  });

  const [newResumeName, setNewResumeName] = useState('');
  const [newResumeSkills, setNewResumeSkills] = useState('');
  const [newResumeFile, setNewResumeFile] = useState(null);

  const [botConfig, setBotConfig] = useState({
    targetRole: 'Full Stack AI Engineer',
    workType: 'Remote',
    minScore: 75,
    dailyLimit: 10,
    scannerActive: true
  });

  const saveResumesToStorage = (updated) => {
    setResumes(updated);
    localStorage.setItem('user_resumes', JSON.stringify(updated));
  };

  const handleUploadResume = (e) => {
    e.preventDefault();
    if (!newResumeName || !newResumeFile) {
      alert('Please enter a resume title and choose a PDF file.');
      return;
    }

    const newRes = {
      id: Date.now(),
      name: newResumeName + '.pdf',
      version: 'v1.0',
      active: false,
      skills: newResumeSkills ? newResumeSkills.split(',').map(s => s.trim()) : ['General'],
      date: new Date().toISOString().split('T')[0]
    };

    saveResumesToStorage([...resumes, newRes]);
    setNewResumeName('');
    setNewResumeSkills('');
    setNewResumeFile(null);
    alert('Resume uploaded to Vault successfully!');
  };

  const handleSetActive = (id) => {
    const updated = resumes.map(r => ({ ...r, active: r.id === id }));
    saveResumesToStorage(updated);
  };

  const handleDeleteResume = (id) => {
    const updated = resumes.filter(r => r.id !== id);
    saveResumesToStorage(updated);
  };

  const handleSaveBotSettings = () => {
    alert('Auto-Apply preferences saved!');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-gray-900 border border-indigo-500/20 backdrop-blur-xl shadow-2xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-300">
                User Profile & Resume Vault
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-extrabold text-sm">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-white">{userEmail}</p>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Account Verified
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Resume Vault */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" /> Resume Vault Manager
                  </h2>
                  <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                    {resumes.length} Versions Stored
                  </span>
                </div>

                <div className="space-y-3">
                  {resumes.map((res) => (
                    <div
                      key={res.id}
                      className={`p-4 rounded-2xl border backdrop-blur-xl transition-all ${
                        res.active 
                          ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg' 
                          : 'bg-gray-950/60 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-sm">{res.name}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-800 text-gray-300">
                              {res.version}
                            </span>
                            {res.active && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Primary Active
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {res.skills.map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-900 text-gray-400 border border-gray-800">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!res.active && (
                            <button
                              onClick={() => handleSetActive(res.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-300 bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors"
                            >
                              Set Primary
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteResume(res.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload New Vault Resume */}
                <form onSubmit={handleUploadResume} className="pt-4 border-t border-gray-800 space-y-4">
                  <h3 className="text-xs font-bold text-gray-300 uppercase">Upload Targeted Version</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Resume Label (e.g. AI Specialist)"
                      value={newResumeName}
                      onChange={(e) => setNewResumeName(e.target.value)}
                      className="px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Skills Tags (comma separated)"
                      value={newResumeSkills}
                      onChange={(e) => setNewResumeSkills(e.target.value)}
                      className="px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setNewResumeFile(e.target.files[0])}
                      className="text-xs text-gray-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white"
                    />

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Add To Vault
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* Auto-Apply Bot & Email Preferences */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-400" /> Auto-Apply Preferences
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">Target Job Title</label>
                    <input
                      type="text"
                      value={botConfig.targetRole}
                      onChange={(e) => setBotConfig({ ...botConfig, targetRole: e.target.value })}
                      className="w-full px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">Work Type</label>
                    <select
                      value={botConfig.workType}
                      onChange={(e) => setBotConfig({ ...botConfig, workType: e.target.value })}
                      className="w-full px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option value="Remote">Remote Only</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">Min Match Threshold: {botConfig.minScore}%</label>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={botConfig.minScore}
                      onChange={(e) => setBotConfig({ ...botConfig, minScore: parseInt(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">Daily Limit</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={botConfig.dailyLimit}
                      onChange={(e) => setBotConfig({ ...botConfig, dailyLimit: parseInt(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveBotSettings}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md"
                >
                  Save Bot Preferences
                </button>
              </div>

              {/* Email Intelligence Status */}
              <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl space-y-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-sky-400" /> Real-Time Inbox Sync
                </h2>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Real-Time Inbox Dispatch Active
                  </span>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default Profile;
