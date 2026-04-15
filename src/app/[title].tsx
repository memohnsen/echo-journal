import Chip from "@/src/components/ui/Chip";
import EmotionPicker from "@/src/components/ui/EmotionPicker";
import Waveform from "@/src/components/ui/Waveform";
import { buttonStyling, MOODS, TOPICS } from "@/src/constants/entries";
import { storage } from "@/src/constants/mmkv";
import { Entry, Mood } from "@/src/types/entry";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { BottomSheet, Input, TextArea, TextField } from "heroui-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { audioProgress, recordingTimeSeconds } from "../utils/formatTime";
import { handlePlayback } from "../utils/audioPlayer";

const EditEntry = () => {
  const { title, date } = useLocalSearchParams();
  const [entryTitle, setEntryTitle] = useState(title);
  const [description, setDescription] = useState("");

  const [topics, setTopics] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood>("other");
  const [audioURI, setAudioURI] = useState("");
  const [transcript, setTranscript] = useState("");

  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const player = useAudioPlayer(audioURI, { updateInterval: 33 });
  const status = useAudioPlayerStatus(player);

  const saveToStorage = () => {
    const item: Entry = {
      mood: selectedMood,
      title: entryTitle,
      description: description,
      topics: topics,
      date: date,
      audioURI: audioURI,
      duration: recordingTimeSeconds(status.duration),
      transcript: transcript,
    };

    const itemObject = JSON.stringify(item);
    storage.set(`${entryTitle}-${date}`, itemObject);
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

  const syncStorageToState = () => {
    const item = storage.getString(`${title}-${date}`);
    if (item) {
      const object = JSON.parse(item);
      setDescription(object.description);
      setTopics(object.topics);
      setSelectedMood(object.mood);
      setTopics(object.topics);
      setAudioURI(object.audioURI);
      setTranscript(object.transcript);
    } else {
      console.log("no mmkv data found");
    }
  };

  useEffect(() => {
    syncStorageToState();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: date,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                storage.remove(`${title}-${date}`);
                router.back();
              }}
              testID="delete-entry-button"
              accessible={true}
              accessibilityLabel="Delete your entry"
              accessibilityHint="Delete your journal entry"
              accessibilityRole="button"
            >
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex-1 bg-inverse-on-surface pt-36 mx-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="pr-2"
            onPress={() => setOpenBottomSheet(true)}
            testID="select-mood-button"
            accessible={true}
            accessibilityLabel="Select mood"
            accessibilityHint="Opens a bottom sheet to select your mood for the journal entry"
            accessibilityRole="button"
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
          <TextField
            className="flex-1"
            testID="title-text-field"
            accessible={true}
            accessibilityLabel="Set title"
            accessibilityHint="Enter the title of your journal entry"
            accessibilityRole="search"
          >
            <Input
              placeholder="Add Title..."
              value={entryTitle}
              onChangeText={setEntryTitle}
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
            isPlaying={status.playing}
            onPress={() => handlePlayback(player, status)}
            testID="waveform-button"
            accessible={true}
            accessibilityLabel="Play audio"
            accessibilityHint="Play the audio from your journal entry"
            accessibilityRole="button"
          />
        </View>
        <View className="flex-row mt-4 gap-2">
          {TOPICS.map((topic) => (
            <Chip
              text={topic.capitalize()}
              key={topic}
              onPress={() => setTopics((prev) => (prev === topic ? "" : topic))}
              variant={topics === topic ? "selected" : "outline"}
              testID="topic-chip"
              accessible={true}
              accessibilityLabel="Select your topic"
              accessibilityHint="Select your topic for your journal entry"
              accessibilityRole="button"
            />
          ))}
        </View>
        <TextField>
          <TextArea
            className="mt-4"
            placeholder="Add Description"
            value={description}
            onChangeText={setDescription}
            testID="description-text-field"
            accessible={true}
            accessibilityLabel="Entry description"
            accessibilityHint="Enter your description for the journal entry"
            accessibilityRole="search"
          />
        </TextField>

        {(transcript ?? "").length > 0 ? (
          <View className="mt-6">
            <Text className="text-on-surface-variant text-sm font-semibold mb-1">
              Transcript
            </Text>
            <Text className="text-on-surface text-base leading-6">
              {transcript}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="absolute mx-2 bottom-8 w-full flex-row gap-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="items-center justify-center w-1/4 bg-on-primary-container p-4 rounded-full"
          testID="cancel-entry-button"
          accessible={true}
          accessibilityLabel="Cancel entry"
          accessibilityHint="Go back and cancel saving this entry"
          accessibilityRole="button"
        >
          <Text className="text-primary font-semibold text-lg">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            saveToStorage();
            router.back();
          }}
          className="items-center justify-center w-2/3 bg-linear-to-b from-[#578CFF] to-[#1F70F5] p-4 rounded-full"
          testID="save-entry-button"
          accessible={true}
          accessibilityLabel="Save entry"
          accessibilityHint="Save this journal entry"
          accessibilityRole="button"
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
              testID="emotion-picker-button"
              accessible={true}
              accessibilityHint="Select your mood for your journal entry"
              accessibilityRole="button"
            />

            <View className="flex-row mx-2 w-full gap-4 mt-8">
              <TouchableOpacity
                onPress={() => {
                  setSelectedMood("other");
                  setOpenBottomSheet(false);
                }}
                className="items-center justify-center w-1/4 bg-on-primary-container p-3 rounded-full"
                testID="cancel-mood-button"
                accessible={true}
                accessibilityLabel="Select mood"
                accessibilityHint="Cancel selecting your mood for the entry"
                accessibilityRole="button"
              >
                <Text className="text-primary font-semibold text-lg">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setOpenBottomSheet(false)}
                className="items-center flex-row justify-center w-2/3 bg-linear-to-b from-[#578CFF] to-[#1F70F5] p-3 rounded-full"
                testID="confirm-mood-button"
                accessible={true}
                accessibilityLabel="Set mood"
                accessibilityHint="Confirm setting the mood for your entry"
                accessibilityRole="button"
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

export default EditEntry;
