const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all notifications for the logged-in user
const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 20 // Only get the 20 most recent
    });
    res.json(notifications);
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// MARK a single notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Make sure it belongs to this user
    const existing = await prisma.notification.findUnique({ where: { id: parseInt(id) } });
    if (!existing || existing.userId !== req.userId) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const notification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { read: true }
    });

    res.json(notification);
  } catch (error) {
    console.error("Mark Read Error:", error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

// MARK ALL notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { 
        userId: req.userId,
        read: false
      },
      data: { read: true }
    });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error("Mark All Read Error:", error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
};

// HELPER FUNCTION: To be used by other controllers (like AI) to create notifications easily
const createNotification = async (userId, type, message) => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type, // 'INFO', 'SUCCESS', 'WARNING'
        message
      }
    });
  } catch (error) {
    console.error("Failed to create notification silently:", error);
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, createNotification };
