import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { useRef, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile } from "../../../src/api/authApi";
import { getSign } from "../../../src/api/qrapi";

export default function IdCard() {
  const [signUrl, setSignUrl] = useState<string>("");
  const [signBase64, setSignBase64] = useState<string>(""); // ✅ ADD THIS
  const cardRef = useRef<View>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  loadAll();
}, []);

const loadAll = async () => {
  try {
    setLoading(true);

    const stored = await AsyncStorage.getItem("user");
    const parsed = JSON.parse(stored || "{}");

    if (!parsed?.email) {
      setUser(null);
      return;
    }

    const [profileRes, signRes] = await Promise.all([
      getProfile(parsed.email),
      getSign()
    ]);

    console.log("PROFILE:", profileRes.data);
    console.log("SIGN:", signRes.data);

    // 🔥 IMPORTANT FIX
    setUser(profileRes.data?.data || profileRes.data);

    setSignUrl(signRes.data?.url || "");
    setSignBase64(signRes.data?.base64 || "");

  } catch (err) {
    console.log("LOAD ERROR:", err);
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  const handleDownload = async () => {
    const uri = await captureRef(cardRef, { format: "png", quality: 1 });

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") return alert("Permission required");

    await MediaLibrary.saveToLibraryAsync(uri);
    alert("Saved to gallery");
  };

  const handleShare = async () => {
    const uri = await captureRef(cardRef, { format: "png", quality: 1 });
    await Sharing.shareAsync(uri);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (!user) {
    return <Text>No user data</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card} ref={cardRef}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.sub}>
            Shri Shivaji Education Society Amravati
          </Text>
          <Text style={styles.school}>
            College Of Engineering & Technology, Akola
          </Text>
          <Text style={styles.sub}>Babhulgaon, Akola</Text>

          <Image
            source={require("../../assets/logo.png")}
            style={styles.avatar}
          />
        </View>

        {/* NAME */}
        <Text style={styles.name}>{user.name}</Text>

        {/* INFO */}
       <View style={styles.bottomcontain}>
  <View>
    <Text style={styles.txt}>Father</Text>
    <Text style={styles.txt}>Mobile</Text>
    <Text style={styles.txt}>PRN</Text>
    <Text style={styles.txt}>Branch</Text>
    <Text style={styles.txt}>Year</Text>
    <Text style={styles.txt}>Blood Group</Text>
  </View>

  <View>
    <Text style={styles.txt}>: {user.father_name || "-"}</Text>
    <Text style={styles.txt}>: {user.mobile}</Text>
    <Text style={styles.txt}>: {user.prn}</Text>
    <Text style={styles.txt}>: {user.branch}</Text>
    <Text style={styles.txt}>: {user.year}</Text>
    <Text style={styles.txt}>: {user.blood_group || "-"}</Text>
  </View>
</View>

       <View style={styles.signsection}>
  <Text style={{ fontWeight: "bold" }}>Principal Sign</Text>
{signBase64 ? (
  <Image
    source={{ uri: `data:image/png;base64,${signBase64}` }}
    style={styles.signImg}
  />
) : signUrl ? (
  <Image
    source={{ uri: `${signUrl}?t=${Date.now()}` }}
    style={styles.signImg}
  />
) : (
  <Text>No Signature</Text>
)}
</View>

        <View style={styles.cardfooter}>
          <Text style={styles.footertext}>
            If Found Please Return To College
          </Text>
        </View>
      </View>

      {/* BUTTONS */}
      <View style={styles.footerbtn}>
        <TouchableOpacity style={styles.btn} onPress={handleDownload}>
          <Text style={styles.btnText}>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={handleShare}>
          <Text style={styles.btnText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },

  card: {
    width: 350,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },

  header: {
    backgroundColor: "orange",
    width: "100%",
    height: "30%",
    padding: 10,
    alignItems: "center",
    borderStartEndRadius: "50%",
    borderBottomEndRadius: "50%"
  },
  cardfooter: {
    backgroundColor: "orange",
    width: "100%",
    padding: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,

  },
  bottomcontain: {
    flexDirection: "row",
    justifyContent: "center",

  },
  signsection: {
    flex: 1,
    justifyContent: "space-evenly"
  },

  footerbtn: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%"

  },
  footertext: { textAlign: "center", color: "#fff", fontWeight: "600" },
  school: {
    color: "#fff",
    fontWeight: "bold",
  },
  txt: {
    fontSize: 18,
    fontWeight: "600"
  },
  sub: {
    color: "#fff",
    fontSize: 12,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 10,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#fff"
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "red",
    marginTop:20
  },

  btn: {
    marginTop: 15,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 8,
  },

  btnText: {
    color: "#fff",
  },
  signImg: {
  width: 120,
  height: 50,
  resizeMode: "contain",
  marginTop: 5
}
});