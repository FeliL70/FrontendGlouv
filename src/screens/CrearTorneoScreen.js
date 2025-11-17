import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BotonRojo2 from "../components/botonRojo2";

const API_URL = "https://wealthy-albacore-eminently.ngrok-free.app/api";

export default function CrearTorneoScreen() {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contrasenia, setContrasenia] = useState("");

  const crearTorneo = async () => {
    if (!nombre) return Alert.alert("Error", "El nombre es obligatorio");

    try {
      const res = await fetch(`${API_URL}/torneos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, contrasenia }),
      });

      const result = await res.json();

      if (res.ok) {
        Alert.alert("Éxito", "Torneo creado");
        navigation.goBack();
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error de conexión");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Torneo</Text>

      <TextInput
        placeholder="Nombre del torneo"
        style={styles.input}
        onChangeText={setNombre}
        value={nombre}
      />

      <TextInput
        placeholder="Descripción"
        style={styles.input}
        onChangeText={setDescripcion}
        value={descripcion}
      />

      <TextInput
        placeholder="Contraseña (si es privado)"
        style={styles.input}
        onChangeText={setContrasenia}
        value={contrasenia}
      />

      <BotonRojo2 texto="Crear" onPress={crearTorneo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#272727", flex: 1, padding: 20 },
  title: { color: "white", fontSize: 26, marginBottom: 25, fontWeight: "bold" },
  input: {
    backgroundColor: "#D9D9D9",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
});
