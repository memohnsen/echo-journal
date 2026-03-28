import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

export default function RootLayout() {
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
              headerLargeTitleEnabled: true,
              headerTitle: "Settings",
              headerTransparent: true,
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          <Stack.Screen
            name="create"
            options={{
              headerShown: true,
              headerLargeTitleEnabled: true,
              headerTitle: "New Entry",
              headerTransparent: true,
              headerBackButtonDisplayMode: "minimal",
            }}
          />
        </Stack>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
