import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  Modal,
  StyleSheet,
  StatusBar,
  Platform,
  Linking,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string) => void;
};

type FocusPoint = { x: number; y: number } | null;

/**
 * Flow B:
 * CAPTURE (this modal) -> REVIEW (/review) -> CONFIRM (outside via draft state)
 *
 * This modal should stay "dumb": it only returns a URI and closes.
 * Navigation decisions happen in the caller.
 */
export default function SelectImageModal({
  visible,
  onClose,
  onImageSelected,
}: Props) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView | null>(null);

  const [permission, requestPermission] = useCameraPermissions();

  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [focusPoint, setFocusPoint] = useState<FocusPoint>(null);

  const busy = isTakingPhoto || isPicking;

  // Reset volatile state when modal closes
  useEffect(() => {
    if (!visible) {
      setTorchOn(false);
      setIsTakingPhoto(false);
      setIsPicking(false);
      setFocusPoint(null);
    }
  }, [visible]);

  // Auto-request camera permission on open (only if undetermined)
  useEffect(() => {
    if (!visible) return;
    if (!permission) return;

    if (permission.status === "undetermined" && permission.canAskAgain) {
      requestPermission();
    }
  }, [visible, permission, requestPermission]);

  // Auto-hide focus ring
  useEffect(() => {
    if (!focusPoint) return;
    const t = setTimeout(() => setFocusPoint(null), 900);
    return () => clearTimeout(t);
  }, [focusPoint]);

  const openAppSettings = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert(
        "Innstillinger",
        "Kunne ikke åpne innstillinger på denne enheten."
      );
    }
  }, []);

  const ensureLibraryPermission = useCallback(async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res.granted) {
      Alert.alert(
        "Bildetilgang kreves",
        "Gi tilgang til bilder for å velge et bilde fra galleriet."
      );
      return false;
    }
    return true;
  }, []);

  const finalizeSelection = useCallback(
    (uri: string) => {
      // Close first to avoid a "flash" / modal lingering during navigation.
      onClose();
      onImageSelected(uri);
    },
    [onClose, onImageSelected]
  );

  const pickImageFromLibrary = useCallback(async () => {
    if (busy) return;

    const ok = await ensureLibraryPermission();
    if (!ok) return;

    try {
      setIsPicking(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) return;

      const uri = result.assets[0]?.uri;
      if (!uri) {
        Alert.alert("Feil", "Kunne ikke lese bildeadresse fra galleriet.");
        return;
      }

      finalizeSelection(uri);
    } catch {
      Alert.alert("Feil", "Kunne ikke åpne galleriet. Prøv igjen.");
    } finally {
      setIsPicking(false);
    }
  }, [busy, ensureLibraryPermission, finalizeSelection]);

  const takePhoto = useCallback(async () => {
    if (busy) return;

    if (!permission?.granted) {
      Alert.alert(
        "Kameratilgang kreves",
        "Gi tilgang til kamera for å ta et bilde."
      );
      return;
    }

    if (!cameraRef.current) {
      Alert.alert("Kamera ikke klart", "Vent litt og prøv igjen.");
      return;
    }

    try {
      setIsTakingPhoto(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: false,
      });

      const uri = photo?.uri;
      if (!uri) {
        Alert.alert("Feil", "Ingen bildeadresse ble returnert.");
        return;
      }

      finalizeSelection(uri);
    } catch {
      Alert.alert("Feil", "Kunne ikke ta bilde. Prøv igjen.");
    } finally {
      setIsTakingPhoto(false);
    }
  }, [busy, permission?.granted, finalizeSelection]);

  const padBottom = Math.max(insets.bottom, 12);
  const padTop = Math.max(insets.top, Platform.OS === "android" ? 12 : 0);

  const hasPermission = !!permission?.granted;
  const canAskAgain = !!permission?.canAskAgain;
  const showPermissionScreen = !!permission && !permission.granted;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />

        {/* Loading */}
        {!permission ? (
          <View className="flex-1 items-center justify-center bg-black">
            <ActivityIndicator />
            <Text className="mt-3 font-body text-white/80">Laster kamera…</Text>
          </View>
        ) : showPermissionScreen ? (
          /* Permission screen */
          <View className="flex-1 items-center justify-center bg-black px-6">
            <Text className="text-center font-heading text-[18px] text-white">
              Kameratilgang kreves
            </Text>
            <Text className="mt-2 text-center font-body text-white/70">
              Vi trenger tilgang til kamera for å ta bilde av skiva.
            </Text>

            <View className="mt-5 w-full gap-3">
              {canAskAgain ? (
                <Pressable
                  onPress={requestPermission}
                  disabled={busy}
                  accessibilityRole="button"
                  accessibilityLabel="Gi kameratilgang"
                >
                  {({ pressed }) => (
                    <View
                      className={`items-center justify-center rounded-[14px] bg-sand/90 py-3 ${
                        busy ? "opacity-60" : ""
                      }`}
                      style={{ opacity: pressed ? 0.9 : 1 }}
                    >
                      <Text className="font-body font-semibold text-text">
                        Gi tilgang
                      </Text>
                    </View>
                  )}
                </Pressable>
              ) : (
                <Pressable
                  onPress={openAppSettings}
                  disabled={busy}
                  accessibilityRole="button"
                  accessibilityLabel="Åpne innstillinger"
                >
                  {({ pressed }) => (
                    <View
                      className={`items-center justify-center rounded-[14px] bg-sand/90 py-3 ${
                        busy ? "opacity-60" : ""
                      }`}
                      style={{ opacity: pressed ? 0.9 : 1 }}
                    >
                      <Text className="font-body font-semibold text-text">
                        Åpne innstillinger
                      </Text>
                    </View>
                  )}
                </Pressable>
              )}

              <Pressable
                onPress={onClose}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel="Lukk"
              >
                {({ pressed }) => (
                  <View
                    className={`items-center justify-center rounded-[14px] border border-white/20 bg-black/30 py-3 ${
                      busy ? "opacity-60" : ""
                    }`}
                    style={{ opacity: pressed ? 0.9 : 1 }}
                  >
                    <Text className="font-body font-semibold text-white">
                      Lukk
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        ) : (
          /* CAPTURE MODE (Review happens outside this modal in Flow B) */
          <>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={(e) => {
                const { locationX, locationY } = e.nativeEvent;
                setFocusPoint({ x: locationX, y: locationY });
                // NOTE: expo-camera (managed) doesn't expose manual focus control.
                // This is a UI-only focus indicator.
              }}
              accessibilityRole="image"
              accessibilityLabel="Kameraforhåndsvisning"
            >
              <CameraView
                ref={cameraRef}
                facing="back"
                active={visible && hasPermission}
                enableTorch={torchOn}
                autofocus={Platform.OS === "ios" ? "on" : undefined}
                style={StyleSheet.absoluteFillObject}
              />
            </Pressable>

            {focusPoint && (
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  left: focusPoint.x - 28,
                  top: focusPoint.y - 28,
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  borderWidth: 2,
                  borderColor: "rgba(255,255,255,0.85)",
                }}
              />
            )}

            <View
              className="absolute left-0 right-0 flex-row items-center justify-between px-4"
              style={{ paddingTop: padTop }}
            >
              <Pressable
                onPress={onClose}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel="Lukk kamera"
                hitSlop={10}
              >
                {({ pressed }) => (
                  <View
                    className={`h-11 w-11 items-center justify-center rounded-full bg-black/45 ${
                      busy ? "opacity-60" : ""
                    }`}
                    style={{ opacity: pressed ? 0.85 : 1 }}
                  >
                    <Feather name="x" size={20} color="#fff" />
                  </View>
                )}
              </Pressable>

              <Pressable
                onPress={() => setTorchOn((v) => !v)}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel={
                  torchOn ? "Skru av lommelykt" : "Skru på lommelykt"
                }
                hitSlop={10}
              >
                {({ pressed }) => (
                  <View
                    className={`h-11 w-11 items-center justify-center rounded-full bg-black/45 ${
                      busy ? "opacity-60" : ""
                    }`}
                    style={{ opacity: pressed ? 0.85 : 1 }}
                  >
                    <Feather
                      name={torchOn ? "zap" : "zap-off"}
                      size={20}
                      color="#fff"
                    />
                  </View>
                )}
              </Pressable>
            </View>

            <View
              className="absolute left-0 right-0 px-4"
              style={{ paddingBottom: padBottom, bottom: 0 }}
            >
              <View className="flex-row gap-2.5 py-3">
                <Pressable
                  onPress={pickImageFromLibrary}
                  disabled={busy}
                  className="flex-1"
                  accessibilityRole="button"
                  accessibilityLabel="Velg fra galleri"
                  hitSlop={10}
                >
                  {({ pressed }) => (
                    <View
                      className={`items-center justify-center rounded-[14px] bg-sand/90 py-3 ${
                        busy ? "opacity-60" : ""
                      }`}
                      style={{ opacity: pressed ? 0.9 : 1 }}
                    >
                      <Text className="font-body text-[15px] font-medium text-text">
                        {isPicking ? "Åpner…" : "Velg"}
                      </Text>
                    </View>
                  )}
                </Pressable>

                <Pressable
                  onPress={takePhoto}
                  disabled={busy}
                  className="flex-1"
                  accessibilityRole="button"
                  accessibilityLabel="Ta bilde"
                  hitSlop={10}
                >
                  {({ pressed }) => (
                    <View
                      className={`items-center justify-center rounded-[14px] bg-sand/90 py-3 ${
                        busy ? "opacity-60" : ""
                      }`}
                      style={{ opacity: pressed ? 0.9 : 1 }}
                    >
                      <Text className="font-body text-[15px] font-medium text-text">
                        {isTakingPhoto ? "Tar bilde…" : "Ta bilde"}
                      </Text>
                    </View>
                  )}
                </Pressable>

                <Pressable
                  onPress={onClose}
                  disabled={busy}
                  className="flex-1"
                  accessibilityRole="button"
                  accessibilityLabel="Avbryt"
                  hitSlop={10}
                >
                  {({ pressed }) => (
                    <View
                      className={`items-center justify-center rounded-[14px] bg-sand/90 py-3 ${
                        busy ? "opacity-60" : ""
                      }`}
                      style={{ opacity: pressed ? 0.9 : 1 }}
                    >
                      <Text className="font-body text-[15px] font-medium text-text">
                        Avbryt
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "black",
  },
});
