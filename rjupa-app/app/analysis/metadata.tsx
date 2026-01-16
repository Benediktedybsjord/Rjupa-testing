import React from "react";
import { View, Text, Pressable } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { getDraftImageUri } from "../../src/state/newAnalysisDraft";

/**
 * AnalysisMetadataScreen
 *
 * This screen is a temporary demo/example used to illustrate the intended
 * flow after image review. It does not represent the final metadata step.
 *
 * The purpose is to validate navigation, layout, and state handling
 * before the real metadata form and analysis pipeline are implemented.
 */


export default function AnalysisMetadataScreen() {
  const insets = useSafeAreaInsets();
  const padTop = Math.max(insets.top, 12);
  const padBottom = Math.max(insets.bottom, 12);

  const [hasDraft, setHasDraft] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setHasDraft(!!getDraftImageUri());
    }, [])
  );

  return (
    <View className="flex-1 bg-bg px-4" style={{ paddingTop: padTop }}>
        <View className="self-center rounded-full border border-card-border bg-bg px-3 py-1">
            <Text className="font-body text-[11px] text-muted">
                Demo / midlertidig innhold – metadatasiden er under utforming
            </Text>
        </View>
      {/* Top content */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
        <Pressable
            onPress={() => router.replace("/review")}
            accessibilityRole="button"
            accessibilityLabel="Tilbake"
            hitSlop={10}
            >
            {({ pressed }) => (
                <View
                className="h-11 w-11 items-center justify-center rounded-full border border-card-border bg-bg"
                style={{ opacity: pressed ? 0.9 : 1 }}
                >
                <Feather name="chevron-left" size={20} color="#111111" />
                </View>
            )}
            </Pressable>

          <Text className="font-heading text-[18px] text-text">Metadata</Text>
          <View className="h-11 w-11" />
        </View>

        <Text className="mt-4 font-body text-[13px] leading-5 text-muted">
          {hasDraft
            ? "Bildet er valgt. Neste steg er å registrere våpen/choke/patron osv."
            : "Ingen bildefil funnet. Gå tilbake og velg bilde på nytt."}
        </Text>

        <View className="mt-5 rounded-card border border-card-border bg-card px-4 py-4">
          <Text className="font-heading text-[15px] text-text">
            Kommer i neste steg
          </Text>
          <Text className="mt-2 font-body text-[13px] leading-5 text-muted">
            • Våpen{"\n"}• Choke{"\n"}• Patron{"\n"}• Antall hagl{"\n"}• Notater
          </Text>
        </View>
      </View>

      {/* Bottom CTA */}
      <View style={{ paddingBottom: padBottom }}>
        <Pressable
          onPress={() => {
            // TODO: Replace with next real step, e.g. /analysis/run or /results
            router.replace("/(tabs)/newAnalysis");
          }}
          disabled={!hasDraft}
          accessibilityRole="button"
          accessibilityLabel="Fortsett"
          hitSlop={10}
        >
          {({ pressed }) => (
            <View
              className={`items-center justify-center rounded-card border border-card-border px-4 py-3 ${
                hasDraft ? "bg-sand/80" : "bg-sand/40"
              }`}
              style={{ opacity: pressed ? 0.92 : 1 }}
            >
              <Text className="font-body font-semibold text-text">Fortsett</Text>
            </View>
          )}
        </Pressable>

        <Text className="mt-3 text-center font-body text-[12px] text-muted">
          Alt skjer lokalt på enheten – ingen opplasting.
        </Text>
      </View>
    </View>
  );
}
