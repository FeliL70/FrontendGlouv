import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'

import Header from '../components/header';
import circuloYLogo from '../../assets/LogoCirculo.png'
import BotonRojo from '../components/botonRojo'
import Separador from '../components/separador';

import { useBluetooth } from '../context/BluetoothContext';

export default function conectarGlouvScreen() {
  
  const { isConnected, connectToDevice, disconnectFromDevice } = useBluetooth();
  const navigation = useNavigation();

  return (
    <View style={{backgroundColor: '#272727', flex: 1}}>
       
       <Header titulo="Conectar Glouv"/>      

       <View style={styles.conectarGlouvScreen}>
         <View style={{ height: 25 }} />
         
         {!isConnected ? (
            <View style={[styles.bordeImagen, {borderColor: 'white', marginBottom: 50}]} >
              <Image source={circuloYLogo} style={styles.imagenes}/>
            </View>
         ) : (
            <View style={[styles.bordeImagen, {borderColor: '#C92828', marginBottom: 25}]} >
              <Image source={circuloYLogo} style={styles.imagenes}/>
            </View>
         )}
         
        {!isConnected && (
          <BotonRojo
            texto="Conectar Glouv"
            blanco={false}
            onPress={connectToDevice}
          />
        )}

        {isConnected && (
          <BotonRojo
            texto="Conectado"
            blanco={true}
          />
        )}

        {isConnected && (
          <BotonRojo
            texto="Desconectar Glouv"
            blanco={false}
            onPress={disconnectFromDevice}
          />
        )}

        <Separador colorS="white" mB={22.5} mT={22.5} />

        <Text style={styles.text}>
          Presiona el botón para activar la conexión Bluetooth de los guantes.
          El sistema buscará dispositivos cercanos automáticamente.
          Una vez conectado podrás entrenar tranquilamente y los datos se registrarán en nuestra aplicación.
        </Text>

      </View>
    </View>
  );
}

  const styles = StyleSheet.create({
    conectarGlouvScreen: {
    justifyContent: 'center',
    alignItems: 'center',
    },

    text: {
    color: 'white',
    fontSize: 15,
    marginTop: 5,
    textAlign: 'center',
    width: '90%',
  },

   imagenes: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  
  bordeImagen: {
  width: 250,
  height: 250,
  borderWidth: 5,
  borderRadius: 125,  
  backgroundColor: '#D9D9D9'
},
  });
    
