import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Student from "../screens/student/Student";
import QrScanning from "../screens/student/QrScanning";
import Attendance from "../screens/student/Attendance";
import RequestScreen from "../screens/student/RequestScreen";
import Dashboard from "../screens/student/Dashboard";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Student") iconName = "people";
          else if (route.name === "QrScan") iconName = "qr-code";
          else if (route.name === "Attendance") iconName = "calendar";
          else if (route.name === "Request") iconName = "document-text";

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Student" component={Student} />
      <Tab.Screen name="QrScan" component={QrScanning} />
      <Tab.Screen name="Attendance" component={Attendance} />
      <Tab.Screen name="Request" component={RequestScreen} />
    </Tab.Navigator>
  );
}