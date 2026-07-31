import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Plus, 
  Trash2, 
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  Bot
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 });
  const [chartData, setChartData] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Search, Filter, Sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const fetchData = async () => {
    try {
      setLoading(true);
      
      let dbApps = [];
      try {
        const appsRes = await API.get('/applications');
        dbApps = appsRes.data || [];
      } catch (err) {
        console.error("API Fetch fallback", err);
      }

      const localApps = JSON.parse(localStorage.getItem('local_applications') || '[]');
      const combinedApps = [...dbApps, ...localApps];

      // Remove duplicate IDs if any
      const uniqueAppsMap = new Map();
      combinedApps.forEach(a => uniqueAppsMap.set(a.id, a));
      const finalApps = Array.from(uniqueAppsMap.values());

      setApplications(finalApps);

      // Compute stats
      const counts = { total: finalApps.length, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
      finalApps.forEach(a => {
        if (counts[a.status] !== undefined) counts[a.status]++;
        else counts.Applied++;
      });
      setStats(counts);

      setChartData([
        { name: 'Applied', value: counts.Applied },
        { name: 'Interview', value: counts.Interview },
        { name: 'Offer', value: counts.Offer },
        { name: 'Rejected', value: counts.Rejected },
      ]);

    } catch (error) {
      console.error("Dashboard error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleDelete = async (appId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    
    try {
      await API.delete(`/applications/${appId}`);
    } catch (err) {
      console.error(err);
    }

    const localApps = JSON.parse(localStorage.getItem('local_applications') || '[]');
    const updatedLocal = localApps.filter(a => a.id !== appId);
    localStorage.setItem('local_applications', JSON.stringify(updatedLocal));

    setApplications(prev => prev.filter(a => a.id !== appId));
    fetchData();
  };

  const handleStatusQuickUpdate = async (appId, newStatus, e) => {
    e.stopPropagation();
    try {
      await API.patch(`/applications/${appId}/status`, { status: newStatus });
    } catch (err) {
      console.error("Status update error", err);
    }

    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
  };

  const filteredApps = applications
    .filter(app => {
      const company = app.company || '';
      const role = app.role || '';
      const matchesSearch = company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = statusFilter === 'All' || app.status === statusFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
        case 'oldest': return new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now());
        case 'company': return (a.company || '').localeCompare(b.company || '');
        case 'score': return (b.aiScore || 0) - (a.aiScore || 0);
        default: return 0;
      }
    });

  const pieData = chartData.filter(d => d.value > 0);
  const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444'];

  const statCards = [
    { title: 'Total Tracked', count: stats.total || 0, icon: Briefcase, color: 'from-blue-600 to-indigo-600', textColor: 'text-blue-400' },
    { title: 'Applied', count: stats.Applied || 0, icon: Clock, color: 'from-indigo-600 to-purple-600', textColor: 'text-indigo-400' },
    { title: 'Interviews', count: stats.Interview || 0, icon: Sparkles, color: 'from-purple-600 to-pink-600', textColor: 'text-purple-400' },
    { title: 'Offers Granted', count: stats.Offer || 0, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600', textColor: 'text-emerald-400' },
    { title: 'Rejected', count: stats.Rejected || 0, icon: XCircle, color: 'from-rose-600 to-red-600', textColor: 'text-rose-400' },
  ];

  const statusBadge = (status) => {
    switch (status) {
      case 'Applied': return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'Interview': return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Offer': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Rejected': return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default: return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar onSearchChange={setSearchTerm} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-gray-900 border border-indigo-500/20 backdrop-blur-xl shadow-2xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-300">
                Application Workspace
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/auto-apply')}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 transition-all"
              >
                <Bot className="w-4 h-4 text-indigo-400" /> Auto-Apply Engine
              </button>

              <button
                onClick={() => navigate('/add')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Application
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800/80 hover:border-indigo-500/40 backdrop-blur-xl transition-all duration-300 shadow-lg hover:-translate-y-1 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-400">{card.title}</span>
                    <div className={`p-2 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight">{card.count}</div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-gray-500">
                    <TrendingUp className={`w-3 h-3 ${card.textColor}`} /> Active in pipeline
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recharts Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Bar Chart: Stage Breakdown */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-indigo-400" /> Pipeline Stage Breakdown
                </h3>
              </div>
              
              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', color: '#fff' }} 
                    />
                    <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart: Status Distribution */}
            <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" /> Conversion Ratio
                </h3>
              </div>

              <div className="h-44 w-full flex items-center justify-center">
                {pieData.length === 0 ? (
                  <p className="text-xs text-gray-500 font-medium">No application data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-gray-400 pt-2 border-t border-gray-800">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Applied</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Interview</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Offer</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Rejected</div>
              </div>
            </div>

          </div>

          {/* Filter, Sort & Search Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-xl">
            
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-gray-200 font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="company">Company Name</option>
                <option value="score">Highest AI Score</option>
              </select>
            </div>
          </div>

          {/* Application Grid */}
          {loading ? (
            <div className="text-center py-16 text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
              Loading workspace...
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-gray-900/50 border border-gray-800/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No job applications found</h3>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/auto-apply')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-600/20 border border-indigo-500/30"
                >
                  Run Auto-Apply Bot
                </button>
                <button
                  onClick={() => navigate('/add')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
                >
                  Add Job Manually
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => navigate(`/application/${app.id}`)}
                  className="p-5 rounded-3xl bg-gray-900/80 border border-gray-800/80 hover:border-indigo-500/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {app.company}
                        </h3>
                        <p className="text-xs font-semibold text-gray-400">{app.role}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {app.aiScore !== null && app.aiScore !== undefined ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-400" /> {app.aiScore}% Match
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-gray-500 bg-gray-800/50">
                          Pending AI Audit
                        </span>
                      )}

                      {app.salary && (
                        <span className="text-xs font-mono font-medium text-gray-400">
                          {app.salary}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusQuickUpdate(app.id, e.target.value, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-950 border border-gray-800 rounded-lg px-2 py-1 text-[11px] text-gray-300 focus:outline-none"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <button
                        onClick={(e) => handleDelete(app.id, e)}
                        className="p-1.5 rounded-lg hover:bg-rose-950/40 text-gray-500 hover:text-rose-400 transition-colors"
                        title="Delete application"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Dashboard;
