import Chip from "@/src/components/ui/Chip";
import { MOODS, TOPICS } from "@/src/constants/entries";
import { storage } from "@/src/constants/mmkv";
import { Mood } from "@/src/types/entry";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Input, TextField } from "heroui-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ListItem } from "../components/ui/ListItem";
import { fillSampleData } from "../utils/fillDevSampleData";
import { router } from "expo-router";

const Settings = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>("other");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topics, setTopics] = useState<string[]>();

  const [openSheet, setOpenSheet] = useState(false);
  const [topicName, setTopicName] = useState("");

  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const setDefaultStorage = (item: string, location: string) => {
    const stored = storage.getString(location);
    if (item === stored) {
      storage.set(location, "");
    } else {
      storage.set(location, item);
    }
  };

  const deleteAllEntries = () => {
    const keys = storage.getAllKeys();
    keys.map((key) => {
      if (key.includes("")) {
        storage.remove(key);
      }
    });

    Alert.alert("All your entries have been deleted from your local storage");

    return;
  };

  const deleteAllData = () => {
    const keys = storage.getAllKeys();
    keys.map((key) => {
      storage.remove(key);
    });

    Alert.alert("All your data has been deleted from your local storage");

    return;
  };

  const saveNewTopics = () => {
    const name = topicName.trim();
    if (!name) {
      return;
    }
    setTopics((prev) => {
      const next = [...(prev ?? []), name];
      storage.set("topicOptions", JSON.stringify(next));
      return next;
    });
    setTopicName("");
    setOpenSheet(false);
  };

  const longPressAlert = (item: string) => {
    Alert.alert("Do you want to delete this topic?", "This cannot be undone.", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Delete", onPress: () => deleteTopic(item) },
    ]);
  };

  const deleteTopic = (item: string) => {
    if (storage.getString("defaultTopic") === item) {
      storage.set("defaultTopic", "");
    }
    setTopics((prev) => {
      const next = (prev ?? []).filter((p) => p !== item);
      storage.set("topicOptions", JSON.stringify(next));
      return next;
    });
    setSelectedTopic((current) => (current === item ? "" : current));

    Alert.alert(`${item.capitalize()} has been deleted`);
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

    const key = storage.getBoolean("biometricsEnabled");
    if (key) {
      setBiometricsEnabled(key);
    }

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
            Select default topic to apply to all new entries or long press to
            delete a topic
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
                    onLongPress={() => longPressAlert(topic)}
                    variant={
                      selectedTopic.includes(topic) ? "selected" : "filled"
                    }
                    testID="topic-chip"
                    accessible={true}
                    accessibilityLabel="Select your default topic"
                    accessibilityHint="Select your default topic for new journal entries"
                    accessibilityRole="button"
                  />
                </View>
              ))}
            <TouchableOpacity
              onPress={() => setOpenSheet(true)}
              className="p-1 bg-#F2F2F7 rounded-full"
              testID="add-topic-button"
              accessible={true}
              accessibilityLabel="Add topic"
              accessibilityHint="Add a new topic option for your journal entries"
              accessibilityRole="button"
            >
              <Ionicons name="add" size={18} color="black" />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View className="mt-4">
          <View className="rounded-2xl flex-row justify-between items-center bg-white p-4">
            <Text className="text-md">Enable Biometrics</Text>
            <Switch
              value={biometricsEnabled}
              onValueChange={(e) => {
                setBiometricsEnabled(e);
                storage.set("biometricsEnabled", e);
              }}
            />
          </View>
        </View>

        <ListItem
          title="Delete All Entries"
          onPress={() => deleteAllEntries()}
          isFirst={true}
          danger={true}
        />

        <ListItem
          title="Delete All Data"
          onPress={() => deleteAllData()}
          danger={true}
          isLast={true}
        />

        {__DEV__ && (
          <>
            <View className="mt-4">
              <Text className="text-gray-500 text-md">DEV</Text>
              <ListItem
                title="Delete All Entries and Fill with Sample Data"
                onPress={() => fillSampleData()}
                danger={true}
                isFirst={true}
              />

              <ListItem
                title="Go to Auth"
                onPress={() => router.push("/biometrics")}
              />

              <ListItem
                title="Begin Onboarding Sequence"
                onPress={() => router.push("/onboarding")}
                isLast={true}
              />
            </View>
          </>
        )}
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
              <TouchableOpacity
                onPress={() => setOpenSheet(false)}
                testID="close-modal-button"
                accessible={true}
                accessibilityLabel="Close popup"
                accessibilityHint="Close the popup"
                accessibilityRole="button"
              >
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
            <TextField
              testID="topic-text-field"
              accessible={true}
              accessibilityLabel="Add a topic name"
              accessibilityHint="Add a name for your new topic"
              accessibilityRole="button"
            >
              <Input
                placeholder="Add Topic Name..."
                value={topicName}
                onChangeText={setTopicName}
              />
            </TextField>

            <TouchableOpacity
              onPress={() => saveNewTopics()}
              className="items-center flex-row justify-center bg-linear-to-b from-[#578CFF] to-[#1F70F5] p-3 rounded-full"
              testID="save-topic-button"
              accessible={true}
              accessibilityLabel="Save topic"
              accessibilityHint="Save your new topic for your journal entries"
              accessibilityRole="button"
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
