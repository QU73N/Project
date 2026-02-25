import { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/authService";
import { MockAuthProvider, useMockAuth } from "./MockAuthContext";

export const UserContext = createContext()

export function UserProvider({ children }) {
    const { mockUser, isMockAuthenticated, mockLogin, mockLogout, mockUpdateProfile } = useMockAuth();
    
    const [isLoading, setIsLoading] = useState(true);
    const [localUser, setLocalUser] = useState(null);
    const [useFallback, setUseFallback] = useState(true); // Always use fallback for now

    // Use mock user
    useEffect(() => {
        if (mockUser) {
            setLocalUser(mockUser);
            setIsLoading(false);
        } else {
            setLocalUser(null);
            setIsLoading(false);
        }
    }, [mockUser]);

    const updateUserProfile = async (profileData) => {
        try {
            // Update mock user
            const result = await mockUpdateProfile(profileData);
            if (result.success) {
                setLocalUser(prev => ({ ...prev, ...profileData }));
            }
            return result;
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, message: 'Failed to update profile' };
        }
    };

    const login = async (email, password) => {
        try {
            // Use mock authentication
            const result = await mockLogin(email, password);
            if (result.success) {
                setUseFallback(true);
            }
            return result;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Login failed' };
        }
    };

    const logout = async () => {
        try {
            // Mock logout
            await mockLogout();
            setLocalUser(null);
            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, message: 'Logout failed' };
        }
    };

    const enableFallback = () => {
        setUseFallback(true);
    };

    return (
        <UserContext.Provider value={{
            user: localUser,
            isAuthenticated: isMockAuthenticated,
            isLoading,
            updateUserProfile,
            login,
            logout,
            authService, // Keep for backward compatibility
            useFallback,
            enableFallback,
            mockUser,
            isMockAuthenticated
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}