import Chip from "@/src/components/ui/Chip";
import { MOODS, TOPICS } from "@/src/constants/entries";
import { storage } from "@/src/constants/mmkv";
import { Mood } from "@/src/types/entry";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { BottomSheet, Input, TextField } from "heroui-native";
import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

const Settings = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>("other");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topics, setTopics] = useState<string[]>();

  const [openSheet, setOpenSheet] = useState(false);
  const [topicName, setTopicName] = useState("");

  const setDefaultStorage = (item: string, location: string) => {
    const stored = storage.getString(location);
    if (item === stored) {
      storage.set(location, "");
    } else {
      storage.set(location, item);
    }
  };

  const saveNewTopics = () => {
    setTopics((prev) => [...prev, topicName]);
    const topicsArr = JSON.stringify(topics);
    storage.set("topicOptions", topicsArr);

    setOpenSheet(false);
  };

  useEffect(() => {
    const defaultMood: Mood = storage.getString("defaultMood") as Mood;
    if (defaultMood) {
      setSelectedMood(defaultMood);
    }

    const defaultTopic = storage.getString("defaultTopic");
    if (defaultTopic) {
      setSelectedTopic(defaultTopic);
    }
  }, []);

  useEffect(() => {
    if (!storage.getString("topicOptions")) {
      setTopics(TOPICS);
      const topics = JSON.stringify(TOPICS);
      storage.set("topicOptions", topics);
    } else {
      const topicsStored = storage.getString("topicOptions");
      if (topicsStored) {
        const obj = JSON.parse(topicsStored);
        setTopics(obj);
      }
    }
  }, []);

  return (
    <>
      <View className="bg-inverse-on-surface flex-1 pt-34 mx-4">
        <View className="bg-white p-4 rounded-2xl">
          <Text className="font-semibold text-lg mb-2">My Moods</Text>
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
                  source={
                    selectedMood === mood.mood ? mood.image : mood.outline
                  }
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

        <View className="bg-white py-4 rounded-2xl mt-4">
          <Text className="font-semibold text-lg mb-2 mx-4">My Topics</Text>
          <Text className="text-on-surface-variant text-md mx-4">
            Select default topic to apply to all new entries
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row mt-4 px-4"
          >
            {topics &&
              topics.map((topic) => (
                <View key={topic} className="mr-1">
                  <Chip
                    text={topic.capitalize()}
                    key={topic}
                    onPress={() => {
                      setSelectedTopic((prev) => (prev === topic ? "" : topic));
                      setDefaultStorage(topic, "defaultTopic");
                    }}
                    variant={
                      selectedTopic.includes(topic) ? "selected" : "filled"
                    }
                  />
                </View>
              ))}
            <TouchableOpacity
              onPress={() => setOpenSheet(true)}
              className="p-1 bg-#F2F2F7 rounded-full"
            >
              <Ionicons name="add" size={18} color="black" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <Modal
        visible={openSheet}
        animationType="fade"
        transparent={true}
        presentationStyle="overFullScreen"
      >
        <View className="flex-1 items-center justify-center bg-black/20">
          <View className="mx-4 mb-8 gap-4 bg-white rounded-2xl p-4 w-11/12">
            <View className="flex-row items-center justify-between mx-2">
              <Text className="font-semibold text-center text-2xl">
                Name Your New Topic
              </Text>
              <TouchableOpacity onPress={() => setOpenSheet(false)}>
                <Ionicons
                  name="close"
                  size={20}
                  color="black"
                  style={{
                    backgroundColor: "lightgray",
                    borderRadius: 999,
                    padding: 4,
                  }}
                />
              </TouchableOpacity>
            </View>
            <TextField>
              <Input
                placeholder="Add Topic Name..."
                value={topicName}
                onChangeText={setTopicName}
              />
            </TextField>

            <TouchableOpacity
              onPress={() => saveNewTopics()}
              className="items-center flex-row justify-center bg-linear-to-b from-[#578CFF] to-[#1F70F5] p-3 rounded-full"
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text className="text-white font-semibold text-lg">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Settings;
