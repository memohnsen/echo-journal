import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

interface DangerListItemProps {
  title: string;
  onPress: () => void;
}

export const DangerListItem = ({ title, onPress }: DangerListItemProps) => {
  return (
    <View className="mt-4">
      <TouchableOpacity onPress={onPress}>
        <View className="flex-row justify-between items-center rounded-2xl bg-white p-4">
          <Text className="text-red-500 text-md">{title}</Text>
          <Ionicons name="chevron-forward" size={20} color="red" />
        </View>
      </TouchableOpacity>
    </View>
  );
};
