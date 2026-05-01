import { Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import InputField from "../../components/InputField";
import Toast from "react-native-toast-message";
import axios from "axios";
import { registerUser } from "../../../src/api/authApi";

type FormType = {
  name: string;
  mobile: string;
  email: string;
  branch: string;
  year: string;
  prn: string;
  password: string;
};

export default function SignupScreen({ navigation }: any) {
  const [form, setForm] = useState<FormType>({
    name: "",
    mobile: "",
    email: "",
    branch: "",
    year: "",
    prn: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof FormType, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const validateForm = (): string | null => {
    if (!form.name.trim()) return "Name is required";
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile)) return "Valid 10-digit mobile required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Valid email required";
    if (!form.branch.trim()) return "Branch required";
    if (!form.year.trim()) return "Year required";
    if (!form.prn.trim()) return "PRN required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSignup = async () => {
    const error = validateForm();
    if (error) {
      Toast.show({
        type: "error",
        text1: error
      });
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(form);

      Toast.show({
        type: "success",
        text1: res.data.message || "Signup Successful. Contact Admin"
      });

      navigation.navigate("Login");

    } catch (err: any) {
      let errorMsg = "Something went wrong";
      if (axios.isAxiosError(err)) {
        errorMsg = err.response?.data?.error || err.response?.data?.message || "Signup failed. Email may exist.";
      }
      Toast.show({
        type: "error",
        text1: errorMsg
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#EDFFFF", "#FFE8D7"]} style={styles.Gradient}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >

          <Text style={styles.title}>Create Account</Text>

          <InputField placeholder="Name" value={form.name} onChangeText={(v) => handleChange("name", v)} />
          <InputField placeholder="Mobile Number" value={form.mobile} onChangeText={(v) => handleChange("mobile", v)} />
          <InputField placeholder="Email" value={form.email} onChangeText={(v) => handleChange("email", v)} />
          <InputField placeholder="Branch" value={form.branch} onChangeText={(v) => handleChange("branch", v)} />
          <InputField placeholder="Year" value={form.year} onChangeText={(v) => handleChange("year", v)} />
          <InputField placeholder="PRN" value={form.prn} onChangeText={(v) => handleChange("prn", v)} />
          <InputField placeholder="Password" value={form.password} onChangeText={(v) => handleChange("password", v)} isPassword={true} />

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSignup} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Signing up..." : "Signup"}</Text>
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
            Already have an account? Login
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  Gradient: {
    flex: 1
  },
  inner: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingTop: 60
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center"
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#000"
  }
});
