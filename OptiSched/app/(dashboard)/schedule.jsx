import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Modal, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect, useContext } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../../constants/Colors'
import { ThemeContext } from '../../contexts/ThemeContext'

const { width, height } = Dimensions.get('window')

const schedule = () => {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentWeek, setCurrentWeek] = useState([])
  const [viewMode, setViewMode] = useState('week') // 'week' or 'month'
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [showSubjectDetail, setShowSubjectDetail] = useState(false)

  const subjects = [
    {
      id: 1,
      name: "Physical Education and Health 4",
      teacher: "HABANA Jr, EDGAR P.",
      day: "Monday",
      time: "7:00 AM - 9:00 AM",
      color: "#10b981",
      duration: 120, // minutes
      room: "Gymnasium",
      type: "Physical Education"
    },
    {
      id: 2,
      name: "Computer/Web Programming 6 - Computer Programming NC III (.NET Technology)",
      teacher: "Calizon, John Michael",
      day: "Monday",
      time: "10:00 AM - 1:00 PM",
      color: Colors.lightBlue,
      duration: 180,
      room: "Computer Lab 2",
      type: "Programming"
    },
    {
      id: 3,
      name: "Mobile App Programming 2",
      teacher: "MARIANO, Psalmmirac Le Pineda",
      day: "Monday",
      time: "1:00 PM - 4:00 PM",
      color: "#8b5cf6",
      duration: 180,
      room: "Computer Lab 1",
      type: "Programming"
    },
    {
      id: 4,
      name: "Contemporary Arts from the regions",
      teacher: "HABANA Jr., Edgar P.",
      day: "Tuesday",
      time: "10:00 AM - 1:00 PM",
      color: "#ec4899",
      duration: 180,
      room: "Art Room",
      type: "Arts"
    },
    {
      id: 5,
      name: "Homeroom",
      teacher: "HABANA Jr., Edgar P.",
      day: "Tuesday",
      time: "2:00 PM - 4:00 PM",
      color: "#f59e0b",
      duration: 120,
      room: "Classroom 101",
      type: "Homeroom"
    },
    {
      id: 6,
      name: "Work Immersion-Practicum Type",
      teacher: "ELLO Jr., EGNACIO Y",
      day: "Tuesday",
      time: "2:00 PM - 4:00 PM",
      color: "#ef4444",
      duration: 120,
      room: "Workshop",
      type: "Practical"
    },
    {
      id: 7,
      name: "Inquiries Investigation and Immersion",
      teacher: "MAGNO, BEA ANGLY",
      day: "Tuesday & Thursday",
      time: "8:30 AM - 10:00 AM",
      color: "#06b6d4",
      duration: 90,
      room: "Library",
      type: "Research"
    },
    {
      id: 8,
      name: "Empowerment Technologies: ICT",
      teacher: "Calizon, John Michael",
      day: "Thursday",
      time: "10:00 AM - 1:00 PM",
      color: Colors.lightBlue,
      duration: 180,
      room: "Computer Lab 3",
      type: "Technology"
    },
    {
      id: 9,
      name: "Entrepreneurship",
      teacher: "ARNADO, RENEIL P.",
      day: "Thursday",
      time: "2:30 PM - 5:20 PM",
      color: "#84cc16",
      duration: 170,
      room: "Business Room",
      type: "Business"
    }
  ]

  // Generate current week dates
  useEffect(() => {
    generateWeekDates(new Date())
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const generateWeekDates = (date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek)
      weekDate.setDate(startOfWeek.getDate() + i)
      week.push(weekDate)
    }
    setCurrentWeek(week)
  }

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

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  const getSubjectsForDay = (dayName) => {
    return subjects.filter(subject => 
      subject.day === dayName || subject.day.includes(dayName)
    )
  }

  const timeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(' ')
    const [hours, minutes] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes
    return period === 'PM' && hours !== 12 ? totalMinutes + 720 : totalMinutes
  }

  const getCurrentTimePosition = () => {
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const startOfDay = 6 * 60 // 6:00 AM start
    return ((currentMinutes - startOfDay) / (14 * 60)) * 100 // 6 AM to 8 PM = 14 hours
  }

  const handleSubjectPress = (subject) => {
    setSelectedSubject(subject)
    setShowSubjectDetail(true)
  }

  const SubjectDetailModal = () => {
    if (!selectedSubject) return null

    return (
      <Modal
        visible={showSubjectDetail}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSubjectDetail(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalColorIndicator, { backgroundColor: selectedSubject.color }]} />
              <TouchableOpacity 
                style={[styles.modalCloseButton, { backgroundColor: colors.border }]}
                onPress={() => setShowSubjectDetail(false)}
              >
                <FontAwesome name="times" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalSubjectName, { color: colors.text }]}>{selectedSubject.name}</Text>
            <Text style={[styles.modalSubjectType, { color: colors.textSecondary }]}>{selectedSubject.type}</Text>
            
            <View style={styles.modalDetails}>
              <View style={styles.modalDetailItem}>
                <FontAwesome name="user" size={16} color={colors.textSecondary} />
                <Text style={[styles.modalDetailText, { color: colors.text }]}>{selectedSubject.teacher}</Text>
              </View>
              
              <View style={styles.modalDetailItem}>
                <FontAwesome name="clock-o" size={16} color={colors.textSecondary} />
                <Text style={[styles.modalDetailText, { color: colors.text }]}>{selectedSubject.time}</Text>
              </View>
              
              <View style={styles.modalDetailItem}>
                <FontAwesome name="map-marker" size={16} color={colors.textSecondary} />
                <Text style={[styles.modalDetailText, { color: colors.text }]}>{selectedSubject.room}</Text>
              </View>
              
              <View style={styles.modalDetailItem}>
                <FontAwesome name="calendar" size={16} color={colors.textSecondary} />
                <Text style={[styles.modalDetailText, { color: colors.text }]}>{selectedSubject.day}</Text>
              </View>
              
              <View style={styles.modalDetailItem}>
                <FontAwesome name="hourglass-half" size={16} color={colors.textSecondary} />
                <Text style={[styles.modalDetailText, { color: colors.text }]}>{selectedSubject.duration} minutes</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.modalActionButton, { backgroundColor: selectedSubject.color }]}
              onPress={() => setShowSubjectDetail(false)}
            >
              <Text style={styles.modalActionText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  const WeekView = () => {
    const timeSlots = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00']
    
    return (
      <View style={[styles.weekContainer, { backgroundColor: colors.card }]}>
        <View style={[styles.timeColumn, { borderRightColor: colors.border }]}>
          {timeSlots.map((time, index) => (
            <View key={index} style={[styles.timeSlotHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.timeSlotHeaderText, { color: colors.textSecondary }]}>
                {parseInt(time) > 12 ? `${parseInt(time) - 12}:00 PM` : `${time}:00 AM`}
              </Text>
            </View>
          ))}
        </View>
        
        {currentWeek.map((date, dayIndex) => {
          const dayName = getDayName(date)
          const daySubjects = getSubjectsForDay(dayName)
          
          return (
            <View key={dayIndex} style={[
              styles.dayColumn,
              { borderRightColor: colors.border },
              isToday(date) && { backgroundColor: colors.primary + '10' },
              isSelected(date) && { backgroundColor: colors.warning + '20' }
            ]}>
              <TouchableOpacity 
                style={[styles.dayHeader, { borderBottomColor: colors.border }]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dayHeaderText, { color: colors.text }]}>{dayName.slice(0, 3)}</Text>
                <Text style={[styles.dayDateText, { color: colors.text }]}>{date.getDate()}</Text>
                {isToday(date) && <View style={[styles.todayIndicator, { backgroundColor: colors.primary }]} />}
              </TouchableOpacity>
              
              {timeSlots.map((time, slotIndex) => {
                const hour = parseInt(time)
                const subjectsAtTime = daySubjects.filter(subject => {
                  const subjectStart = timeToMinutes(subject.time.split(' - ')[0])
                  const subjectEnd = timeToMinutes(subject.time.split(' - ')[1])
                  const currentSlot = hour > 12 ? (hour - 12) * 60 : hour * 60
                  return currentSlot >= subjectStart && currentSlot < subjectEnd
                })
                
                return (
                  <View key={slotIndex} style={[styles.dayTimeSlot, { borderBottomColor: colors.border }]}>
                    {subjectsAtTime.map((subject, subjIndex) => (
                      <TouchableOpacity 
                        key={subjIndex} 
                        style={[styles.daySubjectBlock, { backgroundColor: subject.color }]}
                        onPress={() => handleSubjectPress(subject)}
                      >
                        <Text style={styles.daySubjectText}>{subject.name.split(' ').slice(0, 2).join(' ')}</Text>
                        <Text style={styles.dayTeacherText}>{subject.teacher.split(',')[0]}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )
              })}
            </View>
          )
        })}
        
        {isToday(new Date()) && (
          <View style={[styles.currentTimeLine, { top: `${getCurrentTimePosition()}%` }]}>
            <View style={styles.currentTimeDot} />
          </View>
        )}
      </View>
    )
  }

  const DayView = () => {
    const dayName = getDayName(selectedDate)
    const daySubjects = getSubjectsForDay(dayName)
    
    return (
      <View style={styles.dayViewContainer}>
        <View style={styles.dayViewHeader}>
          <Text style={[styles.dayViewTitle, { color: colors.text }]}>{formatDate(selectedDate)}</Text>
          <Text style={[styles.dayViewSubtitle, { color: colors.textSecondary }]}>{daySubjects.length} classes scheduled</Text>
        </View>
        
        <View style={styles.daySchedule}>
          {daySubjects.map((subject, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.dayScheduleItem, { backgroundColor: colors.card }]}
              onPress={() => handleSubjectPress(subject)}
            >
              <View style={[styles.dayScheduleTime, { backgroundColor: subject.color }]}>
                <Text style={styles.dayScheduleTimeText}>{subject.time}</Text>
              </View>
              <View style={styles.dayScheduleContent}>
                <Text style={[styles.dayScheduleSubject, { color: colors.text }]}>{subject.name}</Text>
                <Text style={[styles.dayScheduleTeacher, { color: colors.textSecondary }]}>{subject.teacher}</Text>
                <View style={styles.dayScheduleDuration}>
                  <FontAwesome name="clock-o" size={12} color={colors.textSecondary} />
                  <Text style={[styles.durationText, { color: colors.textSecondary }]}>{subject.duration} minutes</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Schedule Calendar</Text>
          <Text style={[styles.currentDateTime, { color: colors.textSecondary }]}>{formatDate(currentDate)} • {formatTime(currentDate)}</Text>
        </View>
        <View style={[styles.viewToggle, { backgroundColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'week' && styles.toggleButtonActive, { backgroundColor: viewMode === 'week' ? colors.card : 'transparent' }]}
            onPress={() => setViewMode('week')}
          >
            <Text style={[styles.toggleButtonText, viewMode === 'week' && styles.toggleButtonTextActive, { color: viewMode === 'week' ? colors.text : colors.textSecondary }]}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'day' && styles.toggleButtonActive, { backgroundColor: viewMode === 'day' ? colors.card : 'transparent' }]}
            onPress={() => setViewMode('day')}
          >
            <Text style={[styles.toggleButtonText, viewMode === 'day' && styles.toggleButtonTextActive, { color: viewMode === 'day' ? colors.text : colors.textSecondary }]}>Day</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation */}
      <View style={[styles.navigation, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: colors.border }]}>
          <FontAwesome name="chevron-left" size={16} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.navText, { color: colors.text }]}>Current Week</Text>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: colors.border }]}>
          <FontAwesome name="chevron-right" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {viewMode === 'week' ? <WeekView /> : <DayView />}
        
        {/* Quick Actions - Moved to bottom */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <Pressable 
              style={({pressed}) => [styles.actionCard, { backgroundColor: colors.card }, pressed && styles.actionCardPressed]}
              onPress={() => navigation.navigate('mainDashboard')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                <FontAwesome name="home" size={20} color="#ffffff" />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>Dashboard</Text>
                <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>Back to home</Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
            </Pressable>
            <Pressable 
              style={({pressed}) => [styles.actionCard, { backgroundColor: colors.card }, pressed && styles.actionCardPressed]}
              onPress={() => navigation.navigate('settings')}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#8b5cf6" }]}>
                <FontAwesome name="cog" size={20} color="#ffffff" />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>Settings</Text>
                <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>App preferences</Text>
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
        </View>
      </ScrollView>

      {/* Subject Detail Modal */}
      <SubjectDetailModal />
    </View>
  )
}

