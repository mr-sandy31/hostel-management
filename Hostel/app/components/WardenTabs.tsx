import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import WardenHome from "../screens/warden/WardenHome";
import WardenRequests from "../screens/warden/WardenRequests";
import Profile from "../screens/student/Profile";
import StudentList from "../screens/warden/StudentList";

const Tab = createBottomTabNavigator();

export default function WardenTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>

      <Tab.Screen
        name="Dashboard"
        component={WardenHome}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} />
          )
        }}
      />

      <Tab.Screen
        name="Requests"
        component={WardenRequests}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text" size={22} color={color} />
          )
        }}
      />

      <Tab.Screen
        name="Student"
        component={StudentList}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={22} color={color} />
          )
        }}
      />

    </Tab.Navigator>
  );
}