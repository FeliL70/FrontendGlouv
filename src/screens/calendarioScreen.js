import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import Header from '../components/header';
import { useAuth } from '../context/AuthContext';

export default function CalendarioScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  const [error, setError] = useState(null);

  // Función para formatear segundos a HH:MM:SS
  const formatSeconds = (secs) => {
    if (secs == null || isNaN(secs)) return '00:00:00';
    const total = Number(secs);
    const h = String(Math.floor(total / 3600)).padStart(2, '0');
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // 🔹 NUEVO: función segura para formatear fechas locales a YYYY-MM-DD
  const toLocalDateKey = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // 🔹 Cargar estadísticas cada vez que cambia la fecha seleccionada o el usuario
  useEffect(() => {
    const cargarEstadisticas = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      setEstadisticas(null);
      try {
        const fechaLocal = toLocalDateKey(fechaSeleccionada);
        const res = await fetch(
          `https://wealthy-albacore-eminently.ngrok-free.app/api/estadisticasPorFecha?fecha=${fechaLocal}&id_usuario=${user.id}`
        );
        const json = await res.json();
        if (!res.ok) {
          console.error('Error en backend:', json);
          setError('Error al cargar estadísticas');
        } else {
          setEstadisticas(json);
        }
      } catch (err) {
        console.error('Error inesperado:', err);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, [fechaSeleccionada, user]);

  const fechaKey = toLocalDateKey(fechaSeleccionada);

  return (
    <View style={styles.container}>
      <Header titulo="Calendario" />
      <ScrollView contentContainerStyle={styles.content}>
        <Calendar
          theme={{
            calendarBackground: '#272727',
            textSectionTitleColor: 'white',
            dayTextColor: 'white',
            monthTextColor: 'white',
            arrowColor: 'white',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
          }}
          // 🔹 Crear fecha local sin UTC shift
          onDayPress={(day) => {
            const nuevaFecha = new Date(day.year, day.month - 1, day.day);
            setFechaSeleccionada(nuevaFecha);
          }}
          markedDates={{
            [fechaKey]: { selected: true, marked: true, selectedColor: '#00adf5' },
          }}
        />

        <View style={{ height: 20 }} />

        <Text style={styles.titulo}>Fecha seleccionada</Text>
        <Text style={styles.valor}>{fechaSeleccionada.toDateString()}</Text>

        <View style={{ height: 14 }} />

        <Text style={styles.titulo}>Estadísticas</Text>

        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" />
            <Text style={styles.cargandoText}>Cargando...</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : estadisticas ? (
          <>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Duración total del día</Text>
              <Text style={styles.cardValue}>
                {formatSeconds(estadisticas.duracion_total_dia)}
              </Text>
            </View>

            <View style={styles.row}>
              <View style={[styles.smallCard, { marginRight: 8 }]}>
                <Text style={styles.cardLabel}>Rounds</Text>
                <Text style={styles.cardValue}>{estadisticas.cantidad_rounds_dia ?? 0}</Text>
              </View>

              <View style={styles.smallCard}>
                <Text style={styles.cardLabel}>Golpes</Text>
                <Text style={styles.cardValue}>{estadisticas.cantidad_golpes_dia ?? 0}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Golpe más fuerte (día)</Text>
              <Text style={styles.cardValue}>{estadisticas.golpe_mas_fuerte_dia ?? 0}</Text>
            </View>

            <View style={styles.row}>
              <View style={[styles.smallCard, { marginRight: 8 }]}>
                <Text style={styles.cardLabel}>Golpe más fuerte (semana)</Text>
                <Text style={styles.cardValue}>
                  {estadisticas.golpe_mas_fuerte_semana ?? 0}
                </Text>
              </View>

              <View style={styles.smallCard}>
                <Text style={styles.cardLabel}>Golpe más fuerte (mes)</Text>
                <Text style={styles.cardValue}>
                  {estadisticas.golpe_mas_fuerte_mes ?? 0}
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Golpe más fuerte (histórico)</Text>
              <Text style={styles.cardValue}>
                {estadisticas.golpe_mas_fuerte_historico ?? 0}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.infoText}>Seleccioná una fecha para ver las estadísticas.</Text>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E1E' },
  content: { padding: 16 },
  titulo: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  valor: { color: '#ccc', fontSize: 16, marginTop: 4 },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },
  cargandoText: { color: 'white', marginLeft: 8 },
  errorText: { color: 'red', fontSize: 16 },
  infoText: { color: '#aaa', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  card: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },
  smallCard: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },
  cardLabel: { color: '#aaa', fontSize: 14 },
  cardValue: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});