import { Pressable, StyleSheet, Text, View, ScrollView, Dimensions, Animated, Image } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { useState, useRef, useEffect, useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { ThemeContext } from '../../contexts/ThemeContext'

const { width, height } = Dimensions.get('window')

const mainDashboard = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext)
  const { colors } = useContext(ThemeContext)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const [currentDate, setCurrentDate] = useState(new Date())
  const [todaySchedule, setTodaySchedule] = useState([])

  const subjects = [
    {
      name: "Physical Education and Health 4",
      teacher: "HABANA Jr, EDGAR P.",
      day: "Monday",
      time: "7:00 AM - 9:00 AM",
      color: "#10b981"
    },
    {
      name: "Computer/Web Programming 6 - Computer Programming NC III (.NET Technology)",
      teacher: "Calizon, John Michael",
      day: "Monday",
      time: "10:00 AM - 1:00 PM",
      color: Colors.lightBlue
    },
    {
      name: "Mobile App Programming 2",
      teacher: "MARIANO, Psalmmirac Le Pineda",
      day: "Monday",
      time: "1:00 PM - 4:00 PM",
      color: "#8b5cf6"
    },
    {
      name: "Contemporary Arts from the regions",
      teacher: "HABANA Jr., Edgar P.",
      day: "Tuesday",
      time: "10:00 AM - 1:00 PM",
      color: "#ec4899"
    },
    {
      name: "Homeroom",
      teacher: "HABANA Jr., Edgar P.",
      day: "Tuesday",
      time: "2:00 PM - 4:00 PM",
      color: "#f59e0b"
    },
    {
      name: "Work Immersion-Practicum Type",
      teacher: "ELLO Jr., EGNACIO Y",
      day: "Tuesday",
      time: "2:00 PM - 4:00 PM",
      color: "#ef4444"
    },
    {
      name: "Inquiries Investigation and Immersion",
      teacher: "MAGNO, BEA ANGLY",
      day: "Tuesday & Thursday",
      time: "8:30 AM - 10:00 AM",
      color: "#06b6d4"
    },
    {
      name: "Empowerment Technologies: ICT",
      teacher: "Calizon, John Michael",
      day: "Thursday",
      time: "10:00 AM - 1:00 PM",
      color: Colors.lightBlue
    },
    {
      name: "Entrepreneurship",
      teacher: "ARNADO, RENEIL P.",
      day: "Thursday",
      time: "2:30 PM - 5:20 PM",
      color: "#84cc16"
    }
  ]

  // Update current time and today's schedule
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentDate(now)
      
      // Get current day name
      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
      
      // Filter subjects for today
      const todaySubjects = subjects.filter(subject => 
        subject.day === dayName || subject.day.includes(dayName)
      )
      
      setTodaySchedule(todaySubjects)
    }

    // Initial update
    updateDateTime()

    // Update every minute
    const timer = setInterval(updateDateTime, 60000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

  const SubjectCard = ({ subject, index }) => (
    <Animated.View 
      style={[
        styles.subjectCard,
        { 
          opacity: fadeAnim, 
          transform: [{ translateY: slideAnim }],
          borderLeftColor: subject.color,
          backgroundColor: colors.card
        }
      ]}
    >
      <View style={styles.subjectHeader}>
        <View style={[styles.subjectDay, { backgroundColor: colors.border }]}>
          <Text style={[styles.dayText, { color: colors.text }]}>{subject.day}</Text>
        </View>
        <View style={[styles.subjectColor, { backgroundColor: subject.color }]} />
      </View>
      <Text style={[styles.subjectName, { color: colors.text }]}>{subject.name}</Text>
      <Text style={[styles.subjectTeacher, { color: colors.textSecondary }]}>{subject.teacher}</Text>
      <View style={styles.subjectTime}>
        <FontAwesome name="clock-o" size={14} color={colors.textSecondary} />
        <Text style={[styles.timeText, { color: colors.textSecondary }]}>{subject.time}</Text>
      </View>
    </Animated.View>
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View style={[styles.header, { backgroundColor: colors.card, opacity: fadeAnim }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good {currentDate.getHours() < 12 ? 'Morning' : currentDate.getHours() < 18 ? 'Afternoon' : 'Evening'}!</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Schedule</Text>
          <Text style={[styles.currentDateTime, { color: colors.textSecondary }]}>{formatDate(currentDate)} • {formatTime(currentDate)}</Text>
        </View>
        <View style={styles.profileSection}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profilePicture} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}</Text>
            </View>
          )}
          <Text style={[styles.userName, { color: colors.text }]}>{user.name || 'User'}</Text>
        </View>
      </Animated.View>

      {/* Today's Overview */}
      <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Classes</Text>
        <View style={[styles.todayCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.todayHeader}>
            <Text style={[styles.todayDate, { color: colors.text }]}>{getDayName(currentDate)}</Text>
            <Text style={[styles.todayCount, { color: colors.textSecondary }]}>{todaySchedule.length} classes</Text>
          </View>
          <View style={styles.todaySubjects}>
            {todaySchedule.length > 0 ? (
              todaySchedule.map((subject, index) => (
                <View key={index} style={styles.todaySubject}>
                  <View style={[styles.todayDot, { backgroundColor: subject.color }]} />
                  <Text style={[styles.todaySubjectName, { color: colors.text }]}>{subject.name.split(' ').slice(0, 3).join(' ')}...</Text>
                  <Text style={[styles.todayTime, { color: colors.textSecondary }]}>{subject.time}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.noClassesText, { color: colors.textSecondary }]}>No classes scheduled for today</Text>
            )}
          </View>
        </View>
      </Animated.View>

      {/* All Subjects */}
      <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Complete Schedule</Text>
        <View style={styles.subjectsGrid}>
          {subjects.map((subject, index) => (
            <SubjectCard key={index} subject={subject} index={index} />
          ))}
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <Pressable 
            style={({pressed}) => [styles.actionCard, { backgroundColor: colors.card }, pressed && styles.actionCardPressed]}
            onPress={() => navigation.navigate('schedule')}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
              <FontAwesome name="calendar" size={20} color="#ffffff" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>View Calendar</Text>
              <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>See weekly schedule</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
          </Pressable>
          <Pressable 
            style={({pressed}) => [styles.actionCard, { backgroundColor: colors.card }, pressed && styles.actionCardPressed]}
            onPress={() => navigation.navigate('settings')}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#8b5cf6" }]}>
              <FontAwesome name="bell" size={20} color="#ffffff" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Reminders</Text>
              <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>Class notifications</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
          </Pressable>
          <Pressable 
            style={({pressed}) => [styles.actionCard, { backgroundColor: colors.card }, pressed && styles.actionCardPressed]}
            onPress={() => navigation.navigate('profile')}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#10b981" }]}>
              <FontAwesome name="user" size={20} color="#ffffff" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Profile</Text>
              <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>View your info</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
          </Pressable>
          <Pressable 
            style={({pressed}) => [styles.actionCard, { backgroundColor: colors.card }, pressed && styles.actionCardPressed]}
            onPress={() => navigation.navigate('ai')}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#f59e0b" }]}>
              <FontAwesome name="magic" size={20} color="#ffffff" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>AI Assistant</Text>
              <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>Get help</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
          </Pressable>
        </View>
      </Animated.View>

      <View style={styles.footerSpacing} />
    </ScrollView>
  )
}

export default mainDashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  greeting: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.darkBlue,
    marginTop: 4,
  },
  currentDateTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileSection: {
    alignItems: 'center',
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.darkBlue,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.darkBlue,
    marginBottom: 16,
  },
  todayCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  todayDate: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.darkBlue,
  },
  todayCount: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  todaySubjects: {
    gap: 12,
  },
  todaySubject: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  todaySubjectName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.darkBlue,
  },
  todayTime: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  noClassesText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  subjectsGrid: {
    gap: 16,
  },
  subjectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.lightBlue,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectDay: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.darkBlue,
  },
  subjectColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkBlue,
    marginBottom: 4,
  },
  subjectTeacher: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  subjectTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionCardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkBlue,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  footerSpacing: {
    height: 40,
  },
})