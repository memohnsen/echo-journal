import Chip from "@/components/ui/Chip";
import { MOODS, TOPICS } from "@/constants/entries";
import { Image } from "expo-image";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Settings = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  return (
    <View className="bg-inverse-on-surface flex-1 pt-34 mx-4">
      <View className="bg-white p-4 rounded-2xl">
        <Text className="font-semibold text-lg mb-2">My Mood</Text>
        <Text className="text-on-surface-variant text-md">
          Select default mood to apply to all new entries
        </Text>

        <View className="flex-row-reverse mt-4 justify-between">
          {MOODS.map((mood) => (
            <TouchableOpacity
              onPress={() =>
                setSelectedMood((prev) => (prev === mood.mood ? "" : mood.mood))
              }
              className="items-center gap-2"
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
                setSelectedTopic((prev) => (prev === topic ? "" : topic))
              }
              variant={selectedTopic === topic ? "selected" : "filled"}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default Settings;
