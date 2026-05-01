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

const WardenHome = ({ navigation }: Props) => {

  const handleLogout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }]
      })
    );
  };

  // 🔥 reusable card
  const MenuCard = ({ icon, title, onPress }: any) => (
    <TouchableOpacity style={styles.iconCard} onPress={onPress}>
      {icon}
      <Text style={styles.iconText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#EAF6FF", "#FFE8D7"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* 🔝 HEADER */}
          <View style={styles.topSection}>
            <TouchableOpacity onPress={() => navigation.navigate("WardenProfile")}>
              <View style={styles.profileCircle}>
                <EvilIcons name="user" size={50} color="#333" />
              </View>
            </TouchableOpacity>

            <View style={styles.toprightsection}>
              <TouchableOpacity>
                <Ionicons name="notifications-outline" size={24} color="#333" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 👋 TITLE */}
          <Text style={styles.welcome}>Welcome back 👋</Text>
          <Text style={styles.name}>Warden Dashboard</Text>

          {/* 🔍 SEARCH */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="gray" />
            <TextInput placeholder="Search module..." style={styles.input} />
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
              icon={<Ionicons name="bed" size={26} color="#007AFF" />}
              title="Rooms"
              onPress={() => navigation.navigate("Room")}
            />

            <MenuCard
              icon={<Ionicons name="book" size={26} color="#5856D6" />}
              title="Bookings"
              onPress={() => navigation.navigate("RoomRequests")}
            />

            <MenuCard
              icon={<Ionicons name="cash-outline" size={26} color="#4CAF50" />}
              title="Payments"
              onPress={() => navigation.navigate("WardenPayment")}
            />

            <MenuCard
              icon={<Ionicons name="people" size={26} color="#FF9500" />}
              title="Visitors"
              onPress={() => navigation.navigate("WardenVisitors")}
            />

            <MenuCard
              icon={<MaterialIcons name="message" size={24} color="#FF3B30" />}
              title="Complaints"
              onPress={() => navigation.navigate("WardenComplaint")}
            />

            <MenuCard
              icon={<MaterialIcons name="event" size={24} color="#34C759" />}
              title="Leave"
              onPress={() => navigation.navigate("WardenLeave")}
            />

            <MenuCard
              icon={<MaterialIcons name="calendar-today" size={24} color="#007AFF" />}
              title="Attendance"
              onPress={() => navigation.navigate("StudentAttendance")}
            />

          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default WardenHome;

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
    borderRadius: 50,
    padding: 5,
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
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3
  },

  iconText: {
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 12
  }
});