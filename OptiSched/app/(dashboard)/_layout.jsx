import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from "../../constants/Colors"
import { Ionicons } from '@expo/vector-icons'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

const dashboardLayout = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
  return (
    <Tabs
    screenOptions={{ headerShown: false, tabBarStyle: {
      backgroundColor: Colors.lightBlue,
      paddingTop: 10,
      height: '8%',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    tabBarActiveTintColor: theme.iconColorFocused,
    tabBarInactiveTintColor: theme.iconColor
   }}
    >

      <Tabs.Screen name='mainDashboard' options={ { title: 'Dashboard', tabBarIcon: ({ focused }) => (
        <AntDesign size={24} name={'dashboard'} color={focused ? '#000000' : '#fff'}/>
      )}} />
      <Tabs.Screen name='schedule' options={{ title: 'Schedule', tabBarIcon: ({ focused }) => (
        <Entypo size={24} name='calendar' color={focused ? '#000000' : '#fff'}/>
      )}} />
      <Tabs.Screen name='settings' options={{ title: 'Settings', tabBarIcon: ({ focused }) => (
        <Ionicons size={24} name='settings-outline' color={focused ? '#000000' : '#fff'}/>
      )}}/>
      <Tabs.Screen name='ai' options={{ title: 'AI', tabBarIcon: ({ focused }) => (
        <Ionicons size={24} name='hardware-chip-outline' color={focused ? '#000000' : '#fff'} />
      )}}/>
      <Tabs.Screen name='profile' options={{ title: 'Profile', tabBarIcon: ({focused}) => (
        <Ionicons name='person-outline' size={24} color={focused ? '#000000' : '#fff'}/>
      )}}/>
    </Tabs>
  )
}

export default dashboardLayout