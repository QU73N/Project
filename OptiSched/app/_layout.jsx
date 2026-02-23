import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from "../constants/Colors"
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';

const RootLayout = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
  return (
    <>
    <StatusBar barStyle={theme.statusBar} />
    <Stack>
          <Stack.Screen name="index" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="about" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false, animation: 'fade' }} />
    </Stack>
    </>
  )
}

export default RootLayout