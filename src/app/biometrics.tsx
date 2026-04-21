import { Alert, Text, TouchableOpacity, View } from "react-native";
import { onAuth } from "../utils/biometricsService";
import React from "react";
import { Redirect } from "expo-router";
import { Image } from "expo-image";

interface BiometricsLoginProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const BiometricsLogin = ({
  setIsLoggedIn,
  isLoggedIn,
}: BiometricsLoginProps) => {
  const checkAuth = async () => {
    const result = await onAuth();

    if (result.result.success) {
      return setIsLoggedIn(true);
    } else if (!result.result.hasHardware) {
      return Alert.alert(
        "Authentication failed, device does not support biometric login",
      );
    } else if (!result.result.isEnrolled) {
      return Alert.alert(
        "Authentication failed, device not enrolled in biometric login",
      );
    } else if (!result.result.success) {
      return console.log(result);
    }
  };

  if (isLoggedIn) {
    return <Redirect href={"./index"} />;
  }

  return (
    <View className="flex-1 items-center bg-inverse-on-surface justify-center mx-4">
      <Image
        source={require("../assets/images/excited.svg")}
        style={{ height: 80, width: 80 }}
      />
      <Text className="text-2xl mt-8 font-bold text-center">
        Login with Face ID to Access Your Journal
      </Text>
      <TouchableOpacity
        className="rounded-2xl mt-8 bg-linear-to-b from-[#578CFF] to-[#1F70F5] w-2/3 p-4 items-center justify-center"
        onPress={() => checkAuth()}
      >
        <Text className="text-white font-semibold text-md">Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BiometricsLogin;
