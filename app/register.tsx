import { Link } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Register() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput placeholder="Nombre completo" style={styles.input}/>
      <TextInput placeholder="Email" style={styles.input}/>
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input}/>
      <TextInput placeholder="Confirmar contraseña" secureTextEntry style={styles.input}/>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Crear Cuenta</Text>
      </TouchableOpacity>

      <Link href="/login">
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </Link>

    </View>
  );
}

const styles = StyleSheet.create({
 container:{flex:1,justifyContent:"center",padding:20},
 title:{fontSize:28,fontWeight:"bold",marginBottom:20},
 input:{borderWidth:1,padding:12,marginBottom:10,borderRadius:8},
 button:{backgroundColor:"red",padding:15,borderRadius:10,alignItems:"center"},
 buttonText:{color:"white",fontWeight:"bold"},
 link:{marginTop:20,textAlign:"center"}
});