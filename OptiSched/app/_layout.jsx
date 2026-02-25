import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from "../constants/Colors"
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { UserProvider } from '../contexts/UserContext';
import { ThemeProvider } from '../contexts/ThemeContext';
// import { ClerkProvider } from '@clerk/clerk-expo';
import { MockAuthProvider } from '../contexts/MockAuthContext';

const RootLayout = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
  return (
    <MockAuthProvider>
      <UserProvider>
        <ThemeProvider>
          <StatusBar barStyle={theme.statusBar} />
          <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false, animation: 'fade' }} />
                  <Stack.Screen name="about" options={{ headerShown: false, animation: 'fade' }} />
                  <Stack.Screen name="(dashboard)" options={{ headerShown: false, animation: 'fade' }} />
            </Stack>
          </ThemeProvider>
        </UserProvider>
    </MockAuthProvider>
  )
}

export default RootLayout