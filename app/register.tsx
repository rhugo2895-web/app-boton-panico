import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

export default function Register() {

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    edad: "",
    altura: "",
    peso: "",
    sangre: "",
    telefono: "",
    huella: false
  });

  // 🔐 Registrar huella
  const registrarHuella = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();

      if (!compatible) {
        Alert.alert("Error", "Tu dispositivo no tiene lector de huella");
        return;
      }

      const saved = await LocalAuthentication.isEnrolledAsync();

      if (!saved) {
        Alert.alert("Error", "No tienes huellas registradas en el dispositivo");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirma tu huella",
        fallbackLabel: "Usar contraseña"
      });

      if (result.success) {
        setForm({ ...form, huella: true });
        Alert.alert("Huella registrada correctamente ✅");
      } else {
        Alert.alert("No se pudo verificar la huella");
      }

    } catch (error) {
      Alert.alert("Error con la biometría");
    }
  };

  const registrar = async () => {
    const { nombre, email, password, edad } = form;

    if (!nombre || !email || !password || !edad) {
      Alert.alert("Error", "Completa los campos obligatorios");
      return;
    }

    try {
      await AsyncStorage.setItem("user", JSON.stringify(form));

      Alert.alert("Cuenta creada correctamente");

      router.replace("/");

    } catch (error) {
      Alert.alert("Error al guardar usuario");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        placeholder="Nombre completo"
        style={styles.input}
        onChangeText={(text) => setForm({ ...form, nombre: text })}
      />

      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        keyboardType="email-address"
        onChangeText={(text) => setForm({ ...form, email: text })}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />

      <TextInput
        placeholder="Edad"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(text) => setForm({ ...form, edad: text })}
      />

      <TextInput
        placeholder="Altura (cm)"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(text) => setForm({ ...form, altura: text })}
      />

      <TextInput
        placeholder="Peso (kg)"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(text) => setForm({ ...form, peso: text })}
      />

      <TextInput
        placeholder="Tipo de sangre"
        style={styles.input}
        onChangeText={(text) => setForm({ ...form, sangre: text })}
      />

      <TextInput
        placeholder="Teléfono"
        style={styles.input}
        keyboardType="phone-pad"
        onChangeText={(text) => setForm({ ...form, telefono: text })}
      />

      {/* 🔐 BOTÓN DE HUELLA */}
      <TouchableOpacity style={styles.fingerprintButton} onPress={registrarHuella}>
        <Text style={styles.fingerprintText}>
          {form.huella ? "Huella registrada ✅" : "Registrar huella digital"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={registrar}>
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f7fb",
    justifyContent: "center"
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#333"
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16
  },
  fingerprintButton: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10
  },
  fingerprintText: {
    color: "#fff",
    fontWeight: "bold"
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});