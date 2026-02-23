import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'
import { goBack } from 'expo-router/build/global-state/routing'

const mainDashboard = () => {
  return (
    <View style={styles.container}>
        <Link href="/" style={styles.goBack}>Back to Login</Link>
    </View>
  )
}

export default mainDashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBack: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
})