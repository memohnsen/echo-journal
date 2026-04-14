import { MOODS } from "@/src/constants/entries";
import { Mood } from "@/src/types/entry";
import { Image } from "expo-image";
import { AccessibilityRole, Text, TouchableOpacity, View } from "react-native";

interface EmotionPickerProps {
  selectedMood: Mood;
  setSelectedMood: React.Dispatch<React.SetStateAction<Mood>>;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
}

const EmotionPicker = ({
  selectedMood,
  setSelectedMood,
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole,
  accessible,
  testID,
}: EmotionPickerProps) => {
  return (
    <View className="flex-row-reverse mt-8 justify-between">
      {MOODS.map((mood) => (
        <TouchableOpacity
          key={mood.mood}
          onPress={() => {
            setSelectedMood((prev) =>
              prev === mood.mood ? "other" : mood.mood,
            );
          }}
          className="items-center gap-2"
          testID={testID}
          accessible={accessible}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityRole={accessibilityRole}
        >
          <Image
            source={selectedMood === mood.mood ? mood.image : mood.outline}
            style={{ height: 40, width: 40 }}
            contentFit="contain"
          />
          <Text className="text-on-surface-variant text-md">
            {mood.mood.capitalize()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default EmotionPicker;
