import { createContext, useState, useEffect, useContext } from 'react';

// Mock user data
const MOCK_USERS = [
  {
    id: 'mock_user_1',
    email: 'testaccount123',
    password: '123123',
    firstName: 'Test',
    lastName: 'Account',
    role: 'student',
    profileImage: null,
    permissions: {
      can_view_schedule: true,
      can_edit_schedule: false,
      can_view_profile: true,
      can_edit_profile: true,
      can_manage_users: false,
      can_manage_events: false,
      can_manage_system: false
    },
    subjects: [
      "Physical Education and Health 4",
      "Computer/Web Programming 6",
      "Mobile App Programming 2",
      "Contemporary Arts from the regions",
      "Homeroom",
      "Work Immersion-Practicum Type",
      "Inquiries Investigation and Immersion",
      "Empowerment Technologies: ICT",
      "Entrepreneurship"
    ]
  },
  {
    id: 'mock_admin_1',
    email: 'admin',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'faculty',
    profileImage: null,
    permissions: {
      can_view_schedule: true,
      can_edit_schedule: true,
      can_view_profile: true,
      can_edit_profile: true,
      can_manage_users: true,
      can_manage_events: true,
      can_manage_system: true
    },
    department: 'Computer Science',
    subjects: []
  }
];

export const MockAuthContext = createContext();

export function MockAuthProvider({ children }) {
  const [mockUser, setMockUser] = useState(null);
  const [isMockAuthenticated, setIsMockAuthenticated] = useState(false);
  const [useMockAuth, setUseMockAuth] = useState(false);

  const mockLogin = async (email, password) => {
    try {
      // Find user in mock database
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        setMockUser(userWithoutPassword);
        setIsMockAuthenticated(true);
        setUseMockAuth(true);
        
        return {
          success: true,
          user: userWithoutPassword,
          message: 'Mock login successful'
        };
      } else {
        return {
          success: false,
          message: 'Invalid mock credentials'
        };
      }
    } catch (error) {
      console.error('Mock login error:', error);
      return {
        success: false,
        message: 'Mock login failed'
      };
    }
  };

  const mockLogout = async () => {
    setMockUser(null);
    setIsMockAuthenticated(false);
    setUseMockAuth(false);
    return { success: true, message: 'Mock logout successful' };
  };

  const mockUpdateProfile = async (profileData) => {
    try {
      setMockUser(prev => ({
        ...prev,
        ...profileData
      }));
      return { success: true, message: 'Mock profile updated' };
    } catch (error) {
      console.error('Mock profile update error:', error);
      return { success: false, message: 'Mock profile update failed' };
    }
  };

  return (
    <MockAuthContext.Provider value={{
      mockUser,
      isMockAuthenticated,
      useMockAuth,
      setUseMockAuth,
      mockLogin,
      mockLogout,
      mockUpdateProfile,
      MOCK_USERS
    }}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
}
