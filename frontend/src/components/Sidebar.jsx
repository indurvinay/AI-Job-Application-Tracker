import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Kanban, 
  PlusCircle, 
  UserCheck, 
  Sparkles, 
  Bot, 
  ShieldCheck,
  FileText,
  BookOpen,
  Send
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Auto-Apply Engine', path: '/auto-apply', icon: Bot, badge: 'AUTO' },
    { label: 'Kanban Board', path: '/board', icon: Kanban },
    { label: 'AI Match Analyzer', path: '/ai-analysis', icon: Sparkles },
    { label: 'Cover Letter Studio', path: '/cover-letter', icon: FileText },
    { label: 'Interview Prep Guide', path: '/interview-prep', icon: BookOpen },
    { label: 'ATS Format Checker', path: '/ats-check', icon: ShieldCheck },
    { label: 'Cold Email Dispatcher', path: '/cold-email', icon: Send },
    { label: 'New Application', path: '/add', icon: PlusCircle },
    { label: 'Resume Vault & AI', path: '/profile', icon: UserCheck },
  ];

  return (
    <aside className="w-64 bg-gray-950/60 backdrop-blur-xl border-r border-gray-800/80 p-4 hidden lg:flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
            Navigation & Tools
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Copilot Status Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-gray-900/60 border border-indigo-500/20 relative overflow-hidden group">
          <div className="flex items-center gap-2 text-indigo-400 mb-2 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>Real-Time Mailer Active</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-medium">
            Nodemailer dispatches live confirmation emails to your inbox on every auto-apply!
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 font-medium">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Nexus OS 3.0
        </span>
        <span className="text-indigo-400 font-semibold">100% Private</span>
      </div>
    </aside>
  );
};

export default Sidebar;
