// create.tsx
import React, { useState } from "react";
import { View, Text, Pressable, Modal, Alert, Image } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import SelectImageModal from "../../src/components/SelectImageModal";

export default function CreateScreen() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const handleOpenCamera = async () => {
    // Request camera access
    const cameraPerm = await Camera.requestCameraPermissionsAsync();
    if (!cameraPerm.granted) {
      Alert.alert(
        "Camera access required.",
        "Please allow camera access to use this feature."
      );
      return;
    }

    // Request access to photos (camera roll)
    const libraryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!libraryPerm.granted) {
      Alert.alert(
        "Photo access is required.",
        "Please allow access to Photos to choose an image from your camera roll."
      );
      return;
    }

    // If everything is ok, open modal
    setIsCameraOpen(true);
  };

  //***JSX***//
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>New Analysis</Text>

      {/* Show selected image */}
      {selectedImageUri ? (
        <Image
          source={{ uri: selectedImageUri }}
          style={{
            width: 280,
            height: 280,
            borderRadius: 12,
            marginTop: 12,
          }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ marginTop: 12 }}>No image selected yet</Text>
      )}

      <Pressable
        onPress={handleOpenCamera}
        style={{
          width: "100%",
          height: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Entypo name="camera" size={48} color="black" />
      </Pressable>

      <Modal visible={isCameraOpen} animationType="slide">
        <SelectImageModal
          onClose={() => setIsCameraOpen(false)}
          onImageSelected={(uri) => {
            setSelectedImageUri(uri);
            setIsCameraOpen(false);
          }}
        />
      </Modal>
    </View>
  );
}
