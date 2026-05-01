import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStatus, markAttendance } from "../../../src/api/qrapi";

export default function QrScanning() {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [nextAction, setNextAction] = useState<"entry" | "exit" | null>(null);

  const scanLock = useRef(false); // 🔥 prevent double scan
  const VALID_QR = "ENTRY_GATE";

  // 🔹 Load user
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setLoggedInUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  // 📷 SCAN
  const handleScan = async ({ data }: any) => {
    if (scanLock.current || scanned) return;

    if (!loggedInUser?.email) {
      Alert.alert("Error", "User not loaded");
      return;
    }

    const scannedData = data?.trim().toUpperCase();

    if (scannedData !== VALID_QR) {
      Alert.alert("Invalid QR");
      return;
    }

    scanLock.current = true;
    setScanned(true);
    setLoading(true);

    try {
      const email = loggedInUser.email.trim();

      const res = await getStatus(email);

      setUser(loggedInUser);

      setNextAction(
        res.data.last_status === "entry" ? "exit" : "entry"
      );

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to fetch status");
      resetScan();
    } finally {
      setLoading(false);
    }
  };

  // ✅ MARK ATTENDANCE
  const handleMark = async () => {
    if (!user || !nextAction) return;

    setLoading(true);

    try {
      const res = await markAttendance({
        name: user.name,
        email: user.email.trim(),
        status: nextAction
      });

      Alert.alert("Success", res.data.message);
      resetScan();

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 RESET
  const resetScan = () => {
    setUser(null);
    setNextAction(null);
    setScanned(false);
    scanLock.current = false;
  };

  // 🔐 PERMISSION
  if (!permission) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16 }}>Camera permission required</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>QR Attendance</Text>

      {/* CAMERA */}
      {!user && (
        <View style={styles.cameraWrapper}>
          {loggedInUser ? (
            <CameraView
              style={styles.camera}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={handleScan}
            />
          ) : (
            <ActivityIndicator style={{ marginTop: 40 }} />
          )}

          {/* SCAN BOX */}
          <View style={styles.overlay}>
            <View style={styles.scanBox} />
          </View>
        </View>
      )}

      {/* LOADING */}
      {loading && (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      )}

      {/* RESULT CARD */}
      {user && (
        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user.name}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  nextAction === "entry" ? "#4CAF50" : "#FF3B30"
              }
            ]}
            onPress={handleMark}
          >
            <Text style={styles.btnText}>
              {nextAction === "entry" ? "Mark Entry" : "Mark Exit"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetBtn} onPress={resetScan}>
            <Text style={styles.resetText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 16
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15
  },

  cameraWrapper: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden"
  },

  camera: {
    flex: 1
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },

  scanBox: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: "#00FFAA",
    borderRadius: 10
  },

  card: {
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4
  },

  label: {
    fontSize: 12,
    color: "#888"
  },

  value: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10
  },

  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },

  resetBtn: {
    marginTop: 15,
    alignItems: "center"
  },

  resetText: {
    color: "#007AFF",
    fontSize: 14
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  permissionBtn:{

  }
});