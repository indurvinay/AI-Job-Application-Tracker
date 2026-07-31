# 🚀 AI-Powered Job Application Tracker (Ultimate Edition)

![**LIVE DEMO**](https://ai-job-application-tracker-eosin.vercel.app/)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Python](https://img.shields.io/badge/Python-3.11-yellow)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

A production-grade SaaS web app that helps job seekers track, optimize, and succeed in their job search. Powered by a microservices architecture using Node.js, Python FastAPI, and Google Gemini AI.

## ✨ Features

- **🧠 AI Resume Analysis**: Upload a resume (PDF) and Job Description to get an ATS Match Score, missing skills, and improvement suggestions.
- **📝 AI Cover Letter Generator**: Automatically write perfectly tailored cover letters in formal, friendly, or startup tones. **Export to PDF included!**
- **🎤 AI Mock Interview Prep**: Generates 5 predicted interview questions with STAR method answer tips.
- **📧 AI Cold Email Generator**: Create personalized networking messages for recruiters based on your resume and the job role.
- **📊 ATS Format Checker**: Structural PDF analysis that flags formatting issues that break Applicant Tracking Systems.
- **📋 Kanban Board**: Drag-and-drop job tracking (Applied → Interview → Offer → Rejected).
- **🧩 Chrome Extension**: Save jobs directly from LinkedIn to your tracker with a single click.
- **✉️ Automated Email Reminders**: Background jobs that remind you to follow up on applications.

## 🏗️ Architecture

1. **Frontend**: React (Vite) + Tailwind CSS + Recharts + Framer Motion.
2. **Backend API**: Node.js + Express + Prisma ORM + PostgreSQL.
3. **AI Microservice**: Python FastAPI + Google Gemini AI.

## 🚀 Quick Start (Docker)

1. Clone and enter the directory:
   ```bash
   git clone https://github.com/indurvinay/AI-Job-Application-Tracker.git
   cd job-tracker
   ```
2. Run the stack:
   ```bash
   docker-compose up --build
   ```
3. Open `http://localhost:5173`!

## 🧩 Chrome Extension Setup
1. Go to `chrome://extensions/` in your browser.
2. Enable **Developer Mode**.
3. Click **Load Unpacked** and select the `chrome-extension` folder.
4. *Note: Update the URLs in `popup.js` to match your deployed backend.*

## 👨‍💻 Author
<<<<<<< HEAD
Built by Indur Vinay Kumar

---
*Note: Ensure you do not commit your `.env` files to GitHub.*
=======
Built by [Your Name]
>>>>>>> 5329e70 (Complete AI Job Tracker with Chrome Extension)
