import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { goBack } from 'expo-router/build/global-state/routing'

const mainDashboard = () => {
  return (
    <View style={styles.container}>
        <View style={styles.goBackContainer}>
        </View>
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
  goBackContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '10%',
    backgroundColor: Colors.lightBlue,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    },
})