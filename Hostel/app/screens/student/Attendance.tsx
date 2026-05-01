import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { getAttendanceHistory } from "../../../src/api/qrapi";

const Attendance = () => {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);

      const userData = await AsyncStorage.getItem("user");
      const user = JSON.parse(userData || "{}");

      if (!user?.email) return;

      const res = await getAttendanceHistory(user.email.trim());

      // 🔥 FIX
      const attendance = res.data?.data || [];

      setData(attendance.reverse());

    } catch (err) {
      console.log("Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedDate = date.toLocaleDateString("en-CA");

  // 🔍 FILTER
  const filteredData = (data || []).filter((item) => {
    const name = item?.name || "";

    const matchSearch = name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchDate = item?.date === selectedDate;

    return matchSearch && matchDate;
  });

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>

      <Text style={styles.name}>
        {item?.name || "Unknown"}
      </Text>

      <View style={styles.rowItem}>
        <Text>{item?.date}</Text>
        <Text>⏰ {item?.time}</Text>
      </View>

      <Text
        style={[
          styles.status,
          {
            color:
              item?.status === "entry"
                ? "#4CAF50"
                : "#FF3B30"
          }
        ]}
      >
        {item?.status?.toUpperCase()}
      </Text>

    </View>
  );

  return (
    <LinearGradient colors={["#EDFFFF", "#FFE8D7"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        <Text style={styles.title}>Attendance</Text>

        {/* 🔍 SEARCH + DATE */}
        <View style={styles.row}>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="gray" />
            <TextInput
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.dateText}>
              {date.toDateString()}
            </Text>
          </TouchableOpacity>

        </View>

        {/* 📅 DATE PICKER */}
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selected) => {
              setShowPicker(false);
              if (selected) setDate(selected);
            }}
          />
        )}

        {/* 🔄 REFRESH */}
        <TouchableOpacity style={styles.refresh} onPress={loadHistory}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>

        {/* 📋 LIST */}
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.empty}>No records found</Text>
            }
          />
        )}

      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    width: "60%"
  },

  input: {
    marginLeft: 10,
    flex: 1
  },

  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10
  },

  dateText: {
    color: "#fff",
    marginLeft: 5
  },

  refresh: {
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "flex-end"
  },

  refreshText: {
    color: "#fff"
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },

  name: {
    fontSize: 16,
    fontWeight: "bold"
  },

  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5
  },

  status: {
    marginTop: 8,
    fontWeight: "bold"
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "gray"
  }
});

export default Attendance;