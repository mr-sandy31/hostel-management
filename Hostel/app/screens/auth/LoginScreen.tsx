import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useState } from "react";
import InputField from "../../components/InputField";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../../../src/api/authApi";

type Props = {
  navigation: any;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Enter email & password"
      });
      return;
    }

    try {
      setLoading(true);

      console.log("Sending login:", { email, password });

      const response = await loginUser({
        email: email.trim(),
        password
      });

      console.log("Login response:", response.data);

      // ✅ FINAL DATA STRUCTURE (backend aligned)
      const userData = {
        name: response.data.name,
        email: response.data.email,
        role: response.data.role || "student"
      };

      // ❌ safety check
      if (!userData.email) {
        throw new Error("Invalid response from server");
      }

      // ✅ save user
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      console.log("Saved user:", userData);

      Toast.show({
        type: "success",
        text1: "Login successful!"
      });

      // ✅ ROLE BASED NAVIGATION (NO DELAY NEEDED)
      if (userData.role === "warden") {
        navigation.replace("Warden");
      } else {
        navigation.replace("Tabs");
      }

    } catch (error: any) {
      console.log("Login error:", error?.response?.data || error);

      let msg = "Login failed";

      if (axios.isAxiosError(error)) {
        msg =
          error.response?.data?.detail?.[0]?.msg ||
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Invalid credentials";
      }

      Toast.show({
        type: "error",
        text1: String(msg)   // 🔥 important (no object crash)
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#EDFFFF", "#FFE8D7"]} style={styles.Gradient}>
      <View style={styles.container}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />

        <Text style={styles.title}>Hostel</Text>

        <InputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <InputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          isPassword={true}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <Text
          onPress={() => navigation.navigate("Forgot")}
          style={styles.link}
        >
          Forgot Password?
        </Text>

        <Text
          onPress={() => navigation.navigate("Signup")}
          style={styles.link}
        >
          Create Account
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  Gradient: { flex: 1 },

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },

  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8
  },

  buttonText: {
    color: "#fff",
    textAlign: "center"
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    color: "blue"
  },

  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 10,
    resizeMode: "contain"
  }
});