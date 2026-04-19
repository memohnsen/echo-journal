import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

interface DangerListItemProps {
  title: string;
  onPress: () => void;
  isLast?: boolean;
  isFirst?: boolean;
}

export const DangerListItem = ({
  title,
  onPress,
  isLast,
  isFirst,
}: DangerListItemProps) => {
  const topLevelStyling = () => {
    switch (isFirst) {
      case true:
        return "mt-4";
      default:
        return "";
    }
  };

  const midLevelStyling = () => {
    if (isFirst) {
      return " rounded-t-2xl flex-row justify-between items-center bg-white p-4";
    } else if (isLast) {
      return " rounded-b-2xl flex-row justify-between items-center bg-white p-4";
    } else {
      return "flex-row justify-between items-center bg-white p-4";
    }
  };

  return (
    <View className={topLevelStyling()}>
      <TouchableOpacity onPress={onPress}>
        <View className={midLevelStyling()}>
          <Text className="text-red-500 text-md">{title}</Text>
          <Ionicons name="chevron-forward" size={20} color="red" />
        </View>
      </TouchableOpacity>
      {!isLast && (
        <View className="h-px items-center justify-center w-full bg-gray-200" />
      )}
    </View>
  );
};
