import Chip from "@/src/components/ui/Chip";
import EmotionPicker from "@/src/components/ui/EmotionPicker";
import Waveform from "@/src/components/ui/Waveform";
import { buttonStyling, MOODS, TOPICS } from "@/src/constants/entries";
import { storage } from "@/src/constants/mmkv";
import { Entry, Mood } from "@/src/types/entry";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { BottomSheet, Input, TextArea, TextField } from "heroui-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { audioProgress, recordingTimeSeconds } from "../utils/formatTime";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { generateAPIUrl } from "../utils/apiUrl";

const Create = () => {
  const { duration } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [topics, setTopics] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood>("other");

  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(
    null,
  );
  const [transcript, setTranscript] = useState<string | null>(null);

  const audioPath = storage.getString("tmpRecordingTitle");

  const player = useAudioPlayer(audioPath, { updateInterval: 33 });
  const status = useAudioPlayerStatus(player);

  const saveToStorage = () => {
    const item: Entry = {
      mood: selectedMood,
      title: title,
      description: description,
      topics: topics,
      date: new Date().toLocaleDateString(),
      audioURI: audioPath,
      duration: duration,
      transcript: transcript,
    };

    const itemObject = JSON.stringify(item);
    storage.set(`${title}-${new Date().toLocaleDateString()}`, itemObject);
  };

  const getImageByMood = () => {
    const mood = MOODS.filter((mood) => mood.mood === selectedMood);
    return mood.map((item) => item.image);
  };

  const applyTitleAndSummaryFromAssistant = (text: string) => {
    const trimmed = text.trim();
    const lines = trimmed.split(/\r?\n/);
    const first = lines[0] ?? "";
    const titleMatch = first.match(/^TITLE:\s*(.+)$/i);
    if (titleMatch) {
      setTitle(
        titleMatch[1]
          ? titleMatch[1].trim().replace(/^\*+|\*+$/g, "")
          : "New Entry",
      );
      setDescription(lines.slice(1).join("\n").trim() || trimmed);
    } else {
      setDescription(trimmed);
    }
  };

  const { sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl("/api/chat"),
    }),
    onFinish: ({ message }) => {
      setGeneratingSummary(false);
      if (message.role !== "assistant") {
        return;
      }
      const text = message.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("");
      applyTitleAndSummaryFromAssistant(text);
    },
    onError: () => setGeneratingSummary(false),
  });

  const runTranscription = async (): Promise<
    { ok: true; text: string } | { ok: false }
  > => {
    if (!audioPath) {
      return { ok: true, text: "" };
    }
    setTranscriptionError(null);
    setTranscribing(true);
    try {
      const formData = new FormData();
      const name = audioPath.split("/").pop()?.split("?")[0] ?? "recording.m4a";
      const ext = name.includes(".")
        ? name.split(".").pop()?.toLowerCase()
        : "";
      const mime =
        ext === "caf"
          ? "audio/x-caf"
          : ext === "wav"
            ? "audio/wav"
            : ext === "mp3"
              ? "audio/mpeg"
              : "audio/m4a";
      formData.append("audio", {
        uri: audioPath,
        name,
        type: mime,
      } as unknown as Blob);

      const res = await fetch(generateAPIUrl("/api/transcribe"), {
        method: "POST",
        body: formData,
      });

      const raw = await res.text();
      if (!res.ok) {
        throw new Error(raw || res.statusText);
      }

      const data = JSON.parse(raw) as { text?: string };
      const text = data.text ?? "";
      setTranscript(text);
      return { ok: true, text };
    } catch (e) {
      setTranscriptionError(
        e instanceof Error ? e.message : "Transcription failed",
      );
      return { ok: false };
    } finally {
      setTranscribing(false);
    }
  };

  const onBrainPress = async () => {
    let sourceText = (transcript ?? "").trim() || description.trim();

    if (audioPath && transcript === null) {
      const tx = await runTranscription();
      if (!tx.ok) {
        return;
      }
      sourceText = tx.text.trim() || sourceText;
    }

    setGeneratingSummary(true);
    sendMessage({
      text: sourceText
        ? `Read the journal text below. Reply in plain text only.

First line must be exactly in this format (including the word TITLE):
TITLE: <a short title under 12 words>

Then one blank line, then a 2–3 sentence summary of the entry.

Journal text:
${sourceText}`
        : `Reply with TITLE: <short title> on the first line, a blank line, then a brief generic journal summary.`,
    });
  };

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

  useEffect(() => {
    const defaultMood: Mood = storage.getString("defaultMood") as Mood;
    if (defaultMood) {
      setSelectedMood(defaultMood);
    }

    const defaultTopic = storage.getString("defaultTopic");
    if (defaultTopic) {
      setTopics(defaultTopic);
    }
  }, []);

  return (
    <>
      <ScrollView className="flex-1 bg-inverse-on-surface pt-36 mx-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="pr-2"
            onPress={() => setOpenBottomSheet(true)}
          >
            {selectedMood !== "other" ? (
              <Image
                source={getImageByMood()}
                style={{ height: 32, width: 32 }}
              />
            ) : (
              <Ionicons
                name="add"
                size={24}
                color="#9FABCD"
                className="bg-surface-variant rounded-full p-1"
              />
            )}
          </TouchableOpacity>
          <TextField className="flex-1">
            <Input
              placeholder="Add Title..."
              value={title}
              onChangeText={setTitle}
            />
          </TextField>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <Waveform
            className="flex-1 min-w-0 mr-2"
            mood={selectedMood ? selectedMood : "other"}
            currentTime={recordingTimeSeconds(status.currentTime)}
            totalTime={recordingTimeSeconds(status.duration)}
            progress={audioProgress(status.currentTime, status.duration)}
            isPlaying={status.playing}
            onPress={() => handlePlayback()}
          />
          <TouchableOpacity
            onPress={() => void onBrainPress()}
            disabled={transcribing || generatingSummary}
            className="bg-white rounded-full p-2 shadow ml-2"
          >
            <MaterialCommunityIcons
              name="brain"
              size={28}
              color={buttonStyling(selectedMood)}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row mt-4 gap-2">
          {TOPICS.map((topic) => (
            <Chip
              text={topic.capitalize()}
              key={topic}
              onPress={() => setTopics((prev) => (prev === topic ? "" : topic))}
              variant={topics === topic ? "selected" : "outline"}
            />
          ))}
        </View>
        <TextField>
          <TextArea
            className="mt-4"
            placeholder="Add Description or press the brain for an AI summary"
            value={description}
            onChangeText={setDescription}
            editable={!transcribing && !generatingSummary}
          />
        </TextField>

        {(transcript ?? "").length > 0 ? (
          <View className="mt-6">
            <Text className="text-on-surface-variant text-sm font-semibold mb-1">
              Transcript
            </Text>
            <Text className="text-on-surface text-base leading-6">
              {transcript}
            </Text>
          </View>
        ) : null}

        {transcribing && (
          <View className="flex-row items-center mt-2">
            <ActivityIndicator />
            <Text className="text-on-surface-variant ml-2">
              Transcribing audio…
            </Text>
          </View>
        )}

        {transcriptionError ? (
          <Text className="text-red-600 mt-2">{transcriptionError}</Text>
        ) : null}

        {generatingSummary && (
          <View className="flex-row items-center justify-center mt-8">
            <ActivityIndicator />
            <Text className="text-black ml-4 text-lg font-semibold">
              Generating title and summary
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="absolute mx-2 bottom-8 w-full flex-row gap-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="items-center justify-center w-1/4 bg-on-primary-container p-4 rounded-full"
        >
          <Text className="text-primary font-semibold text-lg">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            saveToStorage();
            router.back();
          }}
          className="items-center justify-center w-2/3 bg-linear-to-b from-[#578CFF] to-[#1F70F5] p-4 rounded-full"
        >
          <Text className="text-white font-semibold text-lg">Save</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet isOpen={openBottomSheet} onOpenChange={setOpenBottomSheet}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content>
            <BottomSheet.Title className="font-semibold text-center text-2xl">
              How are you doing?
            </BottomSheet.Title>
            <EmotionPicker
              selectedMood={selectedMood}
              setSelectedMood={setSelectedMood}
            />

            <View className="flex-row mx-2 w-full gap-4 mt-8">
              <TouchableOpacity
                onPress={() => {
                  setSelectedMood("other");
                  setOpenBottomSheet(false);
                }}
                className="items-center justify-center w-1/4 bg-on-primary-container p-3 rounded-full"
              >
                <Text className="text-primary font-semibold text-lg">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setOpenBottomSheet(false)}
                className="items-center flex-row justify-center w-2/3 bg-linear-to-b from-[#578CFF] to-[#1F70F5] p-3 rounded-full"
              >
                <Ionicons name="checkmark" size={20} color="white" />
                <Text className="text-white font-semibold text-lg">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </>
  );
};

export default Create;
