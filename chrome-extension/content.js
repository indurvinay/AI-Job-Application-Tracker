// This script runs on the LinkedIn Job Page
function scrapeJobData() {
  const jobTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText?.trim() || 
                  document.querySelector('h1')?.innerText?.trim() || "";
                  
  const company = document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText?.trim() || 
                  document.querySelector('.jobs-unified-top-card__company-name')?.innerText?.trim() || "";

  return {
    jobTitle,
    company,
    url: window.location.href
  };
}

// Send data to the popup when it opens
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_JOB_DATA") {
    sendResponse(scrapeJobData());
  }
});
