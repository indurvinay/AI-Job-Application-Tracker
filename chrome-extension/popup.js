// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');
  
  // Update these with your deployed URLs
  const RENDER_BACKEND_URL = "https://ai-job-application-tracker-backend.onrender.com/api"; // <-- User must update this!
  const WEB_APP_URL = "https://ai-job-application-tracker-eosin.vercel.app/";

  // 1. Get data from the current LinkedIn tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab.url.includes("linkedin.com/jobs")) {
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: "GET_JOB_DATA" });
      if (response) {
        document.getElementById('jobTitle').value = response.jobTitle;
        document.getElementById('company').value = response.company;
        document.getElementById('jobUrl').value = response.url;
      }
    } catch (err) {
      console.log("Not on a job page or content script not loaded");
    }
  }

  // 2. Handle Save Button Click
  saveBtn.addEventListener('click', async () => {
    const jobData = {
      company: document.getElementById('company').value,
      role: document.getElementById('jobTitle').value,
      source: "LinkedIn",
      status: "APPLIED",
      salary: "N/A",
      jobUrl: document.getElementById('jobUrl').value
    };

    saveBtn.disabled = true;
    saveBtn.innerText = "Saving...";
    statusDiv.innerText = "";

    try {
      // SMART SEARCH: Scan all tabs to find where the user is logged in
      const allTabs = await chrome.tabs.query({});
      let token = null;
      let targetTabId = null;

      for (const t of allTabs) {
        if (t.url && (t.url.includes("vercel.app") || t.url.includes("localhost"))) {
          try {
            const results = await chrome.scripting.executeScript({
              target: { tabId: t.id },
              func: () => localStorage.getItem('token'),
            });
            if (results[0]?.result) {
              token = results[0].result;
              targetTabId = t.id;
              break; 
            }
          } catch (e) { continue; }
        }
      }

      if (!token) {
        throw new Error("Login token not found. Please open your Job Tracker website and Log In first!");
      }

      // Send to Backend
      const res = await fetch(`${RENDER_BACKEND_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      if (res.ok) {
        statusDiv.innerText = "Successfully saved!";
        statusDiv.className = "success";
        setTimeout(() => window.close(), 1500);
      } else {
        throw new Error("Failed to save job. Check if you are logged in.");
      }
    } catch (err) {
      statusDiv.innerText = err.message;
      statusDiv.className = "error";
      saveBtn.disabled = false;
      saveBtn.innerText = "Save to Tracker";
    }
  });
});
