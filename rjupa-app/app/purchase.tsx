import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAnalysis } from "../src/context/AnalysisContext";
import { theme } from "../src/constants/theme";

type Pack = {
  id: string;
  title: string;
  price: string;
  per: string;
  amount: number;
  highlight?: boolean;
};

const PACKS: Pack[] = [
  { id: "p10", title: "10 analyser", price: "199 kr", per: "≈ 19,9 kr per analyse", amount: 10 },
  { id: "p20", title: "20 analyser", price: "349 kr", per: "≈ 17,5 kr per analyse", amount: 20, highlight: true },
  { id: "p50", title: "50 analyser", price: "749 kr", per: "≈ 15,0 kr per analyse", amount: 50 },
];

export default function PurchaseScreen() {
  const { analysisBalance, addAnalyses } = useAnalysis();

  // Fallbacks
  const c = theme?.colors ?? ({} as any);
  const bg = c.bg ?? "#0B0B0B";
  const text = c.text ?? "#111111";
  const muted = c.muted ?? "rgba(255,255,255,0.75)";
  const sand = c.sand ?? "#E6D6B8";
  const border = c.cardBorder ?? "rgba(0,0,0,0.12)";

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-4 pt-6 pb-10"
      style={{ backgroundColor: bg }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="mb-4">
        <Text className="text-2xl font-semibold" style={{ color: text }}>
          Kjøp analyser
        </Text>
        <Text className="mt-1 text-sm" style={{ color: muted }}>
          Fleksible pakker. Én analyse trekkes først når testen er fullført.
        </Text>
      </View>

      {/* Balance card */}
      <View
        className="overflow-hidden rounded-card border p-4"
        style={{ borderColor: border, backgroundColor: "rgba(255,255,255,0.04)" }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm" style={{ color: muted }}>
              Tilgjengelige analyser
            </Text>
            <Text className="mt-1 text-4xl font-extrabold" style={{ color: text }}>
              {analysisBalance}
            </Text>
          </View>

          <View
            className="h-11 w-11 items-center justify-center rounded-full border"
            style={{ borderColor: border, backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <Feather name="activity" size={20} color={text} />
          </View>
        </View>

        <View className="mt-3 h-px" style={{ backgroundColor: "rgba(255,255,255,0.10)" }} />

        <View className="mt-3 flex-row items-start gap-3">
          <View
            className="mt-0.5 h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <Feather name="info" size={16} color={text} />
          </View>

          <Text className="flex-1 text-sm leading-5" style={{ color: muted }}>
            Én analyse trekkes først etter at en test er fullført og godkjent. Visning av tidligere
            analyser er alltid gratis.
          </Text>
        </View>
      </View>

      {/* Packs */}
      <View className="mt-5 gap-3">
        {PACKS.map((p) => (
          <View
            key={p.id}
            className="overflow-hidden rounded-card border p-4"
            style={{
              borderColor: p.highlight ? "rgba(255,255,255,0.22)" : border,
              backgroundColor: p.highlight ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
            }}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <View className="flex-row items-center gap-2">
                  <Text className="text-lg font-extrabold" style={{ color: text }}>
                    {p.title}
                  </Text>

                  {p.highlight && (
                    <View
                      className="rounded-full px-2 py-0.5"
                      style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
                    >
                      <Text className="text-[11px] font-semibold" style={{ color: muted }}>
                        Mest valgt
                      </Text>
                    </View>
                  )}
                </View>

                <Text className="mt-1 text-base font-semibold" style={{ color: text }}>
                  {p.price}
                </Text>
                <Text className="mt-1 text-xs" style={{ color: muted }}>
                  {p.per}
                </Text>
              </View>

              <Pressable
                onPress={() => addAnalyses(p.amount)} // TEMP: local only (no real payment yet)
                accessibilityRole="button"
                accessibilityLabel={`Kjøp ${p.title}`}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.99 : 1 }],
                  },
                ]}
                className="min-w-[92px] items-center justify-center rounded-[14px] border px-4 py-3"
                // Button uses theme’s sand, with solid text for contrast
                // Border stays subtle to match the rest of the cards
              >
                <View
                  className="absolute inset-0 rounded-[14px]"
                  style={{ backgroundColor: sand }}
                />
                <Text className="font-extrabold" style={{ color: "#111111" }}>
                  Kjøp
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {/* Footer note */}
      <View className="mt-6 items-center">
        <Text className="text-center text-xs" style={{ color: theme.colors.muted }}>
          Kun demovisning. Betaling og backend-integrasjon legges til senere.
        </Text>
      </View>
    </ScrollView>
  );
}