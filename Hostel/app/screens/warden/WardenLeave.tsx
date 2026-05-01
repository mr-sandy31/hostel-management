import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLeaves } from "../../../src/api/qrapi";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

type LeaveItem = {
  id?: string;
  student?: string;
  email?: string;
  from?: string;
  to?: string;
  status?: string;
};

export default function WardenLeave() {
  const [data, setData] = useState<LeaveItem[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getLeaves(from, to);

      console.log("LEAVE DATA:", res.data);

      const list =
        res.data?.data ||
        res.data?.leaves ||
        [];

      setData(Array.isArray(list) ? list : []);

    } catch (err: any) {
      console.log("Leave error:", err?.response?.data || err);
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

  // 🔥 PDF EXPORT
  const generatePDF = async () => {
    if (!data.length) {
      Alert.alert("No Data", "Nothing to export");
      return;
    }

    try {
      setExporting(true);

      const html = `
      <html>
        <body>
          <h2 style="text-align:center;">Leave Report</h2>
          <table border="1" style="width:100%; border-collapse: collapse;">
            <tr>
              <th>Name</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
            ${data.map(d => `
              <tr>
                <td>${d.student || "-"}</td>
                <td>${d.from || "-"}</td>
                <td>${d.to || "-"}</td>
                <td>${d.status || "-"}</td>
              </tr>
            `).join("")}
          </table>
        </body>
      </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      await Sharing.shareAsync(uri);

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  const renderItem = ({ item }: { item: LeaveItem }) => (
    <View style={styles.card}>

      <View style={styles.row}>
        <Text style={styles.name}>
          {item?.student || "Unknown"}
        </Text>

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
      </View>

      <Text style={styles.date}>
        {item?.from || "-"} → {item?.to || "-"}
      </Text>

      <Text style={styles.email}>
        {item?.email || ""}
      </Text>

    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* TITLE */}
      <Text style={styles.title}>Leave Management</Text>

      {/* FILTER */}
      <View style={styles.filterBox}>
        <TextInput
          placeholder="From (DD-MM-YYYY)"
          value={from}
          onChangeText={setFrom}
          style={styles.input}
        />

        <TextInput
          placeholder="To (DD-MM-YYYY)"
          value={to}
          onChangeText={setTo}
          style={styles.input}
        />

        <TouchableOpacity style={styles.filterBtn} onPress={load}>
          <Text style={styles.btnText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* EXPORT */}
      <TouchableOpacity
        style={[styles.exportBtn, exporting && { opacity: 0.6 }]}
        onPress={generatePDF}
        disabled={exporting}
      >
        <Text style={styles.btnText}>
          {exporting ? "Exporting..." : "Export PDF"}
        </Text>
      </TouchableOpacity>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) =>
            item?.id || index.toString()
          }
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              No leave requests found
            </Text>
          }
          showsVerticalScrollIndicator={false}
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

  filterBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3
  },

  input: {
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },

  filterBtn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10
  },

  exportBtn: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
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
    elevation: 2
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  name: {
    fontSize: 16,
    fontWeight: "bold"
  },

  status: {
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12
  },

  date: {
    marginTop: 5,
    color: "#555"
  },

  email: {
    marginTop: 3,
    fontSize: 12,
    color: "gray"
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "gray"
  }
});