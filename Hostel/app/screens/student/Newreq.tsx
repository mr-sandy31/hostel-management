import { Text, View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createRequest } from "../../../src/api/qrapi";

type Props = {
  navigation: any;
};

const Newreq = ({ navigation }: Props) => {

  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");

  const requestTypes = [
    "Room Change",
    "Leave Request",
    "Maintenance",
    "Other"
  ];

 const handleSubmit = async () => {
  if (!selectedType || !description) {
    alert("Please fill all fields ❌");
    return;
  }

  const userData = await AsyncStorage.getItem("user");
  const user = JSON.parse(userData || "{}");

  await createRequest({
    type: selectedType,
    description,
    email: user.email
  });

  alert("Request submitted ✅");

  navigation.goBack();
};

  return (
    <LinearGradient colors={["#EDFFFF", "#FFE8D7"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        {/* 🔙 Top */}
        <View style={styles.topsection}>
          <Ionicons
            name="arrow-back"
            size={25}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.txt}>New Request</Text>
        </View>

        {/* 👤 Icon */}
        <View style={styles.bottomsection}>
          <EvilIcons name="user" size={100} color="black" />

          {/* 📝 Form */}
          <View style={styles.cardsection}>

            {/* 🔽 Request Type */}
            <Text style={styles.label}>Type of Request</Text>

            {requestTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.item,
                  selectedType === type && styles.selectedItem
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={styles.tyt}>{type}</Text>
              </TouchableOpacity>
            ))}

            {/* 📝 Description */}
            <Text style={styles.label}>Description</Text>

            <TextInput
              placeholder="Write your request..."
              value={description}
              onChangeText={setDescription}
              style={styles.textArea}
              multiline
            />

            {/* 🚀 Submit */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit Request</Text>
            </TouchableOpacity>

          </View>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  topsection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  txt: {
    fontSize: 24,
    fontWeight: "bold",
  },

  bottomsection: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },

  cardsection: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
  },

  label: {
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 10,
  },

  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },

  selectedItem: {
    backgroundColor: "#4CAF50",
  },

  tyt: {
    fontWeight: "bold",
    color: "#000",
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    marginTop: 5,
  },

  submitBtn: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Newreq;