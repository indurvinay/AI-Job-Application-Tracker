# 🚀 NexusJob AI — Autonomous Career Suite & Auto-Apply Engine

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-FastAPI-yellow)](https://fastapi.tiangolo.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-Deployed-purple)](https://render.com/)

NexusJob AI is an enterprise-grade autonomous career suite and job application tracker. Powered by a high-performance microservices architecture using **Node.js Express**, **Python FastAPI**, and **Google Gemini AI**, NexusJob AI automates job applications across LinkedIn, Unstop, Naukri, and Indeed while delivering real-time email receipts directly to your inbox.

---

## ✨ Features & Standalone Workspaces

- **⚡ Multi-Platform Auto-Apply Engine (`/auto-apply`)**: 4-step autonomous wizard scanning jobs across **LinkedIn**, **Unstop**, **Naukri**, and **Indeed**, tailoring resume keywords, auto-filling credentials, and sending real-time confirmation receipts to your inbox.
- **✉️ Real-Time Inbox Email Notifications**: Live Nodemailer integration dispatching real-time application confirmation receipts (`✅ Application Confirmation: Role at Company`) directly to your email inbox.
- **📊 Real-Time Dynamic ATS Format Checker (`/ats-check`)**: Dynamic text parser extracting contact metadata, verifying section headings, calculating honest parseability scores, and supporting **side-by-side comparison of up to 5 resumes**.
- **🧠 AI Resume Match Analyzer (`/ai-analysis`)**: Upload a resume (PDF) and Job Description for instant ATS match scoring, missing keywords, and a dedicated **"Required Resume Changes & Keyword Rewrites"** section with 1-click copy action.
- **📝 Cover Letter Studio (`/cover-letter`)**: Generate tailored cover letters in Professional, Executive, or Startup tones with 1-click clipboard copy and PDF print options.
- **🎤 Interview Crack Guide (`/interview-prep`)**: Predict 5 STAR interview questions, sample answers, key technical skills to master, and LinkedIn profile tips per role.
- **📧 Cold Email Dispatcher (`/cold-email`)**: Generate personalized networking emails and dispatch live real-time outreach to recruiters.
- **📁 Resume Vault & Profile Manager (`/profile`)**: Manage targeted resume versions, select primary active resumes, and configure bot preferences.
- **📋 Kanban Board & Dashboard**: Real-time pipeline tracking (Applied → Interview → Offer → Rejected) with Recharts analytics.

---

## 🛠️ Local Development Setup

### 1. Python AI Microservice Setup
Navigate to the `ai-service` directory:
```bash
cd ai-service
pip install -r requirements.txt
```

**Run Command (Local Development)**:
```bash
python -m uvicorn main:app --reload --port 8000
```
*(Or `uvicorn main:app --reload --port 8000`)*

---

### 2. Backend Express API Setup
Navigate to the `backend` directory:
```bash
cd backend
npm install
npx prisma db push
```

**Run Command (Local Development)**:
```bash
npm run dev
```
*(Backend runs on `http://localhost:5000`)*

---

### 3. Frontend React 19 Setup
Navigate to the `frontend` directory:
```bash
cd frontend
npm install
```

**Run Command (Local Development)**:
```bash
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

---

## 🌐 Production Deployment Guide

### A. Deploy Python AI Service on Render (Free)
1. Go to **[dashboard.render.com](https://dashboard.render.com)** and click **"New" → "Web Service"**.
2. Connect GitHub repository: `https://github.com/indurvinay/AI-Job-Application-Tracker.git`.
3. Configure settings:
   - **Root Directory**: `ai-service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**:
     ```bash
     uvicorn main:app --host 0.0.0.0 --port 10000
     ```
4. Click **"Create Web Service"**.

---

### B. Deploy Node.js Backend API on Render (Free)
1. In Render, click **"New" → "Web Service"**.
2. Select your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma db push`
   - **Start Command**: `node src/index.js`
4. Set Environment Variables:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail App Password
5. Click **"Create Web Service"**.

---

### C. Deploy Frontend UI on Vercel (Free)
1. Go to **[vercel.com/new](https://vercel.com/new)** and import `indurvinay/AI-Job-Application-Tracker`.
2. Set Environment Variables:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api`
3. Click **"Deploy"**.

---

## 🧩 Chrome Extension Setup
1. Open `chrome://extensions/` in Google Chrome.
2. Enable **Developer Mode** (top-right toggle).
3. Click **"Load Unpacked"** and select the `chrome-extension` directory.
4. One-click save job postings from LinkedIn directly into your tracker!

---

## 👤 Author & Maintainer
Built by **[Indur Vinay Kumar](https://github.com/indurvinay)**.
