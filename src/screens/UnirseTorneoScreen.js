import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import BotonRojo2 from "../components/botonRojo2";

const API_URL = "https://wealthy-albacore-eminently.ngrok-free.app/api";

export default function UnirseTorneoScreen() {
  const { user } = useAuth();
  const route = useRoute();
  const [nombre, setNombre] = useState(route.params?.nombre || "");
  const [contrasenia, setContrasenia] = useState("");

  const unirse = async () => {
    try {
      const res = await fetch(`${API_URL}/torneos/unirse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: user.id,
          nombre,
          contrasenia,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        Alert.alert("Éxito", result.mensaje);
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Error de conexión");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unirse a Torneo</Text>

      <TextInput
        placeholder="Nombre del Torneo"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
        value={contrasenia}
        onChangeText={setContrasenia}
      />

      <BotonRojo2 texto="Unirme" onPress={unirse} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#272727", padding: 20 },
  title: { color: "white", fontSize: 26, fontWeight: "bold", marginBottom: 25 },
  input: {
    backgroundColor: "#D9D9D9",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
});
