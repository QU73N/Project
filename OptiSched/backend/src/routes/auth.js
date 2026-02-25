import express from 'express';
import { db } from '../config/db.js';
import { faculty, students } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { generateToken, hashPassword, comparePassword } from '../middleware/auth.js';

const router = express.Router();

// Faculty Registration
router.post('/faculty/register', async (req, res) => {
  try {
    const { firstName, lastName, department, password, birthday } = req.body;

    // Check if faculty already exists
    const existingFaculty = await db.select()
      .from(faculty)
      .where(eq(faculty.lastName, lastName))
      .limit(1);

    if (existingFaculty.length > 0) {
      return res.status(400).json({ error: 'Faculty already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new faculty
    const newFaculty = await db.insert(faculty).values({
      firstName,
      lastName,
      department,
      password: hashedPassword,
      birthday: new Date(birthday),
    }).returning();

    // Generate token
    const token = generateToken(newFaculty[0].id, 'faculty');

    res.status(201).json({
      message: 'Faculty registered successfully',
      user: {
        id: newFaculty[0].id,
        firstName: newFaculty[0].firstName,
        lastName: newFaculty[0].lastName,
        department: newFaculty[0].department,
        role: 'faculty'
      },
      token
    });
  } catch (error) {
    console.error('Faculty registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Faculty Login
router.post('/faculty/login', async (req, res) => {
  try {
    const { lastName, password } = req.body;

    // Find faculty by last name
    const facultyUser = await db.select()
      .from(faculty)
      .where(eq(faculty.lastName, lastName))
      .limit(1);

    if (facultyUser.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await comparePassword(password, facultyUser[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(facultyUser[0].id, 'faculty');

    res.json({
      message: 'Login successful',
      user: {
        id: facultyUser[0].id,
        firstName: facultyUser[0].firstName,
        lastName: facultyUser[0].lastName,
        department: facultyUser[0].department,
        role: 'faculty'
      },
      token
    });
  } catch (error) {
    console.error('Faculty login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Student Registration
router.post('/student/register', async (req, res) => {
  try {
    const { firstName, lastName, password, birthday } = req.body;

    // Check if student already exists
    const existingStudent = await db.select()
      .from(students)
      .where(eq(students.lastName, lastName))
      .limit(1);

    if (existingStudent.length > 0) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new student
    const newStudent = await db.insert(students).values({
      firstName,
      lastName,
      password: hashedPassword,
      birthday: new Date(birthday),
    }).returning();

    // Generate token
    const token = generateToken(newStudent[0].id, 'student');

    res.status(201).json({
      message: 'Student registered successfully',
      user: {
        id: newStudent[0].id,
        firstName: newStudent[0].firstName,
        lastName: newStudent[0].lastName,
        role: 'student'
      },
      token
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Student Login
router.post('/student/login', async (req, res) => {
  try {
    const { lastName, password } = req.body;

    // Find student by last name
    const studentUser = await db.select()
      .from(students)
      .where(eq(students.lastName, lastName))
      .limit(1);

    if (studentUser.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await comparePassword(password, studentUser[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(studentUser[0].id, 'student');

    res.json({
      message: 'Login successful',
      user: {
        id: studentUser[0].id,
        firstName: studentUser[0].firstName,
        lastName: studentUser[0].lastName,
        role: 'student'
      },
      token
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
