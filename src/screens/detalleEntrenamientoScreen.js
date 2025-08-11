import { View, StyleSheet, Image, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {useNavigation } from '@react-navigation/native'

import Header from '../components/header'
import BotonRojo2 from '../components/botonRojo2';

export default function detalleEntrenamientoScreen() {
  const navigation = useNavigation();

  const route = useRoute();
  const {imagen, titulo, Descripcion, tiempoT} = route.params;

  return (
    <View style={{backgroundColor: '#272727', flex: 1}}>
             
             <Header titulo={titulo} showBack={true}/>

            <View style={styles.detalleEntrenamientoScreen}>
              <View style={{ height: 23 }} />
              <Image source={{uri: imagen}} style={styles.imagen} />
              <Text style = {styles.desc} >{Descripcion}</Text>
              <View style={{ height: 220 }} />
              <BotonRojo2 texto="Empezar" onPress={() => navigation.navigate('cronometro',{
                tiempoTotal: tiempoT,
              cantidadRounds: 3,
            descanso: 90,
            calentamiento: 90}
              )}/>

            </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detalleEntrenamientoScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagen: {
    width: 345,
    height: 230,
    resizeMode: 'contain',
  },
  desc:{
    color: 'white',
    fontSize: 25,
    marginTop: 30,
   textAlign: 'center',
   
    fontWeight: 'bold',
  }
});