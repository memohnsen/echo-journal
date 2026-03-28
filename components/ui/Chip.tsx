import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ChipProps {
  text: string;
  onPress: () => void;
  variant: "outline" | "filled";
}

const Chip = ({ text, onPress, variant }: ChipProps) => {
  const getChipStyling = (): ViewStyle => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "#c1c3ce",
        };

      default:
        return {
          backgroundColor: "#F2F2F7",
        };
    }
  };

  const getTextStyling = (): StyleProp<TextStyle> => {
    switch (variant) {
      case "outline":
        return {
          color: "black",
          fontSize: 16,
        };

      default:
        return {
          color: "black",
          fontSize: 14,
        };
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          getChipStyling(),
          {
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 24,
            paddingVertical: 4,
            paddingHorizontal: 8,
          },
        ]}
        onPress={onPress}
      >
        <Text style={getTextStyling()}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Chip;
