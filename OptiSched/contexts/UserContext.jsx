import { createContext, useState } from "react";

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
        profileImage: null
    })

    const updateUserProfile = (profileData) => {
        setUser(prevUser => ({ ...prevUser, ...profileData }))
    }

    return (
        <UserContext.Provider value={{ user, updateUserProfile }}>
            {children}
        </UserContext.Provider>
    )
}