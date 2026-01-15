import "react-native-gesture-handler";
import React from "react";
import { Drawer } from "expo-router/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "../src/lib/nativewind-interop";
import "../global.css";

import RjupaHeader from "../src/components/RjupaHeader";
import RjupaDrawerContent from "../src/components/RjupaDrawerContent";
import { theme } from "../src/constants/theme";

import { AnalysisProvider } from "../src/context/AnalysisContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AnalysisProvider>
        <Drawer
          screenOptions={{
            header: (props) => <RjupaHeader {...props} />,
            drawerStyle: { backgroundColor: theme.colors.bg },
            drawerPosition: "right",
          }}
          drawerContent={(props) => <RjupaDrawerContent {...props} />}
        >
          <Drawer.Screen name="(tabs)" options={{ title: "Home" }} />
          <Drawer.Screen name="purchase" options={{ title: "Kjøp" }} />
          <Drawer.Screen name="settings" options={{ title: "Innstillinger" }} />
        </Drawer>
      </AnalysisProvider>
    </SafeAreaProvider>
  );
}
