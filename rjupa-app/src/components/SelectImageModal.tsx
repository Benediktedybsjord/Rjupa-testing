// selectimagemodal.tsx
import React, { useRef, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

type Props = {
  onClose: () => void;
  onImageSelected: (uri: string) => void;
};

export default function SelectImageModal({ onClose, onImageSelected }: Props) {
  const cameraRef = useRef<CameraView | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  const pickImageFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Prevent double taps
    if (isTakingPhoto) return;

    try {
      setIsTakingPhoto(true);

      // Camera ref must exist
      if (!cameraRef.current) {
        Alert.alert("Camera error", "Camera is not ready yet.");
        return;
      }

      // Take picture
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: true,
      });

      if (photo?.uri) {
        onImageSelected(photo.uri);
      }
    } catch (error) {
      Alert.alert("Error", "Could not take photo. Please try again.");
    } finally {
      setIsTakingPhoto(false);
    }
  };

  //***JSX***//
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImageFromLibrary}>
          <Text style={styles.text}>Choose</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.text}>
            {isTakingPhoto ? "..." : "Take Picture"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//***STYLES ENDRES SENERE***//
const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
    gap: 10,
  },
  button: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 12,
  },
  text: { fontSize: 16, fontWeight: "bold" },
});
