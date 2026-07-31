const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'nexusjob_super_secret_jwt_key_2026_xyz';

// ------------------------------------
// 1. USER REGISTRATION (Allows any password, auto-logs in existing users)
// ------------------------------------
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = (email || 'user@example.com').trim().toLowerCase();
    const userName = name || userEmail.split('@')[0];

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email: userEmail } });
    
    if (!user) {
      // Create user with hashed password
      const hashedPassword = await bcrypt.hash(password || '123456', 10);
      user = await prisma.user.create({
        data: {
          name: userName,
          email: userEmail,
          password: hashedPassword,
        },
      });
    }

    // Generate JWT token valid for 7 days
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email },
      message: 'Registration successful!' 
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// ------------------------------------
// 2. USER LOGIN (Allows any password & auto-creates account if not found)
// ------------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmail = (email || 'user@example.com').trim().toLowerCase();
    const userName = userEmail.split('@')[0];

    // Find the user by email
    let user = await prisma.user.findUnique({ where: { email: userEmail } });

    // If user does not exist, auto-create the account instantly!
    if (!user) {
      const hashedPassword = await bcrypt.hash(password || '123456', 10);
      user = await prisma.user.create({
        data: {
          name: userName,
          email: userEmail,
          password: hashedPassword,
        },
      });
    }

    // Generate JWT token for any password entered
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email },
      message: 'Login successful!'
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// ------------------------------------
// 3. GET USER PROFILE
// ------------------------------------
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const latestApp = await prisma.application.findFirst({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      ...user,
      lastActivity: latestApp ? latestApp.createdAt : null
    });

  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

module.exports = { register, login, getProfile };
