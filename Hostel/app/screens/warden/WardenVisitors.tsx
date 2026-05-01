import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllVisitors, updateVisitor } from "../../../src/api/qrapi";

export default function WardenVisitors() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getAllVisitors();

      // 🔥 FIX (IMPORTANT)
      const visitors = res.data?.data || [];

      setData(visitors.reverse());

    } catch (err) {
      console.log("Visitor error:", err);
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
      await updateVisitor({ email, id, status });
      load();
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>

      {/* Student */}
      <Text style={styles.student}>{item.student}</Text>

      {/* Visitor */}
      <Text style={styles.visitor}>
        {item.name} ({item.relation})
      </Text>

      {/* Status */}
      <Text
        style={[
          styles.status,
          {
            backgroundColor:
              item.status === "Approved"
                ? "#4CAF50"
                : item.status === "Rejected"
                ? "#FF3B30"
                : "#FFA500"
          }
        ]}
      >
        {item.status}
      </Text>

      {/* Actions */}
      {item.status === "Pending" && (
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.approve}
            onPress={() =>
              handleUpdate(item.email, item.id, "Approved")
            }
          >
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reject}
            onPress={() =>
              handleUpdate(item.email, item.id, "Rejected")
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

      <Text style={styles.title}>Visitor Requests</Text>

      <FlatList
        data={data || []}
        keyExtractor={(item, index) =>
          item.id ? item.id : index.toString()
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No visitor requests</Text>
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
    marginBottom: 15,
    textAlign: "center"
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

  visitor: {
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
    fontWeight: "bold"
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
    marginTop: 50,
    color: "gray"
  }
});