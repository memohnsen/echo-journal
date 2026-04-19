import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

interface ListItemProps {
  title: string;
  onPress: () => void;
  isLast?: boolean;
  isFirst?: boolean;
  danger?: boolean;
}

export const ListItem = ({
  title,
  onPress,
  isLast,
  isFirst,
  danger,
}: ListItemProps) => {
  const topLevelStyling = () => {
    switch (isFirst) {
      case true:
        return "mt-4";
      default:
        return "";
    }
  };

  const midLevelStyling = () => {
    if (isFirst && isLast) {
      return "rounded-2xl flex-row justify-between items-center bg-white p-4";
    } else if (isFirst) {
      return "rounded-t-2xl flex-row justify-between items-center bg-white p-4";
    } else if (isLast) {
      return "rounded-b-2xl flex-row justify-between items-center bg-white p-4";
    } else {
      return "flex-row justify-between items-center bg-white p-4";
    }
  };

  const isDangerText = () => {
    return danger ? "text-red-500 text-md" : "text-black text-md";
  };

  const isDangerIcon = () => {
    return danger ? "red" : "black";
  };

  return (
    <View className={topLevelStyling()}>
      <TouchableOpacity onPress={onPress}>
        <View className={midLevelStyling()}>
          <Text className={isDangerText()}>{title}</Text>
          <Ionicons name="chevron-forward" size={20} color={isDangerIcon()} />
        </View>
      </TouchableOpacity>
      {!isLast && (
        <View className="h-px items-center justify-center w-full bg-gray-200" />
      )}
    </View>
  );
};
