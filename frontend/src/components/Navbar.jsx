import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  PlusCircle, 
  User, 
  LogOut, 
  Check, 
  Briefcase,
  Bot,
  Sparkles,
  Search
} from 'lucide-react';
import API from '../services/api';

const Navbar = ({ onSearchChange }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const userEmail = localStorage.getItem('userEmail') || 'Applicant';

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await API.get('/notifications');
          setNotifications(res.data || []);
        }
      } catch (err) {
        console.error("Notif error", err);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await API.patch('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleSearchInput = (e) => {
    setSearchVal(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand / Logo */}
        <div 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <Briefcase className="w-5 h-5 text-white transform group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-400 tracking-tight">
                NexusJob AI
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide">Autonomous Career Suite</p>
          </div>
        </div>

        {/* Center: Quick Tools Bar */}
        <div className="hidden lg:flex items-center gap-2">
          <button onClick={() => navigate('/ai-analysis')} className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-900">
            AI Match
          </button>
          <button onClick={() => navigate('/cover-letter')} className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-900">
            Cover Letter
          </button>
          <button onClick={() => navigate('/interview-prep')} className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-900">
            Interview Prep
          </button>
          <button onClick={() => navigate('/ats-check')} className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-900">
            ATS Check
          </button>
          <button onClick={() => navigate('/cold-email')} className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-900">
            Cold Email
          </button>
        </div>

        {/* Right: Actions & User Navigation */}
        <div className="flex items-center gap-3">
          
          <button
            onClick={() => navigate('/auto-apply')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 shadow-md transition-all"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Auto-Apply Engine</span>
          </button>

          <button
            onClick={() => navigate('/add')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 hover:scale-[1.02] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Add Job</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-xl text-gray-300 hover:text-white bg-gray-900/60 hover:bg-gray-800 border border-gray-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" /> Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">No notifications yet</p>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-xs border ${
                          n.read ? 'bg-gray-950/40 text-gray-400 border-gray-800/50' : 'bg-indigo-950/40 text-indigo-200 border-indigo-800/60 font-medium'
                        }`}
                      >
                        <p>{n.message}</p>
                        <span className="text-[10px] text-gray-500 mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-gray-900/60 hover:bg-gray-800 border border-gray-800 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-gray-200 hidden sm:inline max-w-[100px] truncate">
                {userEmail.split('@')[0]}
              </span>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl py-2 z-50">
                <button
                  onClick={() => { setShowProfileDropdown(false); navigate('/profile'); }}
                  className="w-full px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2 font-medium"
                >
                  <User className="w-4 h-4 text-indigo-400" /> My Profile & Vault
                </button>
                <div className="border-t border-gray-800 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
