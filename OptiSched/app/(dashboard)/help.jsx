import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native'
import { useRouter } from 'expo-router'
import React, { useContext, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeContext } from '../../contexts/ThemeContext'

const Help = () => {
  const router = useRouter()
  const { colors } = useContext(ThemeContext)
  const [expandedCategory, setExpandedCategory] = useState(null)

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'rocket',
      questions: [
        {
          question: 'How do I create my first schedule?',
          answer: 'Navigate to the Schedule tab and tap the "Add Class" button. Fill in the class details including subject, time, and location. You can add multiple classes to build your weekly schedule.'
        },
        {
          question: 'How do I import my existing schedule?',
          answer: 'Go to Settings > Data & Storage > Import Schedule. You can import from CSV files or sync with your school\'s scheduling system if supported.'
        },
        {
          question: 'What is the AI Assistant?',
          answer: 'The AI Assistant helps you optimize your schedule, suggests study times, and can answer questions about your classes. Access it from the main dashboard.'
        }
      ]
    },
    {
      id: 'schedule-management',
      title: 'Schedule Management',
      icon: 'calendar',
      questions: [
        {
          question: 'How do I edit a class?',
          answer: 'Tap on any class in your schedule to open its details, then tap the "Edit" button. You can modify the time, location, subject, and other details.'
        },
        {
          question: 'Can I set recurring classes?',
          answer: 'Yes! When adding or editing a class, select "Repeat" and choose the days of the week. The class will automatically appear on your schedule for the selected days.'
        },
        {
          question: 'How do I delete a class?',
          answer: 'Tap on the class, then tap the "Delete" button. You\'ll be asked to confirm before the class is permanently removed.'
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications & Reminders',
      icon: 'bell',
      questions: [
        {
          question: 'How do I set up class reminders?',
          answer: 'Go to Settings > Notifications > Class Reminders. You can choose how many minutes before class you want to be notified.'
        },
        {
          question: 'Why am I not receiving notifications?',
          answer: 'Check that notifications are enabled in both the app settings and your device settings. Also ensure the app has permission to send notifications.'
        },
        {
          question: 'Can I customize notification sounds?',
          answer: 'Yes! Go to Settings > Notifications > Sound to choose from different notification tones or use your device\'s default sound.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: 'user',
      questions: [
        {
          question: 'How do I update my profile information?',
          answer: 'Go to the Profile tab and tap the "Edit Profile" button. You can update your name, section, strand, and other personal information.'
        },
        {
          question: 'How do I change my password?',
          answer: 'Navigate to Settings > Security > Change Password. You\'ll need to enter your current password and then your new password twice.'
        },
        {
          question: 'Is my data secure?',
          answer: 'Yes! We use industry-standard encryption to protect your data. Your schedule and personal information are stored securely and never shared with third parties.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: 'wrench',
      questions: [
        {
          question: 'The app is running slowly, what can I do?',
          answer: 'Try clearing the cache in Settings > Data & Storage > Clear Cache. Also make sure you have the latest version of the app installed.'
        },
        {
          question: 'My schedule isn\'t syncing properly?',
          answer: 'Check your internet connection and try manual sync in Settings > Data & Storage > Sync Schedule. If issues persist, contact support.'
        },
        {
          question: 'I forgot my password, how do I reset it?',
          answer: 'On the login screen, tap "Forgot Password" and enter your email address. You\'ll receive instructions to reset your password.'
        }
      ]
    }
  ]

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  const ContactOption = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={[styles.contactOption, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onPress}>
      <View style={[styles.contactIcon, { backgroundColor: colors.primary + '20' }]}>
        <FontAwesome name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.contactContent}>
        <Text style={[styles.contactTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.contactSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      <FontAwesome name="chevron-right" size={14} color={colors.textSecondary} />
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help Center</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.section}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <FontAwesome name="search" size={16} color={colors.textSecondary} />
            <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
              Search for help...
            </Text>
          </View>
        </View>

        {/* Quick Help */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Help</Text>
          <View style={styles.quickHelpGrid}>
            <TouchableOpacity style={[styles.quickHelpCard, { backgroundColor: colors.card }]}>
              <FontAwesome name="play-circle" size={24} color={colors.primary} />
              <Text style={[styles.quickHelpTitle, { color: colors.text }]}>Video Tutorials</Text>
              <Text style={[styles.quickHelpSubtitle, { color: colors.textSecondary }]}>Watch how-to guides</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickHelpCard, { backgroundColor: colors.card }]}>
              <FontAwesome name="book" size={24} color={colors.primary} />
              <Text style={[styles.quickHelpTitle, { color: colors.text }]}>User Guide</Text>
              <Text style={[styles.quickHelpSubtitle, { color: colors.textSecondary }]}>Read the manual</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>
          {faqCategories.map((category) => (
            <View key={category.id} style={styles.categoryContainer}>
              <TouchableOpacity 
                style={[styles.categoryHeader, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => toggleCategory(category.id)}
              >
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryIcon, { backgroundColor: colors.primary + '20' }]}>
                    <FontAwesome name={category.icon} size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
                </View>
                <FontAwesome 
                  name={expandedCategory === category.id ? "chevron-up" : "chevron-down"} 
                  size={14} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
              
              {expandedCategory === category.id && (
                <View style={styles.questionsContainer}>
                  {category.questions.map((item, index) => (
                    <View key={index} style={styles.questionItem}>
                      <TouchableOpacity 
                        style={styles.questionHeader}
                        onPress={() => Alert.alert(item.question, item.answer)}
                      >
                        <Text style={[styles.questionText, { color: colors.text }]}>{item.question}</Text>
                        <FontAwesome name="chevron-right" size={12} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Still Need Help?</Text>
          <ContactOption
            icon="envelope"
            title="Email Support"
            subtitle="Get help via email"
            onPress={() => Linking.openURL('mailto:support@optisched.com')}
          />
          <View style={styles.contactSpacing} />
          <ContactOption
            icon="comments"
            title="Live Chat"
            subtitle="Chat with our team"
            onPress={() => Alert.alert('Live Chat', 'Live chat is available Monday-Friday, 9AM-5PM. Please try again during business hours.')}
          />
          <View style={styles.contactSpacing} />
          <ContactOption
            icon="phone"
            title="Call Support"
            subtitle="1-800-OPTISCHED"
            onPress={() => Linking.openURL('tel:18007884723')}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default Help

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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchPlaceholder: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  quickHelpGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickHelpCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickHelpTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  quickHelpSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  questionsContainer: {
    marginTop: 8,
  },
  questionItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  contactSpacing: {
    height: 12,
  },
})
