import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, Linking, Share } from 'react-native'
import { Link, useRouter } from 'expo-router'
import React, { useState, useContext } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { UserContext } from '../../contexts/UserContext'
import { ThemeContext } from '../../contexts/ThemeContext'
import { Colors } from '../../constants/Colors'

const Settings = () => {
  const router = useRouter()
  const { user, updateUserProfile } = useContext(UserContext)
  const { isDarkMode, toggleTheme, colors } = useContext(ThemeContext)
  
  const [notifications, setNotifications] = useState(true)
  const [autoSync, setAutoSync] = useState(true)
  const [biometricAuth, setBiometricAuth] = useState(false)

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Navigate back to login
            router.replace('/')
          },
        },
      ]
    )
  }

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out OptiSched - Smart Scheduling Made Simple! Download it now and organize your academic life like never before.',
        url: 'https://play.google.com/store/apps/details?id=com.optisched',
      })
    } catch (error) {
      console.error('Error sharing app:', error)
      Alert.alert('Share Error', 'Unable to share the app at this time. Please try again later.')
    }
  }

  const handleRateApp = () => {
    Alert.alert(
      'Rate OptiSched',
      'Thank you for using OptiSched! Your feedback helps us improve the app.',
      [
        {
          text: 'Maybe Later',
          style: 'cancel',
        },
        {
          text: 'Rate Now',
          onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.optisched')
        },
      ]
    )
  }

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact our support team?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:support@optisched.com?subject=OptiSched Support Request')
        },
        {
          text: 'Live Chat',
          onPress: () => router.push('/(dashboard)/help')
        },
      ]
    )
  }

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'View our privacy policy to learn how we protect your data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'View Policy',
          onPress: () => Linking.openURL('https://optisched.com/privacy')
        },
      ]
    )
  }

  const handleTermsOfService = () => {
    Alert.alert(
      'Terms of Service',
      'Review our terms of service to understand your rights and responsibilities.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'View Terms',
          onPress: () => Linking.openURL('https://optisched.com/terms')
        },
      ]
    )
  }

  const handleSyncSchedule = async () => {
    try {
      Alert.alert('Sync Schedule', 'Syncing your schedule...')
      // Add actual sync logic here
      setTimeout(() => {
        Alert.alert('Success', 'Schedule synced successfully!')
      }, 2000)
    } catch (error) {
      Alert.alert('Error', 'Failed to sync schedule')
    }
  }

  const handleExportSchedule = async () => {
    try {
      Alert.alert('Export Schedule', 'Preparing PDF export...')
      // Add actual export logic here
      setTimeout(() => {
        Alert.alert('Success', 'Schedule exported successfully!')
      }, 2000)
    } catch (error) {
      Alert.alert('Error', 'Failed to export schedule')
    }
  }

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Add actual cache clearing logic here
            Alert.alert('Success', 'Cache cleared successfully!')
          },
        },
      ]
    )
  }

  const SettingItem = ({ icon, title, subtitle, onPress, value, showArrow = true, type = 'default' }) => {
    return (
      <TouchableOpacity style={styles.settingItem} onPress={onPress}>
        <View style={styles.settingLeft}>
          <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
            <FontAwesome name={icon} size={16} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
            {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.settingRight}>
          {type === 'toggle' && (
            <Switch
              value={value}
              onValueChange={onPress}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={value ? colors.primary : colors.textSecondary}
            />
          )}
          {type === 'default' && showArrow && (
            <FontAwesome name="chevron-right" size={14} color={colors.textSecondary} />
          )}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Manage your app preferences
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile</Text>
          <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.profileInfo}>
              <View style={[styles.profileAvatar, { backgroundColor: colors.primary + '20' }]}>
                <FontAwesome name="user" size={24} color={colors.primary} />
              </View>
              <View style={styles.profileDetails}>
                <Text style={[styles.profileName, { color: colors.text }]}>{user.name}</Text>
                <Text style={[styles.profileId, { color: colors.textSecondary }]}>ID: {user.id}</Text>
                <Text style={[styles.profileSection, { color: colors.textSecondary }]}>{user.section} • {user.strand}</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: colors.primary }]} onPress={() => router.push('/(dashboard)/profile')}>
              <FontAwesome name="edit" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingItem
              icon="moon-o"
              title="Dark Mode"
              subtitle="Toggle dark theme"
              onPress={toggleTheme}
              value={isDarkMode}
              type="toggle"
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem
              icon="text-height"
              title="Font Size"
              subtitle="Adjust text size"
              onPress={() => router.push('/(dashboard)/font-settings')}
              showArrow={true}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingItem
              icon="bell"
              title="Push Notifications"
              subtitle="Receive class reminders"
              onPress={() => setNotifications(!notifications)}
              value={notifications}
              type="toggle"
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem
              icon="clock-o"
              title="Class Reminders"
              subtitle="15 minutes before class"
              onPress={() => router.push('/(dashboard)/reminder-settings')}
              showArrow={true}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem
              icon="calendar"
              title="Schedule Updates"
              subtitle="Get notified of changes"
              onPress={() => setAutoSync(!autoSync)}
              value={autoSync}
              type="toggle"
            />
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingItem
              icon="lock"
              title="Biometric Authentication"
              subtitle="Use fingerprint or face ID"
              onPress={() => setBiometricAuth(!biometricAuth)}
              value={biometricAuth}
              type="toggle"
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem
              icon="lock"
              title="Change Password"
              subtitle="Update your password"
              onPress={() => router.push('/(dashboard)/change-password')}
              showArrow={true}
            />
          </View>
        </View>

        {/* Data & Storage Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data & Storage</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingItem
              icon="refresh"
              title="Sync Schedule"
              subtitle="Last synced 2 hours ago"
              onPress={handleSyncSchedule}
              showArrow={true}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem
              icon="download"
              title="Export Schedule"
              subtitle="Download as PDF"
              onPress={handleExportSchedule}
              showArrow={true}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem
              icon="trash"
              title="Clear Cache"
              subtitle="Free up storage space"
              onPress={handleClearCache}
              showArrow={true}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingItem
              icon="question-circle"
              title="Help Center"
              subtitle="FAQs and tutorials"
              onPress={() => router.push('/(dashboard)/help')}
              showArrow={true}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem
              icon="envelope"
              title="Contact Support"
              subtitle="Get help from our team"
              onPress={handleContactSupport}
              showArrow={true}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem
              icon="star"
              title="Rate App"
              subtitle="Share your feedback"
              onPress={handleRateApp}
              showArrow={true}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem
              icon="share"
              title="Share App"
              subtitle="Tell your friends"
              onPress={handleShareApp}
              showArrow={true}
            />
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingItem
              icon="file-text"
              title="Privacy Policy"
              subtitle="How we protect your data"
              onPress={handlePrivacyPolicy}
              showArrow={true}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem
              icon="file-text-o"
              title="Terms of Service"
              subtitle="App usage terms"
              onPress={handleTermsOfService}
              showArrow={true}
            />
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.card, borderColor: colors.error }]} onPress={handleLogout}>
            <FontAwesome name="sign-out" size={16} color="#ef4444" />
            <Text style={[styles.logoutButtonText, { color: '#ef4444' }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>OptiSched Version 1.0.0</Text>
          <Text style={[styles.copyrightText, { color: colors.textSecondary }]}> 2025 OptiSched. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
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
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileId: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileSection: {
    fontSize: 12,
    fontWeight: '500',
  },
  editProfileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingRight: {
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 8,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    fontWeight: '500',
  },
})