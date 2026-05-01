import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllAttendance } from "../../../src/api/qrapi";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function StudentAttendance() {
  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    filterData();
  }, [search, date, data]);

  const load = async () => {
    try {
      const res = await getAllAttendance();
      const attendance = res.data?.data || [];
      setData(attendance);
      setFiltered(attendance);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 FILTER LOGIC
  const filterData = () => {
    let temp = [...data];

    if (search) {
      temp = temp.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (date) {
      temp = temp.filter((item) => item.date === date);
    }

    setFiltered(temp);
  };

  // 📄 EXPORT PDF
  const exportPDF = async () => {
    const html = `
      <html>
        <body>
          <h2>Attendance Report</h2>
          <table border="1" style="width:100%; border-collapse: collapse;">
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
            ${filtered
              .map(
                (i) => `
                <tr>
                  <td>${i.name}</td>
                  <td>${i.date}</td>
                  <td>${i.time}</td>
                  <td>${i.status}</td>
                </tr>
              `
              )
              .join("")}
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.rowCard}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.time}</Text>
      <Text
        style={[
          styles.cell,
          { color: item.status === "entry" ? "green" : "red" }
        ]}
      >
        {item.status.toUpperCase()}
      </Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Attendance</Text>

      {/* 🔍 SEARCH */}
      <TextInput
        placeholder="Search by name..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      {/* 📅 DATE FILTER */}
      <TextInput
        placeholder="Filter by date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />

      {/* 📄 EXPORT */}
      <TouchableOpacity style={styles.exportBtn} onPress={exportPDF}>
        <Text style={styles.btnText}>Export PDF</Text>
      </TouchableOpacity>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Name</Text>
        <Text style={styles.header}>Date</Text>
        <Text style={styles.header}>Time</Text>
        <Text style={styles.header}>Type</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No data found</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F5F7FA"
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },

  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8
  },

  header: {
    width: "25%",
    textAlign: "center",
    fontWeight: "bold"
  },

  rowCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    marginTop: 8,
    borderRadius: 8
  },

  cell: {
    width: "25%",
    textAlign: "center"
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "gray"
  }
});