import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../../global.css";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 2000);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              headerLargeTitleEnabled: false,
              headerRight: () => (
                <Pressable onPress={() => router.push("/settings")}>
                  <Ionicons name="settings-outline" size={20} color="black" />
                </Pressable>
              ),
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: true,
              headerLargeTitleEnabled: false,
              headerTitle: "Settings",
              headerTransparent: true,
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          <Stack.Screen
            name="create"
            options={{
              headerShown: true,
              headerLargeTitleEnabled: false,
              headerTitle: "New Entry",
              headerTransparent: true,
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          <Stack.Screen
            name="[title]"
            options={{
              headerShown: true,
              headerLargeTitleEnabled: false,
              headerTransparent: true,
              headerBackButtonDisplayMode: "minimal",
            }}
          />
        </Stack>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
