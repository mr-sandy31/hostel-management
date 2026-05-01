import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createVisitor, getVisitors } from "../../../src/api/qrapi";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Visitor() {
  const [data, setData] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadVisitors();
  }, []);

  // 🔥 LOAD VISITORS
  const loadVisitors = async () => {
    try {
      setLoading(true);

      const stored = await AsyncStorage.getItem("user");
      const user = JSON.parse(stored || "{}");

      if (!user?.email) {
        setData([]);
        return;
      }

      const res = await getVisitors(user.email);

      console.log("VISITOR DATA:", res.data);

      const visitors =
        res.data?.data ||
        res.data?.visitors ||
        [];

      setData(Array.isArray(visitors) ? visitors.reverse() : []);

    } catch (err) {
      console.log("Visitor error:", err);
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🔄 REFRESH
  const onRefresh = () => {
    setRefreshing(true);
    loadVisitors();
  };

  // ➕ ADD VISITOR
  const handleAdd = async () => {
    if (!name.trim() || !relation.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setSubmitting(true);

      const stored = await AsyncStorage.getItem("user");
      const user = JSON.parse(stored || "{}");

      if (!user?.email) {
        Alert.alert("Error", "User not found");
        return;
      }

      await createVisitor({
        email: user.email,
        name: name.trim(),
        relation: relation.trim()
      });

      setName("");
      setRelation("");

      loadVisitors();

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to add visitor");
    } finally {
      setSubmitting(false);
    }
  };

  // 📦 ITEM UI
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>

      <View style={styles.row}>
        <Text style={styles.name}>
          {item?.name || "Unknown"}
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

      <Text style={styles.relation}>
        {item?.relation || "-"}
      </Text>

      <Text style={styles.date}>
        {item?.date || "-"} • {item?.time || "-"}
      </Text>

    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <Text style={styles.title}>Visitor Requests</Text>

      {/* FORM */}
      <View style={styles.form}>
        <TextInput
          placeholder="Visitor Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Relation (Father, Friend...)"
          value={relation}
          onChangeText={setRelation}
          style={styles.input}
        />

        <TouchableOpacity
          style={[
            styles.btn,
            submitting && { opacity: 0.6 }
          ]}
          onPress={handleAdd}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>+ Add Visitor</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item?.id || index.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <Text >
            No visitors yet
          </Text>
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
    elevation: 2
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  name: {
    fontWeight: "bold",
    fontSize: 16
  },

  relation: {
    marginTop: 5,
    color: "#555"
  },

  date: {
    marginTop: 5,
    fontSize: 12,
    color: "#888"
  },

  status: {
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "bold"
  }
});