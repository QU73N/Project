import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import React, { useContext, useState, useRef } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeContext } from '../../contexts/ThemeContext'
import { UserContext } from '../../contexts/UserContext'
import AIService from '../../services/aiService'

const AI = () => {
  const { colors } = useContext(ThemeContext)
  const { user } = useContext(UserContext)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your AI academic assistant. I can help you with:\n\n• Schedule optimization\n• Study tips and techniques\n• Assignment planning\n• Academic questions\n• Time management advice\n\nHow can I help you today?", isAI: true, timestamp: new Date() }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('chat')
  const scrollViewRef = useRef(null)

  const categories = [
    { id: 'chat', title: 'Chat', icon: 'comments' },
    { id: 'schedule', title: 'Schedule Help', icon: 'calendar' },
    { id: 'study', title: 'Study Tips', icon: 'graduation-cap' },
    { id: 'assignment', title: 'Assignment Plan', icon: 'clipboard' },
  ]

  const quickActions = [
    { id: 'optimize', title: 'Optimize My Schedule', category: 'schedule' },
    { id: 'study-tips', title: 'Study Techniques', category: 'study' },
    { id: 'break-schedule', title: 'Break Suggestions', category: 'schedule' },
    { id: 'time-management', title: 'Time Management', category: 'study' },
  ]

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isAI: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)

    try {
      let response

      if (selectedCategory === 'schedule') {
        // Mock schedule data - in real app, get from user context
        const mockSchedule = {
          classes: [
            { subject: 'Mathematics', time: '8:00 AM', duration: '1 hour' },
            { subject: 'Physics', time: '10:00 AM', duration: '1 hour' },
            { subject: 'Chemistry', time: '2:00 PM', duration: '1 hour' }
          ],
          freeTime: ['9:00 AM - 10:00 AM', '11:00 AM - 2:00 PM', '3:00 PM - 5:00 PM']
        }
        
        response = await AIService.generateScheduleOptimization(mockSchedule, {
          studyGoals: 'improve grades',
          difficulty: 'medium',
          preferences: 'morning study sessions'
        })
      } else if (selectedCategory === 'study') {
        response = await AIService.getStudyAdvice('general', 'high school', '2 hours daily')
      } else if (selectedCategory === 'assignment') {
        response = await AIService.generateAssignmentPlan(
          { subject: 'Mathematics', type: 'Homework', topics: ['Algebra', 'Geometry'] },
          '3 days'
        )
      } else {
        // General chat
        response = await AIService.answerAcademicQuestion(inputText)
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        isAI: true,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI Error:', error)
      
      // Handle specific API errors
      let errorMessage = "I'm having trouble connecting right now. Let me help you with some general advice instead."
      
      if (error.message === 'INVALID_API_KEY') {
        errorMessage = "AI service is not configured yet. Please set up your API key to get full AI assistance. Using helpful tips for now!"
      } else if (error.message === 'RATE_LIMIT_EXCEEDED') {
        errorMessage = "AI service is temporarily unavailable due to high demand. Please wait a few minutes before trying again. In the meantime, I can help with study tips and guidance!"
      } else if (error.message.startsWith('RATE_LIMIT')) {
        const retryAfter = parseInt(error.message.split(':')[1]) || 20
        errorMessage = `Rate limit reached. Retrying in ${retryAfter} seconds... This helps ensure fair usage for all students.`
        // Don't show fallback message yet, let retry happen
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: errorMessage,
          isAI: true,
          timestamp: new Date()
        }])
        setIsLoading(false)
        return
      }
      
      // Fallback response
      const fallbackMessage = {
        id: Date.now() + 1,
        text: AIService.generateFallbackResponse(selectedCategory, inputText),
        isAI: true,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, fallbackMessage])
      
      // Show appropriate alert for API key issues
      if (error.message === 'INVALID_API_KEY') {
        Alert.alert(
          'AI Service Setup Required',
          'To get full AI assistance, you need to configure an API key:\n\n1. Copy .env.example to .env\n2. Add your OpenAI or Gemini API key\n3. Restart the app\n\nThe app will work with helpful tips in the meantime!',
          [
            { text: 'Use Tips Mode', style: 'default' },
            { text: 'Setup Guide', onPress: () => {
              Alert.alert(
                'API Key Setup',
                'Get your free API key:\n\n• OpenAI: platform.openai.com/api-keys\n• Gemini: makersuite.google.com/app/apikey\n\nAdd it to your .env file as EXPO_PUBLIC_OPENAI_API_KEY or EXPO_PUBLIC_GEMINI_API_KEY'
              )
            }}
          ]
        )
      } else if (error.message === 'RATE_LIMIT_EXCEEDED') {
        Alert.alert(
          'Rate Limit Exceeded',
          'You\'ve reached the usage limit for the AI service. This helps ensure fair access for all users.\n\nSuggestions:\n• Wait a few minutes before trying again\n• Use the study tips and guidance available\n• Consider upgrading your API plan for higher limits',
          [{ text: 'Got it', style: 'default' }]
        )
      }
    } finally {
      setIsLoading(false)
      
      // Scroll to bottom after response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }

  const handleQuickAction = (action) => {
    setSelectedCategory(action.category)
    setInputText(action.title)
  }

  const MessageBubble = ({ message }) => (
    <View style={[
      styles.messageContainer,
      message.isAI ? styles.aiMessage : styles.userMessage
    ]}>
      <View style={[
        styles.messageBubble,
        { backgroundColor: message.isAI ? colors.card : colors.primary }
      ]}>
        <Text style={[
          styles.messageText,
          { color: message.isAI ? colors.text : '#ffffff' }
        ]}>
          {message.text}
        </Text>
        <Text style={[
          styles.messageTime,
          { color: message.isAI ? colors.textSecondary : '#ffffff80' }
        ]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <FontAwesome name="robot" size={24} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>AI Assistant</Text>
        </View>
        <TouchableOpacity style={styles.infoButton}>
          <FontAwesome name="info-circle" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={[styles.categoryContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                { 
                  backgroundColor: selectedCategory === category.id ? colors.primary + '20' : 'transparent',
                  borderColor: selectedCategory === category.id ? colors.primary : 'transparent'
                }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <FontAwesome 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.id ? colors.primary : colors.textSecondary} 
              />
              <Text style={[
                styles.categoryText,
                { color: selectedCategory === category.id ? colors.primary : colors.textSecondary }
              ]}>
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      {selectedCategory !== 'chat' && (
        <View style={styles.quickActionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickActions
              .filter(action => action.category === selectedCategory)
              .map(action => (
                <TouchableOpacity
                  key={action.id}
                  style={[styles.quickAction, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => handleQuickAction(action)}
                >
                  <Text style={[styles.quickActionText, { color: colors.text }]}>
                    {action.title}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <View style={[styles.loadingBubble, { backgroundColor: colors.card }]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                AI is thinking...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything about your studies..."
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() && !isLoading ? colors.primary : colors.border }
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <FontAwesome 
              name="send" 
              size={16} 
              color={inputText.trim() && !isLoading ? '#ffffff' : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default AI

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
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  infoButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  quickAction: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    fontWeight: '400',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    maxHeight: 100,
    paddingHorizontal: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
})