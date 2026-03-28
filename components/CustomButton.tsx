import { Text, TouchableOpacity, View, ViewStyle } from 'react-native'

interface CustomButtonProps {
  text: string
  onPress: () => void
  variant: 'outline' | 'filled'
}

const CustomButton = ({ text, onPress, variant }: CustomButtonProps) => {
  const getButtonStyling = (): ViewStyle => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#EBF0F5',
        }

      default:
        return {
          backgroundColor: '#5978e9',
        }
    }
  }

  const getTextColor = (): string => {
    switch (variant) {
      case 'filled':
        return 'white'
      default:
        return 'gray'
    }
  }

  return (
    <View>
      <TouchableOpacity
        style={[
          getButtonStyling(),
          {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 24,
            paddingVertical: 16,
            width: 324,
          },
        ]}
        onPress={onPress}
      >
        <Text style={{ color: getTextColor(), fontWeight: 'bold' }}>{text}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CustomButton
