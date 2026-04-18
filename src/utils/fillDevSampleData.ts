import { Entry } from "@/src/types/entry";
import { storage } from "../constants/mmkv";
import { Alert } from "react-native";

export const fillSampleData = () => {
  const keys = storage.getAllKeys();
  keys.map((key) => {
    if (key.includes("-")) {
      storage.remove(key);
    }
  });

  DEV_SAMPLE_ENTRIES.map((entry) => {
    const item = JSON.stringify(entry);
    storage.set(`${entry.title}-${entry.date}`, item);
  });

  Alert.alert("Entries deleted and sample data loaded");

  return;
};

const DEV_SAMPLE_ENTRIES: Entry[] = [
  {
    mood: "excited",
    title: "Morning Walk Win",
    description:
      "Started the day with a long walk before work and felt way more energized than usual. I want to keep protecting that quiet time because it made the rest of the day feel lighter.",
    topics: "work",
    date: "4/18/2026",
    duration: "1:14",
    transcript:
      "I got outside early this morning and the fresh air made everything feel easier. By the time I sat down to work I felt focused, calm, and actually excited to start.",
  },
  {
    mood: "peaceful",
    title: "Slow Dinner at Home",
    description:
      "Cooked dinner without multitasking and it felt grounding. Nothing major happened, but the evening reminded me that ordinary routines can still feel really full.",
    topics: "family",
    date: "4/17/2026",
    duration: "0:56",
    transcript:
      "Dinner was simple tonight, but I wasn't rushing for once. I ate slowly, cleaned up right away, and felt more settled than I have in a while.",
  },
  {
    mood: "neutral",
    title: "Getting Through the List",
    description:
      "Today was mostly admin work and errands. It was not especially fun or difficult, just one of those steady days where checking things off felt good enough.",
    topics: "work",
    date: "4/15/2026",
    duration: "1:03",
    transcript:
      "I spent most of the afternoon answering emails, scheduling things, and catching up on loose ends. It wasn't memorable, but I did what I needed to do.",
  },
  {
    mood: "sad",
    title: "Missing Old Friends",
    description:
      "A random photo brought up a wave of homesickness and made me realize how much I miss some older friendships. I do not think I need to fix that feeling tonight, just let it be true.",
    topics: "friends",
    date: "4/12/2026",
    duration: "1:27",
    transcript:
      "I saw an old picture today and it hit me harder than I expected. I miss who I was in that season and I miss how easy those friendships used to feel.",
  },
  {
    mood: "stressed",
    title: "Too Many Tabs Open",
    description:
      "My brain felt scattered all afternoon and I kept bouncing between tasks without finishing much. I need a better way to reset when everything starts feeling equally urgent.",
    topics: "work",
    date: "4/10/2026",
    duration: "1:18",
    transcript:
      "There were too many things competing for attention today and I never found a rhythm. Even small requests felt loud by the end of the day.",
  },
  {
    mood: "excited",
    title: "Booked the Weekend Trip",
    description:
      "Finally committed to the little weekend trip I have been talking about for months. It feels good to have something fun on the calendar that is just for me.",
    topics: "surprise",
    date: "4/6/2026",
    duration: "0:49",
    transcript:
      "I booked the place and bought the tickets, so now it is real. I am already picturing the coffee shops, the walks, and a full day without a schedule.",
  },
  {
    mood: "peaceful",
    title: "Call With Mom",
    description:
      "Had one of those easy conversations where nothing dramatic happened and I still hung up feeling deeply cared for. I want more of that kind of contact instead of only calling when something is wrong.",
    topics: "family",
    date: "4/2/2026",
    duration: "1:09",
    transcript:
      "We talked about regular life stuff for almost an hour and it felt really comforting. I noticed how much calmer I felt afterward.",
  },
  {
    mood: "neutral",
    title: "Rainy Saturday Reset",
    description:
      "Stayed in, cleaned the apartment, and listened to music while it rained outside. It was a low-key day, but sometimes that is exactly what I need to feel caught up with myself again.",
    topics: "love",
    date: "3/29/2026",
    duration: "0:52",
    transcript:
      "Today was quiet in the best way. I cleaned, folded laundry, and let the afternoon move slowly instead of trying to make it productive.",
  },
  {
    mood: "sad",
    title: "Energy Dip",
    description:
      "I felt off for most of the day and could not really explain why. Nothing was specifically wrong, but everything took more effort and I felt more withdrawn than usual.",
    topics: "love",
    date: "3/18/2026",
    duration: "1:11",
    transcript:
      "This felt like one of those low-energy days where even simple things were heavy. I am trying not to judge it too much and just notice what my body probably needs.",
  },
  {
    mood: "stressed",
    title: "Running Late Everywhere",
    description:
      "The whole day felt like catching up from the second I woke up. I kept making it through each thing, but I never really felt present for any of it.",
    topics: "friends",
    date: "3/5/2026",
    duration: "1:05",
    transcript:
      "I was behind all day and it snowballed into everything feeling rushed. By tonight I mostly just want a clean slate and an earlier bedtime.",
  },
];
