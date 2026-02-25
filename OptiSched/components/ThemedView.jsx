import { View, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'

const ThemedView = ({ style, ...props}) => {

    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

  return (
    <View style={[{
         backgroundColor: '#f8f9fa' }, style]} {...props}
    />
  )
}

export default ThemedView