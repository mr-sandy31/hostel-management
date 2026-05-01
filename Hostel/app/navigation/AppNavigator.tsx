import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// AUTH
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import ForgotPwd from "../screens/auth/ForgotPwd";

// STUDENT
import Tabs from "../components/Tabs";
import Profile from "../screens/student/Profile";
import IdCard from "../screens/student/IdCard";
import Newreq from "../screens/student/Newreq";
import Visitor from "../screens/student/Visitor";
import Complaint from "../screens/student/Complaint";
import StudentPay from "../screens/student/StudentPay";
import Leave from "../screens/student/Leave";
import StudentRooms from "../screens/student/StudentRooms";
import SelectRoom from "../screens/student/SelectRoom";

// WARDEN
import WardenTabs from "../components/WardenTabs";
import StudentList from "../screens/warden/StudentList";
import WardenProfile from "../screens/warden/WardenProfile";
import SignUpload from "../screens/warden/SignUpload";
import WardenComplaint from "../screens/warden/WardenComplaint";
import WardenVisitors from "../screens/warden/WardenVisitors";
import StudentAttendance from "../screens/warden/StudentAttendance";
import WardenPayment from "../screens/warden/WardenPayment";
import WardenLeave from "../screens/warden/WardenLeave";
import Room from "../screens/warden/Room";
import RoomRequests from "../screens/warden/RoomRequests";

export type RootStackParamList = {
  // AUTH
  Login: undefined;
  Signup: undefined;
  Forgot: undefined;

  // ROOT
  Tabs: undefined;
  Warden: undefined;

  // STUDENT
  Profile: undefined;
  IdCard: undefined;
  Newreq: undefined;
  Visitor: undefined;
  Complaint: undefined;
  StudentPay: undefined;
  Leave: undefined;
  StudentRooms: undefined;
  SelectRoom: undefined;

  // WARDEN
  StudentList: undefined;
  WardenProfile: undefined;
  SignUpload: undefined;
  WardenComplaint: undefined;
  WardenVisitors: undefined;
  StudentAttendance: undefined;
  WardenPayment: undefined;
  WardenLeave: undefined;
  Room: undefined;
  RoomRequests: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login" // ✅ IMPORTANT
    >

      {/* AUTH */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Forgot" component={ForgotPwd} />

      {/* MAIN */}
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Warden" component={WardenTabs} />

      {/* STUDENT */}
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="IdCard" component={IdCard} />
      <Stack.Screen name="Newreq" component={Newreq} />
      <Stack.Screen name="Visitor" component={Visitor} />
      <Stack.Screen name="Complaint" component={Complaint} />
      <Stack.Screen name="StudentPay" component={StudentPay} />
      <Stack.Screen name="Leave" component={Leave} />
      <Stack.Screen name="StudentRooms" component={StudentRooms} />
      <Stack.Screen name="SelectRoom" component={SelectRoom} />

      {/* WARDEN */}
      <Stack.Screen name="StudentList" component={StudentList} />
      <Stack.Screen name="WardenProfile" component={WardenProfile} />
      <Stack.Screen name="SignUpload" component={SignUpload} />
      <Stack.Screen name="WardenComplaint" component={WardenComplaint} />
      <Stack.Screen name="WardenVisitors" component={WardenVisitors} />
      <Stack.Screen name="StudentAttendance" component={StudentAttendance} />
      <Stack.Screen name="WardenPayment" component={WardenPayment} />
      <Stack.Screen name="WardenLeave" component={WardenLeave} />
      <Stack.Screen name="Room" component={Room} />
      <Stack.Screen name="RoomRequests" component={RoomRequests} />

    </Stack.Navigator>
  );
};

export default AppNavigator;