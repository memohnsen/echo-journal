import { Image } from "expo-image";
import { View } from "react-native";

const SplashScreen = () => {
  return (
    <View className="bg-surface-variant flex-1 items-center justify-center">
      <Image
        source={require("@/assets/images/color-splash.png")}
        style={{ width: 100, height: 100 }}
      />
    </View>
  );
};

export default SplashScreen;
