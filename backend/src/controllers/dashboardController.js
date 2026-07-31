const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Ask the database to count applications grouped by their status
    const statusCounts = await prisma.application.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true },
    });

    // 2. Organize the counts into a clean object for our frontend
    const stats = {
      total: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    statusCounts.forEach(item => {
      stats[item.status] = item._count.id;
      stats.total += item._count.id;
    });

    // 3. Prepare data specifically for our Chart (it needs an array of objects)
    const chartData = [
      { name: 'Applied', value: stats.Applied },
      { name: 'Interview', value: stats.Interview },
      { name: 'Offer', value: stats.Offer },
      { name: 'Rejected', value: stats.Rejected },
    ];

    res.json({ stats, chartData });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

module.exports = { getStats };
