import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import React, { useContext, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeContext } from '../../contexts/ThemeContext'

const FontSettings = () => {
  const router = useRouter()
  const { colors } = useContext(ThemeContext)
  const [fontSize, setFontSize] = useState(16)

  const fontSizes = [
    { label: 'Small', size: 14 },
    { label: 'Medium', size: 16 },
    { label: 'Large', size: 18 },
    { label: 'Extra Large', size: 20 },
  ]

  const handleFontSizeChange = (size) => {
    setFontSize(size)
    // Save to user preferences or context
    Alert.alert('Font Size Changed', `Font size set to ${size}px`)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Font Size</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Text Size</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Choose the font size that's most comfortable for you
          </Text>
          
          <View style={[styles.sizeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {fontSizes.map((option) => (
              <TouchableOpacity
                key={option.size}
                style={[
                  styles.sizeOption,
                  { 
                    backgroundColor: fontSize === option.size ? colors.primary + '20' : 'transparent',
                    borderColor: fontSize === option.size ? colors.primary : colors.border
                  }
                ]}
                onPress={() => handleFontSizeChange(option.size)}
              >
                <View style={styles.sizeContent}>
                  <Text style={[styles.sizeLabel, { color: colors.text, fontSize: option.size }]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.sizePreview, { color: colors.textSecondary, fontSize: option.size }]}>
                    Sample text preview
                  </Text>
                </View>
                {fontSize === option.size && (
                  <FontAwesome name="check" size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preview</Text>
          <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.previewTitle, { color: colors.text, fontSize: fontSize + 4 }]}>
              Schedule Overview
            </Text>
            <Text style={[styles.previewText, { color: colors.textSecondary, fontSize: fontSize }]}>
              Monday, February 25, 2025
            </Text>
            <View style={styles.previewItem}>
              <Text style={[styles.previewTime, { color: colors.primary, fontSize: fontSize }]}>
                8:00 AM
              </Text>
              <Text style={[styles.previewClass, { color: colors.text, fontSize: fontSize }]}>
                Mathematics - Calculus
              </Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={[styles.previewTime, { color: colors.primary, fontSize: fontSize }]}>
                10:00 AM
              </Text>
              <Text style={[styles.previewClass, { color: colors.text, fontSize: fontSize }]}>
                Physics - Quantum Mechanics
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default FontSettings

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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  sizeCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sizeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  sizeContent: {
    flex: 1,
  },
  sizeLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  sizePreview: {
    fontWeight: '400',
  },
  previewCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  previewTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  previewText: {
    fontWeight: '500',
    marginBottom: 16,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewTime: {
    fontWeight: '600',
    marginRight: 16,
    minWidth: 60,
  },
  previewClass: {
    flex: 1,
    fontWeight: '500',
  },
})
