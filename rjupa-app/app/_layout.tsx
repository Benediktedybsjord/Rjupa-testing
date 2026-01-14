import "react-native-gesture-handler";
import React from "react";
import { Drawer } from "expo-router/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";

import RjupaHeader from "../src/components/RjupaHeader";
import RjupaDrawerContent from "../src/components/RjupaDrawerContent";
import { theme } from "../src/constants/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Drawer
        screenOptions={{
          header: (props) => <RjupaHeader {...props} />,
          drawerStyle: { backgroundColor: theme.colors.bg },
        }}
        drawerContent={(props) => <RjupaDrawerContent {...props} />}
      >
        <Drawer.Screen name="(tabs)" options={{ title: "Home" }} />
        <Drawer.Screen name="purchases" options={{ title: "Kjøp" }} />
        <Drawer.Screen name="settings" options={{ title: "Innstillinger" }} />
      </Drawer>
    </SafeAreaProvider>
  );
}
