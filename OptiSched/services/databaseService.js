// Database Service for OptiSched
// MySQL connection and query management

import mysql from 'mysql2/promise';

class DatabaseService {
  constructor() {
    this.pool = null;
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'optisched_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
      multipleStatements: true
    };
  }

  // Initialize database connection pool
  async initialize() {
    try {
      this.pool = mysql.createPool(this.config);
      
      // Test connection
      const connection = await this.pool.getConnection();
      console.log('Database connected successfully');
      connection.release();
      
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  // Execute query with error handling
  async query(sql, params = []) {
    if (!this.pool) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    try {
      const [rows, fields] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error(`Query failed: ${error.message}`);
    }
  }

  // Transaction helper
  async transaction(callback) {
    if (!this.pool) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // User authentication methods
  async authenticateUser(username, password) {
    try {
      const sql = `
        SELECT u.*, ur.role_name, ur.permissions 
        FROM users u 
        JOIN user_roles ur ON u.role_id = ur.id 
        WHERE u.username = ? AND u.is_active = 1
      `;
      
      const users = await this.query(sql, [username]);
      
      if (users.length === 0) {
        return { success: false, message: 'User ID not found' };
      }

      const user = users[0];
      
      // In production, use bcrypt.compare(password, user.password_hash)
      // For demo purposes, we'll use a simple comparison
      const bcrypt = require('bcrypt');
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      
      if (!passwordMatch) {
        return { success: false, message: 'Password incorrect' };
      }

      // Update last login
      await this.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id]
      );

      // Remove sensitive data
      delete user.password_hash;
      
      return { 
        success: true, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role_name,
          permissions: user.permissions,
          profilePicture: user.profile_picture
        }
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, message: 'Authentication failed' };
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const sql = `
        SELECT u.id, u.username, u.email, u.first_name, u.last_name, 
               u.profile_picture, ur.role_name, ur.permissions
        FROM users u 
        JOIN user_roles ur ON u.role_id = ur.id 
        WHERE u.id = ? AND u.is_active = 1
      `;
      
      const users = await this.query(sql, [userId]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Get user error:', error);
      throw new Error('Failed to get user');
    }
  }

  // Get student schedule
  async getStudentSchedule(studentId) {
    try {
      const sql = `
        SELECT c.id, c.class_name, s.subject_code, s.subject_name, 
               s.credits, t.first_name as teacher_first, t.last_name as teacher_last,
               c.room, c.schedule
        FROM student_enrollments se
        JOIN classes c ON se.class_id = c.id
        JOIN subjects s ON c.subject_id = s.id
        JOIN teachers tc ON c.teacher_id = tc.id
        JOIN users t ON tc.user_id = t.id
        WHERE se.student_id = ? AND se.status = 'enrolled' AND c.is_active = 1
        ORDER BY s.subject_name
      `;
      
      return await this.query(sql, [studentId]);
    } catch (error) {
      console.error('Get student schedule error:', error);
      throw new Error('Failed to get student schedule');
    }
  }

  // Get teacher schedule
  async getTeacherSchedule(teacherId) {
    try {
      const sql = `
        SELECT c.id, c.class_name, s.subject_code, s.subject_name, 
               s.credits, c.room, c.schedule, c.current_students
        FROM classes c
        JOIN subjects s ON c.subject_id = s.id
        WHERE c.teacher_id = ? AND c.is_active = 1
        ORDER BY s.subject_name
      `;
      
      return await this.query(sql, [teacherId]);
    } catch (error) {
      console.error('Get teacher schedule error:', error);
      throw new Error('Failed to get teacher schedule');
    }
  }

  // Update class schedule (for teachers)
  async updateClassSchedule(classId, teacherId, newSchedule) {
    try {
      // Verify teacher owns this class
      const classCheck = await this.query(
        'SELECT id FROM classes WHERE id = ? AND teacher_id = ? AND is_active = 1',
        [classId, teacherId]
      );
      
      if (classCheck.length === 0) {
        throw new Error('Class not found or access denied');
      }

      const sql = 'UPDATE classes SET schedule = ? WHERE id = ?';
      await this.query(sql, [JSON.stringify(newSchedule), classId]);
      
      return { success: true, message: 'Schedule updated successfully' };
    } catch (error) {
      console.error('Update schedule error:', error);
      throw new Error('Failed to update schedule');
    }
  }

  // Add schedule change (cancel class, etc.)
  async addScheduleChange(classId, teacherId, changeType, reason, newDate = null, newRoom = null) {
    try {
      // Verify teacher owns this class
      const classCheck = await this.query(
        'SELECT id FROM classes WHERE id = ? AND teacher_id = ? AND is_active = 1',
        [classId, teacherId]
      );
      
      if (classCheck.length === 0) {
        throw new Error('Class not found or access denied');
      }

      const sql = `
        INSERT INTO schedule_changes 
        (class_id, teacher_id, change_type, original_date, new_date, new_room, reason)
        VALUES (?, ?, ?, CURDATE(), ?, ?, ?)
      `;
      
      await this.query(sql, [classId, teacherId, changeType, newDate, newRoom, reason]);
      
      return { success: true, message: 'Schedule change added successfully' };
    } catch (error) {
      console.error('Add schedule change error:', error);
      throw new Error('Failed to add schedule change');
    }
  }

  // Get events
  async getEvents(startDate, endDate) {
    try {
      const sql = `
        SELECT e.*, u.first_name, u.last_name
        FROM events e
        JOIN users u ON e.organizer_id = u.id
        WHERE e.is_active = 1 
        AND e.start_date >= ? 
        AND e.end_date <= ?
        ORDER BY e.start_date
      `;
      
      return await this.query(sql, [startDate, endDate]);
    } catch (error) {
      console.error('Get events error:', error);
      throw new Error('Failed to get events');
    }
  }

  // Log system activity
  async logActivity(userId, action, tableName = null, recordId = null, oldValues = null, newValues = null) {
    try {
      const sql = `
        INSERT INTO system_logs 
        (user_id, action, table_name, record_id, old_values, new_values)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      await this.query(sql, [
        userId, 
        action, 
        tableName, 
        recordId, 
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null
      ]);
    } catch (error) {
      console.error('Log activity error:', error);
      // Don't throw error for logging failures
    }
  }

  // Close database connection
  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('Database connection closed');
    }
  }
}

export default new DatabaseService();
