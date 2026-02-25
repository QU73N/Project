import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useContext } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../../constants/Colors'
import * as ImagePicker from 'expo-image-picker'
import { UserContext } from '../../contexts/UserContext'
import { ThemeContext } from '../../contexts/ThemeContext'

const profile = () => {
  const { user, updateUserProfile } = useContext(UserContext)
  const { colors } = useContext(ThemeContext)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to change your profile picture')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8
    })

    if (!result.canceled) {
      updateUserProfile({ profileImage: result.assets[0].uri })
      Alert.alert('Success', 'Profile picture updated successfully!')
    }
  }

  const ProfileField = ({ label, value, multiline = false, colors }) => (
    <View style={styles.profileField}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.fieldValue, { color: colors.text }, multiline && styles.fieldValueMultiline]}>{value}</Text>
    </View>
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
      </View>

      {/* Profile Picture Section */}
      <View style={[styles.profilePictureSection, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.profilePictureContainer} onPress={pickImage}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profilePicture} />
          ) : (
            <View style={[styles.profilePicturePlaceholder, { backgroundColor: colors.border }]}>
              <FontAwesome name="user" size={40} color={colors.textSecondary} />
            </View>
          )}
          <View style={styles.cameraOverlay}>
            <FontAwesome name="camera" size={20} color="#ffffff" />
          </View>
        </TouchableOpacity>
        <Text style={[styles.changePictureText, { color: colors.textSecondary }]}>Tap to change picture</Text>
      </View>

      {/* Profile Information */}
      <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
        
        <ProfileField
          label="Full Name"
          value={user.name}
          colors={colors}
        />
        
        <ProfileField
          label="Student ID"
          value={user.id}
          colors={colors}
        />
        
        <ProfileField
          label="Date of Birth"
          value={user.dateOfBirth}
          colors={colors}
        />
        
        <ProfileField
          label="Address"
          value={user.address}
          multiline={true}
          colors={colors}
        />
      </View>

      {/* Academic Information */}
      <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Academic Information</Text>
        
        <ProfileField
          label="Strand"
          value={user.strand}
          colors={colors}
        />
        
        <ProfileField
          label="Section"
          value={user.section}
          colors={colors}
        />
      </View>

      <View style={styles.footerSpacing} />
    </ScrollView>
  )
}

export default profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  changePictureText: {
    fontSize: 14,
    fontWeight: '500',
  },
  profileSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  profileField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 16,
    color: Colors.darkBlue,
    fontWeight: '500',
  },
  fieldValueMultiline: {
    lineHeight: 22,
  },
  footerSpacing: {
    height: 40,
  },
})