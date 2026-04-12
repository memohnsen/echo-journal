import Chip from "@/src/components/ui/Chip";
import EmotionPicker from "@/src/components/ui/EmotionPicker";
import Waveform from "@/src/components/ui/Waveform";
import { buttonStyling, MOODS, TOPICS } from "@/src/constants/entries";
import { storage } from "@/src/constants/mmkv";
import { Entry, Mood } from "@/src/types/entry";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { BottomSheet, Input, TextArea, TextField } from "heroui-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { audioProgress, recordingTimeSeconds } from "../utils/formatTime";

const Create = () => {
  const { duration } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [topics, setTopics] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood>("other");

  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const audioPath = storage.getString("tmpRecordingTitle");

  const player = useAudioPlayer(audioPath, { updateInterval: 33 });
  const status = useAudioPlayerStatus(player);

  const saveToStorage = () => {
    const item: Entry = {
      mood: selectedMood,
      title: title,
      description: description,
      topics: topics,
      date: new Date().toLocaleDateString(),
      audioURI: audioPath,
      duration: duration,
    };

    const itemObject = JSON.stringify(item);
    storage.set(`${title}-${new Date().toLocaleDateString()}`, itemObject);
    console.log("save successful");
  };

  const getImageByMood = () => {
    const mood = MOODS.filter((mood) => mood.mood === selectedMood);
    return mood.map((item) => item.image);
  };

  const generateSummary = () => {
    setGeneratingSummary((prev) => !prev);
    return;
  };

  useEffect(() => {
    const defaultMood: Mood = storage.getString("defaultMood");
    if (defaultMood) {
      setSelectedMood(defaultMood);
    }

    const defaultTopic = storage.getString("defaultTopic");
    if (defaultTopic) {
      setTopics(defaultTopic);
    }
  }, []);

  return (
    <>
      <View className="flex-1 bg-background pt-36 mx-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="pr-2"
            onPress={() => setOpenBottomSheet(true)}
          >
            {selectedMood !== "other" ? (
              <Image
                source={getImageByMood()}
                style={{ height: 32, width: 32 }}
              />
            ) : (
              <Ionicons
                name="add"
                size={24}
                color="#9FABCD"
                className="bg-surface-variant rounded-full p-1"
              />
            )}
          </TouchableOpacity>
          <TextField className="flex-1">
            <Input
              placeholder="Add Title..."
              value={title}
              onChangeText={setTitle}
            />
          </TextField>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <Waveform
            className="flex-1 min-w-0 mr-2"
            mood={selectedMood ? selectedMood : "other"}
            currentTime={recordingTimeSeconds(status.currentTime)}
            totalTime={recordingTimeSeconds(status.duration)}
            progress={audioProgress(status.currentTime, status.duration)}
            onPress={() => {
              player.seekTo(0);
              player.play();
            }}
          />
          <TouchableOpacity
            onPress={() => generateSummary()}
            className="bg-white rounded-full p-2 shadow ml-2"
          >
            <MaterialCommunityIcons
              name="brain"
              size={28}
              color={buttonStyling(selectedMood)}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row mt-4 gap-2">
          {TOPICS.map((topic) => (
            <Chip
              text={topic.capitalize()}
              key={topic}
              onPress={() => setTopics((prev) => (prev === topic ? "" : topic))}
              variant={topics === topic ? "selected" : "outline"}
            />
          ))}
        </View>
        <TextField>
          <TextArea
            className="mt-4"
            placeholder="Add Description"
            value={description}
            onChangeText={setDescription}
          />
        </TextField>

        {generatingSummary && (
          <View className="flex-row items-center justify-center mt-8">
            <ActivityIndicator />
            <Text className="text-black ml-4 text-lg font-semibold">
              Generating AI Summary
            </Text>
          </View>
        )}
      </View>

      <View className="absolute mx-2 bottom-8 w-full flex-row gap-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="items-center justify-center w-1/4 bg-on-primary-container p-4 rounded-full"
        >
          <Text className="text-primary font-semibold text-lg">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            saveToStorage();
            router.back();
          }}
          className="items-center justify-center w-2/3 bg-linear-to-b from-[#578CFF] to-[#1F70F5] p-4 rounded-full"
        >
          <Text className="text-white font-semibold text-lg">Save</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet isOpen={openBottomSheet} onOpenChange={setOpenBottomSheet}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content>
            <BottomSheet.Title className="font-semibold text-center text-2xl">
              How are you doing?
            </BottomSheet.Title>
            <EmotionPicker
              selectedMood={selectedMood}
              setSelectedMood={setSelectedMood}
            />

            <View className="flex-row mx-2 w-full gap-4 mt-8">
              <TouchableOpacity
                onPress={() => {
                  setSelectedMood("other");
                  setOpenBottomSheet(false);
                }}
                className="items-center justify-center w-1/4 bg-on-primary-container p-3 rounded-full"
              >
                <Text className="text-primary font-semibold text-lg">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setOpenBottomSheet(false)}
                className="items-center flex-row justify-center w-2/3 bg-linear-to-b from-[#578CFF] to-[#1F70F5] p-3 rounded-full"
              >
                <Ionicons name="checkmark" size={20} color="white" />
                <Text className="text-white font-semibold text-lg">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </>
  );
};

export default Create;
