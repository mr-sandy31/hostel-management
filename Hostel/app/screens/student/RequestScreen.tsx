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
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { getRequests } from "../../../src/api/qrapi";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ✅ TYPE */
type RequestItem = {
  id?: string;
  type?: string;
  description?: string;
  status?: string;
  date?: string;
  time?: string;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Newreq"
>;

export default function RequestScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [data, setData] = useState<RequestItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* 🔄 LOAD ON SCREEN FOCUS */
  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  /* 🔥 LOAD DATA */
  const loadRequests = async () => {
    try {
      setLoading(true);

      const userData = await AsyncStorage.getItem("user");

      if (!userData) {
        console.log("User not found ❌");
        setData([]);
        return;
      }

      const user = JSON.parse(userData);

      if (!user?.email) {
        console.log("Email missing ❌");
        setData([]);
        return;
      }

      const res = await getRequests(user.email.trim());

      console.log("REQUEST RESPONSE:", res.data);

      // 🔥 SAFE HANDLING
      const requests = res.data?.data || res.data?.requests || [];

      setData(Array.isArray(requests) ? requests.reverse() : []);

    } catch (err) {
      console.log("Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  /* 🔍 SEARCH FILTER */
  const filteredData = (data || []).filter((item) =>
    (item?.description || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* 📦 RENDER ITEM */
  const renderItem = ({ item }: { item: RequestItem }) => (
    <View style={styles.card}>

      <View style={{ flex: 1 }}>
        <Text style={styles.type}>
          {item?.type || "General"}
        </Text>

        <Text style={styles.cardText}>
          {item?.description || "No description"}
        </Text>

        <Text style={styles.date}>
          📅 {item?.date || "-"} ⏰ {item?.time || "-"}
        </Text>
      </View>

      <Text
        style={[
          styles.status,
          {
            backgroundColor:
              item?.status === "Pending"
                ? "#FFA500"
                : item?.status === "Approved"
                ? "#4CAF50"
                : "#FF3B30"
          }
        ]}
      >
        {item?.status || "Pending"}
      </Text>

    </View>
  );

  return (
    <LinearGradient colors={["#EDFFFF", "#FFE8D7"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        {/* TITLE */}
        <Text style={styles.title}>Requests</Text>

        {/* SEARCH + ADD */}
        <View style={styles.row}>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="gray" />
            <TextInput
              placeholder="Search request..."
              value={search}
              onChangeText={setSearch}
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("Newreq")}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addText}>New</Text>
          </TouchableOpacity>

        </View>

        {/* LIST */}
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : filteredData.length === 0 ? (
          <Text style={styles.centerText}>No requests found ❌</Text>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) =>
              item?.id ? item.id : index.toString()
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}

      </SafeAreaView>
    </LinearGradient>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },

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
    width: "65%"
  },

  input: {
    marginLeft: 10,
    flex: 1
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10
  },

  addText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold"
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    elevation: 2
  },

  type: {
    fontWeight: "bold",
    color: "#333"
  },

  cardText: {
    marginTop: 3,
    width: "90%"
  },

  date: {
    marginTop: 5,
    fontSize: 12,
    color: "#666"
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontWeight: "bold",
    height: 30,
    textAlign: "center",
    color: "#fff"
  },

  centerText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray"
  }
});