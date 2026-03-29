import Chip from "@/components/ui/Chip";
import EmotionPicker from "@/components/ui/EmotionPicker";
import { TOPICS } from "@/constants/entries";
import { Mood } from "@/types/entry";
import { useState } from "react";
import { Text, View } from "react-native";

const Settings = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>("other");
  const [selectedTopic, setSelectedTopic] = useState([""]);

  return (
    <View className="bg-inverse-on-surface flex-1 pt-34 mx-4">
      <View className="bg-white p-4 rounded-2xl">
        <Text className="font-semibold text-lg mb-2">My Mood</Text>
        <Text className="text-on-surface-variant text-md">
          Select default mood to apply to all new entries
        </Text>

        <EmotionPicker
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
        />
      </View>

      <View className="bg-white p-4 rounded-2xl mt-4">
        <Text className="font-semibold text-lg mb-2">My Mood</Text>
        <Text className="text-on-surface-variant text-md">
          Select default mood to apply to all new entries
        </Text>
        <View className="flex-row gap-2 mt-4 items-center">
          {TOPICS.map((topic) => (
            <Chip
              text={topic.capitalize()}
              onPress={() =>
                setSelectedTopic((prev) =>
                  prev.includes(topic)
                    ? prev.filter((t) => t !== topic)
                    : [...prev, topic],
                )
              }
              variant={selectedTopic.includes(topic) ? "selected" : "filled"}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default Settings;
