import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import InputField from "../../components/InputField";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  navigation: any;
};

const ForgotPwd = ({ navigation }: Props) => {

  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);


  const sendOtp = () => {
    if (!email) {
      alert("Enter email first");
      return;
    }

    alert("OTP sent (demo)");
    setOtpSent(true);
  };


  const verifyOtp = () => {
    if (otp === "1234") {
      alert("OTP Verified");
      navigation.navigate("Login");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <LinearGradient colors={["#EDFFFF", "#FFE8D7"]} style={styles.Gradient}>
      <View style={styles.container}>
        
        <Text style={styles.title}>Forgot Password</Text>

        <InputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        {!otpSent ? (
          <TouchableOpacity style={styles.button} onPress={sendOtp}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        ) : (
          <>
            <InputField
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
            />

            <TouchableOpacity style={styles.button} onPress={verifyOtp}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </>
        )}

        <Text
          onPress={() => navigation.navigate("Login")}
          style={styles.link}
        >
          Back To Login
        </Text>

      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  Gradient: { flex: 1 },
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },
  link: {
    marginTop: 25,
    textAlign: "center",
    color: "blue"
  }
});

export default ForgotPwd;