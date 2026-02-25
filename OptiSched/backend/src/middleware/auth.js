import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { faculty, students } from '../db/schema.js';
import { ENV } from '../config/env.js';

const JWT_SECRET = ENV.JWT_SECRET;

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user is faculty
    let user = await db.select().from(faculty).where(eq(faculty.id, decoded.userId)).limit(1);
    
    if (user.length > 0) {
      req.user = { ...user[0], role: 'faculty' };
      next();
      return;
    }
    
    // Check if user is student
    user = await db.select().from(students).where(eq(students.id, decoded.userId)).limit(1);
    
    if (user.length > 0) {
      req.user = { ...user[0], role: 'student' };
      next();
      return;
    }
    
    // If no user found in either table
    return res.status(401).json({ error: 'Invalid token - user not found' });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, ENV.JWT_SECRET, { expiresIn: '24h' });
};

export const hashPassword = async (password) => {
  const bcrypt = await import('bcrypt');
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  const bcrypt = await import('bcrypt');
  return bcrypt.compare(password, hashedPassword);
};
