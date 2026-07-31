const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to ensure a valid user exists in DB before creating applications
const ensureUserExists = async (userId) => {
  const targetId = userId || 1;
  let user = await prisma.user.findUnique({ where: { id: targetId } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: targetId,
        name: 'Applicant',
        email: 'vinay20developer@gmail.com',
        password: '$2b$10$ZIFfMDTHIE41gKmtSlMZYuG0qcC/DK88Owg35aVK.V39DIA1UAQ6q'
      }
    });
  }
  return user.id;
};

// 1. CREATE an application
const createApplication = async (req, res) => {
  try {
    const { company, role, status, salary, notes, jobDescription, applicationLink, aiScore, aiAnalysis } = req.body;
    
    if (!company || !role) {
      return res.status(400).json({ error: 'Company and Role are required.' });
    }

    const userId = await ensureUserExists(req.userId);

    const application = await prisma.application.create({
      data: {
        company,
        role,
        status: status || 'Applied',
        salary: salary || null,
        notes: notes || null,
        jobDescription: jobDescription || null,
        applicationLink: applicationLink || null,
        aiScore: aiScore ? parseInt(aiScore) : null,
        aiAnalysis: aiAnalysis ? (typeof aiAnalysis === 'string' ? aiAnalysis : JSON.stringify(aiAnalysis)) : null,
        userId: userId
      }
    });
    
    res.status(201).json(application);
  } catch (error) {
    console.error("Create Application Error:", error);
    res.status(500).json({ error: error.message || 'Failed to create application' });
  }
};

// 2. GET ALL applications for the logged-in user
const getApplications = async (req, res) => {
  try {
    const userId = await ensureUserExists(req.userId);
    const applications = await prisma.application.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(applications);
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// 3. GET A SINGLE application
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await ensureUserExists(req.userId);

    const application = await prisma.application.findUnique({
      where: { id: parseInt(id) }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error("Get Application By ID Error:", error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};

// 4. UPDATE an entire application
const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; 

    const existing = await prisma.application.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = await prisma.application.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(application);
  } catch (error) {
    console.error("Update Application Error:", error);
    res.status(500).json({ error: 'Failed to update application' });
  }
};

// 5. UPDATE ONLY STATUS
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await prisma.application.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = await prisma.application.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json(application);
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// 6. DELETE an application
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.application.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await prisma.application.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error("Delete Application Error:", error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  deleteApplication
};
