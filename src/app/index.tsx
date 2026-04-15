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
import { recordingTimeMs, toDateTimestamp } from "../utils/formatTime";
import { Image } from "expo-image";

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

  const syncStorageToState = () => {
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
  };

  useEffect(() => {
    syncStorageToState();
  }, []);

  // RECORD AUDIO
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync(RecordingPresets.HIGH_QUALITY);
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
          onRefresh={() => syncStorageToState()}
          ListHeaderComponent={() => (
            <View className="mx-4" testID="home-screen">
              <Text
                testID="home-title"
                accessible={true}
                accessibilityLabel="EchoJournal"
                accessibilityRole="header"
                className="font-bold text-4xl mb-4"
              >
                EchoJournal
              </Text>
              <View className="flex-row gap-2 mb-6 items-center">
                <Chip
                  text={selectedMood ? selectedMood.capitalize() : "All Moods"}
                  onPress={() => setMoodOpen((prev) => !prev)}
                  variant={selectedMood ? "selected" : "outline"}
                  clearFilter={() => setSelectedMood("")}
                  selectedMood={selectedMood}
                  image={true}
                  testID="mood-chip"
                  accessible={true}
                  accessibilityLabel="Select your mood"
                  accessibilityHint="Filter journal entries by mood"
                  accessibilityRole="button"
                />
                <Chip
                  text={
                    selectedTopic ? selectedTopic.capitalize() : "All Topics"
                  }
                  onPress={() => setTopicsOpen((prev) => !prev)}
                  variant={selectedTopic ? "selected" : "outline"}
                  clearFilter={() => setSelectedTopic("")}
                  selectedTopic={selectedTopic}
                  testID="topic-chip"
                  accessible={true}
                  accessibilityLabel="Select your topic"
                  accessibilityHint="Filter journal entries by topic"
                  accessibilityRole="button"
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
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center mt-40">
              <Image
                source={require("@/src/assets/images/sad.svg")}
                style={{ width: 100, height: 100 }}
              />
              <Text className="text-lg text-center px-12 mt-8">
                No journal entries yet, click the button below to get started!
              </Text>
            </View>
          )}
        />

        {moodOpen && (
          <MoodDropdown
            visible={moodOpen}
            setMoodOpen={setMoodOpen}
            setSelectedMood={setSelectedMood}
            selectedMood={selectedMood}
            testID="mood-dropdown-button"
            accessible={true}
            accessibilityLabel="Open mood options"
            accessibilityHint="Open the sheet to select and filter by a given mood"
            accessibilityRole="button"
          />
        )}

        {topicsOpen && (
          <TopicDropdown
            visible={topicsOpen}
            setTopicOpen={setTopicsOpen}
            setSelectedTopic={setSelectedTopic}
            selectedTopic={selectedTopic}
            testID="topic-dropdown-button"
            accessible={true}
            accessibilityLabel="Open topic options"
            accessibilityHint="Open the sheet to select and filter by a given topic"
            accessibilityRole="button"
          />
        )}

        <TouchableOpacity
          className="absolute bottom-10 right-8 bg-linear-to-b from-[#578CFF] to-[#1F70F5] rounded-full p-3 shadow"
          testID="start-recording-button"
          accessible={true}
          accessibilityLabel="Plus"
          accessibilityHint="Start a new voice journal entry"
          accessibilityRole="button"
          onPress={() => {
            record();
            setOpenSheet(true);
          }}
        >
          <Ionicons
            name="add"
            size={32}
            color="white"
            accessible={false}
            importantForAccessibility="no"
          />
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
              {recordingTimeMs(recorderState.durationMillis)}
            </BottomSheet.Description>

            <View className="flex-row mx-8 mb-8 gap-4 mt-8 items-center justify-between">
              <TouchableOpacity
                testID="cancel-record-button"
                accessibilityLabel="Cancel recording"
                accessible={true}
                accessibilityHint="Cancel recording your journal entry"
                accessibilityRole="button"
                onPress={() => setOpenSheet(false)}
              >
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
                  testID="finish-recording-button"
                  accessibilityLabel="Finish recording"
                  accessible={true}
                  accessibilityHint="Finish recording your journal entry"
                  accessibilityRole="button"
                  onPress={() => {
                    stopRecording();
                    setOpenSheet(false);
                    router.push({
                      pathname: "/create",
                      params: {
                        duration: recordingTimeMs(recorderState.durationMillis),
                      },
                    });
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
              <TouchableOpacity
                testID="pause-recording-button"
                accessibilityLabel="Pause recording"
                accessible={true}
                accessibilityHint="Pause recording your journal entry"
                accessibilityRole="button"
                onPress={() => stopRecording()}
              >
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
