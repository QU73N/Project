import { Pressable, StyleSheet, Text, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router'
import { Colors } from '../../constants/Colors'

const mainDashboard = () => {
  const navigation = useNavigation();

  {/*const accountPress = () => {
    console.log('Account button pressed');
  }
  const overviewPress = () => {
    console.log('Overview button pressed');
  }
  const settingPress = () => {
    console.log('Settings button pressed');
  }
  const aiPress = () => {
    console.log('AI button pressed');
  }
  const schedPress = () => {
    console.log('Schedule button pressed');
  }*/}
  return (
    <View style={styles.container}>
      <View style={styles.headerDashboard}>
        <Text style={styles.textDashboard}>Dashboard</Text>
      </View>

        {/* <View style={styles.menuContainer}>
          <Pressable onPress = {schedPress} style={({pressed}) => [styles.schedPress, pressed && styles.pressedSchedPress]}>
            <FontAwesome name="calendar" size={35} style={styles.schedIcon}/>
          </Pressable>

          <Pressable onPress={overviewPress} style={({pressed}) => [styles.overviewPress, pressed && styles.pressedOverviewPress]}>
            <FontAwesome name="home" size={35} style={styles.overviewIcon}/>
          </Pressable>

          <Pressable onPress={settingPress}
          style={({pressed}) => [styles.settingPress, pressed && styles.pressedSettingPress]}>
            <FontAwesome name="cog" size={35} style={styles.settingIcon}/>
          </Pressable>

          <Pressable onPress={aiPress}
          style={({pressed}) => [styles.aiPress, pressed && styles.pressedAiPress]}>
            <FontAwesome name="comment" size={35} style={styles.aiIcon}/>
          </Pressable>

          <Pressable onPress={accountPress} 
          style={({pressed}) => [styles.accountPress, pressed && styles.pressedAccountPress]}>
            <FontAwesome name="user" size={35} style={styles.accountIcon}/>
          </Pressable>
        </View> */}

        <Link href='/' style={styles.goBack}>Go Back</Link>

        <View style={styles.notifContainer}>
          <Text style={styles.notifText}>Notification</Text>
          <FontAwesome name="bell" size={18} style={{position: 'absolute', top: '12%', right: '32%', color: Colors.darkBlue}}/>
        </View>
        <View style={styles.schedContainer}>
          <Text style={styles.schedText}>Schedule</Text>

          <View style={styles.calendarContainer}>

          </View>
        </View>
    </View>
  )
}

export default mainDashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDashboard: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '10%',
    backgroundColor: Colors.lightBlue,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  textDashboard: {
    position: 'absolute',
    top: '50%',
    left: '5%',
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  /*menuContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '10%',
    backgroundColor: Colors.lightBlue,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)',
  },*/
    goBack: {
      position: 'absolute',
      bottom: '10%',
      fontSize: 18,
    },
    notifContainer: {
      position: 'absolute',
      top: '15%',
      width: '90%',
      height: '20%',
      backgroundColor: Colors.white,
      borderRadius: 20,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    notifText: {
      fontSize: 18,
      fontWeight: 'bold',
      position: 'absolute',
      top: '10%',
      left: '35%',
      color: Colors.darkBlue,
    },
    schedContainer: {
      position: 'absolute',
      top: '40%',
      width: '90%',
      height: '40%',
      backgroundColor: Colors.white,
      borderRadius: 20,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    schedText: {
      fontSize: 28,
      fontWeight: 'bold',
      position: 'absolute',
      top: '5%',
      color: Colors.darkBlue,
    },
    calendarContainer: {
      position: 'absolute',
      top: '20%',
      width: '90%',
      height: '70%',
      backgroundColor: Colors.lightestBlue,
      borderRadius: 10,
      outlineColor: Colors.darkBlue,
      outlineWidth: 2,
    },

    /*accountPress: {
      position: 'absolute',
      top: '20%',
      right: '7%',
      padding: 10,
      borderRadius: 50,
    },
    pressedAccountPress: {
      backgroundColor: Colors.blue,
    },
    accountIcon: {
      color: Colors.white,
    },
    schedPress: {
      position: 'absolute',
      top: '20%',
      left: '7%',
      padding: 10,
      borderRadius: 50,
    },
    pressedSchedPress: {
      backgroundColor: Colors.blue,
    },
    schedIcon: {
      color: Colors.white,
    },
    settingPress: {
      position: 'absolute',
      top: '20%',
      left: '50%',
      transform: [{ translateX: -25 }],
      padding: 10,
      borderRadius: 50,
    },
    pressedSettingPress: {
      backgroundColor: Colors.blue,
    },
    settingIcon: {
      color: Colors.white,
    },
    overviewPress: {
      position: 'absolute',
      top: '20%',
      left: '25%',
      padding: 10,
      borderRadius: 50,
    },
    pressedOverviewPress: {
      backgroundColor: Colors.blue,
    },
    overviewIcon: {
      color: Colors.white,
    },
    aiPress: {
      position: 'absolute',
      top: '20%',
      right: '25%',
      padding: 10,
      borderRadius: 50,
    },
    pressedAiPress: {
      backgroundColor: Colors.blue,
    },
    aiIcon: {
      color: Colors.white,
    },*/ 
})