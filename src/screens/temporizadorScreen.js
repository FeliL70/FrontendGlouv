import { View, StyleSheet, Text} from 'react-native';
import {useNavigation } from '@react-navigation/native'

import React, { useState } from 'react';

import Slider from '@react-native-community/slider';

import Header from '../components/header'
import BotonRojo2 from '../components/botonRojo2';
import Separador from '../components/separador';

export default function temporizadorScreen() {
  const navigation = useNavigation();
  
  const [rounds, setRounds] = useState(1);
  const [duracionRound, setDuracionRound] = useState(10);
  const [descanso, setDescanso] = useState(10);
  const [calentamiento, setCalentamiento] = useState(10);

const totalSegundos = rounds * (duracionRound + descanso);
const minutos = Math.floor(totalSegundos / 60);
const segundos = totalSegundos % 60;
const tiempoTotalTexto = segundos === 0 
  ? `${minutos} minuto${minutos !== 1 ? 's' : ''}`
  : `${minutos}:${segundos.toString().padStart(2, '0')}`;

  return (
    <View style={{backgroundColor: '#272727', flex: 1}}>
             
     <Header titulo="Temporizador" showBack={true}/>
       
    <View style={styles.temporizadorScreen}>

      <View style={styles.textC}>
       <Text style={styles.text}>Rounds</Text>
       </View>

      <View style={styles.rectangulo}>
         <Text>{rounds} rounds</Text>
         <Slider
           minimumValue={1}
           maximumValue={12}
           step={1}
           value={rounds}
           onValueChange={setRounds}/>

           <Separador colorS="black" mB= {10} mT= {10}/>

        <Text>{`0:${duracionRound.toString().padStart(2, '0')} / round`}</Text>
        <Slider
        minimumValue={10}
        maximumValue={300}
        step={10}
        value={duracionRound}
        onValueChange={setDuracionRound}/>

          <Separador colorS="black" mB= {10} mT= {10}/>

        <Text>{`0:${descanso.toString().padStart(2, '0')} descanso`}</Text>
        <Slider
         minimumValue={10}
         maximumValue={300}
         step={30}
         value={descanso}
         onValueChange={setDescanso}/>

         <Separador colorS="black" mB= {10} mT= {10}/>

<View style={{alignSelf: 'flex-end'}}>
  <Text style={{ marginTop: 10 }}>
    Tiempo total de entrenamiento: {tiempoTotalTexto}
  </Text>
  </View>
  
</View>

  <View style={styles.textC}>
  <Text style={styles.text}>Extra</Text>
  </View>

<View style={styles.rectangulo}>

  <Text>{`0:${calentamiento.toString().padStart(2, '0')} calentamiento`}</Text>
  <Slider
    minimumValue={0}
    maximumValue={60}
    step={5}
    value={calentamiento}
    onValueChange={setCalentamiento}
  />
</View>

          <View style={{ height: 75 }} />

          <BotonRojo2 texto="Empezar" onPress={() => navigation.navigate('cronometro', {
            tiempoTotal: duracionRound,
            cantidadRounds: rounds,
            descanso: descanso,
            calentamiento: calentamiento}
           )}/>

</View>
            </View>
  );
}

const styles = StyleSheet.create({
  temporizadorScreen: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  textC: {
   paddingHorizontal: 20,     
   alignSelf: 'flex-start'  
  },


  rectangulo: {
  backgroundColor: '#d9d9d9',
  borderRadius: 20,
  width: '90%', 
  padding: 15,
  
},
text: {
  color: 'white',
  fontSize: 22,
  marginTop: 25,
  marginBottom: 25,
  fontWeight: 'bold',
},

});