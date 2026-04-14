import { TOPICS } from "@/src/constants/entries";
import "@/src/utils/capitalize";
import { Ionicons } from "@expo/vector-icons";
import {
  AccessibilityRole,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TopicDropdownProps {
  visible: boolean;
  setTopicOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTopic: React.Dispatch<React.SetStateAction<string>>;
  selectedTopic: string;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
}

const TopicDropdown = ({
  visible,
  setTopicOpen,
  setSelectedTopic,
  selectedTopic,
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole,
  accessible,
  testID,
}: TopicDropdownProps) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      presentationStyle="overFullScreen"
    >
      <View className="flex-1 items-center pt-52 bg-black/20">
        <View className="items-start gap-4 bg-surface w-11/12 p-4 rounded-2xl shadow">
          {TOPICS.map((topic) => (
            <View key={topic} className="flex-row items-center gap-60">
              <TouchableOpacity
                onPress={() => {
                  setSelectedTopic((prev) => (prev === topic ? "" : topic));
                  setTopicOpen(false);
                }}
                className="flex-row items-center"
                testID={testID}
                accessible={accessible}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityRole={accessibilityRole}
              >
                <Text className="mr-4">#</Text>
                <Text>{topic.capitalize()}</Text>
              </TouchableOpacity>
              {selectedTopic === topic && (
                <Ionicons name="checkmark" size={20} color="blue" />
              )}
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default TopicDropdown;
