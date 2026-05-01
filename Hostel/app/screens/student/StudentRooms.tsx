import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRooms, bookRoom } from "../../../src/api/qrapi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StudentRooms() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  // 🔥 LOAD ROOMS
  const load = async () => {
    try {
      setLoading(true);

      const res = await getRooms();

      console.log("ROOM LIST:", res.data);

      const list =
        res.data?.data ||
        res.data?.rooms ||
        [];

      setData(Array.isArray(list) ? list : []);

    } catch (err) {
      console.log("Room error:", err);
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  // 🛏 BOOK ROOM
  const handleBook = async (room_id: string) => {
    try {
      const stored = await AsyncStorage.getItem("user");
      const user = JSON.parse(stored || "{}");

      if (!user?.email) {
        Alert.alert("Error", "User not found");
        return;
      }

      await bookRoom({
        email: user.email,
        room_id
      });

      Alert.alert("Success", "Room request sent");

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to send request");
    }
  };

  // 📦 ROOM CARD
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>

      <View>
        <Text style={styles.room}>
          Room {item?.room_no || "-"}
        </Text>

        <Text style={styles.capacity}>
          Capacity: {item?.capacity || 0}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => handleBook(item.id)}
      >
        <Text style={styles.btnText}>Request</Text>
      </TouchableOpacity>

    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Available Rooms</Text>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item?.id || index.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            No rooms available
          </Text>
        }
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F5F7FA"
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  room: {
    fontSize: 16,
    fontWeight: "bold"
  },

  capacity: {
    marginTop: 5,
    color: "#555"
  },

  btn: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold"
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "gray"
  }
});