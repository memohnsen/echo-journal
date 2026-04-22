import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "../components/ui/CustomButton";
import { Redirect, router } from "expo-router";
import {
  useAudioRecorder,
  RecordingPresets,
  useAudioRecorderState,
} from "expo-audio";
import { storage } from "../constants/mmkv";
import { Ionicons } from "@expo/vector-icons";
import { recordingTimeMs } from "../utils/formatTime";

const Onboarding = () => {
  const [pageNumber, setPageNumber] = useState(0);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync(RecordingPresets.HIGH_QUALITY);
    audioRecorder.record();
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    if (audioRecorder.uri) {
      storage.set("tmpRecordingTitle", audioRecorder.uri);
      console.log("stored audio path");
    }
  };

  const handleRecording = () => {
    if (recorderState.isRecording) {
      stopRecording();
      router.push({
        pathname: "/create",
        params: {
          duration: recordingTimeMs(recorderState.durationMillis),
        },
      });
    } else {
      record();
    }
  };

  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(glowScale, {
            toValue: 1.35,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(glowScale, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.15,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.5,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [glowOpacity, glowScale, recorderState.isRecording]);

  return (
    <View className="flex-1 bg-inverse-on-surface items-center justify-center">
      {pageNumber === 0 && (
        <>
          <View>
            <Text className="mb-8 text-2xl font-bold text-center">
              Welcome to EchoJournal!
            </Text>
            <View className="flex-row -mx-10 mb-10 items-center justify-center">
              <Image
                source={require("@/src/assets/images/sad.svg")}
                style={{ height: 70, width: 70 }}
              />
              <Image
                source={require("@/src/assets/images/stressed.svg")}
                style={{ height: 70, width: 70 }}
              />
              <Image
                source={require("@/src/assets/images/neutral.svg")}
                style={{ height: 70, width: 70 }}
              />
              <Image
                source={require("@/src/assets/images/peaceful.svg")}
                style={{ height: 70, width: 70 }}
              />
              <Image
                source={require("@/src/assets/images/excited.svg")}
                style={{ height: 70, width: 70 }}
              />
            </View>
          </View>
          <CustomButton
            text="Continue"
            onPress={() => setPageNumber((prev) => prev + 1)}
            variant="filled"
            className="absolute bottom-10"
          />
        </>
      )}
      {pageNumber === 1 && (
        <>
          <View className="mx-4 items-center justify-center gap-y-10">
            <Image
              source={require("@/src/assets/images/sad.svg")}
              style={{ height: 70, width: 70 }}
            />
            <Text className="text-center text-lg">
              Journaling is one of the best ways to talk through what's
              bothering you or to remeber those really great moments, but
              sometimes it's hard to actually put the emotions you're feeling
              into words
            </Text>
          </View>
          <CustomButton
            text="Continue"
            onPress={() => setPageNumber((prev) => prev + 1)}
            variant="filled"
            className="absolute bottom-10"
          />
        </>
      )}
      {pageNumber === 2 && (
        <>
          <View className="items-center mx-4 justify-center gap-y-10">
            <Image
              source={require("@/src/assets/images/peaceful.svg")}
              style={{ height: 70, width: 70 }}
            />
            <Text className="text-center text-xl font-semibold">
              That's where EchoJournal comes in.
            </Text>
            <Text className="text-center text-lg">
              EchoJournal lets you talk through what you're feeling to help work
              through those good and bad days. Write a description or get a
              transcript to remember those key things you want to remeber.
            </Text>
          </View>
          <CustomButton
            text="Continue"
            onPress={() => setPageNumber((prev) => prev + 1)}
            variant="filled"
            className="absolute bottom-10"
          />
        </>
      )}
      {pageNumber === 3 && (
        <View className="mx-4 items-center justify-center gap-y-10">
          <Image
            source={require("@/src/assets/images/excited.svg")}
            style={{ height: 70, width: 70 }}
          />
          <Text className="text-center font-semibold text-xl">
            Let's record your first journal entry!
          </Text>
          <View className="relative items-center justify-center w-20 h-20">
            {recorderState.isRecording && (
              <Animated.View
                pointerEvents="none"
                className="absolute w-20 h-20 rounded-full bg-[#1F70F5]"
                style={{
                  transform: [{ scale: glowScale }],
                  opacity: glowOpacity,
                }}
              />
            )}
            <TouchableOpacity
              testID="finish-recording-button"
              accessibilityLabel="Finish recording"
              accessible={true}
              accessibilityHint="Finish recording your journal entry"
              accessibilityRole="button"
              onPress={() => {
                handleRecording();
              }}
            >
              <Ionicons
                name={recorderState.isRecording ? "checkmark" : "mic"}
                size={44}
                color="white"
                className="bg-primary-container rounded-full p-4"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {pageNumber === 4 && <Redirect href={"/"} />}
    </View>
  );
};

export default Onboarding;
