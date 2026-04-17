import { MOODS } from "@/src/constants/entries";
import "@/src/utils/capitalize";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  AccessibilityRole,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MoodDropdownProps {
  visible: boolean;
  setMoodOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMood: React.Dispatch<React.SetStateAction<string>>;
  selectedMood: string;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
}

const MoodDropdown = ({
  visible,
  setMoodOpen,
  setSelectedMood,
  selectedMood,
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole,
  accessible,
  testID,
}: MoodDropdownProps) => {
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
            <TouchableOpacity onPress={() => setMoodOpen(false)}>
              <Ionicons
                name="close"
                size={16}
                color="black"
                className="bg-gray-200 rounded-full p-1"
              />
            </TouchableOpacity>
          </View>
          {MOODS.map((mood) => (
            <View
              key={mood.mood}
              className="flex-row items-center justify-between"
            >
              <TouchableOpacity
                onPress={() => {
                  setSelectedMood((prev) =>
                    prev === mood.mood ? "" : mood.mood,
                  );
                  setMoodOpen(false);
                }}
                className="flex-row items-center"
                testID={testID}
                accessible={accessible}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityRole={accessibilityRole}
              >
                <Image
                  source={mood.image}
                  style={{ height: 24, width: 24, marginRight: 8 }}
                />
                <Text>{mood.mood.capitalize()}</Text>
              </TouchableOpacity>
              {selectedMood === mood.mood && (
                <Ionicons name="checkmark" size={20} color="blue" />
              )}
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default MoodDropdown;
