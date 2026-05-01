import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createRoom, getRooms, deleteRoom } from "../../../src/api/qrapi";

export default function Room() {
  const [room, setRoom] = useState("");
  const [capacity, setCapacity] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const res = await getRooms();
      const list = res.data?.data || [];
      setData(Array.isArray(list) ? list : []);
    } catch (err) {
      console.log(err);
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRooms();
  };

  // ➕ ADD
  const handleAdd = async () => {
    if (!room || !capacity) {
      alert("Fill all fields");
      return;
    }

    await createRoom({
      room_no: room,
      capacity: Number(capacity)
    });

    setRoom("");
    setCapacity("");
    loadRooms();
  };

  // ❌ DELETE
  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Room",
      "Are you sure you want to delete this room?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRoom(id);
              loadRooms();
            } catch (err) {
              console.log(err);
              alert("Delete failed");
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>

      <View>
        <Text style={styles.roomNo}>
          Room {item?.room_no}
        </Text>
        <Text style={styles.capacity}>
          Capacity: {item?.capacity}
        </Text>
      </View>

      {/* DELETE BUTTON */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>

    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Room Management</Text>

      {/* FORM */}
      <View style={styles.form}>
        <TextInput
          placeholder="Room Number"
          value={room}
          onChangeText={setRoom}
          style={styles.input}
        />

        <TextInput
          placeholder="Capacity"
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity style={styles.btn} onPress={handleAdd}>
          <Text style={styles.btnText}>Add Room</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item?.id || index.toString()
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No rooms</Text>
          }
        />
      )}

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

  form: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3
  },

  input: {
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },

  btn: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
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

  roomNo: {
    fontSize: 16,
    fontWeight: "bold"
  },

  capacity: {
    marginTop: 5,
    color: "#555"
  },

  deleteBtn: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 8
  },

  deleteText: {
    color: "#fff",
    fontWeight: "bold"
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "gray"
  }
});