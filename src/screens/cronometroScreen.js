import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import BotonRojo from '../components/botonRojo';

export default function CronometroScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    tiempoTotal,
    cantidadRounds,
    descanso,
    calentamiento,

    pesoActual = 103,

  } = route.params;

  const [finalizado, setFinalizado] = useState(false);
  const [esperandoInicio, setEsperandoInicio] = useState(true);
  const [fase, setFase] = useState('calentamiento');
  const [tiempoFase, setTiempoFase] = useState(calentamiento);
  const [roundActual, setRoundActual] = useState(1);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const intervalRef = useRef(null);

  const sonidoRef = useRef(null);

  useEffect(() => {
    const cargarSonido = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sonidoCampa.mp3')
      );
      sonidoRef.current = sound;
    };

    cargarSonido();

    return () => {
      if (sonidoRef.current) sonidoRef.current.unloadAsync();
    };
  }, []);

useEffect(() => {
  if (esperandoInicio) return;

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
    intervalRef.current = setInterval(() => {
      setTiempoTranscurrido((prev) => prev + 1);
    }, 1000);
  } else if (fase === 'round' && corriendo && tiempoTranscurrido >= tiempoTotal) {
    clearInterval(intervalRef.current);
    reproducirSonido();

    if (roundActual < cantidadRounds) {
      setCorriendo(false);
      setRoundActual((prev) => prev + 1);
      setFase('espera');
      setTiempoFase(descanso);
    } else {
      setCorriendo(false);
      setFinalizado(true);
    }
  }

  return () => clearInterval(intervalRef.current);
}, [fase, tiempoTranscurrido, corriendo, tiempoFase, esperandoInicio]);


  const reproducirSonido = async () => {
    if (sonidoRef.current) {
      await sonidoRef.current.replayAsync();
    }
  };

  const progreso = tiempoTranscurrido / tiempoTotal;

  const manejarPausa = () => {
    setCorriendo(false);
    setModalVisible(true);
  };

  const continuar = () => {
    setModalVisible(false);
    setCorriendo(true);
  };

  const abandonar = () => {
    setModalVisible(false);
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

      <View style={styles.circulo}>
       <Text style={styles.pesoTexto}>{pesoActual}KG</Text>
      </View>

      <Text style={styles.tiempo}>{`${Math.floor(tiempoTranscurrido / 60)}:${(tiempoTranscurrido % 60).toString().padStart(2, '0')}`}</Text>

      <View style={styles.barraContainer}>
        <View style={[styles.barraProgreso, { flex: progreso }]} />
        <View style={{ flex: 1 - progreso }} />
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
},
pesoTexto: {
  fontSize: 50,
  color: 'white',
  fontWeight: 'bold',
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