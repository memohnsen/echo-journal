import { DATE_RANGES_ARRAY } from "@/src/constants/entries";
import "@/src/utils/capitalize";
import { Ionicons } from "@expo/vector-icons";
import {
  AccessibilityRole,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DateDropdownProps {
  visible: boolean;
  setDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDateRange: React.Dispatch<React.SetStateAction<string>>;
  dateRange: string;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
}

export const DateDropdown = ({
  visible,
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole,
  accessible,
  testID,
  setDateOpen,
  setDateRange,
  dateRange,
}: DateDropdownProps) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      presentationStyle="overFullScreen"
    >
      <View className="flex-1 items-center bg-black/20">
        <View className="gap-4 top-70 bg-surface w-11/12 p-4 rounded-2xl shadow">
          <View className="items-end justify-end my-0">
            <TouchableOpacity onPress={() => setDateOpen(false)}>
              <Ionicons
                name="close"
                size={16}
                color="black"
                className="bg-gray-200 rounded-full p-1"
              />
            </TouchableOpacity>
          </View>
          {DATE_RANGES_ARRAY.map((date) => (
            <View key={date} className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => {
                  setDateRange((prev) => (prev === date ? "All Time" : date));
                  setDateOpen(false);
                }}
                className="flex-row items-center"
                testID={testID}
                accessible={accessible}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityRole={accessibilityRole}
              >
                <Text>{date}</Text>
              </TouchableOpacity>
              {dateRange === date && (
                <Ionicons name="checkmark" size={20} color="blue" />
              )}
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
};
