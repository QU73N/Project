import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useSafeAreaFrame } from "react-native-safe-area-context";

export function useUser() {
    const context = useContext(UserContext)

    if(!context) {
        throw new Error('useUser must be used within a UserProvider')
    }

    return context
}
