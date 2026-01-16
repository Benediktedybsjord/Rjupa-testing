import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import SelectImageModal from "../../src/components/SelectImageModal";
import {
  getDraftImageUri,
  clearDraftImageUri,
  setDraftImageUri,
} from "../../src/state/newAnalysisDraft";

type ChecklistItem = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  desc: string;
};

type Params = {
  openCamera?: string;
};

 /**
   * TEAM NOTE (CTA / "Open camera"):
   * Should we include a "sticky" camera CTA at the bottom that appears after scrolling
   * to keep the primary action easily accessible?
   *
   * Without a sticky CTA:
   * - The UI feels calmer and more focused, without an extra CTA competing with content.
   * - Reduced complexity (no scroll state, thresholds, or extra padding to avoid overlap).
   * - Lower risk of the CTA covering content or conflicting with safe areas on smaller screens.
   *
   * Open questions for the team:
   * - Do we want to prioritize quick access to the camera while reading the checklist (sticky CTA),
   *   or is it better UX to encourage users to read everything first and then press the button
   *   inside the content card (non-sticky)?
   */

export default function NewAnalysisScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Params>();

  const [hasDraft, setHasDraft] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const checklist: ChecklistItem[] = useMemo(
    () => [
      {
        icon: "map-pin",
        title: "28 meter",
        desc: "Testen må skytes på riktig avstand for sammenlignbare tall.",
      },
      {
        icon: "maximize",
        title: "Hele skiven synlig",
        desc: "Pass på at hele 60 cm-sirkelen og rutenettet er med i bildet.",
      },
      {
        icon: "minus",
        title: "10 cm referanselinje",
        desc: "Referanselinjen må være synlig – den brukes til skalering.",
      },
      {
        icon: "sun",
        title: "Godt lys",
        desc: "Unngå skygger/sterke refleksjoner. Jevnt lys gir best treffdeteksjon.",
      },
      {
        icon: "camera",
        title: "Hold rolig",
        desc: "Hold telefonen stødig og mest mulig rett mot skiven.",
      },
    ],
    []
  );

  const requestPermissions = useCallback(async () => {
    const cam = await Camera.requestCameraPermissionsAsync();
    if (!cam.granted) {
      Alert.alert("Kameratilgang kreves", "Gi tilgang til kamera for å ta bilde.");
      return false;
    }

    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!lib.granted) {
      Alert.alert("Bildetilgang kreves", "Gi tilgang til bilder for å velge fra galleri.");
      return false;
    }

    return true;
  }, []);

  const handleOpenCamera = useCallback(async () => {
    if (opening) return;
    setOpening(true);
    try {
      const ok = await requestPermissions();
      if (!ok) return;
      setCameraOpen(true);
    } finally {
      setOpening(false);
    }
  }, [opening, requestPermissions]);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      // TODO: later can be used to fetch local data (quota/history)
      await new Promise((r) => setTimeout(r, 250));
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  const handleImageCaptured = useCallback((uri: string) => {
    // Flow B: capture/pick -> review route. Keep this screen deterministic.
    setDraftImageUri(uri);
    setCameraOpen(false);
    router.push("/review");
  }, []);

  const handleClearDraft = useCallback(() => {
    clearDraftImageUri();
    setHasDraft(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Sync UI with draft whenever this screen becomes active
      setHasDraft(!!getDraftImageUri());

      // Auto-open camera when coming from Review "Retake"
      if (params.openCamera === "1") {
        handleOpenCamera();
        router.setParams({ openCamera: undefined });
      }
    }, [params.openCamera, handleOpenCamera])
  );

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 12) + 24,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="mb-3">
          <View className="bg-bg px-4 py-2">
            <View className="self-center rounded-full border border-card-border bg-bg px-3 py-1">
              <Text className="font-body text-[11px] text-muted">
                Demo / midlertidig innhold – Analysesiden er under utforming
              </Text>
            </View>
          </View>

          <Text className="font-heading text-[22px] text-text">Ny analyse</Text>
          <Text className="mt-1 font-body text-[13px] leading-5 text-muted">
            Før du åpner kamera: ta 10 sekunder og sjekk punktene under. Det reduserer
            feilbilder og gir mer pålitelige resultater.
          </Text>
        </View>

        {/* Content card */}
        <View className="overflow-hidden rounded-card border border-card-border bg-card">
          {/* Draft status (replaces big preview on this screen) */}
          <View className="border-b border-card-border bg-sand/60 px-4 py-4">
            {hasDraft ? (
              <View className="gap-2">
                <Text className="font-body text-xs text-muted">
                  Du har valgt et bilde (klart for forhåndsvisning)
                </Text>

                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => router.push("/review")}
                    accessibilityRole="button"
                    accessibilityLabel="Åpne forhåndsvisning"
                    className="flex-1"
                    hitSlop={10}
                  >
                    {({ pressed }) => (
                      <View
                        className="rounded-card border border-card-border bg-bg px-4 py-3"
                        style={{ opacity: pressed ? 0.9 : 1 }}
                      >
                        <Text className="text-center font-body text-[13px] font-semibold text-text">
                          Åpne forhåndsvisning
                        </Text>
                      </View>
                    )}
                  </Pressable>

                  <Pressable
                    onPress={handleClearDraft}
                    accessibilityRole="button"
                    accessibilityLabel="Nullstill valgt bilde"
                    className="flex-1"
                    hitSlop={10}
                  >
                    {({ pressed }) => (
                      <View
                        className="rounded-card border border-card-border bg-bg px-4 py-3"
                        style={{ opacity: pressed ? 0.9 : 1 }}
                      >
                        <Text className="text-center font-body text-[13px] text-text">
                          Nullstill
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </View>
              </View>
            ) : (
              <View className="items-center justify-center gap-2 py-2">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-bg">
                  <Feather name="check-circle" size={22} color="#111111" />
                </View>
                <Text className="font-body text-[13px] text-muted text-center">
                  Sørg for at bildet blir tydelig og komplett før du tar det.
                </Text>
              </View>
            )}
          </View>

          {/* Checklist */}
          <View className="px-4 py-4">
            <Text className="font-heading text-[15px] text-text">
              Sjekkliste (maks 5)
            </Text>

            <View className="mt-3 gap-3">
              {checklist.map((item, idx) => (
                <View key={idx} className="flex-row gap-3">
                  <View className="mt-[2px] h-9 w-9 items-center justify-center rounded-full border border-card-border bg-bg">
                    <Feather name={item.icon} size={16} color="#111111" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-body text-[13px] font-semibold text-text">
                      {item.title}
                    </Text>
                    <Text className="mt-0.5 font-body text-[12.5px] leading-5 text-muted">
                      {item.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View className="mt-4 rounded-card border border-card-border bg-bg px-3 py-2.5">
              <Text className="font-body text-[12.5px] leading-5 text-muted">
                Tips: Hvis du er usikker, ta heller et nytt bilde. Analysefeil skyldes
                nesten alltid utsnitt/lys/uklarhet.
              </Text>
            </View>

            <Text className="mt-3 text-center font-body text-[12px] text-muted">
              Alt skjer lokalt på enheten – ingen opplasting.
            </Text>

            <Pressable
              onPress={handleOpenCamera}
              disabled={opening}
              accessibilityRole="button"
              accessibilityLabel="Åpne kamera"
              className="mt-4 w-full items-center"
            >
              {({ pressed }) => (
                <View
                  className={`items-center justify-center rounded-card border border-card-border px-6 py-5 ${
                    opening ? "bg-sand/50" : "bg-sand/80"
                  }`}
                  style={{
                    opacity: pressed ? 0.92 : 1,
                    transform: [{ scale: pressed ? 0.995 : 1 }],
                  }}
                >
                  <Entypo name="camera" size={44} color="#111111" />
                  <Text className="mt-2 font-body text-[13px] font-semibold text-text">
                    {opening ? "Åpner…" : "Åpne kamera"}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Camera modal */}
      <SelectImageModal
        visible={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onImageSelected={handleImageCaptured}
      />
    </View>
  );
}
