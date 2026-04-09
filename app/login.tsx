import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const iniciarSesion = async () => {
    try {
      const data = await AsyncStorage.getItem("user");

      if (!data) {
        Alert.alert("Error", "Primero regístrate");
        return;
      }

      const user = JSON.parse(data);

      if (email === user.email && password === user.password) {
        Alert.alert("Bienvenido 🔥");
        router.push("/home");
      } else {
        Alert.alert("Error", "Datos incorrectos");
      }

    } catch (error) {
      Alert.alert("Error al iniciar sesión");
    }
  };

  // 🔐 LOGIN CON HUELLA
  const loginHuella = async () => {
    try {
      const data = await AsyncStorage.getItem("user");

      if (!data) {
        Alert.alert("Error", "No hay usuario registrado");
        return;
      }

      const user = JSON.parse(data);

      if (!user.huella) {
        Alert.alert("Error", "No activaste la huella en el registro");
        return;
      }

      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert("Error", "Tu dispositivo no soporta biometría");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Inicia sesión con tu huella"
      });

      if (result.success) {
        Alert.alert("Bienvenido con huella 👆");
        router.push("/home");
      } else {
        Alert.alert("No se pudo verificar");
      }

    } catch (error) {
      Alert.alert("Error con biometría");
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Bienvenido 👋</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Contraseña"
          secureTextEntry={!showPass}
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Text style={styles.showText}>
            {showPass ? "Ocultar" : "Ver"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={iniciarSesion}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      {/* 🔐 BOTÓN HUELLA */}
      <TouchableOpacity style={styles.fingerprintButton} onPress={loginHuella}>
        <Text style={styles.fingerprintText}>Entrar con huella 👆</Text>
      </TouchableOpacity>

      <Link href="/register">
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#f5f7fb"
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222"
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 25,
    color: "#666"
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0"
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
    paddingHorizontal: 10
  },
  passwordInput: {
    flex: 1,
    padding: 14
  },
  showText: {
    color: "#4CAF50",
    fontWeight: "bold"
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 5,
    elevation: 3
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  fingerprintButton: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10
  },
  fingerprintText: {
    color: "#fff",
    fontWeight: "bold"
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#4CAF50",
    fontWeight: "bold"
  }
});