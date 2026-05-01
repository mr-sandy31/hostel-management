import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  uploadSign,
  getSign,
  deleteSign
} from "../../../src/api/qrapi";

export default function SignUpload({ navigation }: any) {
  const [image, setImage] = useState<string | null>(null);
  const [currentSign, setCurrentSign] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSign();
  }, []);

  // 🔥 fetch sign
  const loadSign = async () => {
    try {
      const res = await getSign();

      // ✅ FIX (IMPORTANT)
      setCurrentSign(res.data?.data?.url || "");
    } catch (err) {
      console.log("Fetch sign error:", err);
    }
  };

  // 📸 pick image
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
    }
  };

  // 🚀 upload
  const handleUpload = async () => {
    if (!image) {
      alert("Select image first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", {
        uri: image,
        name: "sign.png",
        type: "image/png"
      } as any);

      await uploadSign(formData);

      alert("Uploaded ✔");
      setImage(null);
      loadSign();

    } catch (err) {
      console.log(err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ❌ delete
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteSign();
      setCurrentSign("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 🔙 HEADER */}
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Signature</Text>
        </View>

        {/* CURRENT SIGN */}
        <View style={styles.card}>
          <Text style={styles.label}>Current Signature</Text>

          {currentSign ? (
            <Image source={{ uri: currentSign }} style={styles.image} />
          ) : (
            <Text style={styles.noText}>No signature uploaded</Text>
          )}

          {currentSign && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
            >
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* NEW SIGN */}
        <View style={styles.card}>
          <Text style={styles.label}>Upload New Signature</Text>

          {image && (
            <Image source={{ uri: image }} style={styles.image} />
          )}

          <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
            <Text style={styles.btnText}>Select Image</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Upload</Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F5F7FA"
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 15
  },

  title: {
    fontSize: 22,
    fontWeight: "bold"
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3
  },

  label: {
    fontWeight: "bold",
    marginBottom: 10
  },

  image: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 10
  },

  noText: {
    color: "gray",
    marginBottom: 10
  },

  pickBtn: {
    backgroundColor: "#555",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },

  uploadBtn: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10
  },

  deleteBtn: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 10,
    marginTop: 10
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  }
});