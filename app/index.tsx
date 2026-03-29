import EntryCard from "@/components/EntryCard";
import Chip from "@/components/ui/Chip";
import MoodDropdown from "@/components/ui/MoodDropdown";
import TopicDropdown from "@/components/ui/TopicDropdown";
import { Entry } from "@/types/entry";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { BottomSheet } from "heroui-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

const data: Entry[] = [
  {
    title: "My Entry",
    description: "sample",
    mood: "excited",
    topics: ["work", "friends"],
  },
  {
    title: "My Entry",
    mood: "sad",
  },
  {
    title: "My Entry",
    mood: "neutral",
  },
  {
    title: "My Entry",
    mood: "peaceful",
  },
  {
    title: "My Entry",
    mood: "stressed",
  },
];

export default function Index() {
  const [moodOpen, setMoodOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [openSheet, setOpenSheet] = useState(false);
  const [recordingActive, setRecordingActive] = useState(false);

  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.5)).current;

  const filteredData = (): Entry[] => {
    let filtered;

    if (selectedMood && selectedTopic) {
      filtered = data.filter(
        (item) =>
          item.mood === selectedMood && item.topics?.includes(selectedTopic),
      );
    } else if (selectedMood) {
      filtered = data.filter((item) => item.mood === selectedMood);
    } else if (selectedTopic) {
      filtered = data.filter((item) =>
        item.topics?.filter((i) => i.includes(selectedTopic)),
      );
    } else {
      filtered = data;
    }

    return filtered;
  };

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
  }, [recordingActive]);

  return (
    <>
      <View className="flex-1 bg-inverse-on-surface">
        <FlashList
          data={filteredData()}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            paddingBottom: 70,
          }}
          ListHeaderComponent={() => (
            <View className="mx-4">
              <Text className="font-bold text-4xl mb-4">EchoJournal</Text>
              <View className="flex-row gap-2 mb-8 items-center">
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
          renderItem={(item) => (
            <EntryCard
              title={item.item.title}
              description={item.item.description}
              mood={item.item.mood}
              topics={item.item.topics?.map((i) => i)}
            />
          )}
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
          onPress={() => setOpenSheet(true)}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <BottomSheet isOpen={openSheet} onOpenChange={setOpenSheet}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content>
            <BottomSheet.Title className="font-semibold text-center text-2xl">
              {recordingActive
                ? "Recording your memories..."
                : "Recording paused"}
            </BottomSheet.Title>
            <BottomSheet.Description className="text-center mt-1">
              00:00:00
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
                {recordingActive && (
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
                    setOpenSheet(false);
                    router.push("/create");
                  }}
                >
                  <Ionicons
                    name={recordingActive ? "checkmark" : "mic"}
                    size={44}
                    color="white"
                    className="bg-primary-container rounded-full p-4"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => setRecordingActive((prev) => !prev)}
              >
                <Ionicons
                  name={recordingActive ? "pause" : "play"}
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
