import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  getRoomRequests,
  updateRoom
} from "../../../src/api/qrapi";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoomRequests() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getRoomRequests();

      console.log("ROOM REQUEST:", res.data);

      const list =
        res.data?.data ||
        res.data?.requests ||
        [];

      setData(Array.isArray(list) ? list : []);

    } catch (err: any) {
      console.log("Room error:", err?.response?.data || err);
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

  const handleUpdate = async (
    email: string,
    status: string,
    room_id: string
  ) => {
    try {
      await updateRoom({ email, status, room_id });

      Alert.alert("Success", `Request ${status}`);
      load();

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to update");
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>

      {/* STUDENT */}
      <Text style={styles.name}>
        {item?.student || "Unknown"}
      </Text>

      {/* ROOM */}
      <Text style={styles.room}>
        Room ID: {item?.room_id || "-"}
      </Text>

      {/* STATUS */}
      <Text
        style={[
          styles.status,
          {
            backgroundColor:
              item?.status === "Approved"
                ? "#4CAF50"
                : item?.status === "Rejected"
                ? "#FF3B30"
                : "#FFA500"
          }
        ]}
      >
        {item?.status || "Pending"}
      </Text>

      {/* ACTION */}
      {item?.status === "Pending" && (
        <View style={styles.row}>

          <TouchableOpacity
            style={styles.approve}
            onPress={() =>
              handleUpdate(item.email, "Approved", item.room_id)
            }
          >
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reject}
            onPress={() =>
              handleUpdate(item.email, "Rejected", item.room_id)
            }
          >
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>

        </View>
      )}

    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Room Requests</Text>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item?.id || index.toString()
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            No room requests
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
    elevation: 2
  },

  name: {
    fontSize: 16,
    fontWeight: "bold"
  },

  room: {
    marginTop: 5,
    color: "#444"
  },

  status: {
    marginTop: 8,
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    fontSize: 12
  },

  row: {
    flexDirection: "row",
    marginTop: 12
  },

  approve: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    marginRight: 10
  },

  reject: {
    backgroundColor: "#FF3B30",
    padding: 10,
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