import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'

const about = () => {
    const goBack = () => {
    console.log('Go back button pressed');
    }
  return (

    <View style={styles.container}>
        <Link onPress={goBack} 
        href="/" style={styles.goBack}>Back to Login</Link>
    </View>
  )
}

export default about

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