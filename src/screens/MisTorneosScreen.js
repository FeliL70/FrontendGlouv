import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

const API_URL = "https://wealthy-albacore-eminently.ngrok-free.app/api";

export default function MisTorneosScreen() {
  const { user } = useAuth();
  const [torneos, setTorneos] = useState([]);

  const fetchMyTorneos = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/torneos/usuario?id_usuario=${user.id}`);
      const data = await res.json();
      setTorneos(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchMyTorneos();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Torneos</Text>

      <FlatList
        data={torneos}
        keyExtractor={(item) => item.id_torneo.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.Torneos.nombre}</Text>
            <Text style={styles.description}>{item.Torneos.descripcion}</Text>
            <Text style={styles.points}>
              Puntos: {item.puntuacion}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#272727", flex: 1, padding: 20 },
  title: { color: "white", fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#3A3A3A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: { color: "#FF3B30", fontSize: 20, fontWeight: "bold" },
  description: { color: "white", fontSize: 14, marginTop: 5 },
  points: { color: "#999", marginTop: 10, fontSize: 14 },
});
