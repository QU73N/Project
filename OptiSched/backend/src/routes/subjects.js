import express from 'express';
import { db } from '../config/db.js';
import { subjects, faculty } from '../db/schema.js';
import { eq, like } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const allSubjects = await db.select({
      id: subjects.id,
      name: subjects.name,
      day: subjects.day,
      time: subjects.time,
      color: subjects.color,
      teacher: {
        firstName: faculty.firstName,
        lastName: faculty.lastName,
        department: faculty.department
      }
    })
    .from(subjects)
    .leftJoin(faculty, eq(subjects.teacherId, faculty.id));

    res.json(allSubjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subjects by day
router.get('/day/:day', async (req, res) => {
  try {
    const { day } = req.params;
    
    const daySubjects = await db.select({
      id: subjects.id,
      name: subjects.name,
      day: subjects.day,
      time: subjects.time,
      color: subjects.color,
      teacher: {
        firstName: faculty.firstName,
        lastName: faculty.lastName,
        department: faculty.department
      }
    })
    .from(subjects)
    .leftJoin(faculty, eq(subjects.teacherId, faculty.id))
    .where(like(subjects.day, `%${day}%`));

    res.json(daySubjects);
  } catch (error) {
    console.error('Error fetching subjects by day:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subject by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const subject = await db.select({
      id: subjects.id,
      name: subjects.name,
      day: subjects.day,
      time: subjects.time,
      color: subjects.color,
      teacher: {
        firstName: faculty.firstName,
        lastName: faculty.lastName,
        department: faculty.department
      }
    })
    .from(subjects)
    .leftJoin(faculty, eq(subjects.teacherId, faculty.id))
    .where(eq(subjects.id, parseInt(id)))
    .limit(1);

    if (subject.length === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(subject[0]);
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new subject (faculty only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Only faculty can create subjects' });
    }

    const { name, day, time, color } = req.body;

    const newSubject = await db.insert(subjects).values({
      name,
      teacherId: req.user.id,
      day,
      time,
      color,
    }).returning();

    res.status(201).json({
      message: 'Subject created successfully',
      subject: newSubject[0]
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update subject (faculty only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Only faculty can update subjects' });
    }

    const { id } = req.params;
    const { name, day, time, color } = req.body;

    // Check if subject belongs to this faculty
    const subject = await db.select()
      .from(subjects)
      .where(eq(subjects.id, parseInt(id)))
      .limit(1);

    if (subject.length === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    if (subject[0].teacherId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own subjects' });
    }

    const updatedSubject = await db.update(subjects)
      .set({
        name,
        day,
        time,
        color,
        updatedAt: new Date()
      })
      .where(eq(subjects.id, parseInt(id)))
      .returning();

    res.json({
      message: 'Subject updated successfully',
      subject: updatedSubject[0]
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete subject (faculty only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Only faculty can delete subjects' });
    }

    const { id } = req.params;

    // Check if subject belongs to this faculty
    const subject = await db.select()
      .from(subjects)
      .where(eq(subjects.id, parseInt(id)))
      .limit(1);

    if (subject.length === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    if (subject[0].teacherId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own subjects' });
    }

    await db.delete(subjects).where(eq(subjects.id, parseInt(id)));

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
