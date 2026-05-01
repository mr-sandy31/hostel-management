import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createComplaint, getComplaints } from "../../../src/api/qrapi";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Complaint() {
  const [data, setData] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  // 🔥 LOAD DATA
  const load = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(await AsyncStorage.getItem("user") || "{}");

      if (!user?.email) return;

      const res = await getComplaints(user.email);

      const complaints = res.data?.data || [];

      setData(complaints.reverse());

    } catch (err) {
      console.log("Complaint error:", err);
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🔄 PULL TO REFRESH
  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  // 🚀 ADD COMPLAINT
  const handleAdd = async () => {
    if (!text.trim()) {
      alert("Enter complaint");
      return;
    }

    try {
      setSubmitting(true);

      const user = JSON.parse(await AsyncStorage.getItem("user") || "{}");

      await createComplaint({
        email: user.email,
        text: text.trim()
      });

      setText("");
      load();

    } catch (err) {
      console.log("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // 🎯 ITEM UI
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>

      <Text style={styles.text}>{item?.text}</Text>

      <Text
        style={[
          styles.status,
          {
            backgroundColor:
              item?.status === "Solved"
                ? "#4CAF50"
                : item?.status === "Not Solved"
                ? "#FF3B30"
                : "#FFA500"
          }
        ]}
      >
        {item?.status}
      </Text>

      {item?.remark && (
        <Text style={styles.remark}>Remark: {item.remark}</Text>
      )}

      <Text style={styles.date}>
        {item?.date} • {item?.time}
      </Text>

    </View>
  );

  // ⏳ LOADING
  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Complaint Section</Text>

      {/* INPUT */}
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Write your complaint..."
          value={text}
          onChangeText={setText}
          style={styles.input}
          multiline
        />

        <TouchableOpacity
          style={[styles.btn, submitting && { opacity: 0.6 }]}
          onPress={handleAdd}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={data || []}
        keyExtractor={(item, index) =>
          item?.id ? item.id : index.toString()
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No complaints yet</Text>
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

  inputBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3
  },

  input: {
    minHeight: 60,
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 10
  },

  btn: {
    marginTop: 10,
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

  text: {
    fontSize: 15,
    fontWeight: "500"
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

  date: {
    marginTop: 5,
    fontSize: 12,
    color: "gray"
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "gray"
  }
});