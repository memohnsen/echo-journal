import Chip from "@/src/components/ui/Chip";
import { MOODS, TOPICS } from "@/src/constants/entries";
import { storage } from "@/src/constants/mmkv";
import { Mood } from "@/src/types/entry";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Settings = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>("other");
  const [selectedTopic, setSelectedTopic] = useState("");

  const setDefaultStorage = (item: string, location: string) => {
    const stored = storage.getString(location);
    if (item === stored) {
      storage.set(location, "");
    } else {
      storage.set(location, item);
    }
  };

  useEffect(() => {
    const defaultMood: Mood = storage.getString("defaultMood");
    if (defaultMood) {
      setSelectedMood(defaultMood);
    }

    const defaultTopic = storage.getString("defaultTopic");
    if (defaultTopic) {
      setSelectedTopic(defaultTopic);
    }
  }, []);

  return (
    <View className="bg-inverse-on-surface flex-1 pt-34 mx-4">
      <View className="bg-white p-4 rounded-2xl">
        <Text className="font-semibold text-lg mb-2">My Mood</Text>
        <Text className="text-on-surface-variant text-md">
          Select default mood to apply to all new entries
        </Text>

        <View className="flex-row-reverse mt-8 justify-between">
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.mood}
              onPress={() => {
                setSelectedMood((prev) =>
                  prev === mood.mood ? "other" : mood.mood,
                );
                setDefaultStorage(mood.mood, "defaultMood");
              }}
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
        <Text className="font-semibold text-lg mb-2">My Topic</Text>
        <Text className="text-on-surface-variant text-md">
          Select default topic to apply to all new entries
        </Text>
        <View className="flex-row gap-2 mt-4 items-center">
          {TOPICS.map((topic) => (
            <Chip
              text={topic.capitalize()}
              key={topic}
              onPress={() => {
                setSelectedTopic((prev) => (prev === topic ? "" : topic));
                setDefaultStorage(topic, "defaultTopic");
              }}
              variant={selectedTopic.includes(topic) ? "selected" : "filled"}
            />
          ))}
          <TouchableOpacity className="p-1 bg-inverse-on-surface rounded-full">
            <Ionicons name="add" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Settings;
