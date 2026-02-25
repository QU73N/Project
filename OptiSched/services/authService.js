// Authentication Service for OptiSched
// Handles user login, session management, and authorization

import databaseService from './databaseService';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.sessionTimeout = null;
    this.SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
  }

  // Initialize authentication service
  async initialize() {
    try {
      await databaseService.initialize();
      console.log('Auth service initialized successfully');
      return true;
    } catch (error) {
      console.error('Auth service initialization failed:', error);
      throw error;
    }
  }

  // Login with username and password
  async login(username, password) {
    try {
      // Validate input
      if (!username || !password) {
        return { 
          success: false, 
          message: 'Please enter both username and password' 
        };
      }

      // Authenticate against database
      const authResult = await databaseService.authenticateUser(username, password);
      
      if (!authResult.success) {
        return authResult;
      }

      // Set current user
      this.currentUser = authResult.user;
      this.isAuthenticated = true;

      // Start session timeout
      this.startSessionTimeout();

      // Log login activity
      await databaseService.logActivity(
        this.currentUser.id,
        'USER_LOGIN',
        'users',
        this.currentUser.id
      );

      return {
        success: true,
        user: this.currentUser,
        message: 'Login successful'
      };

    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Login failed. Please try again.' 
      };
    }
  }

  // Logout current user
  async logout() {
    try {
      if (this.currentUser && this.isAuthenticated) {
        // Log logout activity
        await databaseService.logActivity(
          this.currentUser.id,
          'USER_LOGOUT',
          'users',
          this.currentUser.id
        );
      }

      // Clear session
      this.clearSession();

      return { success: true, message: 'Logged out successfully' };

    } catch (error) {
      console.error('Logout error:', error);
      // Still clear session even if logging fails
      this.clearSession();
      return { success: true, message: 'Logged out successfully' };
    }
  }

  // Check if user is authenticated
  isLoggedIn() {
    return this.isAuthenticated && this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check user permissions
  hasPermission(permission) {
    if (!this.currentUser || !this.currentUser.permissions) {
      return false;
    }

    return this.currentUser.permissions[permission] === true;
  }

  // Check if user has specific role
  hasRole(role) {
    if (!this.currentUser) {
      return false;
    }

    return this.currentUser.role === role;
  }

  // Get user role-based dashboard route
  getDashboardRoute() {
    if (!this.currentUser) {
      return '/login';
    }

    const roleRoutes = {
      'student': '/(dashboard)/schedule',
      'teacher': '/(dashboard)/schedule',
      'principal': '/(dashboard)/schedule',
      'it_manager': '/(dashboard)/schedule',
      'event_handler': '/(dashboard)/schedule'
    };

    return roleRoutes[this.currentUser.role] || '/(dashboard)/schedule';
  }

  // Refresh user session
  async refreshSession() {
    try {
      if (!this.currentUser) {
        return { success: false, message: 'No active session' };
      }

      // Get updated user data
      const updatedUser = await databaseService.getUserById(this.currentUser.id);
      
      if (!updatedUser) {
        this.clearSession();
        return { success: false, message: 'User not found' };
      }

      this.currentUser = updatedUser;
      this.startSessionTimeout();

      return { 
        success: true, 
        user: this.currentUser,
        message: 'Session refreshed successfully' 
      };

    } catch (error) {
      console.error('Session refresh error:', error);
      return { success: false, message: 'Failed to refresh session' };
    }
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      if (!this.currentUser) {
        return { success: false, message: 'Not authenticated' };
      }

      // Check if user can edit profile
      if (!this.hasPermission('can_edit_profile')) {
        return { success: false, message: 'Permission denied' };
      }

      // Validate updates
      const allowedFields = ['first_name', 'last_name', 'email', 'profile_picture'];
      const validUpdates = {};
      
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          validUpdates[field] = updates[field];
        }
      }

      if (Object.keys(validUpdates).length === 0) {
        return { success: false, message: 'No valid fields to update' };
      }

      // Update in database
      const setClause = Object.keys(validUpdates).map(field => `${field} = ?`).join(', ');
      const values = Object.values(validUpdates);
      
      await databaseService.query(
        `UPDATE users SET ${setClause} WHERE id = ?`,
        [...values, this.currentUser.id]
      );

      // Log activity
      await databaseService.logActivity(
        this.currentUser.id,
        'PROFILE_UPDATE',
        'users',
        this.currentUser.id,
        null,
        validUpdates
      );

      // Refresh current user data
      const refreshResult = await this.refreshSession();
      
      return { 
        success: true, 
        user: refreshResult.user,
        message: 'Profile updated successfully' 
      };

    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  }

  // Get student schedule (for students)
  async getStudentSchedule() {
    try {
      if (!this.currentUser || this.currentUser.role !== 'student') {
        return { success: false, message: 'Access denied' };
      }

      if (!this.hasPermission('can_view_schedule')) {
        return { success: false, message: 'Permission denied' };
      }

      // Get student record first
      const studentRecords = await databaseService.query(
        'SELECT id FROM students WHERE user_id = ?',
        [this.currentUser.id]
      );

      if (studentRecords.length === 0) {
        return { success: false, message: 'Student record not found' };
      }

      const studentId = studentRecords[0].id;
      const schedule = await databaseService.getStudentSchedule(studentId);

      return { 
        success: true, 
        schedule: schedule,
        message: 'Schedule retrieved successfully' 
      };

    } catch (error) {
      console.error('Get student schedule error:', error);
      return { success: false, message: 'Failed to get schedule' };
    }
  }

  // Get teacher schedule (for teachers)
  async getTeacherSchedule() {
    try {
      if (!this.currentUser || this.currentUser.role !== 'teacher') {
        return { success: false, message: 'Access denied' };
      }

      if (!this.hasPermission('can_view_schedule')) {
        return { success: false, message: 'Permission denied' };
      }

      // Get teacher record first
      const teacherRecords = await databaseService.query(
        'SELECT id FROM teachers WHERE user_id = ?',
        [this.currentUser.id]
      );

      if (teacherRecords.length === 0) {
        return { success: false, message: 'Teacher record not found' };
      }

      const teacherId = teacherRecords[0].id;
      const schedule = await databaseService.getTeacherSchedule(teacherId);

      return { 
        success: true, 
        schedule: schedule,
        message: 'Schedule retrieved successfully' 
      };

    } catch (error) {
      console.error('Get teacher schedule error:', error);
      return { success: false, message: 'Failed to get schedule' };
    }
  }

  // Update class schedule (for teachers)
  async updateClassSchedule(classId, newSchedule) {
    try {
      if (!this.currentUser || this.currentUser.role !== 'teacher') {
        return { success: false, message: 'Access denied' };
      }

      if (!this.hasPermission('can_edit_schedule')) {
        return { success: false, message: 'Permission denied' };
      }

      // Get teacher record first
      const teacherRecords = await databaseService.query(
        'SELECT id FROM teachers WHERE user_id = ?',
        [this.currentUser.id]
      );

      if (teacherRecords.length === 0) {
        return { success: false, message: 'Teacher record not found' };
      }

      const teacherId = teacherRecords[0].id;
      const result = await databaseService.updateClassSchedule(classId, teacherId, newSchedule);

      // Log activity
      await databaseService.logActivity(
        this.currentUser.id,
        'SCHEDULE_UPDATE',
        'classes',
        classId,
        null,
        { schedule: newSchedule }
      );

      return result;

    } catch (error) {
      console.error('Update schedule error:', error);
      return { success: false, message: 'Failed to update schedule' };
    }
  }

  // Add schedule change (cancel class, etc.)
  async addScheduleChange(classId, changeType, reason, newDate = null, newRoom = null) {
    try {
      if (!this.currentUser || this.currentUser.role !== 'teacher') {
        return { success: false, message: 'Access denied' };
      }

      if (!this.hasPermission('can_edit_schedule')) {
        return { success: false, message: 'Permission denied' };
      }

      // Get teacher record first
      const teacherRecords = await databaseService.query(
        'SELECT id FROM teachers WHERE user_id = ?',
        [this.currentUser.id]
      );

      if (teacherRecords.length === 0) {
        return { success: false, message: 'Teacher record not found' };
      }

      const teacherId = teacherRecords[0].id;
      const result = await databaseService.addScheduleChange(
        classId, 
        teacherId, 
        changeType, 
        reason, 
        newDate, 
        newRoom
      );

      // Log activity
      await databaseService.logActivity(
        this.currentUser.id,
        'SCHEDULE_CHANGE',
        'schedule_changes',
        classId,
        null,
        { changeType, reason, newDate, newRoom }
      );

      return result;

    } catch (error) {
      console.error('Add schedule change error:', error);
      return { success: false, message: 'Failed to add schedule change' };
    }
  }

  // Get events
  async getEvents(startDate, endDate) {
    try {
      if (!this.currentUser) {
        return { success: false, message: 'Not authenticated' };
      }

      if (!this.hasPermission('can_view_schedule')) {
        return { success: false, message: 'Permission denied' };
      }

      const events = await databaseService.getEvents(startDate, endDate);

      return { 
        success: true, 
        events: events,
        message: 'Events retrieved successfully' 
      };

    } catch (error) {
      console.error('Get events error:', error);
      return { success: false, message: 'Failed to get events' };
    }
  }

  // Start session timeout
  startSessionTimeout() {
    this.clearSessionTimeout();
    this.sessionTimeout = setTimeout(() => {
      console.log('Session expired, logging out...');
      this.logout();
    }, this.SESSION_DURATION);
  }

  // Clear session timeout
  clearSessionTimeout() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  // Clear session data
  clearSession() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.clearSessionTimeout();
  }

  // Cleanup method
  async cleanup() {
    this.clearSession();
    await databaseService.close();
  }
}

export default new AuthService();
