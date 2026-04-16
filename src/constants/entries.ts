import { Mood } from "@/src/types/entry";
import { ColorValue } from "react-native";

export const TOPICS = ["work", "friends", "family", "love", "surprise"];

export const DATE_RANGES_ARRAY = [
  "Last 30 Days",
  "Last 90 Days",
  "Last 6 Months",
  "Last Year",
  "All Time",
];

interface MoodsImages {
  mood: Mood;
  image: string;
  outline: string;
  backgroundColor: ColorValue;
  waveColor: ColorValue;
}

export const MOODS: MoodsImages[] = [
  {
    mood: "excited",
    image: require("@/src/assets/images/excited.svg"),
    outline: require("@/src/assets/images/excited-outline.svg"),
    backgroundColor: "#F5F2EF",
    waveColor: "#DDD2C8",
  },
  {
    mood: "peaceful",
    image: require("@/src/assets/images/peaceful.svg"),
    outline: require("@/src/assets/images/peaceful-outline.svg"),
    backgroundColor: "#F6F2F5",
    waveColor: "#E1CEDB",
  },
  {
    mood: "neutral",
    image: require("@/src/assets/images/neutral.svg"),
    outline: require("@/src/assets/images/neutral-outline.svg"),
    backgroundColor: "#EEF7F3",
    waveColor: "#B9DDCB",
  },
  {
    mood: "sad",
    image: require("@/src/assets/images/sad.svg"),
    outline: require("@/src/assets/images/sad-outline.svg"),
    backgroundColor: "#EFF4F8",
    waveColor: "#C5D8E9",
  },
  {
    mood: "stressed",
    image: require("@/src/assets/images/stressed.svg"),
    outline: require("@/src/assets/images/stressed-outline.svg"),
    backgroundColor: "#F8EFEF",
    waveColor: "#E9C5C5",
  },
];

export const buttonStyling = (mood: Mood) => {
  switch (mood) {
    case "excited":
      return "#DB6C0B";
    case "peaceful":
      return "#BE3294";
    case "neutral":
      return "#41B278";
    case "sad":
      return "#3A8EDE";
    case "stressed":
      return "#DE3A3A";
    default:
      return "#1f70f5";
  }
};
