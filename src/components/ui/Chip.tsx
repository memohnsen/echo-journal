import { MOODS } from "@/src/constants/entries";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Pressable,
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
  variant: "outline" | "filled" | "selected";
  clearFilter?: () => void;
  selectedMood?: string;
  selectedTopic?: string;
  image?: boolean;
}

const Chip = ({
  text,
  onPress,
  variant,
  clearFilter,
  selectedMood,
  selectedTopic,
  image,
}: ChipProps) => {
  const getChipStyling = (): ViewStyle => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "#6c7085",
        };

      case "selected":
        return {
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#1f70f5",
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
          fontSize: 14,
        };

      case "selected":
        return {
          color: "black",
          fontSize: 14,
        };

      default:
        return {
          color: "black",
          fontSize: 14,
        };
    }
  };

  const getImage = () => {
    const mood = MOODS.filter((mood) => text.toLowerCase() === mood.mood);
    return mood.map((item) => item.image);
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
            paddingVertical: 6,
            paddingHorizontal: 10,
          },
        ]}
        onPress={onPress}
      >
        {selectedMood || selectedTopic ? (
          <View className="flex-row items-center">
            {image && (
              <Image source={getImage()} style={{ height: 22, width: 22 }} />
            )}
            <Text style={[getTextStyling(), { paddingHorizontal: 8 }]}>
              {text}
            </Text>
            <Pressable onPress={clearFilter}>
              <Ionicons name="close" size={18} color="gray" />
            </Pressable>
          </View>
        ) : (
          <Text style={getTextStyling()}>{text}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Chip;
