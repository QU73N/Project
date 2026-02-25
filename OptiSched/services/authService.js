// React Native Compatible Authentication Service for OptiSched
// Uses mock data for all functionality

import * as SecureStore from 'expo-secure-store';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.sessionTimeout = null;
    this.SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
    
    // Mock user data matching the database schema
    this.mockUsers = [
      {
        id: 1,
        username: 'morgado',
        email: 'morgado@school.edu',
        password: 'password123',
        firstName: 'Ace A.',
        lastName: 'Morgado',
        role: 'student',
        permissions: {
          can_view_schedule: true,
          can_edit_schedule: false,
          can_view_profile: true,
          can_edit_profile: true,
          can_manage_users: false,
          can_manage_events: false,
          can_manage_system: false
        },
        profilePicture: null,
        // Personal Information (read-only except profile picture)
        dateOfBirth: 'June 8, 2008',
        address: 'MGL Village, Viente Reales, Valenzuela City',
        // Academic Information
        studentId: '02000399541',
        gradeLevel: 12,
        section: 'A',
        strand: 'Mobile App & Web Development',
        department: 'Science and Technology',
        enrollmentDate: '2022-06-15',
        gpa: '89.5',
        // Contact Information (editable)
        phoneNumber: '+63 912 345 6789',
        emergencyContact: 'Maria Morgado (Mother) +63 913 456 7890',
        // Schedule
        subjects: [
          'Physical Education and Health 4',
          'Computer/Web Programming 6',
          'Mobile App Programming 2',
          'Contemporary Arts from the regions',
          'Homeroom',
          'Work Immersion-Practicum Type',
          'Inquiries Investigation and Immersion',
          'Empowerment Technologies: ICT',
          'Entrepreneurship'
        ]
      },
      {
        id: 2,
        username: 'habanajr',
        email: 'habanajr@school.edu',
        password: 'password123',
        firstName: 'EDGAR P.',
        lastName: 'HABANA Jr',
        role: 'teacher',
        permissions: {
          can_view_schedule: true,
          can_edit_schedule: true,
          can_view_profile: true,
          can_edit_profile: true,
          can_manage_users: false,
          can_manage_events: false,
          can_manage_system: false
        },
        profilePicture: null,
        // Personal Information (read-only except profile picture)
        dateOfBirth: 'March 15, 1985',
        address: '123 Teacher Street, Quezon City',
        // Academic Information
        employeeId: 'TCH001',
        department: 'Physical Education',
        specialization: 'Physical Education and Health',
        hireDate: '2010-06-01',
        subjectsHandled: [
          'Physical Education and Health 4',
          'Contemporary Arts from the regions',
          'Homeroom'
        ],
        roomAssignment: 'Gym & Room 101-102',
        // Contact Information (editable)
        phoneNumber: '+63 912 234 5678',
        emergencyContact: 'Elena Habana (Spouse) +63 913 234 5679',
        // Schedule
        schedule: {
          monday: ['7:00 AM - 9:00 AM', '10:00 AM - 1:00 PM', '2:00 PM - 4:00 PM'],
          tuesday: ['10:00 AM - 1:00 PM', '2:00 PM - 4:00 PM']
        }
      },
      {
        id: 3,
        username: 'calizon',
        email: 'calizon@school.edu',
        password: 'password123',
        firstName: 'John Michael',
        lastName: 'Calizon',
        role: 'teacher',
        permissions: {
          can_view_schedule: true,
          can_edit_schedule: true,
          can_view_profile: true,
          can_edit_profile: true,
          can_manage_users: false,
          can_manage_events: false,
          can_manage_system: false
        },
        profilePicture: null,
        // Personal Information (read-only except profile picture)
        dateOfBirth: 'July 22, 1988',
        address: '456 Tech Avenue, Makati City',
        // Academic Information
        employeeId: 'TCH002',
        department: 'Science and Technology',
        specialization: 'Computer Programming & Web Development',
        hireDate: '2015-08-15',
        subjectsHandled: [
          'Computer/Web Programming 6 - Computer Programming NC III (.NET Technology)',
          'Empowerment Technologies: ICT'
        ],
        roomAssignment: 'Lab 1',
        // Contact Information (editable)
        phoneNumber: '+63 912 345 6780',
        emergencyContact: 'Anna Calizon (Spouse) +63 913 345 6781',
        // Schedule
        schedule: {
          monday: ['10:00 AM - 1:00 PM'],
          thursday: ['10:00 AM - 1:00 PM']
        }
      },
      {
        id: 4,
        username: 'mariano',
        email: 'mariano@school.edu',
        password: 'password123',
        firstName: 'Psalmmirac Le Pineda',
        lastName: 'MARIANO',
        role: 'teacher',
        permissions: {
          can_view_schedule: true,
          can_edit_schedule: true,
          can_view_profile: true,
          can_edit_profile: true,
          can_manage_users: false,
          can_manage_events: false,
          can_manage_system: false
        },
        profilePicture: null,
        // Personal Information (read-only except profile picture)
        dateOfBirth: 'September 10, 1990',
        address: '789 Mobile Street, Pasig City',
        // Academic Information
        employeeId: 'TCH003',
        department: 'Science and Technology',
        specialization: 'Mobile App Development',
        hireDate: '2018-03-01',
        subjectsHandled: [
          'Mobile App Programming 2'
        ],
        roomAssignment: 'Lab 2',
        // Contact Information (editable)
        phoneNumber: '+63 912 456 7890',
        emergencyContact: 'Roberto Mariano (Father) +63 913 456 7891',
        // Schedule
        schedule: {
          monday: ['1:00 PM - 4:00 PM']
        }
      },
      {
        id: 5,
        username: 'ellojr',
        email: 'ellojr@school.edu',
        password: 'password123',
        firstName: 'EGNACIO Y',
        lastName: 'ELLO Jr.',
        role: 'teacher',
        permissions: {
          can_view_schedule: true,
          can_edit_schedule: true,
          can_view_profile: true,
          can_edit_profile: true,
          can_manage_users: false,
          can_manage_events: false,
          can_manage_system: false
        },
        profilePicture: null,
        // Personal Information (read-only except profile picture)
        dateOfBirth: 'December 5, 1982',
        address: '321 Work Street, Caloocan City',
        // Academic Information
        employeeId: 'TCH004',
        department: 'Academic Affairs',
        specialization: 'Work Immersion Program',
        hireDate: '2012-01-10',
        subjectsHandled: [
          'Work Immersion-Practicum Type'
        ],
        roomAssignment: 'Room 103',
        // Contact Information (editable)
        phoneNumber: '+63 912 567 8901',
        emergencyContact: 'Luisa Ello (Mother) +63 913 567 8902',
        // Schedule
        schedule: {
          tuesday: ['2:00 PM - 4:00 PM']
        }
      },
      {
        id: 6,
        username: 'magno',
        email: 'magno@school.edu',
        password: 'password123',
        firstName: 'BEA ANGLY',
        lastName: 'MAGNO',
        role: 'teacher',
        permissions: {
          can_view_schedule: true,
          can_edit_schedule: true,
          can_view_profile: true,
          can_edit_profile: true,
          can_manage_users: false,
          can_manage_events: false,
          can_manage_system: false
        },
        profilePicture: null,
        // Personal Information (read-only except profile picture)
        dateOfBirth: 'February 18, 1987',
        address: '654 Research Road, Mandaluyong City',
        // Academic Information
        employeeId: 'TCH005',
        department: 'Science and Technology',
        specialization: 'Research and Investigation',
        hireDate: '2016-07-20',
        subjectsHandled: [
          'Inquiries Investigation and Immersion'
        ],
        roomAssignment: 'Lab 3',
        // Contact Information (editable)
        phoneNumber: '+63 912 678 9012',
        emergencyContact: 'Antonio Magno (Father) +63 913 678 9013',
        // Schedule
        schedule: {
          tuesday: ['8:30 AM - 10:00 AM'],
          thursday: ['8:30 AM - 10:00 AM']
        }
      },
      {
        id: 7,
        username: 'arnado',
        email: 'arnado@school.edu',
        password: 'password123',
        firstName: 'RENEIL P.',
        lastName: 'ARNADO',
        role: 'teacher',
        permissions: {
          can_view_schedule: true,
          can_edit_schedule: true,
          can_view_profile: true,
          can_edit_profile: true,
          can_manage_users: false,
          can_manage_events: false,
          can_manage_system: false
        },
        profilePicture: null,
        // Personal Information (read-only except profile picture)
        dateOfBirth: 'April 30, 1986',
        address: '987 Business Blvd, Pasay City',
        // Academic Information
        employeeId: 'TCH006',
        department: 'Academic Affairs',
        specialization: 'Entrepreneurship and Business',
        hireDate: '2014-09-15',
        subjectsHandled: [
          'Entrepreneurship'
        ],
        roomAssignment: 'Room 104',
        // Contact Information (editable)
        phoneNumber: '+63 912 789 0123',
        emergencyContact: 'Carmen Arnado (Spouse) +63 913 789 0124',
        // Schedule
        schedule: {
          thursday: ['2:30 PM - 5:20 PM']
        }
      },
      {
        id: 8,
        username: 'principal001',
        email: 'principal@school.edu',
        password: 'password123',
        firstName: 'Robert',
        lastName: 'Johnson',
        role: 'principal',
        permissions: {
          can_view_schedule: true,
          can_edit_schedule: true,
          can_view_profile: true,
          can_edit_profile: true,
          can_manage_users: true,
          can_manage_events: true,
          can_manage_system: false
        },
        profilePicture: null,
        // Personal Information (read-only except profile picture)
        dateOfBirth: 'May 15, 1975',
        address: '1 Administration Avenue, Quezon City',
        // Academic Information
        employeeId: 'PRN001',
        department: 'Academic Affairs',
        specialization: 'School Administration',
        hireDate: '2010-01-01',
        subjectsHandled: ['School Management', 'Academic Oversight'],
        roomAssignment: 'Principal Office',
        // Contact Information (editable)
        phoneNumber: '+63 912 890 1234',
        emergencyContact: 'Sarah Johnson (Spouse) +63 913 890 1235'
      },
      {
        id: 9,
        username: 'itmanager001',
        email: 'itmanager@school.edu',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Wilson',
        role: 'it_manager',
        permissions: {
          can_view_schedule: true,
          can_edit_schedule: true,
          can_view_profile: true,
          can_edit_profile: true,
          can_manage_users: true,
          can_manage_events: true,
          can_manage_system: true
        },
        profilePicture: null,
        // Personal Information (read-only except profile picture)
        dateOfBirth: 'August 22, 1980',
        address: 'IT Department, Main Campus',
        // Academic Information
        employeeId: 'ITM001',
        department: 'Science and Technology',
        specialization: 'IT Management and System Administration',
        hireDate: '2013-06-01',
        subjectsHandled: ['System Administration', 'Network Management'],
        roomAssignment: 'IT Office',
        // Contact Information (editable)
        phoneNumber: '+63 912 901 2345',
        emergencyContact: 'Lisa Wilson (Spouse) +63 913 901 2346'
      },
      {
        id: 10,
        username: 'event001',
        email: 'events@school.edu',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Brown',
        role: 'event_handler',
        permissions: {
          can_view_schedule: true,
          can_edit_schedule: false,
          can_view_profile: true,
          can_edit_profile: true,
          can_manage_users: false,
          can_manage_events: true,
          can_manage_system: false
        },
        profilePicture: null,
        // Personal Information (read-only except profile picture)
        dateOfBirth: 'November 8, 1984',
        address: 'Events Office, Main Campus',
        // Academic Information
        employeeId: 'EVT001',
        department: 'Academic Affairs',
        specialization: 'Event Management and Coordination',
        hireDate: '2017-02-15',
        subjectsHandled: ['Event Planning', 'School Activities'],
        roomAssignment: 'Events Office',
        // Contact Information (editable)
        phoneNumber: '+63 912 012 3456',
        emergencyContact: 'James Brown (Spouse) +63 913 012 3457'
      }
    ];
  }

  // Initialize authentication service
  async initialize() {
    try {
      // Check for stored session
      const storedUser = await SecureStore.getItemAsync('currentUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        this.currentUser = userData;
        this.isAuthenticated = true;
        
        // Update mock data with stored password to ensure consistency
        const userIndex = this.mockUsers.findIndex(u => u.id === userData.id);
        if (userIndex !== -1 && userData.password) {
          this.mockUsers[userIndex].password = userData.password;
        }
        
        this.startSessionTimeout();
      }
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

      // Find user in mock data
      const user = this.mockUsers.find(u => u.username === username);
      
      if (!user) {
        return { success: false, message: 'User ID not found' };
      }

      // Check password
      if (user.password !== password) {
        return { success: false, message: 'Password incorrect' };
      }

      // Set current user with complete profile data
      this.currentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions: user.permissions,
        profilePicture: user.profilePicture,
        // Personal Information
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        // Academic Information
        studentId: user.studentId,
        employeeId: user.employeeId,
        gradeLevel: user.gradeLevel,
        section: user.section,
        strand: user.strand,
        department: user.department,
        specialization: user.specialization,
        hireDate: user.hireDate,
        enrollmentDate: user.enrollmentDate,
        gpa: user.gpa,
        subjectsHandled: user.subjectsHandled,
        subjects: user.subjects,
        roomAssignment: user.roomAssignment,
        // Contact Information
        phoneNumber: user.phoneNumber,
        emergencyContact: user.emergencyContact,
        // Schedule
        schedule: user.schedule
      };
      
      this.isAuthenticated = true;

      // Store session securely (include password for persistence)
      const sessionData = {
        ...this.currentUser,
        password: user.password // Include password for re-authentication
      };
      await SecureStore.setItemAsync('currentUser', JSON.stringify(sessionData));

      // Start session timeout
      this.startSessionTimeout();

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
      // Clear stored session
      await SecureStore.deleteItemAsync('currentUser');
      
      // Clear session
      this.clearSession();

      return { success: true, message: 'Logged out successfully' };

    } catch (error) {
      console.error('Logout error:', error);
      // Still clear session even if storage fails
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
      const updatedUser = this.mockUsers.find(u => u.id === this.currentUser.id);
      
      if (!updatedUser) {
        this.clearSession();
        return { success: false, message: 'User not found' };
      }

      this.currentUser = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        permissions: updatedUser.permissions,
        profilePicture: updatedUser.profilePicture,
        // Personal Information
        dateOfBirth: updatedUser.dateOfBirth,
        address: updatedUser.address,
        // Academic Information
        studentId: updatedUser.studentId,
        employeeId: updatedUser.employeeId,
        gradeLevel: updatedUser.gradeLevel,
        section: updatedUser.section,
        strand: updatedUser.strand,
        department: updatedUser.department,
        specialization: updatedUser.specialization,
        hireDate: updatedUser.hireDate,
        enrollmentDate: updatedUser.enrollmentDate,
        gpa: updatedUser.gpa,
        subjectsHandled: updatedUser.subjectsHandled,
        subjects: updatedUser.subjects,
        roomAssignment: updatedUser.roomAssignment,
        // Contact Information
        phoneNumber: updatedUser.phoneNumber,
        emergencyContact: updatedUser.emergencyContact,
        // Schedule
        schedule: updatedUser.schedule,
        // Password (needed for session persistence)
        password: updatedUser.password
      };
      
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

  // Update user profile (mock implementation)
  async updateProfile(updates) {
    try {
      if (!this.currentUser) {
        return { success: false, message: 'Not authenticated' };
      }

      if (!this.hasPermission('can_edit_profile')) {
        return { success: false, message: 'Permission denied' };
      }

      // Define editable fields based on user role
      const editableFields = this.getEditableFields();
      const validUpdates = {};
      
      // Handle password change separately
      if (updates.currentPassword && updates.newPassword) {
        const passwordResult = await this.changePassword(updates.currentPassword, updates.newPassword, updates.confirmPassword);
        if (!passwordResult.success) {
          return passwordResult;
        }
      }
      
      // Validate and filter updates for other fields
      for (const field of editableFields) {
        if (updates[field] !== undefined) {
          // Additional validation for specific fields
          if (field === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updates[field])) {
              return { success: false, message: 'Invalid email format' };
            }
          }
          if (field === 'phoneNumber') {
            const phoneRegex = /^\+63 \d{3} \d{3} \d{4}$/;
            if (!phoneRegex.test(updates[field])) {
              return { success: false, message: 'Invalid phone format. Use: +63 XXX XXX XXXX' };
            }
          }
          validUpdates[field] = updates[field];
        }
      }

      // Check for read-only fields
      const readOnlyFields = this.getReadOnlyFields();
      for (const field of readOnlyFields) {
        if (updates[field] !== undefined) {
          return { success: false, message: `Cannot edit ${field}. This field is read-only.` };
        }
      }

      if (Object.keys(validUpdates).length === 0) {
        return { success: false, message: 'No valid fields to update' };
      }

      // Update in mock data
      const userIndex = this.mockUsers.findIndex(u => u.id === this.currentUser.id);
      if (userIndex !== -1) {
        this.mockUsers[userIndex] = { ...this.mockUsers[userIndex], ...validUpdates };
      }

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

  // Change password function - uses mock data only
  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      // Validate current password against mock data
      const user = this.mockUsers.find(u => u.id === this.currentUser.id);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      if (user.password !== currentPassword) {
        return { success: false, message: 'Current password is incorrect' };
      }

      // Validate new password
      if (!newPassword || newPassword.length < 8) {
        return { success: false, message: 'New password must be at least 8 characters long' };
      }

      // Check password confirmation
      if (newPassword !== confirmPassword) {
        return { success: false, message: 'New passwords do not match' };
      }

      // Check if new password is different from current password
      if (newPassword === currentPassword) {
        return { success: false, message: 'New password must be different from current password' };
      }

      // Update password in mock data for session consistency
      const userIndex = this.mockUsers.findIndex(u => u.id === this.currentUser.id);
      if (userIndex !== -1) {
        this.mockUsers[userIndex].password = newPassword;
      }

      // Update current session password
      this.currentUser.password = newPassword;
      
      // Store updated session
      const sessionData = {
        ...this.currentUser,
        password: newPassword
      };
      await SecureStore.setItemAsync('currentUser', JSON.stringify(sessionData));

      // Log password change for security
      console.log(`Password changed for user: ${this.currentUser.username} (Updated in mock data)`);

      return { success: true, message: 'Password changed successfully' };

    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Failed to change password' };
    }
  }

  // Get editable fields based on user role
  getEditableFields() {
    const baseEditableFields = ['email', 'phoneNumber', 'emergencyContact', 'profilePicture'];
    
    if (this.currentUser.role === 'student') {
      return [...baseEditableFields];
    } else if (['teacher', 'principal', 'it_manager', 'event_handler'].includes(this.currentUser.role)) {
      return [...baseEditableFields];
    }
    
    return baseEditableFields;
  }

  // Get read-only fields (cannot be edited)
  getReadOnlyFields() {
    const baseReadOnlyFields = ['id', 'username', 'firstName', 'lastName', 'dateOfBirth'];
    
    if (this.currentUser.role === 'student') {
      return [...baseReadOnlyFields, 'studentId', 'gradeLevel', 'section', 'strand', 'department', 'enrollmentDate'];
    } else if (['teacher', 'principal', 'it_manager', 'event_handler'].includes(this.currentUser.role)) {
      return [...baseReadOnlyFields, 'employeeId', 'department', 'specialization', 'hireDate', 'subjectsHandled'];
    }
    
    return baseReadOnlyFields;
  }

  // Get complete user profile for display
  getUserProfile() {
    if (!this.currentUser) {
      return null;
    }

    return {
      // Personal Information
      name: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      dateOfBirth: this.currentUser.dateOfBirth,
      address: this.currentUser.address,
      profilePicture: this.currentUser.profilePicture,
      
      // Contact Information
      email: this.currentUser.email,
      phoneNumber: this.currentUser.phoneNumber,
      emergencyContact: this.currentUser.emergencyContact,
      
      // Academic Information (role-specific)
      ...(this.currentUser.role === 'student' ? {
        studentId: this.currentUser.studentId,
        gradeLevel: this.currentUser.gradeLevel,
        section: this.currentUser.section,
        strand: this.currentUser.strand,
        department: this.currentUser.department,
        enrollmentDate: this.currentUser.enrollmentDate,
        gpa: this.currentUser.gpa,
        subjects: this.currentUser.subjects
      } : {}),
      
      ...(this.currentUser.role !== 'student' ? {
        employeeId: this.currentUser.employeeId,
        department: this.currentUser.department,
        specialization: this.currentUser.specialization,
        hireDate: this.currentUser.hireDate,
        subjectsHandled: this.currentUser.subjectsHandled,
        roomAssignment: this.currentUser.roomAssignment,
        schedule: this.currentUser.schedule
      } : {}),
      
      // System Information
      role: this.currentUser.role,
      permissions: this.currentUser.permissions
    };
  }

  // Get student schedule (mock data)
  async getStudentSchedule() {
    try {
      if (!this.currentUser || this.currentUser.role !== 'student') {
        return { success: false, message: 'Access denied' };
      }

      if (!this.hasPermission('can_view_schedule')) {
        return { success: false, message: 'Permission denied' };
      }

      // Mock schedule data matching the dashboard
      const schedule = [
        {
          id: 1,
          subjectName: "Physical Education and Health 4",
          teacherName: "HABANA Jr, EDGAR P.",
          day: "Monday",
          time: "7:00 AM - 9:00 AM",
          room: "Gym",
          color: "#10b981"
        },
        {
          id: 2,
          subjectName: "Computer/Web Programming 6 - Computer Programming NC III (.NET Technology)",
          teacherName: "Calizon, John Michael",
          day: "Monday",
          time: "10:00 AM - 1:00 PM",
          room: "Lab 1",
          color: "#3b82f6"
        },
        {
          id: 3,
          subjectName: "Mobile App Programming 2",
          teacherName: "MARIANO, Psalmmirac Le Pineda",
          day: "Monday",
          time: "1:00 PM - 4:00 PM",
          room: "Lab 2",
          color: "#8b5cf6"
        },
        {
          id: 4,
          subjectName: "Contemporary Arts from the regions",
          teacherName: "HABANA Jr., Edgar P.",
          day: "Tuesday",
          time: "10:00 AM - 1:00 PM",
          room: "Room 101",
          color: "#ec4899"
        },
        {
          id: 5,
          subjectName: "Homeroom",
          teacherName: "HABANA Jr., Edgar P.",
          day: "Tuesday",
          time: "2:00 PM - 4:00 PM",
          room: "Room 102",
          color: "#f59e0b"
        },
        {
          id: 6,
          subjectName: "Work Immersion-Practicum Type",
          teacherName: "ELLO Jr., EGNACIO Y",
          day: "Tuesday",
          time: "2:00 PM - 4:00 PM",
          room: "Room 103",
          color: "#ef4444"
        },
        {
          id: 7,
          subjectName: "Inquiries Investigation and Immersion",
          teacherName: "MAGNO, BEA ANGLY",
          day: "Tuesday & Thursday",
          time: "8:30 AM - 10:00 AM",
          room: "Lab 3",
          color: "#06b6d4"
        },
        {
          id: 8,
          subjectName: "Empowerment Technologies: ICT",
          teacherName: "Calizon, John Michael",
          day: "Thursday",
          time: "10:00 AM - 1:00 PM",
          room: "Lab 1",
          color: "#3b82f6"
        },
        {
          id: 9,
          subjectName: "Entrepreneurship",
          teacherName: "ARNADO, RENEIL P.",
          day: "Thursday",
          time: "2:30 PM - 5:20 PM",
          room: "Room 104",
          color: "#84cc16"
        }
      ];

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
  }
}

export default new AuthService();
