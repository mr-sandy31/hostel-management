import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getAllComplaints,
  updateComplaint
} from "../../../src/api/qrapi";

export default function WardenComplaint() {
  const [data, setData] = useState<any[]>([]);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  // 🔥 FIXED LOAD FUNCTION
  const load = async () => {
    try {
      setLoading(true);

      const res = await getAllComplaints();

      const complaints = res.data?.data || []; // ✅ FIX

      setData(complaints.reverse());

    } catch (err) {
      console.log("Complaint error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (
    email: string,
    id: string,
    status: string
  ) => {
    try {
      const remark = remarks[id] || "";

      await updateComplaint({
        email,
        id,
        status,
        remark
      });

      setRemarks((prev) => ({ ...prev, [id]: "" }));
      load();

    } catch (err) {
      console.log("Update error:", err);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>

      <Text style={styles.student}>{item.student}</Text>

      <Text style={styles.text}>{item.text}</Text>

      {/* STATUS */}
      <Text
        style={[
          styles.status,
          {
            backgroundColor:
              item.status === "Solved"
                ? "#4CAF50"
                : item.status === "Not Solved"
                ? "#FF3B30"
                : "#FFA500"
          }
        ]}
      >
        {item.status}
      </Text>

      {/* REMARK */}
      {item.remark ? (
        <Text style={styles.remark}>Remark: {item.remark}</Text>
      ) : null}

      {/* ACTION */}
      {item.status === "Pending" && (
        <>
          <TextInput
            placeholder="Write remark..."
            value={remarks[item.id] || ""}
            onChangeText={(val) =>
              setRemarks((prev) => ({ ...prev, [item.id]: val }))
            }
            style={styles.input}
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.approve}
              onPress={() =>
                handleUpdate(item.email, item.id, "Solved")
              }
            >
              <Text style={styles.btnText}>Solved</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reject}
              onPress={() =>
                handleUpdate(item.email, item.id, "Not Solved")
              }
            >
              <Text style={styles.btnText}>Not Solved</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <Text style={styles.title}>Complaint Management</Text>

      <FlatList
        data={data || []}
        keyExtractor={(item, index) =>
          item.id ? item.id : index.toString()
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No complaints found</Text>
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
    elevation: 3
  },

  student: {
    fontWeight: "bold",
    fontSize: 16
  },

  text: {
    marginTop: 5,
    fontSize: 15
  },

  status: {
    marginTop: 8,
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    fontWeight: "bold"
  },

  remark: {
    marginTop: 5,
    color: "#333"
  },

  input: {
    marginTop: 10,
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 10
  },

  row: {
    flexDirection: "row",
    marginTop: 10
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
    marginTop: 50,
    color: "gray"
  }
});