import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPayment } from "../../../src/api/qrapi";

export default function StudentPay() {
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("user") || "{}");

      const res = await getPayment(user.email);

      setPayment(res.data?.data || null);

    } catch (err) {
      console.log("Payment error:", err);
      setPayment(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Payment</Text>

      {!payment?.amount ? (
        <Text style={styles.empty}>No payment request</Text>
      ) : (
        <View style={styles.card}>

          {/* Amount */}
          <Text style={styles.label}>Amount Due</Text>
          <Text style={styles.amount}>₹ {payment.amount}</Text>

          {/* QR */}
          <Text style={styles.label}>Scan & Pay</Text>
          <Image
            source={require("../../assets/qr.png")}
            style={styles.qr}
          />

          {/* Status */}
          <Text style={styles.status}>
            Status: {payment.status}
          </Text>

          {/* Refresh */}
          <TouchableOpacity style={styles.refresh} onPress={load}>
            <Text style={styles.btnText}>Refresh</Text>
          </TouchableOpacity>

        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    backgroundColor: "#F5F7FA"
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3
  },

  label: {
    fontSize: 14,
    color: "gray"
  },

  amount: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4CAF50",
    marginVertical: 10
  },

  qr: {
    width: 180,
    height: 180,
    marginVertical: 15
  },

  status: {
    fontWeight: "bold",
    color: "#FFA500"
  },

  refresh: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold"
  },

  empty: {
    marginTop: 50,
    color: "gray"
  }
});