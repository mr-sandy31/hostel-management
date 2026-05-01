import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getAllRequests,
  updateRequestStatus
} from "../../../src/api/qrapi";

type RequestItem = {
  id: string;
  name: string;
  email: string;
  description: string;
  status: string;
};

export default function WardenRequests() {
  const [data, setData] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await getAllRequests();

      // 🔥 FIX (IMPORTANT)
      const requests = res.data?.data || [];

      setData(requests.reverse());

    } catch (error: any) {
      console.log("ERROR:", error?.response?.data || error.message);
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
      await updateRequestStatus({ email, id, status });
      loadData();
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  const renderItem = ({ item }: { item: RequestItem }) => (
    <View style={styles.card}>

      {/* Student */}
      <Text style={styles.name}>{item.name}</Text>

      {/* Request */}
      <Text style={styles.desc}>{item.description}</Text>

      {/* Status Badge */}
      <Text
        style={[
          styles.status,
          {
            backgroundColor:
              item.status === "Pending"
                ? "#FFA500"
                : item.status === "Approved"
                ? "#4CAF50"
                : "#FF3B30"
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
      
      {/* HEADER */}
      <Text style={styles.title}>Student Requests</Text>

      <FlatList
        data={data || []}
        keyExtractor={(item, index) =>
          item.id ? item.id : index.toString()
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No requests found</Text>
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

  name: {
    fontWeight: "bold",
    fontSize: 16
  },

  desc: {
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