import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { clearDraftImageUri, getDraftImageUri } from "../src/state/newAnalysisDraft";

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const padBottom = Math.max(insets.bottom, 12);
  const padTop = Math.max(insets.top, 12);

  const [uri, setUri] = React.useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      setUri(getDraftImageUri());
    }, [])
  );

  const handleRetake = React.useCallback(() => {
    clearDraftImageUri();
    // Replace prevents navigating back to this review screen after retake
    router.replace("/(tabs)/newAnalysis?openCamera=1");
  }, []);

  const handleUsePhoto = React.useCallback(() => {
    // Proceed to next step (metadata). We keep draft uri as source of truth.
    router.replace("/analysis/metadata");
  }, []);

  if (!uri) {
    return (
      <View className="flex-1 bg-bg px-4" style={{ paddingTop: padTop }}>
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Lukk"
            hitSlop={10}
          >
            {({ pressed }) => (
              <View
                className="h-11 w-11 items-center justify-center rounded-full border border-card-border bg-bg"
                style={{ opacity: pressed ? 0.9 : 1 }}
              >
                <Feather name="x" size={20} color="#111111" />
              </View>
            )}
          </Pressable>

          <Text className="font-heading text-[18px] text-text">Forhåndsvisning</Text>
          <View className="h-11 w-11" />
        </View>

        <Text className="mt-4 font-body text-[13px] leading-5 text-muted">
          Ingen bilde valgt. Gå tilbake og ta et nytt bilde.
        </Text>

        <Pressable
          onPress={handleRetake}
          className="mt-5"
          accessibilityRole="button"
          accessibilityLabel="Ta nytt bilde"
          hitSlop={10}
        >
          {({ pressed }) => (
            <View
              className="items-center justify-center rounded-card border border-card-border bg-sand/80 px-4 py-3"
              style={{ opacity: pressed ? 0.92 : 1 }}
            >
              <Text className="font-body font-semibold text-text">Ta nytt bilde</Text>
            </View>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View
        className="absolute left-0 right-0 z-10 flex-row items-center justify-between px-4"
        style={{ paddingTop: padTop }}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Lukk"
          hitSlop={10}
        >
          {({ pressed }) => (
            <View
              className="h-11 w-11 items-center justify-center rounded-full bg-black/45"
              style={{ opacity: pressed ? 0.85 : 1 }}
            >
              <Feather name="x" size={20} color="#fff" />
            </View>
          )}
        </Pressable>

        <Text className="font-heading text-[16px] text-white">Forhåndsvisning</Text>
        <View className="h-11 w-11" />
      </View>

      <Image source={{ uri }} style={{ flex: 1 }} resizeMode="contain" />

      <View
        className="absolute left-0 right-0 px-4"
        style={{ paddingBottom: padBottom, bottom: 0 }}
      >
        <View className="flex-row gap-3 py-4">
          <Pressable
            onPress={handleRetake}
            className="flex-1"
            accessibilityRole="button"
            accessibilityLabel="Ta nytt bilde"
            hitSlop={10}
          >
            {({ pressed }) => (
              <View
                className="items-center justify-center rounded-[14px] border border-white/30 bg-black/40 py-3"
                style={{ opacity: pressed ? 0.92 : 1 }}
              >
                <Text className="font-body text-[15px] font-medium text-white">
                  Ta nytt bilde
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={handleUsePhoto}
            className="flex-1"
            accessibilityRole="button"
            accessibilityLabel="Bruk bilde"
            hitSlop={10}
          >
            {({ pressed }) => (
              <View
                className="items-center justify-center rounded-[14px] bg-sand/90 py-3"
                style={{ opacity: pressed ? 0.92 : 1 }}
              >
                <Text className="font-body text-[15px] font-semibold text-text">
                  Bruk bilde
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        <Text className="pb-2 text-center font-body text-[12px] text-white/70">
          Sjekk at hele skiva er med, og at bildet er skarpt.
        </Text>
      </View>
    </View>
  );
}
