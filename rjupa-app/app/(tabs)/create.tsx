import React, { useState } from "react";
import { View, Text, Pressable, Alert, Image } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import SelectImageModal from "../../src/components/SelectImageModal";


// Skal vi ha kjøp analyser her også? Tenkte at drawer bør uansett ha kjøp i menyen, 
// men vi bør ha det på en av skjermene også. Enten create eller profile?

export default function CreateScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const handleOpenCamera = async () => {
    const cameraPerm = await Camera.requestCameraPermissionsAsync();
    if (!cameraPerm.granted) {
      Alert.alert(
        "Kameratilgang kreves",
        "Gi tilgang til kamera for å ta bilde."
      );
      return;
    }

    const libraryPerm =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!libraryPerm.granted) {
      Alert.alert(
        "Bildetilgang kreves",
        "Gi tilgang til bilder for å velge fra galleri."
      );
      return;
    }

    setCameraOpen(true);
  };

  return (
    <View className="flex-1 bg-bg">
      {/* Centered content */}
      <View className="flex-1 items-center justify-center px-4">
        <Text className="font-heading text-xl text-text">
          Ny analyse
        </Text>

        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="mt-4 h-[280px] w-[280px] rounded-card"
            resizeMode="cover"
            accessibilityLabel="Valgt bilde"
          />
        ) : (
          <Text className="mt-4 font-body text-muted text-center">
            Velg eller ta et bilde for å starte analysen
          </Text>
        )}

        <Pressable
          onPress={handleOpenCamera}
          accessibilityRole="button"
          accessibilityLabel="Åpne kamera"
          className="mt-8 w-full items-center"
        >
          <View className="items-center justify-center rounded-card border border-card-border bg-sand/80 px-6 py-5">
            <Entypo name="camera" size={44} color="#111111" />
            <Text className="mt-2 font-body text-[13px] font-semibold text-text">
              Åpne kamera
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Camera / Image modal */}
      <SelectImageModal
        visible={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onImageSelected={(uri) => {
          setImageUri(uri);
          setCameraOpen(false);
        }}
      />
    </View>
  );
}
