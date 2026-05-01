import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { getStudentsList } from "../../../src/api/qrapi"; // ✅ correct API

type StudentType = {
  id?: string;
  name?: string;
  mobile?: string;
};

const Student = () => {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🔥 FETCH DATA (SAFE)
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await getStudentsList();

      console.log("STUDENT API:", res.data);

      // ✅ SAFE RESPONSE HANDLING
      const list =
        res.data?.data ||
        res.data?.students ||
        [];

      setStudents(Array.isArray(list) ? list : []);

    } catch (err: any) {
      console.log("Fetch Error:", err?.response?.data || err);
      setStudents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🔄 PULL TO REFRESH
  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  // 🔍 SAFE SEARCH
  const filteredStudents = (students || []).filter((item) =>
    (item?.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 📦 RENDER ITEM
  const renderItem = ({ item }: { item: StudentType }) => (
    <View style={styles.card}>

      <View>
        <Text style={styles.name}>
          {item?.name || "Unknown"}
        </Text>
        <Text style={styles.mobile}>
          {item?.mobile || "No number"}
        </Text>
      </View>

      <TouchableOpacity>
        <MaterialIcons
          name="chat"
          size={24}
          color="#FF3B30"
        />
      </TouchableOpacity>

    </View>
  );

  return (
    <LinearGradient colors={["#EDFFFF", "#FFE8D7"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        {/* TITLE */}
        <Text style={styles.txt}>Students</Text>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search student..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* LIST */}
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={filteredStudents}
            keyExtractor={(item, index) =>
              item?.id || index.toString()
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            ListEmptyComponent={
              <Text style={styles.empty}>
                No students found
              </Text>
            }
          />
        )}

      </SafeAreaView>
    </LinearGradient>
  );
};

export default Student;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },

  txt: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2
  },

  input: {
    marginLeft: 10,
    flex: 1
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2
  },

  name: {
    fontSize: 16,
    fontWeight: "bold"
  },

  mobile: {
    fontSize: 14,
    color: "gray"
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "gray",
    fontSize: 14
  }
});