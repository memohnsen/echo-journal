import { buttonStyling, MOODS } from "@/src/constants/entries";
import { Mood } from "@/src/types/entry";
import { Ionicons } from "@expo/vector-icons";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  AccessibilityRole,
  ColorValue,
  DimensionValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const WAVE_PITCH = 6;
const HEIGHT_OPTIONS: number[] = [8, 12, 14, 16];

interface WaveformProps {
  mood: Mood;
  currentTime: string;
  totalTime: string;
  onPress: () => void;
  className?: string;
  progress: number;
  isPlaying: boolean;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
}

const Waveform = ({
  mood,
  currentTime,
  totalTime,
  onPress,
  className,
  progress,
  isPlaying,
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole,
  accessible,
  testID,
}: WaveformProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const [stripWidth, setStripWidth] = useState(0);

  const waveCount =
    stripWidth > 0
      ? Math.max(1, Math.floor(stripWidth / WAVE_PITCH))
      : Math.max(12, Math.floor((windowWidth * 0.45) / WAVE_PITCH));

  const heights = useMemo((): DimensionValue[] => {
    return Array.from({ length: waveCount }, () => {
      const idx = Math.floor(Math.random() * HEIGHT_OPTIONS.length);
      return HEIGHT_OPTIONS[idx] as DimensionValue;
    });
  }, [waveCount]);

  const stripW = useSharedValue(0);
  const smoothProgress = useSharedValue(progress);

  useEffect(() => {
    stripW.value = stripWidth;
  }, [stripWidth]);

  useEffect(() => {
    const t = Math.min(1, Math.max(0, progress));
    smoothProgress.value = withTiming(t, {
      duration: 40,
      easing: Easing.linear,
    });
  }, [progress]);

  const clipStyle = useAnimatedStyle(() => ({
    width: stripW.value * smoothProgress.value,
  }));

  const getBackground = (): ColorValue => {
    return (
      MOODS.find((item) => item.mood === mood)?.backgroundColor ?? "#eef0ff"
    );
  };

  const getWaveColor = (): ColorValue => {
    return MOODS.find((item) => item.mood === mood)?.waveColor ?? "#bac6e9";
  };

  const wave = (height: DimensionValue, played: boolean) => {
    const color = getWaveColor();
    return (
      <View
        style={[
          styles.wave,
          {
            backgroundColor: color,
            height,
            opacity: played ? 1 : 0.38,
          },
        ]}
      />
    );
  };

  const rowWidth = stripWidth > 0 ? stripWidth : undefined;

  const bars = (played: boolean) =>
    heights.map((h, i) => <Fragment key={i}>{wave(h, played)}</Fragment>);

  return (
    <View
      style={[styles.background, { backgroundColor: getBackground() }]}
      className={className}
    >
      <TouchableOpacity
        onPress={onPress}
        className="bg-white shadow rounded-full p-2 mr-2"
        testID={testID}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
      >
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={18}
          color={buttonStyling(mood)}
        />
      </TouchableOpacity>

      <View
        style={styles.waveStrip}
        onLayout={(e) => setStripWidth(e.nativeEvent.layout.width)}
      >
        <View style={styles.waveStripInner}>
          <View
            style={[styles.waveRow, rowWidth != null && { width: rowWidth }]}
          >
            {bars(false)}
          </View>
          <Animated.View style={[styles.waveClip, clipStyle]}>
            <View
              style={[styles.waveRow, rowWidth != null && { width: rowWidth }]}
            >
              {bars(true)}
            </View>
          </Animated.View>
        </View>
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
  waveStripInner: {
    flex: 1,
    minWidth: 0,
    position: "relative",
    justifyContent: "center",
  },
  waveRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  waveClip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    overflow: "hidden",
    justifyContent: "center",
  },
});
