import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getStudentsList,
  sendPayment
} from "../../../src/api/qrapi";

export default function WardenPayment() {
  const [students, setStudents] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getStudentsList();
    setStudents(res.data?.data || []);
  };

  const openModal = (student:any) => {
    setSelected(student);
    setModal(true);
  };

  const handleSend = async () => {
    if (!amount) return alert("Enter amount");

    await sendPayment({
      email: selected.email,
      amount: Number(amount)
    });

    alert("Payment sent ✔");
    setModal(false);
    setAmount("");
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>{item.email}</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => openModal(item)}
      >
        <Text style={styles.btnText}>Send Payment</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Send Payment Request</Text>

      <FlatList
        data={students}
        keyExtractor={(item) => item.email}
        renderItem={renderItem}
      />

      {/* 🔥 MODAL */}
      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modal}>

            <Text style={styles.modalTitle}>
              {selected?.name}
            </Text>

            <TextInput
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />

            <TouchableOpacity style={styles.send} onPress={handleSend}>
              <Text style={styles.btnText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancel}
              onPress={() => setModal(false)}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2
  },

  name: {
    fontWeight: "bold",
    fontSize: 16
  },

  btn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    marginTop: 10
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },

  modalBg: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },

  modal: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 10
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  input: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },

  send: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },

  cancel: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8
  }
});