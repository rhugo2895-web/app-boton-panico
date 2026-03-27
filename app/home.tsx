import { Audio } from "expo-av";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {

  const activarPanico = async () => {

    try {
      
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permiso de ubicación denegado");
        return;
      }

     
      let location = await Location.getCurrentPositionAsync({});
      console.log("Ubicación:", location.coords);

    
      const { status: audioStatus } = await Audio.requestPermissionsAsync();

      if (audioStatus !== "granted") {
        Alert.alert("Permiso de micrófono denegado");
        return;
      }

      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

    
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      console.log(" Grabando audio...");

      
      Accelerometer.addListener((data) => {
        console.log("Movimiento:", data);
      });

      
      Alert.alert(
        " Pánico activado",
        `Grabando audio...\nLat: ${location.coords.latitude}\nLng: ${location.coords.longitude}`
      );

     
      setTimeout(async () => {
        try {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();

          console.log("Audio guardado en:", uri);

          Alert.alert(" Audio grabado correctamente");
        } catch (e) {
          console.log("Error al detener grabación:", e);
        }
      }, 5000);

    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Error al activar sensores");
    }

  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Bienvenido</Text>

      <TouchableOpacity
        style={styles.panicButton}
        onPress={activarPanico}
      >
        <Text style={styles.panicText}>BOTÓN DE PÁNICO</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  title:{
    fontSize:24,
    marginBottom:40
  },

  panicButton:{
    width:200,
    height:200,
    borderRadius:100,
    backgroundColor:"red",
    justifyContent:"center",
    alignItems:"center"
  },

  panicText:{
    color:"white",
    fontWeight:"bold"
  }
});