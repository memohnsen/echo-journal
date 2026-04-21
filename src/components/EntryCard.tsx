import { MOODS } from "@/src/constants/entries";
import { Entry } from "@/src/types/entry";
import "@/src/utils/capitalize";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import Chip from "./ui/Chip";
import Waveform from "./ui/Waveform";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { audioProgress, recordingTimeSeconds } from "../utils/formatTime";
import { router } from "expo-router";

const EntryCard = ({
  mood,
  title,
  description,
  topics,
  date,
  audioURI,
}: Entry) => {
  const getImageByMood = () => {
    const moodsAll = MOODS.filter((item) => item.mood === mood);
    return moodsAll.map((i) => i.image);
  };

  const player = useAudioPlayer(audioURI, { updateInterval: 33 });
  const status = useAudioPlayerStatus(player);

  const handlePlayback = () => {
    if (status.playing) {
      player.pause();
    } else if (status.currentTime === status.duration) {
      player.seekTo(0);
      player.play();
    } else {
      player.play();
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: `/entries/[title]`,
          params: {
            title: title,
            date: date,
          },
        });
      }}
      className="flex-row mx-4 mb-4"
      testID="entry-card"
      accessible={true}
      accessibilityLabel="Edit your entry"
      accessibilityHint="Edit the contents of a specific journal entry"
      accessibilityRole="button"
    >
      <Image
        source={getImageByMood()}
        style={{ width: 32, height: 32, marginLeft: 4 }}
      />
      <View className="bg-surface w-5/6 rounded-2xl p-4 ml-4 shadow">
        <Text className="font-bold text-xl" numberOfLines={1}>
          {title}
        </Text>
        <Waveform
          mood={mood}
          currentTime={recordingTimeSeconds(status.currentTime)}
          totalTime={recordingTimeSeconds(status.duration)}
          progress={audioProgress(status.currentTime, status.duration)}
          isPlaying={status.playing}
          onPress={() => handlePlayback()}
          testID="waveform-button"
          accessible={true}
          accessibilityLabel="Play audio"
          accessibilityHint="Play the audio from your journal entry"
          accessibilityRole="button"
        />
        {description && (
          <Text className="text-on-surface-variant text-md" numberOfLines={2}>
            {description}
          </Text>
        )}
        {topics && (
          <View className="flex-row gap-2 pt-2">
            {topics && (
              <Chip
                onPress={() => { }}
                variant="filled"
                text={`# ${topics.capitalize()}`}
                testID="topic-chip"
                accessible={true}
                accessibilityLabel="Entry topic"
                accessibilityHint="Displays your topic for the journal entry"
                accessibilityRole="button"
              />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default EntryCard;
