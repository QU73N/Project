import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from "../../constants/Colors"
import { Ionicons } from '@expo/vector-icons'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'

const dashboardLayout = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const { colors, isDarkMode } = useContext(ThemeContext)
  return (
    <Tabs
    screenOptions={{ headerShown: false, tabBarStyle: {
      backgroundColor: isDarkMode ? colors.card : Colors.lightBlue,
      paddingTop: 10,
      height: '8%',
    },
    tabBarActiveTintColor: isDarkMode ? colors.primary : '#000000',
    tabBarInactiveTintColor: isDarkMode ? colors.textSecondary : '#ffffff',
   }}
    >

      <Tabs.Screen name='mainDashboard' options={ { title: 'Dashboard', tabBarIcon: ({ focused }) => (
        <AntDesign size={24} name={'dashboard'} color={focused ? (isDarkMode ? colors.primary : '#000000') : (isDarkMode ? colors.textSecondary : '#fff')}/>
      )}} />
      <Tabs.Screen name='schedule' options={{ title: 'Schedule', tabBarIcon: ({ focused }) => (
        <Entypo size={24} name='calendar' color={focused ? (isDarkMode ? colors.primary : '#000000') : (isDarkMode ? colors.textSecondary : '#fff')}/>
      )}} />
      <Tabs.Screen name='settings' options={{ title: 'Settings', tabBarIcon: ({ focused }) => (
        <Ionicons size={24} name='settings-outline' color={focused ? (isDarkMode ? colors.primary : '#000000') : (isDarkMode ? colors.textSecondary : '#fff')}/>
      )}}/>
      <Tabs.Screen name='ai' options={{ title: 'AI', tabBarIcon: ({ focused }) => (
        <Ionicons size={24} name='hardware-chip-outline' color={focused ? (isDarkMode ? colors.primary : '#000000') : (isDarkMode ? colors.textSecondary : '#fff')} />
      )}}/>
      <Tabs.Screen name='profile' options={{ title: 'Profile', tabBarIcon: ({focused}) => (
        <Ionicons name='person-outline' size={24} color={focused ? (isDarkMode ? colors.primary : '#000000') : (isDarkMode ? colors.textSecondary : '#fff')}/>
      )}}/>

      {/* Hidden screens - not shown in tab bar */}
      <Tabs.Screen name='font-settings' options={{ href: null, title: 'Font Settings' }} />
      <Tabs.Screen name='reminder-settings' options={{ href: null, title: 'Reminder Settings' }} />
      <Tabs.Screen name='change-password' options={{ href: null, title: 'Change Password' }} />
      <Tabs.Screen name='help' options={{ href: null, title: 'Help Center' }} />
    </Tabs>
  )
}

export default dashboardLayout