import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../src/constants/theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imagePlaceholder} />
        {/* Just a placeholder until we find out what the homepage is gonna look like. */}
        <Text style={styles.title}>Title</Text>
        <Text style={styles.sub}>Subtitle</Text>
        <Text style={styles.body}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: theme.colors.bg, // mer konsistent enn lilla
  },
  imagePlaceholder: {
    height: 180,
    backgroundColor: theme.colors.sand, // mer konsistent enn lilla
  },
  title: {
    marginTop: 12,
    paddingHorizontal: 12,
    fontFamily: theme.fonts.heading || theme.fonts.headingFallback,
    fontSize: 18,
    color: theme.colors.text,
  },
  sub: {
    paddingHorizontal: 12,
    marginTop: 2,
    fontFamily: theme.fonts.body || theme.fonts.bodyFallback,
    color: theme.colors.muted,
  },
  body: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: theme.fonts.body || theme.fonts.bodyFallback,
    color: theme.colors.muted,
  },
});
