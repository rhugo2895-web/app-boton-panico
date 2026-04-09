import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import { router } from "expo-router";
import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function Home() {

  const [screen, setScreen] = useState<"home" | "profile" | "history" | "map">("home");
  const [user, setUser] = useState<any>({});
  const [location, setLocation] = useState<any>(null);
  const [phones, setPhones] = useState<string[]>([]);
  const [newPhone, setNewPhone] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    cargarUsuario();
    cargarTelefonos();
    cargarHistorial();
    obtenerUbicacionInicial();
  }, []);

  const cargarUsuario = async () => {
    const data = await AsyncStorage.getItem("user");
    if (data) setUser(JSON.parse(data));
  };

  const cargarTelefonos = async () => {
    const data = await AsyncStorage.getItem("phones");
    if (data) setPhones(JSON.parse(data));
  };

  const cargarHistorial = async () => {
    const data = await AsyncStorage.getItem("history");
    if (data) setHistory(JSON.parse(data));
  };

  const obtenerUbicacionInicial = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      setLocation(loc.coords);
    }
  };

  const guardarTelefono = async () => {
    if (!newPhone) return;

    const updated = [...phones, newPhone];
    setPhones(updated);
    setNewPhone("");

    await AsyncStorage.setItem("phones", JSON.stringify(updated));
  };

  const llamarEmergencia = () => {
    if (phones.length > 0) {
      Linking.openURL(`tel:${phones[0]}`);
    } else {
      Alert.alert("No hay números guardados");
    }
  };

  const reproducirAudio = async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
    } catch {
      Alert.alert("Error al reproducir audio");
    }
  };

  const activarPanico = async () => {

    let subscription: any = null;
    let recording: Audio.Recording | null = null;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      setLocation(loc.coords);

      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      if (audioStatus !== "granted") return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recording = rec;

      Accelerometer.setUpdateInterval(1000);
      subscription = Accelerometer.addListener(() => {});

      llamarEmergencia();

      Alert.alert("🚨 Emergencia activada");

      setTimeout(async () => {

        if (subscription) subscription.remove();

        let audioUri = null;

        if (recording) {
          await recording.stopAndUnloadAsync();
          audioUri = recording.getURI();
        }

        const now = new Date();
        const fecha = `${now.getDate().toString().padStart(2, "0")}/${
          (now.getMonth() + 1).toString().padStart(2, "0")
        }/${now.getFullYear()} ${
          now.getHours().toString().padStart(2, "0")
        }:${now.getMinutes().toString().padStart(2, "0")}:${
          now.getSeconds().toString().padStart(2, "0")
        }`;

        const nuevoRegistro = {
          fecha,
          audio: audioUri,
          lat: loc.coords.latitude,
          lng: loc.coords.longitude
        };

        const updatedHistory = [nuevoRegistro, ...history];
        setHistory(updatedHistory);
        await AsyncStorage.setItem("history", JSON.stringify(updatedHistory));

        Alert.alert("Finalizado");

      }, 15000);

    } catch (e) {
      Alert.alert("Error en sensores");
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/");
  };

  return (
    <View style={styles.container}>

      {/* NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => setScreen("home")}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Emergencia</Text>

        <View style={{ flexDirection: "row", gap: 15 }}>
          <TouchableOpacity onPress={() => setScreen("history")}>
            <Text style={styles.navIcon}>📜</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScreen("map")}>
            <Text style={styles.navIcon}>🗺️</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScreen("profile")}>
            <Text style={styles.navIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HOME */}
      {screen === "home" && (
        <View style={styles.center}>
          <TouchableOpacity style={styles.panicButton} onPress={activarPanico}>
            <Text style={styles.panicText}>PÁNICO</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* PERFIL */}
      {screen === "profile" && (
        <ScrollView style={{ width: "100%" }} contentContainerStyle={{ padding: 20 }}>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Datos personales</Text>
            <Text style={styles.text}>Nombre: {user?.nombre}</Text>
            <Text style={styles.text}>Email: {user?.email}</Text>
            <Text style={styles.text}>Edad: {user?.edad}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Teléfonos</Text>

            {phones.map((p, i) => (
              <Text key={i}>{p}</Text>
            ))}

            <TextInput
              placeholder="Nuevo número"
              style={styles.input}
              value={newPhone}
              onChangeText={setNewPhone}
            />

            <TouchableOpacity style={styles.addBtn} onPress={guardarTelefono}>
              <Text style={{ color: "#fff" }}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logout} onPress={cerrarSesion}>
            <Text style={{ color: "#fff" }}>Cerrar sesión</Text>
          </TouchableOpacity>

        </ScrollView>
      )}

      {/* MAPA */}
      {screen === "map" && (
        location ? (
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
          >
            <Marker coordinate={location} />
          </MapView>
        ) : (
          <View style={styles.center}>
            <Text>Cargando ubicación...</Text>
          </View>
        )
      )}

      {/* HISTORIAL */}
      {screen === "history" && (
        <ScrollView style={{ width: "100%" }} contentContainerStyle={{ padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            Historial de emergencias
          </Text>

          {history.length === 0 ? (
            <Text>No hay registros</Text>
          ) : (
            history.map((item, index) => (
              <View key={index} style={styles.card}>
                <Text>{item.fecha}</Text>

                <Text style={{ fontSize: 12 }}>
                  📍 {item.lat}, {item.lng}
                </Text>

                {item.audio && (
                  <TouchableOpacity
                    style={styles.playBtn}
                    onPress={() => reproducirAudio(item.audio)}
                  >
                    <Text style={{ color: "#fff" }}>▶ Escuchar audio</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef2f7" },

  navbar: {
    height: 90,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  navIcon: { fontSize: 24 },
  title: { fontSize: 18, fontWeight: "bold" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  panicButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
  },

  panicText: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  text: {
    fontSize: 16,
    marginBottom: 5
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 10
  },

  addBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center"
  },

  logout: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 10,
    marginTop: 10
  },

  playBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center"
  }
});