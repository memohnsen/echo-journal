import { SearchField } from "heroui-native";
import Chip from "./ui/Chip";
import { View, Text } from "react-native";

type HomeListHeaderProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedMood: string;
  onMoodChipPress: () => void;
  onClearMood: () => void;
  selectedTopic: string;
  onTopicChipPress: () => void;
  onClearTopic: () => void;
  dateRange: string;
  onDateChipPress: () => void;
  onClearDate: () => void;
};

export function HomeListHeader({
  searchTerm,
  onSearchTermChange,
  selectedMood,
  onMoodChipPress,
  onClearMood,
  selectedTopic,
  onTopicChipPress,
  onClearTopic,
  dateRange,
  onDateChipPress,
  onClearDate,
}: HomeListHeaderProps) {
  return (
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
      <SearchField value={searchTerm} onChange={onSearchTermChange}>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>

      <View className="flex-row gap-2 mb-6 items-center mt-4">
        <Chip
          text={selectedMood ? selectedMood.capitalize() : "All Moods"}
          onPress={onMoodChipPress}
          variant={selectedMood ? "selected" : "outline"}
          clearFilter={onClearMood}
          selectedMood={selectedMood}
          image={true}
          testID="mood-chip"
          accessible={true}
          accessibilityLabel="Select your mood"
          accessibilityHint="Filter journal entries by mood"
          accessibilityRole="button"
        />
        <Chip
          text={selectedTopic ? selectedTopic.capitalize() : "All Topics"}
          onPress={onTopicChipPress}
          variant={selectedTopic ? "selected" : "outline"}
          clearFilter={onClearTopic}
          selectedTopic={selectedTopic}
          testID="topic-chip"
          accessible={true}
          accessibilityLabel="Select your topic"
          accessibilityHint="Filter journal entries by topic"
          accessibilityRole="button"
        />
        <Chip
          text={dateRange}
          onPress={onDateChipPress}
          variant={dateRange ? "selected" : "outline"}
          clearFilter={onClearDate}
          dateRange={dateRange}
          testID="date-range-chip"
          accessible={true}
          accessibilityLabel="Select your date range"
          accessibilityHint="Filter journal entries by date"
          accessibilityRole="button"
        />
      </View>
    </View>
  );
}
