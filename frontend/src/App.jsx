import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import AddApplication from './pages/AddApplication';
import Board from './pages/Board'; 
import ApplicationDetail from './pages/ApplicationDetail'; 
import AutoApply from './pages/AutoApply';
import AIAnalysisPage from './pages/AIAnalysisPage';
import CoverLetterPage from './pages/CoverLetterPage';
import InterviewPrepPage from './pages/InterviewPrepPage';
import ATSCheckPage from './pages/ATSCheckPage';
import ColdEmailPage from './pages/ColdEmailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/auto-apply" element={<AutoApply />} />
        
        {/* 5 Standalone AI Tool Workspaces */}
        <Route path="/ai-analysis" element={<AIAnalysisPage />} />
        <Route path="/cover-letter" element={<CoverLetterPage />} />
        <Route path="/interview-prep" element={<InterviewPrepPage />} />
        <Route path="/ats-check" element={<ATSCheckPage />} />
        <Route path="/cold-email" element={<ColdEmailPage />} />

        <Route path="/add" element={<AddApplication />} /> 
        <Route path="/board" element={<Board />} />
        <Route path="/application/:id" element={<ApplicationDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
