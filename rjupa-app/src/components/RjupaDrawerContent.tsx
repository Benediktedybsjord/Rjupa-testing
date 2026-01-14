import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { theme } from "../constants/theme";

function Item({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.item, active && styles.itemActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
    >
      <Feather name={icon} size={18} color={theme.colors.icon} />
      <Text style={styles.itemText}>{label}</Text>
    </Pressable>
  );
}

export default function RjupaDrawerContent(props: DrawerContentComponentProps) {
  const { state, navigation } = props;
  const currentRoute = state.routeNames[state.index];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>Rjupa</Text>
        <Text style={styles.sub}>Meny</Text>
      </View>

      <Item
        label="Hjem"
        icon="home"
        active={currentRoute === "(tabs)"}
        onPress={() => navigation.navigate("(tabs)")}
      />
      <Item
        label="Kjøp"
        icon="shopping-bag"
        active={currentRoute === "purchases"}
        onPress={() => navigation.navigate("purchases")}
      />
      <Item
        label="Innstillinger"
        icon="settings"
        active={currentRoute === "settings"}
        onPress={() => navigation.navigate("settings")}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>© Rjupa</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flexGrow: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  brand: {
    fontSize: 18,
    fontFamily: theme.fonts.heading || theme.fonts.headingFallback,
    color: theme.colors.text,
  },
  sub: {
    marginTop: 4,
    fontFamily: theme.fonts.body || theme.fonts.bodyFallback,
    color: theme.colors.muted,
  },
  item: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: 10,
  },
  itemActive: { backgroundColor: theme.colors.sand },
  itemText: {
    fontSize: 15,
    fontFamily: theme.fonts.body || theme.fonts.bodyFallback,
    color: theme.colors.text,
  },
  footer: { marginTop: "auto", padding: 16 },
  footerText: {
    fontFamily: theme.fonts.body || theme.fonts.bodyFallback,
    color: theme.colors.muted,
  },
});
