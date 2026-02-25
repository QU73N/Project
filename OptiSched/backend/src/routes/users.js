import express from 'express';
import { db } from '../config/db.js';
import { faculty, students } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { authenticateToken, hashPassword, comparePassword } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Remove password from response
    const { password, ...userProfile } = user;
    
    res.json({
      user: userProfile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, birthday } = req.body;
    const user = req.user;

    let updatedUser;
    
    if (user.role === 'faculty') {
      updatedUser = await db.update(faculty)
        .set({
          firstName,
          lastName,
          birthday: new Date(birthday),
          updatedAt: new Date()
        })
        .where(eq(faculty.id, user.id))
        .returning();
    } else {
      updatedUser = await db.update(students)
        .set({
          firstName,
          lastName,
          birthday: new Date(birthday),
          updatedAt: new Date()
        })
        .where(eq(students.id, user.id))
        .returning();
    }

    // Remove password from response
    const { password, ...userProfile } = updatedUser[0];
    
    res.json({
      message: 'Profile updated successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    if (user.role === 'faculty') {
      await db.update(faculty)
        .set({
          password: hashedNewPassword,
          updatedAt: new Date()
        })
        .where(eq(faculty.id, user.id));
    } else {
      await db.update(students)
        .set({
          password: hashedNewPassword,
          updatedAt: new Date()
        })
        .where(eq(students.id, user.id));
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all faculty (public endpoint)
router.get('/faculty', async (req, res) => {
  try {
    const allFaculty = await db.select({
      id: faculty.id,
      firstName: faculty.firstName,
      lastName: faculty.lastName,
      department: faculty.department,
      createdAt: faculty.createdAt
    })
    .from(faculty)
    .orderBy(faculty.lastName);

    res.json(allFaculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all students (faculty only)
router.get('/students', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Only faculty can view students' });
    }

    const allStudents = await db.select({
      id: students.id,
      firstName: students.firstName,
      lastName: students.lastName,
      birthday: students.birthday,
      createdAt: students.createdAt
    })
    .from(students)
    .orderBy(students.lastName);

    res.json(allStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
