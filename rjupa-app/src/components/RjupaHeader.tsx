import React from "react";
import { View, Text, Pressable, StyleSheet, Platform, StatusBar } from "react-native";
import type { DrawerHeaderProps } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../constants/theme";

export default function RjupaHeader({ navigation }: DrawerHeaderProps) {
  const insets = useSafeAreaInsets();

  const androidTop = Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0;
  const topPad = Math.max(insets.top, androidTop);

  return (
    <View style={[styles.wrap, { paddingTop: topPad }]}>
      <View style={styles.left}>
        <Text style={styles.logo}>Rjupa</Text>
      </View>

      <Pressable
        onPress={() => navigation.toggleDrawer()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Åpne meny"
        style={styles.menuBtn}
        
      >
        <Feather name="menu" size={22} color={theme.colors.icon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: theme.colors.sand,
    paddingHorizontal: 16,

    minHeight: 56,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: {
    fontSize: 18,
    fontFamily: theme.fonts.heading || theme.fonts.headingFallback,
    color: theme.colors.text,
  },
  menuBtn: { padding: 6, borderRadius: 10 },
});
