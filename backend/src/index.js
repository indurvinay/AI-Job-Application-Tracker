const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // <--- NEW
const { startCronJobs } = require('./jobs/reminderCron');


// Load environment variables from our .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware
app.use(cors()); // Allows our React frontend to talk to this backend safely
app.use(express.json()); // Allows our backend to understand JSON data sent in requests

// Import and use routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);  
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes); // <--- NEW

// A simple test route to check if the server is running
app.get('/', (_req, res) => {
  res.send('Job Tracker API is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;

// Start background tasks
startCronJobs();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});