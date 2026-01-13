import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { DrawerHeaderProps } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { theme } from "../constants/theme";

export default function RjupaHeader({ navigation, options }: DrawerHeaderProps) {
  const title = options.title ?? "Rjupa";

  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        {/* Change to Rjupa logo later:) */}
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
    height: 56,
    backgroundColor: theme.colors.sand,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { fontSize: 18, fontWeight: "700", color: theme.colors.text },
  menuBtn: { padding: 6, borderRadius: 10 },
});
