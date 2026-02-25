import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import React, { useContext, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeContext } from '../../contexts/ThemeContext'

const ReminderSettings = () => {
  const router = useRouter()
  const { colors } = useContext(ThemeContext)
  
  const [classReminders, setClassReminders] = useState(true)
  const [reminderTime, setReminderTime] = useState(15)
  const [assignmentReminders, setAssignmentReminders] = useState(true)
  const [examReminders, setExamReminders] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)

  const reminderTimes = [
    { label: '5 minutes before', value: 5 },
    { label: '10 minutes before', value: 10 },
    { label: '15 minutes before', value: 15 },
    { label: '30 minutes before', value: 30 },
    { label: '1 hour before', value: 60 },
  ]

  const handleSaveSettings = () => {
    Alert.alert(
      'Settings Saved',
      'Your reminder preferences have been updated successfully!',
      [{ text: 'OK', onPress: () => router.back() }]
    )
  }

  const ReminderItem = ({ icon, title, subtitle, value, onToggle, enabled = true }) => (
    <View style={[styles.reminderItem, { opacity: enabled ? 1 : 0.5 }]}>
      <View style={styles.reminderLeft}>
        <View style={[styles.reminderIcon, { backgroundColor: colors.primary + '20' }]}>
          <FontAwesome name={icon} size={16} color={colors.primary} />
        </View>
        <View style={styles.reminderContent}>
          <Text style={[styles.reminderTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.reminderSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={enabled ? onToggle : null}
        trackColor={{ false: colors.border, true: colors.primary + '40' }}
        thumbColor={value ? colors.primary : colors.textSecondary}
        disabled={!enabled}
      />
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Class Reminders</Text>
        <TouchableOpacity onPress={handleSaveSettings} style={styles.saveButton}>
          <FontAwesome name="check" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Class Reminders Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Class Notifications</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ReminderItem
              icon="bell"
              title="Class Reminders"
              subtitle="Get notified before each class"
              value={classReminders}
              onToggle={() => setClassReminders(!classReminders)}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.timeSection}>
              <Text style={[styles.timeTitle, { color: colors.text }]}>Reminder Time</Text>
              {reminderTimes.map((time) => (
                <TouchableOpacity
                  key={time.value}
                  style={[
                    styles.timeOption,
                    {
                      backgroundColor: reminderTime === time.value ? colors.primary + '20' : 'transparent',
                      borderColor: reminderTime === time.value ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setReminderTime(time.value)}
                  disabled={!classReminders}
                >
                  <Text style={[
                    styles.timeLabel,
                    { 
                      color: classReminders ? colors.text : colors.textSecondary,
                      fontWeight: reminderTime === time.value ? '600' : '400'
                    }
                  ]}>
                    {time.label}
                  </Text>
                  {reminderTime === time.value && (
                    <FontAwesome name="check" size={14} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Other Reminders Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Other Reminders</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ReminderItem
              icon="clipboard"
              title="Assignment Reminders"
              subtitle="Notify about upcoming assignments"
              value={assignmentReminders}
              onToggle={() => setAssignmentReminders(!assignmentReminders)}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <ReminderItem
              icon="file-text"
              title="Exam Reminders"
              subtitle="Get notified about exams and tests"
              value={examReminders}
              onToggle={() => setExamReminders(!examReminders)}
            />
          </View>
        </View>

        {/* Notification Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notification Settings</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ReminderItem
              icon="volume-up"
              title="Sound"
              subtitle="Play sound for notifications"
              value={soundEnabled}
              onToggle={() => setSoundEnabled(!soundEnabled)}
              enabled={classReminders || assignmentReminders || examReminders}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <ReminderItem
              icon="mobile"
              title="Vibration"
              subtitle="Vibrate for notifications"
              value={vibrationEnabled}
              onToggle={() => setVibrationEnabled(!vibrationEnabled)}
              enabled={classReminders || assignmentReminders || examReminders}
            />
          </View>
        </View>

        {/* Test Notification */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.testButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              if (classReminders || assignmentReminders || examReminders) {
                Alert.alert('Test Reminder', 'This is a test notification! Your settings are working properly.')
              } else {
                Alert.alert('No Reminders', 'Please enable at least one reminder type to test notifications.')
              }
            }}
          >
            <FontAwesome name="bell" size={16} color="#ffffff" />
            <Text style={styles.testButtonText}>Send Test Notification</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default ReminderSettings

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
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  reminderSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  timeSection: {
    padding: 16,
    paddingTop: 0,
  },
  timeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})
