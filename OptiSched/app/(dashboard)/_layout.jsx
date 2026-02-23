import { StatusBar, StyleSheet } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const dashboardLayout = () => {
  return (
    <>
        <StatusBar value='auto' />
        <Stack 
        screenOptions={{ headerShown: false, animation: 'fade' }} />
    </>
  )
}

export default dashboardLayout