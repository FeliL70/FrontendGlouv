import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

const API_URL = "https://wealthy-albacore-eminently.ngrok-free.app/api";

export default function TorneosListScreen() {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchTorneos = async () => {
    try {
      const res = await fetch(`${API_URL}/torneos`);
      const data = await res.json();
      setTorneos(data);
    } catch (error) {
      console.error("Error al obtener torneos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTorneos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Torneos Disponibles</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF3B30" />
      ) : (
        <FlatList
          data={torneos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.torneoName}>{item.nombre}</Text>
              <Text style={styles.description}>{item.descripcion}</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("UnirseTorneo", { nombre: item.nombre })
                }
              >
                <Text style={styles.buttonText}>Unirse</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.menu}>
        <TouchableOpacity onPress={() => navigation.navigate("CrearTorneo")}>
          <Text style={styles.menuButton}>Crear Torneo</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("MisTorneos")}>
          <Text style={styles.menuButton}>Mis Torneos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#272727", padding: 20 },
  title: { color: "white", fontSize: 26, fontWeight: "bold", marginBottom: 15 },
  card: {
    borderRadius: 12,
    backgroundColor: "#3A3A3A",
    padding: 15,
    marginBottom: 12,
  },
  torneoName: { color: "#FF3B30", fontSize: 20, fontWeight: "bold" },
  description: { color: "white", fontSize: 14, marginTop: 5 },
  button: {
    marginTop: 10,
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  menuButton: { color: "#FF3B30", fontSize: 16, fontWeight: "bold" },
});
