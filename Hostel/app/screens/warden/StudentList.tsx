import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getStudentsList,
  updateStudentStatus,
  deleteStudent
} from "../../../src/api/qrapi";

type StatusType = "pending" | "approved" | "rejected";

export default function StudentList() {
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState<StatusType>("pending");

  useEffect(() => {
    loadStudents();
  }, []);

 const loadStudents = async () => {
  try {
    const res = await getStudentsList();

    const students = res.data?.data || [];

    setData(students);

  } catch (err) {
    console.log("Student error:", err);
    setData([]);
  }
};

  const handleUpdate = async (email: string, status: StatusType) => {
    await updateStudentStatus({ email, status });
    loadStudents();
  };

  // 🔥 DELETE FUNCTION
  const handleDelete = (email: string) => {
    Alert.alert(
      "Delete Student",
      "Are you sure you want to delete this student?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteStudent(email);
            loadStudents();
          }
        }
      ]
    );
  };

const filteredData = (data || []).filter(
  (item) => item.status === filter
);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>{item.email}</Text>

      <Text
        style={[
          styles.status,
          {
            color:
              item.status === "approved"
                ? "#4CAF50"
                : item.status === "rejected"
                ? "#FF3B30"
                : "#FFA500"
          }
        ]}
      >
        {item.status.toUpperCase()}
      </Text>

      {/* Pending Actions */}
      {item.status === "pending" && (
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.approve}
            onPress={() => handleUpdate(item.email, "approved")}
          >
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reject}
            onPress={() => handleUpdate(item.email, "rejected")}
          >
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 🔥 DELETE BUTTON (ALL STATES) */}
      <TouchableOpacity
        style={styles.delete}
        onPress={() => handleDelete(item.email)}
      >
        <Text style={styles.btnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      
      {/* TABS */}
      <View style={styles.topTabs}>
        <TouchableOpacity
          style={[styles.tab, filter === "pending" && styles.activePending]}
          onPress={() => setFilter("pending")}
        >
          <Text style={styles.tabText}>Pending</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, filter === "approved" && styles.activeApproved]}
          onPress={() => setFilter("approved")}
        >
          <Text style={styles.tabText}>Approved</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, filter === "rejected" && styles.activeRejected]}
          onPress={() => setFilter("rejected")}
        >
          <Text style={styles.tabText}>Rejected</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
     <FlatList
  data={filteredData || []}
  keyExtractor={(item, index) =>
    item.email ? item.email : index.toString()
  }
  renderItem={renderItem}
/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10
  },

  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#ccc"
  },

  activePending: { backgroundColor: "#FFA500" },
  activeApproved: { backgroundColor: "#4CAF50" },
  activeRejected: { backgroundColor: "#FF3B30" },

  tabText: {
    color: "#fff",
    fontWeight: "bold"
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2
  },

  name: {
    fontWeight: "bold",
    fontSize: 16
  },

  status: {
    marginTop: 5,
    fontWeight: "bold"
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

  delete: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 8,
    marginTop: 10
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  }
});