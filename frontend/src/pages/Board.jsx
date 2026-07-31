import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Plus, 
  Eye 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

const COLUMNS = [
  { id: 'Applied', title: 'Applied', color: 'from-blue-500/20 to-indigo-500/10', borderColor: 'border-blue-500/40', badge: 'bg-blue-500/20 text-blue-300' },
  { id: 'Interview', title: 'Interview', color: 'from-purple-500/20 to-pink-500/10', borderColor: 'border-purple-500/40', badge: 'bg-purple-500/20 text-purple-300' },
  { id: 'Offer', title: 'Offer Granted', color: 'from-emerald-500/20 to-teal-500/10', borderColor: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-300' },
  { id: 'Rejected', title: 'Rejected', color: 'from-rose-500/20 to-red-500/10', borderColor: 'border-rose-500/40', badge: 'bg-rose-500/20 text-rose-300' }
];

function Board() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const res = await API.get('/applications');
        setApplications(res.data || []);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [navigate]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const newStatus = destination.droppableId;
    const appId = parseInt(draggableId);

    if (newStatus === 'Offer') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    const updatedApps = applications.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApps);

    try {
      await API.patch(`/applications/${appId}/status`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error saving status change.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-gray-900 border border-indigo-500/20 backdrop-blur-xl shadow-2xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-300">
                Kanban Career Pipeline
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
                Drag and drop cards across hiring stages. Real-time updates and salary aggregation.
              </p>
            </div>

            <button
              onClick={() => navigate('/add')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Application
            </button>
          </div>

          {/* Kanban Columns Grid */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {COLUMNS.map((col) => {
                const colApps = applications.filter(app => app.status === col.id);

                return (
                  <div 
                    key={col.id} 
                    className={`bg-gradient-to-b ${col.color} bg-gray-900/90 rounded-3xl p-4 border ${col.borderColor} backdrop-blur-xl flex flex-col min-h-[580px] shadow-xl`}
                  >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-white tracking-wide">{col.title}</h2>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-black ${col.badge}`}>
                          {colApps.length}
                        </span>
                      </div>
                    </div>

                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`flex-1 space-y-3 transition-colors rounded-2xl p-1 ${
                            snapshot.isDraggingOver ? 'bg-indigo-500/10 border border-indigo-500/30 ring-2 ring-indigo-500/20' : ''
                          }`}
                        >
                          {colApps.map((app, index) => (
                            <Draggable key={app.id} draggableId={app.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => navigate(`/application/${app.id}`)}
                                  className={`p-4 rounded-2xl bg-gray-900/90 border border-gray-800 hover:border-indigo-500/50 backdrop-blur-xl shadow-lg cursor-pointer transition-all duration-200 ${
                                    snapshot.isDragging ? 'rotate-2 scale-105 ring-2 ring-indigo-400 opacity-90 shadow-2xl' : 'hover:-translate-y-1'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-bold text-white text-base truncate">{app.company}</h3>
                                    {app.aiScore !== null && app.aiScore !== undefined && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> {app.aiScore}%
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs font-semibold text-gray-400 mb-3">{app.role}</p>

                                  <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 pt-2 border-t border-gray-800/80">
                                    <span>{app.salary || 'No salary listed'}</span>
                                    <Eye className="w-3.5 h-3.5 text-indigo-400 hover:text-white" />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>

        </main>
      </div>
    </div>
  );
}

export default Board;
