import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useRouter } from 'expo-router'
import React, { useContext, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeContext } from '../../contexts/ThemeContext'
import { UserContext } from '../../contexts/UserContext'
import authService from '../../services/authService'

const ChangePassword = () => {
  const router = useRouter()
  const { colors } = useContext(ThemeContext)
  const { user } = useContext(UserContext)
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = (password) => {
    return password.length >= 8
  }

  const handleChangePassword = async () => {
    // Dismiss keyboard
    Keyboard.dismiss()
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match')
      return
    }

    if (!validatePassword(newPassword)) {
      Alert.alert('Error', 'Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)

    try {
      // Use authService to change password (mock data)
      const result = await authService.changePassword(currentPassword, newPassword, confirmPassword)
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Your password has been changed successfully!',
          [{ text: 'OK', onPress: () => router.back() }]
        )
      } else {
        Alert.alert('Error', result.message || 'Failed to change password. Please try again.')
      }
    } catch (error) {
      console.error('Password change error:', error)
      Alert.alert('Error', 'Failed to change password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const PasswordInput = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    showPassword, 
    setShowPassword,
    secureTextEntry = true 
  }) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: colors.text }]}>{label}</Text>
      <View style={[styles.passwordInputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput
          style={[styles.passwordInput, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <FontAwesome 
            name={showPassword ? "eye-slash" : "eye"} 
            size={16} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="chevron-left" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Change Password</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
        {/* Security Notice */}
        <View style={styles.section}>
          <View style={[styles.noticeCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
            <FontAwesome name="info-circle" size={20} color={colors.primary} />
            <View style={styles.noticeContent}>
              <Text style={[styles.noticeTitle, { color: colors.primary }]}>Security Notice</Text>
              <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
                For your security, please choose a strong password that you haven't used before.
              </Text>
            </View>
          </View>
        </View>

        {/* Password Form */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Update Password</Text>
          
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter your current password"
            showPassword={showCurrentPassword}
            setShowPassword={setShowCurrentPassword}
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter your new password"
            showPassword={showNewPassword}
            setShowPassword={setShowNewPassword}
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your new password"
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
          />
        </View>

        {/* Password Requirements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Password Requirements</Text>
          <View style={[styles.requirementsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.requirement}>
              <FontAwesome 
                name={newPassword.length >= 8 ? "check-circle" : "circle"} 
                size={14} 
                color={newPassword.length >= 8 ? "#10b981" : colors.textSecondary} 
              />
              <Text style={[styles.requirementText, { 
                color: newPassword.length >= 8 ? "#10b981" : colors.textSecondary 
              }]}>
                At least 8 characters
              </Text>
            </View>
            <View style={styles.requirement}>
              <FontAwesome 
                name={/[A-Z]/.test(newPassword) ? "check-circle" : "circle"} 
                size={14} 
                color={/[A-Z]/.test(newPassword) ? "#10b981" : colors.textSecondary} 
              />
              <Text style={[styles.requirementText, { 
                color: /[A-Z]/.test(newPassword) ? "#10b981" : colors.textSecondary 
              }]}>
                One uppercase letter (recommended)
              </Text>
            </View>
            <View style={styles.requirement}>
              <FontAwesome 
                name={/[0-9]/.test(newPassword) ? "check-circle" : "circle"} 
                size={14} 
                color={/[0-9]/.test(newPassword) ? "#10b981" : colors.textSecondary} 
              />
              <Text style={[styles.requirementText, { 
                color: /[0-9]/.test(newPassword) ? "#10b981" : colors.textSecondary 
              }]}>
                One number (recommended)
              </Text>
            </View>
          </View>
        </View>

        {/* Change Password Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[
              styles.changeButton, 
              { 
                backgroundColor: isLoading ? colors.border : colors.primary,
                opacity: (currentPassword && newPassword && confirmPassword) ? 1 : 0.5
              }
            ]}
            onPress={handleChangePassword}
            disabled={!currentPassword || !newPassword || !confirmPassword || isLoading}
          >
            {isLoading ? (
              <Text style={[styles.changeButtonText, { color: colors.textSecondary }]}>
                Updating Password...
              </Text>
            ) : (
              <>
                <FontAwesome name="lock" size={16} color="#ffffff" />
                <Text style={styles.changeButtonText}>Change Password</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ChangePassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  noticeContent: {
    flex: 1,
    marginLeft: 12,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  requirementsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  changeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})
