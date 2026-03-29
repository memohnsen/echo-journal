import Chip from "@/components/ui/Chip";
import EmotionPicker from "@/components/ui/EmotionPicker";
import Waveform from "@/components/ui/Waveform";
import { buttonStyling, MOODS, TOPICS } from "@/constants/entries";
import { Mood } from "@/types/entry";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { BottomSheet, Input, TextArea, TextField } from "heroui-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Create = () => {
  const [title, setTitle] = useState("");
  const [topics, setTopics] = useState([""]);
  const [description, setDescription] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood>("other");
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const getImageByMood = () => {
    const mood = MOODS.filter((mood) => mood.mood === selectedMood);
    return mood.map((item) => item.image);
  };

  return (
    <>
      <View className="flex-1 bg-background pt-36 mx-4">
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
            mood={selectedMood ? selectedMood : "other"}
            length={32}
            currentTime={"0:00"}
            totalTime={"12:30"}
          />
          <TouchableOpacity className="bg-white rounded-full p-2 shadow ml-2">
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
              onPress={() =>
                setTopics((prev) =>
                  prev.includes(topic)
                    ? prev.filter((t) => t !== topic)
                    : [...prev, topic],
                )
              }
              variant={topics.includes(topic) ? "selected" : "outline"}
            />
          ))}
        </View>
        <TextField>
          <TextArea
            className="mt-4"
            placeholder="Add Description"
            value={description}
            onChangeText={setDescription}
          />
        </TextField>
      </View>

      <View className="absolute mx-2 bottom-8 w-full flex-row gap-4">
        <TouchableOpacity className="items-center justify-center w-1/4 bg-on-primary-container p-4 rounded-full">
          <Text className="text-primary font-semibold text-lg">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center justify-center w-2/3 bg-linear-to-b from-[#578CFF] to-[#1F70F5] p-4 rounded-full">
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
