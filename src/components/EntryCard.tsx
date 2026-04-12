import { MOODS } from "@/src/constants/entries";
import { Entry } from "@/src/types/entry";
import "@/src/utils/capitalize";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import Chip from "./ui/Chip";
import Waveform from "./ui/Waveform";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { recordingTimeSeconds } from "../utils/formatTime";

const EntryCard = ({ mood, title, description, topics, audioURI }: Entry) => {
  const getImageByMood = () => {
    const moodsAll = MOODS.filter((item) => item.mood === mood);
    return moodsAll.map((i) => i.image);
  };

  const player = useAudioPlayer(audioURI);
  const status = useAudioPlayerStatus(player);

  return (
    <View className="flex-row mx-4 mb-4">
      <Image
        source={getImageByMood()}
        style={{ width: 32, height: 32, marginLeft: 4 }}
      />
      <View className="bg-surface w-5/6 rounded-2xl p-4 ml-4 shadow">
        <Text className="font-bold text-xl">{title}</Text>
        <Waveform
          mood={mood}
          currentTime={recordingTimeSeconds(status.currentTime)}
          totalTime={recordingTimeSeconds(status.duration)}
          onPress={() => {
            player.seekTo(0);
            player.play();
          }}
        />
        {description && (
          <Text className="text-on-surface-variant text-md">{description}</Text>
        )}
        {topics && (
          <View className="flex-row gap-2 pt-2">
            {topics && (
              <Chip
                onPress={() => {}}
                variant="filled"
                text={`# ${topics.capitalize()}`}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default EntryCard;
