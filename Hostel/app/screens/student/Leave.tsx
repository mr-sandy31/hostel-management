import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { createLeave } from "../../../src/api/qrapi";

export default function Leave() {
  const [name, setName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !fromDate || !toDate) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    try {
      setLoading(true);

      const stored = await AsyncStorage.getItem("user");
      const user = JSON.parse(stored || "{}");

      if (!user?.email) {
        Alert.alert("Error", "User not found");
        return;
      }

      await createLeave({
        email: user.email,
        name,
        from: fromDate,
        to: toDate
      });

      Alert.alert("Success", "Leave applied ✔");

      setName("");
      setFromDate("");
      setToDate("");

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Apply Leave</Text>

      {/* FORM */}
      <View style={styles.form}>

        <TextInput
          placeholder="Student Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="From Date (DD-MM-YYYY)"
          value={fromDate}
          onChangeText={setFromDate}
          style={styles.input}
        />

        <TextInput
          placeholder="To Date (DD-MM-YYYY)"
          value={toDate}
          onChangeText={setToDate}
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Submit Leave</Text>
          )}
        </TouchableOpacity>

      </View>

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
    marginBottom: 20
  },

  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3
  },

  input: {
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12
  },

  btn: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  }
});