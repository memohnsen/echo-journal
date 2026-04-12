import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

const NoEntries = () => {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Image
        source={require("@/assets/images/empty-list.svg")}
        style={{ width: 150, height: 150 }}
      />
      <Text className="text-2xl font-semibold mt-4">No Entries</Text>
      <Text className="text-md mt-2 text-on-surface-variant">
        Start recording your first Echo
      </Text>
    </View>
  );
};

export default NoEntries;
