import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { router } from "expo-router";
import { ScreenScroll } from "../../src/components/ScreenScroll";

const LOGO = require("../../src/assets/logo/Rjupa-Testing.png");

function StatusChip({ text }: { text: string }) {
  return (
    <View className="self-start rounded-full border border-card-border bg-bg px-2.5 py-1.5">
      <Text className="font-body text-xs text-muted">{text}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  // Demo/placeholder
  const availableAnalyses = useMemo(() => 12, []);
  const canStartNewAnalysis = availableAnalyses > 0;

  const handleNewAnalysis = useCallback(() => {
    router.navigate("/(tabs)/create");
  }, []);

  const handlePurchase = useCallback(() => {
    router.push("/purchase");
  }, []);

  return (
    <ScreenScroll refreshing={refreshing} onRefresh={onRefresh}>
      <View
        className="overflow-hidden rounded-card border border-card-border bg-bg"
        accessibilityRole="summary"
        accessibilityLabel="Hjem"
      >
        {/* Logo / hero */}
        <View className="h-[180px] items-center justify-center bg-sand px-4">
          <Image
            source={LOGO}
            className="h-[75px] w-[130px]"
            resizeMode="contain"
            accessibilityRole="image"
            accessibilityLabel="Rjúpa-testing logo"
          />
        </View>

        {/* Demo / placeholder notice */}
        <View className="bg-bg px-4 py-2">
          <View className="self-center rounded-full border border-card-border bg-bg px-3 py-1">
            <Text className="font-body text-[11px] text-muted">
              Demo / midlertidig innhold – hjemmesiden er under utforming
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className="h-px bg-card-border" />

        {/* Content */}
        <View className="px-[14px] py-3">
          <Text className="font-heading text-[18px] text-text">
            Rjúpa-testing
          </Text>

          <Text className="mt-1 font-body text-muted">
            Presis analyse av skuddbilder for hagleskyttere
          </Text>

          <View className="mt-2.5 flex-row flex-wrap gap-2">
            <StatusChip text="Offline" />
            <StatusChip text="Lokal analyse" />
            <StatusChip text="G1" />
          </View>

          <Text className="mt-2.5 font-body leading-5 text-muted">
            Ta bilde av skiva, la appen telle haglhull og beregne nøkkeltall
            (trangboring, kjerne og fordeling). Resultatene lagres lokalt og kan
            sammenlignes i historikken.
          </Text>

          {/* Availability */}
          <View className="mt-3 rounded-card border border-card-border bg-sand px-3 py-2">
            <Text className="font-body text-[13px] text-text">
              Tilgjengelige analyser:{" "}
              <Text className="font-heading text-[13px] text-text">12</Text>
            </Text>

            <Text className="mt-0.5 font-body text-[12px] text-muted">
              Du kan starte en ny analyse nå.
            </Text>
          </View>

          {/* Actions */}
          <View className="mt-3.5 flex-row items-center justify-between border-t border-card-border pt-3">
            <Text className="font-body text-[13px] text-muted">
              Klar for ny analyse?
            </Text>

            <View className="flex-row gap-2">
              <Pressable
                onPress={handlePurchase}
                className="rounded-card border border-card-border bg-bg px-3 py-2"
                accessibilityRole="button"
                accessibilityLabel="Kjøp analyser"
                hitSlop={10}
              >
                <Text className="font-body text-[13px] text-text">Kjøp</Text>
              </Pressable>

              <Pressable
                onPress={handleNewAnalysis}
                disabled={!canStartNewAnalysis}
                className={[
                  "rounded-card px-3 py-2",
                  canStartNewAnalysis ? "bg-sand" : "bg-card-border",
                ].join(" ")}
                accessibilityRole="button"
                accessibilityLabel="Ny analyse"
                accessibilityHint={
                  canStartNewAnalysis
                    ? "Starter en ny analyse"
                    : "Kjøp analyser for å starte"
                }
                accessibilityState={{ disabled: !canStartNewAnalysis }}
                hitSlop={10}
              >
                <Text
                  className={[
                    "font-body text-[13px]",
                    canStartNewAnalysis ? "text-text" : "text-muted",
                  ].join(" ")}
                >
                  Ny analyse
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScreenScroll>
  );
}