export default schedule

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  currentDateTime: {
    fontSize: 14,
    marginTop: 4,
  },
  viewToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    fontWeight: '600',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  weekContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  timeColumn: {
    width: 60,
    borderRightWidth: 1,
  },
  timeSlotHeader: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  timeSlotHeaderText: {
    fontSize: 10,
    fontWeight: '500',
  },
  dayColumn: {
    flex: 1,
    borderRightWidth: 1,
  },
  dayHeader: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    position: 'relative',
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dayDateText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dayTimeSlot: {
    height: 60,
    borderBottomWidth: 1,
    padding: 2,
  },
  daySubjectBlock: {
    flex: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
  },
  daySubjectText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  dayTeacherText: {
    fontSize: 8,
    color: '#ffffff',
    opacity: 0.8,
  },
  currentTimeLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#ef4444',
    zIndex: 10,
  },
  currentTimeDot: {
    position: 'absolute',
    left: -4,
    top: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
  },
  dayViewContainer: {
    padding: 20,
  },
  dayViewHeader: {
    marginBottom: 20,
  },
  dayViewTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  dayViewSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  daySchedule: {
    gap: 12,
  },
  dayScheduleItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dayScheduleTime: {
    width: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dayScheduleTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  dayScheduleContent: {
    flex: 1,
  },
  dayScheduleSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayScheduleTeacher: {
    fontSize: 14,
    marginBottom: 8,
  },
  dayScheduleDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
  },
  quickActionsSection: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubjectName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalSubjectType: {
    fontSize: 14,
    marginBottom: 20,
  },
  modalDetails: {
    gap: 12,
    marginBottom: 24,
  },
  modalDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalDetailText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
})
