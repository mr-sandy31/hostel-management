import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  FlatList
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile } from "../../../src/api/qrapi";

export default function SelectRoom() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  // 🔥 LOAD STUDENT PROFILE
  const load = async () => {
    try {
      setLoading(true);

      const stored = await AsyncStorage.getItem("user");
      const user = JSON.parse(stored || "{}");

      if (!user?.email) return;

      const res = await getProfile(user.email);

      console.log("PROFILE:", res.data);

      setData(res.data?.data || res.data);

    } catch (err) {
      console.log("Error:", err);
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  // 🎨 STATUS COLOR
  const getColor = (status: string) => {
    if (status === "Approved") return "#4CAF50";
    if (status === "Rejected") return "#FF3B30";
    return "#FFA500";
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>My Room Request</Text>

      {!data?.room_request ? (
        <Text style={styles.empty}>
          No room requested yet
        </Text>
      ) : (
        <View style={styles.card}>

          <Text style={styles.room}>
            Room ID: {data?.room_request?.room_id || "-"}
          </Text>

          <Text
            style={[
              styles.status,
              {
                backgroundColor: getColor(
                  data?.room_request?.status
                )
              }
            ]}
          >
            {data?.room_request?.status || "Pending"}
          </Text>

        </View>
      )}

      {/* REFRESH BUTTON */}
      <TouchableOpacity style={styles.btn} onPress={load}>
        <Text style={styles.btnText}>Refresh</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F5F7FA",
    justifyContent: "center"
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    alignItems: "center"
  },

  room: {
    fontSize: 18,
    fontWeight: "bold"
  },

  status: {
    marginTop: 15,
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
    fontWeight: "bold"
  },

  btn: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },

  empty: {
    textAlign: "center",
    color: "gray",
    marginBottom: 20
  }
});