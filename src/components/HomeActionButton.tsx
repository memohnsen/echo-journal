import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, type StyleProp, type ViewStyle } from "react-native";

interface HomeActionButtonProps {
  className: string;
  accessibilityLabel: string;
  accessibilityHint: string;
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

export const HomeActionButton = ({
  className,
  accessibilityLabel,
  accessibilityHint,
  onPress,
  iconName,
  style,
}: HomeActionButtonProps) => {
  return (
    <TouchableOpacity
      className={className}
      style={style}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      onPress={onPress}
    >
      <Ionicons
        name={iconName}
        size={32}
        color="white"
        accessible={false}
        importantForAccessibility="no"
      />
    </TouchableOpacity>
  );
};
