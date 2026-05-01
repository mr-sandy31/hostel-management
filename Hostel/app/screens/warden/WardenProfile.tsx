import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile } from "../../../src/api/authApi";

type Props = {
  navigation: any;
};

const WardenProfile = ({ navigation }: Props) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(stored || "{}");

      if (!parsed.email) return;

      const res = await getProfile(parsed.email);

      // 🔥 FIX
      setUser(res.data?.data || null);

    } catch (err) {
      console.log("Profile error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <LinearGradient colors={["#EDFFFF", "#FFE8D7"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.topsection}>
            <Ionicons
              name="arrow-back"
              size={25}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.txt}>Profile</Text>
          </View>

          {/* PROFILE CARD */}
          <View style={styles.profileCard}>
            <EvilIcons name="user" size={100} />

            <Text style={styles.name}>
              {user?.name || "No Name"}
            </Text>

            <Text style={styles.email}>
              {user?.email || "No Email"}
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.info}>
                📞 {user?.mobile || "N/A"}
              </Text>
              <Text style={styles.info}>
                🎓 {user?.branch || "N/A"}
              </Text>
            </View>
          </View>

          {/* OPTIONS */}
          <View style={styles.cardsection}>

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("SignUpload")}
            >
              <Text style={styles.tyt}>Upload Signature</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <Text style={styles.tyt}>Privacy Policy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <Text style={styles.tyt}>Contact Support</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>

      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },

  topsection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20
  },

  txt: {
    fontSize: 22,
    fontWeight: "bold"
  },

  profileCard: {
    backgroundColor: "#fff",
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10
  },

  email: {
    color: "gray",
    marginTop: 5
  },

  infoBox: {
    marginTop: 10,
    alignItems: "center"
  },

  info: {
    fontSize: 14,
    marginVertical: 2
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
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: "#ccc"
  },

  tyt: {
    fontWeight: "bold",
    color: "#000"
  }
});

export default WardenProfile;