import { buttonStyling, MOODS } from "@/src/constants/entries";
import { Mood } from "@/src/types/entry";
import { Ionicons } from "@expo/vector-icons";
import { Fragment, useState } from "react";
import {
  ColorValue,
  DimensionValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const WAVE_PITCH = 6;

interface WaveformProps {
  mood: Mood;
  currentTime: string;
  totalTime: string;
  onPress: () => void;
  className?: string;
}

const Waveform = ({
  mood,
  currentTime,
  totalTime,
  onPress,
  className,
}: WaveformProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const [stripWidth, setStripWidth] = useState(0);

  const waveCount =
    stripWidth > 0
      ? Math.max(1, Math.floor(stripWidth / WAVE_PITCH))
      : Math.max(12, Math.floor((windowWidth * 0.45) / WAVE_PITCH));

  const getBackground = (): ColorValue => {
    return (
      MOODS.find((item) => item.mood === mood)?.backgroundColor ?? "#eef0ff"
    );
  };

  const getWaveColor = (): ColorValue => {
    return MOODS.find((item) => item.mood === mood)?.waveColor ?? "#bac6e9";
  };

  const wave = (height: DimensionValue) => {
    return (
      <View
        style={[
          styles.wave,
          { backgroundColor: getWaveColor() },
          { height: height },
        ]}
      />
    );
  };

  const selectWaveform = () => {
    const random = Math.floor(Math.random() * 4);
    if (random === 0) {
      return wave(8);
    } else if (random === 1) {
      return wave(12);
    } else if (random === 2) {
      return wave(14);
    } else {
      return wave(16);
    }
  };

  return (
    <View
      style={[styles.background, { backgroundColor: getBackground() }]}
      className={className}
    >
      <TouchableOpacity
        onPress={onPress}
        className="bg-white shadow rounded-full p-2 mr-2"
      >
        <Ionicons name="play" size={18} color={buttonStyling(mood)} />
      </TouchableOpacity>

      <View
        style={styles.waveStrip}
        onLayout={(e) => setStripWidth(e.nativeEvent.layout.width)}
      >
        {Array.from({ length: waveCount }, (_, i) => (
          <Fragment key={i}>{selectWaveform()}</Fragment>
        ))}
      </View>

      <Text className="text-xs mr-1 ml-2 shrink-0">
        {currentTime}/{totalTime}
      </Text>
    </View>
  );
};

export default Waveform;

const styles = StyleSheet.create({
  wave: {
    borderRadius: 999,
    marginRight: 3,
    width: 3,
  },
  background: {
    height: 40,
    marginVertical: 8,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 4,
  },
  waveStrip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
    overflow: "hidden",
  },
});
