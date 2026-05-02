import EntryCard from "@/src/components/EntryCard";
import MoodDropdown from "@/src/components/ui/MoodDropdown";
import { startOfDay, subDays } from "date-fns";
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
import { router, useFocusEffect } from "expo-router";
import { BottomSheet } from "heroui-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated as RNAnimated,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { recordingTimeMs, toDateTimestamp } from "../utils/formatTime";
import { Image } from "expo-image";
import { HomeListHeader } from "../components/HomeHeader";
import { DateDropdown } from "../components/ui/DateDropdown";
import BiometricsLogin from "./biometrics";
import {
  default as Animated,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { HomeActionButton } from "../components/HomeActionButton";

type ListItem =
  | { type: "header"; date: string; id: string }
  | { type: "entry"; entry: Entry; id: string };

export default function Index() {
  const [moodOpen, setMoodOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);

  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [dateRange, setDateRange] = useState("All Time");

  const [searchTerm, setSearchTerm] = useState("");
  const [storedData, setStoredData] = useState<Entry[]>([]);

  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [buttonsOpen, setButtonsOpen] = useState(false);
  const translateChatY = useSharedValue(0);
  const translatePlusY = useSharedValue(0);
  const addIconRotation = useSharedValue(0);

  useEffect(() => {
    const biometrics = storage.getBoolean("biometricsEnabled");
    setBiometricsEnabled(biometrics);
  }, []);

  const syncStorageToState = useCallback(() => {
    const entryData = storage
      .getAllKeys()
      .filter((key) => key.includes("-"))
      .map((key) => storage.getString(key))
      .filter((item): item is string => Boolean(item))
      .map((item) => JSON.parse(item) as Entry);

    setStoredData(entryData);
  }, []);

  // LIST DATA
  const filteredData = (): Entry[] => {
    if (!storedData.length) {
      return [];
    }

    let filtered = storedData;

    if (selectedMood && selectedTopic) {
      filtered = storedData.filter(
        (item) => item.mood === selectedMood && item.topics === selectedTopic,
      );
    } else if (selectedMood) {
      filtered = storedData.filter((item) => item.mood === selectedMood);
    } else if (selectedTopic) {
      filtered = storedData.filter((item) => item.topics === selectedTopic);
    }

    const list = [...filtered].sort(
      (a, b) => toDateTimestamp(b.date) - toDateTimestamp(a.date),
    );

    const daysForDateRange = (range: string): number | null => {
      switch (range) {
        case "Last 30 Days":
          return 30;
        case "Last 90 Days":
          return 90;
        case "Last 6 Months":
          return 180;
        case "Last Year":
          return 365;
        case "All Time":
          return null;
        default:
          return null;
      }
    };

    const finalFilteredList = () => {
      const days = daysForDateRange(dateRange);
      if (days === null) {
        return list;
      }
      const cutoff = startOfDay(subDays(new Date(), days)).getTime();
      return list.filter((item) => toDateTimestamp(item.date) >= cutoff);
    };

    const standardizedSearch = searchTerm.trim().toLowerCase();

    if (!standardizedSearch) {
      return finalFilteredList();
    } else {
      return finalFilteredList().filter((item) =>
        item.title.toLowerCase().includes(standardizedSearch),
      );
    }
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

  const listItems = buildListItems(filteredData());

  const today = new Date();

  const yesterday = () => {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    return now.toLocaleDateString();
  };

  useFocusEffect(syncStorageToState);

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

  const pauseRecording = () => {
    if (recorderState.isRecording) {
      audioRecorder.pause();
    } else {
      audioRecorder.record();
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
  const glowScale = useRef(new RNAnimated.Value(1)).current;
  const glowOpacity = useRef(new RNAnimated.Value(0.5)).current;

  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.parallel([
        RNAnimated.sequence([
          RNAnimated.timing(glowScale, {
            toValue: 1.35,
            duration: 900,
            useNativeDriver: true,
          }),
          RNAnimated.timing(glowScale, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        RNAnimated.sequence([
          RNAnimated.timing(glowOpacity, {
            toValue: 0.15,
            duration: 900,
            useNativeDriver: true,
          }),
          RNAnimated.timing(glowOpacity, {
            toValue: 0.5,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [glowOpacity, glowScale, recorderState.isRecording]);

  const AnimatedPlusButton = Animated.createAnimatedComponent(HomeActionButton);

  const animatedChatStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(translateChatY.value) }],
  }));

  const animatedPlusStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(translatePlusY.value) }],
  }));

  const animatedAddIconStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${addIconRotation.value}deg` }],
  }));

  const handlePlusPress = () => {
    translatePlusY.value += buttonsOpen ? 70 : -70;
  };

  const handleChatPress = () => {
    translateChatY.value += buttonsOpen ? 140 : -140;
  };

  const handleAnimation = () => {
    setButtonsOpen((prev) => !prev);
    addIconRotation.value = withSpring(buttonsOpen ? 0 : 45);
    handlePlusPress();
    handleChatPress();
  };

  if (!isLoggedIn && biometricsEnabled) {
    return (
      <BiometricsLogin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    );
  }

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
          onRefresh={syncStorageToState}
          ListHeaderComponent={
            <HomeListHeader
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              selectedMood={selectedMood}
              onMoodChipPress={() => setMoodOpen((prev) => !prev)}
              onClearMood={() => setSelectedMood("")}
              selectedTopic={selectedTopic}
              onTopicChipPress={() => setTopicsOpen((prev) => !prev)}
              onClearTopic={() => setSelectedTopic("")}
              dateRange={dateRange}
              onDateChipPress={() => setDatesOpen((prev) => !prev)}
              onClearDate={() => setDateRange("All Time")}
            />
          }
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
        {datesOpen && (
          <DateDropdown
            visible={datesOpen}
            setDateOpen={setDatesOpen}
            setDateRange={setDateRange}
            dateRange={dateRange}
            testID="date-dropdown-button"
            accessible={true}
            accessibilityLabel="Open date range options"
            accessibilityHint="Open the sheet to select a date range filter"
            accessibilityRole="button"
          />
        )}

        {/* Action Buttons */}
        {/* Purple Chat */}
        <AnimatedPlusButton
          className={
            "absolute bottom-10 right-8 bg-linear-to-b from-[#b589d6] to-[#804fb3] rounded-full p-3 shadow"
          }
          accessibilityLabel="Chat"
          accessibilityHint="Chat with your journal entries"
          onPress={() => {
            router.push("/chat");
          }}
          iconName="chatbubble"
          style={animatedChatStyles}
        />

        {/* Blue Record */}
        <AnimatedPlusButton
          className={
            "absolute bottom-10 right-8 bg-linear-to-b from-green-500 to-green-600 rounded-full p-3 shadow"
          }
          accessibilityLabel="Plus"
          accessibilityHint="Start a new voice journal entry"
          onPress={() => {
            record();
            setOpenSheet(true);
          }}
          iconName="mic"
          style={animatedPlusStyles}
        />

        {/* Open Action Menu Button */}
        <TouchableOpacity
          className={
            "absolute bottom-10 right-8 bg-linear-to-b from-[#578CFF] to-[#1F70F5] rounded-full p-3 shadow"
          }
          accessible={true}
          accessibilityLabel={
            buttonsOpen ? "Close action menu" : "Open action menu"
          }
          accessibilityHint="Show or hide journal action buttons"
          accessibilityRole="button"
          onPress={handleAnimation}
          activeOpacity={1}
        >
          <Animated.View style={animatedAddIconStyles}>
            <Ionicons
              name="add"
              size={32}
              color="white"
              accessible={false}
              importantForAccessibility="no"
            />
          </Animated.View>
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
                  <RNAnimated.View
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
                onPress={() => pauseRecording()}
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
