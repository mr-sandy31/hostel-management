import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { CommonActions } from "@react-navigation/native";

type Props = {
  navigation: any;
};

const Profile = ({ navigation }: Props) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(stored || "{}");

      setUser(parsed);
    } catch (err) {
      console.log("Profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }]
      })
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <LinearGradient colors={["#EDFFFF", "#FFE8D7"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        {/* HEADER */}
        <View style={styles.topsection}>
          <Ionicons
            name="arrow-back"
            size={25}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.txt}>Profile</Text>
        </View>

        {/* USER INFO */}
        <View style={styles.bottomsection}>
          <EvilIcons name="user" size={100} color="black" />

          <Text style={styles.name}>
            {user?.name || "User"}
          </Text>

          <Text style={styles.email}>
            {user?.email || ""}
          </Text>

          {/* OPTIONS */}
          <View style={styles.cardsection}>

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("IdCard")}
            >
              <Ionicons name="card-outline" size={20} />
              <Text style={styles.tyt}>ID Card</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <Ionicons name="shield-outline" size={20} />
              <Text style={styles.tyt}>Privacy Policy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <Ionicons name="help-circle-outline" size={20} />
              <Text style={styles.tyt}>Contact Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
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
    gap: 15,
  },

  txt: {
    fontSize: 24,
    fontWeight: "bold",
  },

  bottomsection: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },

  email: {
    color: "gray",
    marginTop: 5
  },

  cardsection: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: 25,
    borderRadius: 12,
    padding: 10,
    elevation: 3
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },

  tyt: {
    fontWeight: "bold",
    color: "#000",
  },

  logout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center"
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold"
  }
});

export default Profile;