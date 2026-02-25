import { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const UserContext = createContext()

export function UserProvider({ children })
{
    const[user, setUser] = useState({
        name: "Morgado, Ace A.",
        id: "02000399541",
        dateOfBirth: "June 8, 2008",
        address: "MGL Village, Viente Reales, Valenzuela City",
        strand: "Mobile App & Web Development",
        section: "12 A",
        profileImage: null,
        email: "morgado@school.edu",
        phoneNumber: "+63 912 345 6789",
        emergencyContact: "Maria Morgado (Mother) +63 913 456 7890",
        gradeLevel: 12,
        department: "Science and Technology",
        enrollmentDate: "2022-06-15",
        gpa: "89.5",
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
        ],
        role: "student",
        permissions: {
            can_view_schedule: true,
            can_edit_schedule: false,
            can_view_profile: true,
            can_edit_profile: true,
            can_manage_users: false,
            can_manage_events: false,
            can_manage_system: false
        }
    })

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await authService.initialize()
                if (authService.isLoggedIn()) {
                    const userProfile = authService.getUserProfile()
                    setUser(userProfile)
                    setIsAuthenticated(true)
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()
    }, [])

    const updateUserProfile = async (profileData) => {
        try {
            const result = await authService.updateProfile(profileData)
            if (result.success) {
                const updatedProfile = authService.getUserProfile()
                setUser(updatedProfile)
            }
            return result
        } catch (error) {
            console.error('Profile update error:', error)
            return { success: false, message: 'Failed to update profile' }
        }
    }

    const login = async (username, password) => {
        try {
            const result = await authService.login(username, password)
            if (result.success) {
                const userProfile = authService.getUserProfile()
                setUser(userProfile)
                setIsAuthenticated(true)
            }
            return result
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, message: 'Login failed' }
        }
    }

    const logout = async () => {
        try {
            const result = await authService.logout()
            if (result.success) {
                setUser(null)
                setIsAuthenticated(false)
            }
            return result
        } catch (error) {
            console.error('Logout error:', error)
            return { success: false, message: 'Logout failed' }
        }
    }

    return (
        <UserContext.Provider value={{ 
            user, 
            isAuthenticated, 
            isLoading,
            updateUserProfile, 
            login,
            logout,
            authService
        }}>
            {children}
        </UserContext.Provider>
    )
}