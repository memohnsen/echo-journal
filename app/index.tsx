import EntryCard from "@/components/EntryCard";
import Chip from "@/components/ui/Chip";
import MoodDropdown from "@/components/ui/MoodDropdown";
import TopicDropdown from "@/components/ui/TopicDropdown";
import { Entry } from "@/types/entry";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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

  const filteredData = (): Entry[] => {
    if (!selectedMood) return data;

    return data.filter((item) => item.mood === selectedMood);
  };

  return (
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
            <View className="flex-row gap-2 mb-8">
              <Chip
                text={selectedMood ? selectedMood.capitalize() : "All Moods"}
                onPress={() => setMoodOpen((prev) => !prev)}
                variant={"outline"}
              />
              <Chip
                text={selectedTopic ? selectedTopic.capitalize() : "All Topics"}
                onPress={() => setTopicsOpen((prev) => !prev)}
                variant={"outline"}
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
        onPress={() => {}}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
