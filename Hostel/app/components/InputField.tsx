import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  isPassword?: boolean;
};

export default function InputField({
  value,
  onChangeText,
  placeholder,
  isPassword = false
}: Props) {
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
      />

      {isPassword && (
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Ionicons
            name={secure ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  input: {
    flex: 1,
    padding: 10
  }
});