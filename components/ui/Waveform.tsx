import { Ionicons } from "@expo/vector-icons";
import { Fragment } from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";

interface WaveformProps {
  mood: "excited" | "peaceful" | "neutral" | "sad" | "stressed";
  currentTime: string;
  totalTime: string;
}

const Waveform = ({ mood, currentTime, totalTime }: WaveformProps) => {
  const backgroundStyling = (): ViewStyle => {
    switch (mood) {
      case "excited":
        return {
          backgroundColor: "#F5F2EF",
          height: 40,
          marginVertical: 8,
          borderRadius: 999,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 4,
        };
      case "peaceful":
        return {
          backgroundColor: "#F6F2F5",
          height: 40,
          marginVertical: 8,
          borderRadius: 999,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 4,
        };
      case "neutral":
        return {
          backgroundColor: "#EEF7F3",
          height: 40,
          marginVertical: 8,
          borderRadius: 999,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 4,
        };
      case "sad":
        return {
          backgroundColor: "#EFF4F8",
          height: 40,
          marginVertical: 8,
          borderRadius: 999,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 4,
        };
      default:
        return {
          backgroundColor: "#F8EFEF",
          height: 40,
          marginVertical: 8,
          borderRadius: 999,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 4,
        };
    }
  };

  const waveStyling = (): ViewStyle => {
    switch (mood) {
      case "excited":
        return {
          backgroundColor: "#DDD2C8",
          borderRadius: 999,
          marginRight: 3,
          width: 3,
        };
      case "peaceful":
        return {
          backgroundColor: "#E1CEDB",
          borderRadius: 999,
          marginRight: 3,
          width: 3,
        };
      case "neutral":
        return {
          backgroundColor: "#B9DDCB",
          borderRadius: 999,
          marginRight: 3,
          width: 3,
        };
      case "sad":
        return {
          backgroundColor: "#C5D8E9",
          borderRadius: 999,
          marginRight: 3,
          width: 3,
        };
      default:
        return {
          backgroundColor: "#E9C5C5",
          borderRadius: 999,
          marginRight: 3,
          width: 3,
        };
    }
  };

  const buttonStyling = () => {
    switch (mood) {
      case "excited":
        return "#DB6C0B";
      case "peaceful":
        return "#BE3294";
      case "neutral":
        return "#41B278";
      case "sad":
        return "#3A8EDE";
      default:
        return "#DE3A3A";
    }
  };

  const smWave = () => {
    return <View style={[waveStyling(), { height: 8 }]} />;
  };

  const mdWave = () => {
    return <View style={[waveStyling(), { height: 12 }]} />;
  };

  const lgWave = () => {
    return <View style={[waveStyling(), { height: 14 }]} />;
  };

  const xlWave = () => {
    return <View style={[waveStyling(), { height: 16 }]} />;
  };

  const selectWaveform = () => {
    const random = Math.floor(Math.random() * 4);
    if (random === 0) {
      return smWave();
    } else if (random === 1) {
      return mdWave();
    } else if (random === 2) {
      return lgWave();
    } else {
      return xlWave();
    }
  };

  return (
    <View style={backgroundStyling()}>
      <TouchableOpacity
        onPress={() => {}}
        className="bg-white shadow rounded-full p-2 mr-2"
      >
        <Ionicons name="play" size={18} color={buttonStyling()} />
      </TouchableOpacity>

      {Array.from({ length: 25 }, (_, i) => (
        <Fragment key={i}>{selectWaveform()}</Fragment>
      ))}

      <Text className="text-xs mr-1 ml-2">
        {currentTime}/{totalTime}
      </Text>
    </View>
  );
};

export default Waveform;
