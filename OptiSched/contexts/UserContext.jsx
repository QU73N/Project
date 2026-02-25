import { createContext, useState, useEffect, useContext } from "react";
import { ClerkProvider, useUser, useAuth } from "@clerk/clerk-expo";
import { authService } from "../services/authService";

export const UserContext = createContext()

export function UserProvider({ children }) {
    const { isSignedIn, user, isLoaded } = useUser();
    const { getToken } = useAuth();
    
    const [isLoading, setIsLoading] = useState(true);
    const [localUser, setLocalUser] = useState(null);

    // Sync Clerk user with local context
    useEffect(() => {
        if (isLoaded && user) {
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
        } else if (isLoaded && !user) {
            setLocalUser(null);
            setIsLoading(false);
        }
    }, [isLoaded, user]);

    const updateUserProfile = async (profileData) => {
        try {
            // TODO: Update user profile via Clerk API
            console.log('Updating profile:', profileData);
            
            // Update local state
            setLocalUser(prev => ({
                ...prev,
                ...profileData
            }));
            
            return { success: true, message: 'Profile updated successfully' };
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, message: 'Failed to update profile' };
        }
    };

    const login = async (email, password) => {
        // Clerk handles login through their components
        // This is just a placeholder for compatibility
        return { success: false, message: 'Use Clerk SignIn component instead' };
    };

    const logout = async () => {
        try {
            // Clerk handles sign out
            await Clerk.signOut();
            setLocalUser(null);
            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, message: 'Logout failed' };
        }
    };

    return (
        <ClerkProvider>
            <UserContext.Provider value={{
                user: localUser,
                isAuthenticated: isSignedIn,
                isLoading,
                updateUserProfile,
                login,
                logout,
                authService, // Keep for backward compatibility
                clerkUser: user,
                isSignedIn,
                getToken
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