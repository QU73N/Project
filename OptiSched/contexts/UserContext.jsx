import { createContext, useState, useEffect, useContext } from "react";
import { ClerkProvider, useUser, useAuth } from "@clerk/clerk-expo";
import { authService } from "../services/authService";
import { MockAuthProvider, useMockAuth } from "./MockAuthContext";

export const UserContext = createContext()

export function UserProvider({ children }) {
    const { isSignedIn, user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const { mockUser, isMockAuthenticated, useMockAuth, mockLogin, mockLogout, mockUpdateProfile } = useMockAuth();
    
    const [isLoading, setIsLoading] = useState(true);
    const [localUser, setLocalUser] = useState(null);
    const [useFallback, setUseFallback] = useState(false);

    // Determine which user to use (Clerk or Mock)
    useEffect(() => {
        if (useMockAuth && mockUser) {
            // Use mock user
            setLocalUser(mockUser);
            setIsLoading(false);
        } else if (isLoaded && user) {
            // Use Clerk user
            setLocalUser({
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.primaryEmailAddress?.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImage: user.imageUrl,
                role: 'student', // Default role, can be updated based on metadata
                permissions: {
                    can_view_schedule: true,
                    can_edit_schedule: false,
                    can_view_profile: true,
                    can_edit_profile: true,
                    can_manage_users: false,
                    can_manage_events: false,
                    can_manage_system: false
                }
            });
            setIsLoading(false);
        } else if (isLoaded && !user && !useMockAuth) {
            setLocalUser(null);
            setIsLoading(false);
        }
    }, [isLoaded, user, useMockAuth, mockUser]);

    const updateUserProfile = async (profileData) => {
        try {
            if (useMockAuth) {
                // Update mock user
                const result = await mockUpdateProfile(profileData);
                if (result.success) {
                    setLocalUser(prev => ({ ...prev, ...profileData }));
                }
                return result;
            } else {
                // TODO: Update user profile via Clerk API
                console.log('Updating profile:', profileData);
                
                // Update local state
                setLocalUser(prev => ({
                    ...prev,
                    ...profileData
                }));
                
                return { success: true, message: 'Profile updated successfully' };
            }
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, message: 'Failed to update profile' };
        }
    };

    const login = async (email, password) => {
        try {
            // First try Clerk login
            if (!useFallback) {
                // Try Clerk authentication
                return { success: false, message: 'Use Clerk SignIn component instead' };
            } else {
                // Fallback to mock authentication
                const result = await mockLogin(email, password);
                if (result.success) {
                    setUseFallback(true);
                }
                return result;
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // If Clerk fails, try mock authentication
            const result = await mockLogin(email, password);
            if (result.success) {
                setUseFallback(true);
            }
            return result;
        }
    };

    const logout = async () => {
        try {
            if (useMockAuth) {
                // Mock logout
                await mockLogout();
                setUseFallback(false);
            } else {
                // Clerk logout
                await Clerk.signOut();
            }
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
        <ClerkProvider>
            <UserContext.Provider value={{
                user: localUser,
                isAuthenticated: useMockAuth ? isMockAuthenticated : isSignedIn,
                isLoading,
                updateUserProfile,
                login,
                logout,
                authService, // Keep for backward compatibility
                clerkUser: user,
                isSignedIn,
                getToken,
                useFallback,
                enableFallback,
                mockUser,
                isMockAuthenticated
            }}>
                {children}
            </UserContext.Provider>
        </ClerkProvider>
    );
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}