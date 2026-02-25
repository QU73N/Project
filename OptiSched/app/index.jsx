import { ScrollView, Pressable, StyleSheet, Text, TextInput, View, Animated, Dimensions, Platform, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native'
import { Colors } from '../constants/Colors'
import { Link } from 'expo-router'
import ThemedView from '../components/ThemedView'
import { useNavigation } from '@react-navigation/native'
import { useState, useRef, useEffect, useContext } from 'react'
import { useUser } from '../hooks/useUser'
import { ThemeContext } from '../contexts/ThemeContext'
// import { useSignIn, useOAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useUserContext } from '../contexts/UserContext'

const { width, height } = Dimensions.get('window')

const LogIn = () => {
  const navigation = useNavigation()
  const router = useRouter()
  const { colors } = useContext(ThemeContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isFocused, setIsFocused] = useState({ username: false, password: false })
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const passwordRef = useRef(null)
  const usernameRef = useRef(null)

  const { login: contextLogin, useFallback, enableFallback } = useUserContext()

  const { user } = useUser()

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

  const loginSubmit = async () => {
    if (!username || !password) {
      setLoginError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setLoginError('')

    try {
      // Use mock authentication
      const result = await contextLogin(username, password)
      
      if (result.success) {
        router.replace('/(dashboard)')
      } else {
        setLoginError(result.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setLoginError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoginError('Google Sign-In temporarily disabled. Use mock account instead.')
  }

  const handleMockLogin = () => {
    setUsername('testaccount123')
    setPassword('123123')
    enableFallback()
  }

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }))
  }

  const handleUsernameSubmit = () => {
    passwordRef.current?.focus()
  }

  const handlePasswordSubmit = () => {
    passwordRef.current?.blur()
    loginSubmit()
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.innerContainer}>
          {/* Animated Background Gradient */}
          <View style={styles.backgroundGradient}>
            <View style={[styles.gradientCircle, { top: -100, right: -50 }]} />
            <View style={[styles.gradientCircle, { bottom: -150, left: -75 }]} />
          </View>

          {/* Header */}
          <Animated.View 
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={[styles.brandText, { color: colors.text }]}>
              Opti<Text style={[styles.brandHighlight, { color: colors.primary }]}>Sched</Text>
            </Text>
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>Smart Scheduling Made Simple</Text>
          </Animated.View>

          {/* Login Form */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                backgroundColor: colors.card
              }
            ]}
          >
            <View style={styles.formHeader}>
              <Text style={[styles.formTitle, { color: colors.text }]}>OptiSched Portal</Text>
              <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>Sign in to access your schedule</Text>
            </View>

            {/* Error Message */}
            {loginError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{loginError}</Text>
              </View>
            ) : null}

            {/* Username Input */}
            <Pressable 
              style={[
                styles.inputContainer,
                isFocused.username && [styles.inputFocused, { borderColor: colors.primary, backgroundColor: colors.card }],
                { backgroundColor: colors.card, borderColor: colors.border }
              ]}
              onPress={() => usernameRef.current?.focus()}
            >
              <TextInput 
                ref={usernameRef}
                placeholder='Username' 
                style={[styles.textInput, { color: colors.text }]}
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={setUsername}
                value={username}
                onFocus={() => handleFocus('username')}
                onBlur={() => handleBlur('username')}
                placeholderTextColor={colors.textSecondary}
                blurOnSubmit={false}
                returnKeyType="next"
                onSubmitEditing={handleUsernameSubmit}
              />
            </Pressable>

            {/* Password Input */}
            <Pressable 
              style={[
                styles.inputContainer,
                isFocused.password && [styles.inputFocused, { borderColor: colors.primary, backgroundColor: colors.card }],
                { backgroundColor: colors.card, borderColor: colors.border }
              ]}
              onPress={() => passwordRef.current?.focus()}
            >
              <TextInput 
                ref={passwordRef}
                placeholder='Password' 
                style={[styles.textInput, { color: colors.text }]}
                secureTextEntry
                autoCorrect={false}
                onChangeText={setPassword}
                value={password}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                placeholderTextColor={colors.textSecondary}
                blurOnSubmit={false}
                returnKeyType="done"
                onSubmitEditing={handlePasswordSubmit}
                selectTextOnFocus={true}
              />
            </Pressable>

            {/* Forgot Password */}
            <View style={styles.forgotContainer}>
              <Link href={'/resetPass'} style={[styles.forgotLink, { color: colors.primary }]}>
                Forgot your password?
              </Link>
            </View>

            {/* Login Button */}
            <Pressable 
              onPress={loginSubmit}
              disabled={isLoading}
              style={({pressed}) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
                isLoading && styles.loginButtonDisabled
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </Pressable>

            {/* Google Sign-In Button */}
            <Pressable 
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              style={({pressed}) => [
                styles.googleButton,
                pressed && styles.googleButtonPressed,
                isLoading && styles.googleButtonDisabled
              ]}
            >
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </Pressable>

            {/* Mock Login Button (for testing) */}
            <Pressable 
              onPress={handleMockLogin}
              disabled={isLoading}
              style={({pressed}) => [
                styles.mockButton,
                pressed && styles.mockButtonPressed,
                isLoading && styles.mockButtonDisabled
              ]}
            >
              <Text style={styles.mockButtonText}>Use Mock Account (testaccount123/123123)</Text>
            </Pressable>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}> 2025 OptiSched. All rights reserved.</Text>
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    position: 'relative',
    minHeight: height,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  gradientCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(73, 136, 196, 0.1)',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: height * 0.15,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  brandText: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.darkBlue,
    textAlign: 'center',
    letterSpacing: -1,
  },
  brandHighlight: {
    color: Colors.lightBlue,
  },
  tagline: {
    fontSize: 16,
    color: Colors.blue,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 1,
    marginTop: 40,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.darkBlue,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '400',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputFocused: {
    borderColor: Colors.lightBlue,
    backgroundColor: '#ffffff',
    shadowColor: Colors.lightBlue,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.darkBlue,
    paddingVertical: 16,
    fontWeight: '500',
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotLink: {
    fontSize: 14,
    color: Colors.lightBlue,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.lightBlue,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonPressed: {
    backgroundColor: Colors.blue,
    transform: [{ scale: 0.98 }],
  },
  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  googleButton: {
    backgroundColor: '#4285f4',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4285f4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  googleButtonPressed: {
    backgroundColor: '#3367d6',
    transform: [{ scale: 0.98 }],
  },
  googleButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  googleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  mockButton: {
    backgroundColor: '#6b7280',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6b7280',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  mockButtonPressed: {
    backgroundColor: '#4b5563',
    transform: [{ scale: 0.98 }],
  },
  mockButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  mockButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 20,
    zIndex: 1,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '400',
  },
  versionText: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
  },
})

export default LogIn