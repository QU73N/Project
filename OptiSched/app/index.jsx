import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Colors } from '../constants/Colors'
import { Link } from 'expo-router'
import ThemedView from '../components/ThemedView'

const LogIn = () => {
  const loginSubmit = () => {
    console.log('Login button pressed');
  }
  const aboutSubmit = () => {
    console.log('About button pressed');
  }
  return (
    <ThemedView style={styles.container}>
      <View style={styles.HeadContainer}>
        <Text 
          style={styles.HeadText}
          accessibilityLabel="OptiSched application header"
          accessibilityRole="header"
        >
          Opti<Text style={styles.HeadTextHighlight}>Sched</Text>
        </Text>
      </View>

      <View style={styles.SubContainer}>
          <Text style={styles.SubText}>Log In</Text>

          <Pressable onPress={loginSubmit}
          style={({pressed}) => [styles.loginButton, pressed && styles.pressedLoginButton]}>
            <Text style={styles.loginButtonText}>Continue</Text>
          </Pressable>

          <Link 
          href="/about" style={styles.aboutText}>About OptiSched</Link>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}> 2025 OptiSched. All rights reserved.</Text>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  HeadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightBlue,
    width: '100%',
    height: '40%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'absolute',
    top: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  HeadText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.white,
  },
  HeadTextHighlight: {
    color: Colors.lightestBlue,
    shadowColor: Colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  SubContainer: {
    backgroundColor: Colors.white,
    width: '80%',
    height: '55%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '15%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.6)',
  },
  SubText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.blue,
    position: 'absolute',
    top: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutText: {
    position: 'absolute',
    top: '92%',
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.blue,
    fontSize: 13,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.lightBlue,
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerText: {
    color: Colors.white,
  },
  loginButton: {
    position: 'absolute',
    bottom: '15%',
    backgroundColor: Colors.lightBlue,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressedLoginButton: {
    backgroundColor: Colors.darkBlue,
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 7,
  },
})

export default LogIn