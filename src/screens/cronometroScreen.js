import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Animated } from 'react-native';
import BotonRojo from '../components/botonRojo';
import { useBluetooth } from '../context/BluetoothContext';
import { useAuth } from '../context/AuthContext';

export default function CronometroScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { fuerza } = useBluetooth();
  const { user } = useAuth();

  const { id_entrenamiento, tiempoTotal, cantidadRounds, descanso, calentamiento } = route.params;

  const [finalizado, setFinalizado] = useState(false);
  const [esperandoInicio, setEsperandoInicio] = useState(true);
  const [fase, setFase] = useState('calentamiento');
  const [tiempoFase, setTiempoFase] = useState(calentamiento);
  const [roundActual, setRoundActual] = useState(1);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const intervalRef = useRef(null);

  // Nuevo: id del registro UsuarioEntrenamiento en la DB
  const [idEntrenamiento, setIdEntrenamiento] = useState(null);

  const sonidoRef = useRef(null);
  const [primerGolpe, setPrimerGolpe] = useState(false);
  const animacionColor = useRef(new Animated.Value(0)).current;
  const animacionPulso = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const cargarSonido = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sonidoCampa.mp3')
        );
        sonidoRef.current = sound;
      } catch (err) {
        console.error('Error cargando sonido:', err);
      }
    };
    cargarSonido();
    return () => {
      if (sonidoRef.current) sonidoRef.current.unloadAsync();
      clearInterval(intervalRef.current);
    };
  }, []);

  // cuando comienza el primer round, crear registro de UsuarioEntrenamiento en el backend
  const crearUsuarioEntrenamiento = async () => {
    try {
      const res = await fetch(`https://wealthy-albacore-eminently.ngrok-free.app/api/usuarioEntrenamiento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: user.id,
          id_entrenamiento,
          fecha: new Date().toISOString(),
          tiempo: "00:00:00"
        })
      });
      const json = await res.json();
      if (res.ok && json?.id) {
        setIdEntrenamiento(json.id);
      } else {
        console.warn('No se pudo crear UsuarioEntrenamiento', json);
      }
    } catch (err) {
      console.error('Error creando UsuarioEntrenamiento', err);
    }
  };

  const finalizarUsuarioEntrenamiento = async (id, tiempoFinalSegundos) => {
  try {
    if (!id) return;
    const tiempoFormateado = new Date(tiempoFinalSegundos * 1000)
      .toISOString()
      .substring(11, 19); // "HH:MM:SS"

    const res = await fetch(`https://wealthy-albacore-eminently.ngrok-free.app/api/usuarioEntrenamiento/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tiempo: tiempoFormateado }),
    });

    if (!res.ok) {
      const json = await res.json();
      console.warn('Error actualizando tiempo entrenamiento', json);
    }
  } catch (err) {
    console.error('Error finalizando entrenamiento', err);
  }
};

  // --- NUEVO: función que guarda un golpe en tu backend ---
  const guardarGolpe = async (fuerzaValor, idUsuarioEntrenamiento, idGuante = null) => {
    try {
      if (!idUsuarioEntrenamiento) {
        console.warn('guardarGolpe: falta idUsuarioEntrenamiento');
        return;
      }
      // Ajustá la ruta si tu endpoint es diferente
      const res = await fetch(`https://wealthy-albacore-eminently.ngrok-free.app/api/golpes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuarioEntrenamiento: idUsuarioEntrenamiento,
          fuerza: fuerzaValor,
          id_guante: idGuante
        })
      });
      const json = await res.json();
      if (!res.ok) {
        console.warn('Error guardando golpe', json);
      } else {
        // opcional: podés hacer algo con la respuesta si querés
        // console.log('Golpe guardado', json);
      }
    } catch (err) {
      console.error('Error en guardarGolpe:', err);
    }
  };
  // --------------------------------------------------------

  // Reaccionar a fuerza -> guardar golpe SOLO si corriendo y idEntrenamiento
  useEffect(() => {
    if (!corriendo) return;
    if (!idEntrenamiento) return;
    if (fuerza == null) return;
    if (fuerza <= 0) return;

    // Guardar cada nuevo valor de fuerza directamente en la DB
    guardarGolpe(fuerza, idEntrenamiento);

    if (!primerGolpe) {
      setPrimerGolpe(true);
      Animated.timing(animacionColor, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      // pulso visual
      Animated.sequence([
        Animated.timing(animacionPulso, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(animacionPulso, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [fuerza, corriendo, idEntrenamiento]);

  useEffect(() => {
    if (esperandoInicio) return;

    // al entrar a 'round' por primera vez, si no hay idEntrenamiento, crear uno
    if (fase === 'round' && !idEntrenamiento) {
      crearUsuarioEntrenamiento();
    }

    if (fase !== 'round' && tiempoFase > 0) {
      const faseInterval = setInterval(() => {
        setTiempoFase((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(faseInterval);
    }

    if (fase !== 'round' && tiempoFase === 0) {
      if (fase === 'calentamiento') {
        setFase('round');
        setCorriendo(true);
      } else if (fase === 'espera') {
        setFase('round');
        setTiempoTranscurrido(0);
        setCorriendo(true);
      }
    }

    if (fase === 'round' && corriendo && tiempoTranscurrido < tiempoTotal) {
      // si ya había un intervalo, limpiarlo primero
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTiempoTranscurrido((prev) => prev + 1);
      }, 1000);
    } else if (fase === 'round' && corriendo && tiempoTranscurrido >= tiempoTotal) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      reproducirSonido();

      // finalizar el entrenamiento actual (guardar tiempo)
      if (idEntrenamiento) {
        finalizarUsuarioEntrenamiento(idEntrenamiento, tiempoTranscurrido);
      }

      if (roundActual < cantidadRounds) {
        setCorriendo(false);
        setRoundActual((prev) => prev + 1);
        setFase('espera');
        setTiempoFase(descanso);
        setIdEntrenamiento(null); // se puede crear uno nuevo al iniciar siguiente round
      } else {
        setCorriendo(false);
        setFinalizado(true);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fase, tiempoTranscurrido, corriendo, tiempoFase, esperandoInicio]);

  const reproducirSonido = async () => {
    if (sonidoRef.current) {
      try {
        await sonidoRef.current.replayAsync();
      } catch (err) {
        console.error('Error reproduciendo sonido', err);
      }
    }
  };

  const manejarPausa = () => {
    setCorriendo(false);
    setModalVisible(true);
  };

  const continuar = () => {
    setModalVisible(false);
    setCorriendo(true);
  };

  const abandonar = async () => {
    setModalVisible(false);
    // Si abandonás y hay un entrenamiento creado, actualizalo con tiempo actual
    if (idEntrenamiento) {
      await finalizarUsuarioEntrenamiento(idEntrenamiento, tiempoTranscurrido);
    }
    navigation.goBack();
  };

  return (

    
    <SafeAreaView style={styles.container}>
      <View style={styles.lineaContainer}>
  {Array.from({ length: cantidadRounds }).map((_, index) => (
    <View
      key={index}
      style={[styles.linea, index < roundActual && styles.lineaActiva]}
    />
  ))}
</View>

<Text style={styles.titulo}>{`Round ${roundActual}`}</Text>

<Animated.View
  style={[
    styles.circulo,
    {
      backgroundColor: animacionColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['white', '#C92828'],
      }),
      borderColor: animacionColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['#C92828', 'white'],
      }),
      transform: [{ scale: animacionPulso }],
    },
  ]}
>
  {/* GOLPES (YA LO TENÍAS) */}
  <Animated.Text
    style={[
      styles.pesoTexto,
      {
        color: animacionColor.interpolate({
          inputRange: [0, 1],
          outputRange: ['black', 'white'],
        }),
      },
    ]}
  >
    {fuerza !== null && !isNaN(fuerza) && fuerza > 0
      ? `${Math.round(fuerza)} kg`
      : 'Esperando datos...'}
  </Animated.Text>

  {/* INFO DEL USUARIO */}
  <View style={{ marginTop: 10, alignItems: "center" }}>
    <Text style={styles.infoUsuario}>{user?.nombre}</Text>
    <Text style={styles.infoUsuario}>{user?.email}</Text>
    <Text style={styles.infoUsuario}>{user?.pais}</Text>
  </View>
</Animated.View>

<Text style={styles.tiempo}>
  {`${Math.floor(tiempoTranscurrido / 60)}:${(tiempoTranscurrido % 60)
    .toString()
    .padStart(2, '0')}`}
</Text>

<View style={styles.barraContainer}>
  <View
    style={[
      styles.barraProgreso,
      {
        flex: 1 - tiempoTranscurrido / tiempoTotal,
      },
    ]}
  />
  <View
    style={{
      flex: tiempoTranscurrido / tiempoTotal,
    }}
  />
</View>

<View style={styles.controles}>
  <TouchableOpacity onPress={manejarPausa}>
    <Ionicons name="pause" size={48} color="white" />
  </TouchableOpacity>

  <TouchableOpacity onPress={() => setTiempoTranscurrido(tiempoTotal)}>
    <Ionicons name="play-skip-forward" size={48} color="white" />
  </TouchableOpacity>
</View>

<Modal visible={esperandoInicio || fase !== 'round'} transparent animationType="fade">
  <View style={styles.modalContainer}>
    <View style={styles.modalContenido}>

      {esperandoInicio && (
        <>
          <Text style={styles.mTitulo}>¿Listo para empezar?</Text>
          <BotonRojo
            texto="Comenzar"
            blanco={false}
            onPress={() => {
              setEsperandoInicio(false);
              if (calentamiento > 0) {
                setFase('calentamiento');
                setTiempoFase(calentamiento);
              } else {
                setFase('round');
                setCorriendo(true);
              }
            }}
          />
        </>
      )}

      {!esperandoInicio && fase !== 'round' && (
        <>
          <Text style={styles.mTitulo}>
            {fase === 'calentamiento' ? 'Calentamiento' : 'Siguiente round'}
          </Text>
          <Text style={styles.tiempo}>
            {`${Math.floor(tiempoFase / 60)}:${(tiempoFase % 60).toString().padStart(2, '0')}`}
          </Text>

          <View style={styles.barraContainer}>
            <View style={[
              styles.barraProgreso,
              {
                flex: 1 - tiempoFase / (fase === 'calentamiento' ? calentamiento : descanso),
              }
            ]} />
            <View style={{
              flex: tiempoFase / (fase === 'calentamiento' ? calentamiento : descanso),
            }} />
            
          </View>

          <BotonRojo
            texto="Saltear"
            blanco={false}
            onPress={() => {
              setTiempoFase(0);
            }}
          />
        </>
      )}

    </View>
  </View>
</Modal>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>

            <Text style={styles.mTitulo}>Pausa</Text>

            <BotonRojo
                        texto="Continuar"
                        blanco={true}
                        onPress={continuar}>
            </BotonRojo>
            
            <BotonRojo
                        texto="Abandonar"
                        blanco={false}
                        onPress={abandonar}>
            </BotonRojo>
            
          </View>
        </View>
      </Modal>

<Modal visible={finalizado} transparent animationType="fade">
  <View style={styles.modalContainer}>
    <View style={styles.modalContenido}>
      <Text style={styles.mTitulo}>¡Entrenamiento finalizado!</Text>
      <BotonRojo
        texto="Salir"
        blanco={false}
        onPress={() => {
          setFinalizado(false);
          navigation.navigate('Entrenamientos')}
        }
      />
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#272727',
    alignItems: 'center',
    padding: 20,
  },
  lineaContainer: {
    flexDirection: 'row',
    marginBottom: 80,
  },
  linea: {
    height: 4,
    flex: 1,
    backgroundColor: '#444',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  lineaActiva: {
    backgroundColor: '#C92828',
  },
  titulo: {
    color: 'white',
    fontSize: 32,
    marginBottom: 32,
  },
  tiempo: {
    color: 'white',
    fontSize: 40,
    marginBottom: 20,
  },
  barraContainer: {
    flexDirection: 'row',
    width: '80%',
    height: 6,
    backgroundColor: '#444',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  barraProgreso: {
    backgroundColor: '#C92828',
  },
  controles: {
    flexDirection: 'row',
  },
 
  circulo: {
  width: 250,
  height: 250,
  borderRadius: 125,
  borderWidth: 6,
  borderColor: '#C92828',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 32,
  backgroundColor: 'white',
},
pesoTexto: {
  fontSize: 22,
  textAlign: 'center',
  color: 'white',
  fontWeight: 'bold',
},

infoUsuario: {
  fontSize: 12,
  color: '#fff',
  opacity: 0.9,
  textAlign: 'center',
  marginTop: -2,
},

 
  modalContainer: {
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
},
modalContenido: {
  backgroundColor: '#1c1c1c',
  width: '100%',
  alignItems: 'center',
  padding: 20,
},
mTitulo: {
  fontSize: 37,
  fontWeight: 'bold',
  color: 'white',
  marginBottom: 20,
  textAlign: 'center'
},

});