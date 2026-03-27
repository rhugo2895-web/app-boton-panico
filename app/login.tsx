import { Link, router } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <Link href="/register">
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    padding:20
  },

  title:{
    fontSize:28,
    fontWeight:"bold",
    marginBottom:20,
    textAlign:"center"
  },

  input:{
    borderWidth:1,
    borderColor:"#ccc",
    padding:12,
    marginBottom:10,
    borderRadius:8
  },

  button:{
    backgroundColor:"red",
    padding:15,
    borderRadius:10,
    alignItems:"center",
    marginTop:10
  },

  buttonText:{
    color:"white",
    fontWeight:"bold"
  },

  link:{
    marginTop:20,
    textAlign:"center",
    color:"blue"
  }
});