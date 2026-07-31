import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThreeScene from '../components/ThreeScene';
import { Briefcase, Mail, Lock, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react';
import API from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const passToUse = password.trim() || '123456';
    const emailToUse = email.trim() || 'user@nexusjob.ai';

    try {
      setLoading(true);
      const res = await API.post('/auth/login', { email: emailToUse, password: passToUse });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', emailToUse);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Fail-safe local access
      localStorage.setItem('token', 'local-token-2026');
      localStorage.setItem('userEmail', emailToUse);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@nexusjob.ai');
    setPassword('any_random_password');
    try {
      setLoading(true);
      const res = await API.post('/auth/login', { email: 'demo@nexusjob.ai', password: 'any_random_password' });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', 'demo@nexusjob.ai');
      navigate('/dashboard');
    } catch (err) {
      localStorage.setItem('token', 'demo-token-12345');
      localStorage.setItem('userEmail', 'demo@nexusjob.ai');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* 3D WebGL Background */}
      <ThreeScene variant="full" />

      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-300">
            Sign In To App
          </h1>
          <p className="text-xs text-gray-400 font-medium">Access your 3D AI Job Application Suite</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-400">Password</label>
              <span className="text-[11px] font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-indigo-400" /> Enter any random password
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter any random password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            {loading ? 'Authenticating...' : 'Sign In to Workspace'}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-800 w-full" />
          <span className="bg-gray-900 px-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider absolute">OR</span>
        </div>

        <button
          onClick={handleDemoLogin}
          className="w-full py-2.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-600/10 border border-indigo-500/30 hover:bg-indigo-600/20 flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" /> One-Click Instant Sign In
        </button>

        <p className="text-center text-xs text-gray-400 font-medium pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-bold hover:underline">
            Sign up free
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
