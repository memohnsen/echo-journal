import EntryCard from "@/src/components/EntryCard";
import Chip from "@/src/components/ui/Chip";
import MoodDropdown from "@/src/components/ui/MoodDropdown";
import TopicDropdown from "@/src/components/ui/TopicDropdown";
import { storage } from "@/src/constants/mmkv";
import { Entry } from "@/src/types/entry";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { router } from "expo-router";
import { BottomSheet } from "heroui-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Text, TouchableOpacity, View } from "react-native";

type ListItem =
  | { type: "header"; date: string; id: string }
  | { type: "entry"; entry: Entry; id: string };

export default function Index() {
  const [moodOpen, setMoodOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [openSheet, setOpenSheet] = useState(false);

  const [storedData, setStoredData] = useState<Entry[]>();

  // LIST DATA
  const filteredData = (): Entry[] => {
    let filtered;

    if (storedData) {
      if (selectedMood && selectedTopic) {
        filtered = storedData.filter(
          (item) =>
            item.mood === selectedMood && item.topics?.includes(selectedTopic),
        );
      } else if (selectedMood) {
        filtered = storedData.filter((item) => item.mood === selectedMood);
      } else if (selectedTopic) {
        filtered = storedData.filter((item) => item.topics === selectedTopic);
      } else {
        filtered = storedData;
      }
    } else {
      return [];
    }

    return filtered;
  };

  const toDateTimestamp = (date: string): number => {
    const parsed = Date.parse(date);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const buildListItems = (entries: Entry[]): ListItem[] => {
    const items: ListItem[] = [];
    let previousDate: string | null = null;

    entries.forEach((entry, index) => {
      if (entry.date !== previousDate) {
        items.push({
          type: "header",
          date: entry.date,
          id: `header-${entry.date}-${index}`,
        });
        previousDate = entry.date;
      }

      items.push({
        type: "entry",
        entry,
        id: `entry-${entry.date}-${entry.title}-${index}`,
      });
    });

    return items;
  };

  const sortedEntries = filteredData()
    .slice()
    .sort((a, b) => toDateTimestamp(b.date) - toDateTimestamp(a.date));

  const listItems = buildListItems(sortedEntries);

  const today = new Date();

  const yesterday = () => {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    return now.toLocaleDateString();
  };

  useEffect(() => {
    const keys = storage.getAllKeys();
    const entryKeys = keys.filter((key) => key.includes("-"));
    const entryData = entryKeys.map((data) => {
      const item = storage.getString(data);
      if (item) {
        return JSON.parse(item);
      } else {
        console.log("no mmkv data found");
      }
    });
    setStoredData(entryData);
  }, []);

  // RECORD AUDIO
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const recordingTime = () => {
    const total = Math.floor((recorderState.durationMillis % 60000) / 1000);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    if (audioRecorder.uri) {
      storage.set("tmpRecordingTitle", audioRecorder.uri);
      console.log("stored audio path");
    }
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  // ANIMATION
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(glowScale, {
            toValue: 1.35,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(glowScale, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.15,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.5,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [recorderState.isRecording]);

  return (
    <>
      <View className="flex-1 bg-inverse-on-surface">
        <FlashList
          data={listItems}
          keyExtractor={(item) => item.id}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            paddingBottom: 70,
          }}
          ListHeaderComponent={() => (
            <View className="mx-4">
              <Text className="font-bold text-4xl mb-4">EchoJournal</Text>
              <View className="flex-row gap-2 mb-6 items-center">
                <Chip
                  text={selectedMood ? selectedMood.capitalize() : "All Moods"}
                  onPress={() => setMoodOpen((prev) => !prev)}
                  variant={selectedMood ? "selected" : "outline"}
                  clearFilter={() => setSelectedMood("")}
                  selectedMood={selectedMood}
                  image={true}
                />
                <Chip
                  text={
                    selectedTopic ? selectedTopic.capitalize() : "All Topics"
                  }
                  onPress={() => setTopicsOpen((prev) => !prev)}
                  variant={selectedTopic ? "selected" : "outline"}
                  clearFilter={() => setSelectedTopic("")}
                  selectedTopic={selectedTopic}
                />
              </View>
            </View>
          )}
          renderItem={({ item }) => {
            if (item.type === "header") {
              return (
                <View className="px-4 pb-2 bg-inverse-on-surface mb-2">
                  <Text className="text-on-surface-variant font-semibold text-md">
                    {item.date === today.toLocaleDateString()
                      ? "TODAY"
                      : item.date === yesterday()
                        ? "YESTERDAY"
                        : item.date}
                  </Text>
                </View>
              );
            }

            return (
              <EntryCard
                title={item.entry.title}
                description={item.entry.description}
                mood={item.entry.mood}
                topics={item.entry.topics}
                date={item.entry.date}
                audioURI={item.entry.audioURI}
              />
            );
          }}
        />

        {moodOpen && (
          <MoodDropdown
            visible={moodOpen}
            setMoodOpen={setMoodOpen}
            setSelectedMood={setSelectedMood}
            selectedMood={selectedMood}
          />
        )}

        {topicsOpen && (
          <TopicDropdown
            visible={topicsOpen}
            setTopicOpen={setTopicsOpen}
            setSelectedTopic={setSelectedTopic}
            selectedTopic={selectedTopic}
          />
        )}

        <TouchableOpacity
          className="absolute bottom-10 right-8 bg-linear-to-b from-[#578CFF] to-[#1F70F5] rounded-full p-3 shadow"
          onPress={() => {
            record();
            setOpenSheet(true);
          }}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <BottomSheet isOpen={openSheet} onOpenChange={setOpenSheet}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content>
            <BottomSheet.Title className="font-semibold text-center text-2xl">
              {recorderState.isRecording
                ? "Recording your memories..."
                : "Recording paused"}
            </BottomSheet.Title>
            <BottomSheet.Description className="text-center mt-1">
              {recordingTime()}
            </BottomSheet.Description>

            <View className="flex-row mx-8 mb-8 gap-4 mt-8 items-center justify-between">
              <TouchableOpacity onPress={() => setOpenSheet(false)}>
                <Ionicons
                  name="close"
                  size={32}
                  color="#680014"
                  className="bg-error-container rounded-full p-2"
                />
              </TouchableOpacity>
              <View className="relative items-center justify-center w-20 h-20">
                {recorderState.isRecording && (
                  <Animated.View
                    pointerEvents="none"
                    className="absolute w-20 h-20 rounded-full bg-[#1F70F5]"
                    style={{
                      transform: [{ scale: glowScale }],
                      opacity: glowOpacity,
                    }}
                  />
                )}
                <TouchableOpacity
                  onPress={() => {
                    stopRecording();
                    setOpenSheet(false);
                    router.push("/create");
                  }}
                >
                  <Ionicons
                    name={recorderState.isRecording ? "checkmark" : "mic"}
                    size={44}
                    color="white"
                    className="bg-primary-container rounded-full p-4"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => stopRecording()}>
                <Ionicons
                  name={recorderState.isRecording ? "pause" : "play"}
                  size={32}
                  color="#00419c"
                  className="bg-inverse-on-surface rounded-full p-2"
                />
              </TouchableOpacity>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </>
  );
}
