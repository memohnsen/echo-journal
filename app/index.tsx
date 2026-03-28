import EntryCard from "@/components/EntryCard";
import Chip from "@/components/ui/Chip";
import { Entry } from "@/types/entry";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
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
  return (
    <View className="flex-1 bg-inverse-on-surface">
      <FlashList
        data={data}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingBottom: 70,
        }}
        ListHeaderComponent={() => (
          <View className="mx-4">
            <Text className="font-bold text-4xl mb-4">EchoJournal</Text>
            <View className="flex-row gap-2 mb-8">
              <Chip text="All Moods" onPress={() => {}} variant={"outline"} />
              <Chip text="All Topics" onPress={() => {}} variant={"outline"} />
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

      <TouchableOpacity
        className="absolute bottom-10 right-8 bg-primary-container rounded-full p-3 shadow"
        onPress={() => {}}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
