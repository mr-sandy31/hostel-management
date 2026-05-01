import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { CommonActions } from "@react-navigation/native";

type Props = {
  navigation: any;
};

const Dashboard = ({ navigation }: Props) => {

  const handleLogout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }]
      })
    );
  };

  // 🎯 ICON CARD (IMPROVED)
  const MenuCard = ({ icon, title, color, onPress }: any) => (
    <TouchableOpacity style={styles.iconCard} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.iconText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#EAF6FF", "#FFE8D7"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* 🔝 HEADER */}
          <View style={styles.topSection}>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <View style={styles.profileCircle}>
                <EvilIcons name="user" size={50} color="#333" />
              </View>
            </TouchableOpacity>

            <View style={styles.toprightsection}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <TouchableOpacity onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 👋 WELCOME */}
          <Text style={styles.welcome}>Welcome 👋</Text>
          <Text style={styles.name}>Hostel Dashboard</Text>

          {/* 🔍 SEARCH */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="gray" />
            <TextInput placeholder="Search..." style={styles.input} />
          </View>

          {/* 🎯 BANNER */}
          <View style={styles.cardContainer}>
            <Image
              source={require("../../assets/banner.jpeg")}
              style={styles.banner}
            />
          </View>

          {/* 📊 MENU GRID */}
          <View style={styles.iconRow}>

            <MenuCard
              icon={<Ionicons name="bed" size={20} color="#fff" />}
              title="Room"
              color="#007AFF"
              onPress={() => navigation.navigate("StudentRooms")}
            />

            <MenuCard
              icon={<Ionicons name="book" size={20} color="#fff" />}
              title="Booking"
              color="#5856D6"
              onPress={() => navigation.navigate("SelectRoom")}
            />

            <MenuCard
              icon={<Ionicons name="cash-outline" size={20} color="#fff" />}
              title="Payment"
              color="#4CAF50"
              onPress={() => navigation.navigate("StudentPay")}
            />

            <MenuCard
              icon={<Ionicons name="people" size={20} color="#fff" />}
              title="Visitor"
              color="#FF9500"
              onPress={() => navigation.navigate("Visitor")}
            />

            <MenuCard
              icon={<MaterialIcons name="message" size={20} color="#fff" />}
              title="Complaint"
              color="#FF3B30"
              onPress={() => navigation.navigate("Complaint")}
            />

            <MenuCard
              icon={<MaterialIcons name="event" size={20} color="#fff" />}
              title="Leave"
              color="#34C759"
              onPress={() => navigation.navigate("Leave")}
            />

          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },

  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  toprightsection: {
    flexDirection: "row",
    gap: 15
  },

  profileCircle: {
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 50,
    elevation: 3
  },

  welcome: {
    marginTop: 15,
    fontSize: 14,
    color: "gray"
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    elevation: 3
  },

  input: {
    marginLeft: 10,
    flex: 1
  },

  cardContainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    padding: 10,
    borderRadius: 12,
    elevation: 3
  },

  banner: {
    width: "100%",
    height: 160,
    borderRadius: 10
  },

  iconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20
  },

  iconCard: {
    width: "30%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3
  },

  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center"
  },

  iconText: {
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 12
  }
});