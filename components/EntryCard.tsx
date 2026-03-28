import { Entry } from "@/types/entry";
import "@/utils/capitalize";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import Chip from "./ui/Chip";
import Waveform from "./ui/Waveform";

const EntryCard = ({ mood, title, description, topics }: Entry) => {
  const getImageByMood = () => {
    switch (mood) {
      case "excited":
        return require("@/assets/images/excited.svg");
      case "peaceful":
        return require("@/assets/images/peaceful.svg");
      case "neutral":
        return require("@/assets/images/neutral.svg");
      case "sad":
        return require("@/assets/images/sad.svg");
      default:
        return require("@/assets/images/stressed.svg");
    }
  };

  return (
    <View className="flex-row mx-4 mb-4">
      <Image source={getImageByMood()} style={{ width: 32, height: 32 }} />
      <View className="bg-surface w-5/6 rounded-2xl p-4 ml-4 shadow">
        <Text className="font-bold text-xl">{title}</Text>
        <Waveform mood={mood} currentTime="0:00" totalTime="12:30" />
        {description && (
          <Text className="text-on-surface-variant text-md">{description}</Text>
        )}
        {topics && (
          <View className="flex-row gap-2 pt-2">
            {topics.map((topic) => (
              <Chip
                onPress={() => {}}
                variant="filled"
                text={`# ${topic.capitalize()}`}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default EntryCard;
