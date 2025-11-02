import { View, StyleSheet, ScrollView, Text} from 'react-native';
import {useNavigation } from '@react-navigation/native'

import { useEffect, useState } from 'react';


import Header from '../components/header';
import ImagenBoton from '../components/imagenBoton';
import Separador from '../components/separador';

export default function EntrenamientosScreen(){

    const navigation = useNavigation();

    const [entrenamientos, setEntrenamientos] = useState([]);

useEffect(() => {
  fetch(`https://wealthy-albacore-eminently.ngrok-free.app/api/entrenamientos?ids=1,2,3`)
    .then(res => res.json())
    .then(setEntrenamientos)
    .catch((err) => console.error("Error al obtener entrenamientos:", err));
}, []);

    return (
      
<View style={{flex: 1, backgroundColor: '#272727',}}>
       
 <Header titulo="Entrenamientos"/>         

  <ScrollView>
<View style={styles.entrenamientosScreen}>
      
        <View style={{ height: 25 }} />
        
          {entrenamientos.map((entreno) => (
              <View key={entreno.id} style={{ width: '100%', alignItems: 'center' }}> 
                <ImagenBoton
                imagenDeBoton={entreno.foto}
                texto={entreno.nombre}
                desc={entreno.descripcion}
                onPress={() =>
                  navigation.navigate('detalleEntrenamiento', {
                    imagen: entreno.foto,
                    titulo: entreno.nombre,
                    Descripcion: entreno.descripcion,
                    tiempoT: entreno.duracion,
                    entrenamientoId: entreno.id
                  })
                }
                />
                <Separador colorS="white" mB= {43} mT= {22.5}/>  
              </View>
          ))}
 <Text onPress={() => navigation.navigate('temporizador')}
    style={{ textDecorationLine: 'underline', color: '#D9D9D9' }}
    >temporizador</Text>

  <Text onPress={() => navigation.navigate('entrenamientosTotales')}
    style={{ textDecorationLine: 'underline', color: '#D9D9D9' }}
    >Ver más</Text>

</View>
</ScrollView>

      </View>
    );
  }
  
  
const styles = StyleSheet.create({

  entrenamientosScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: 'white',
    fontSize: 25,
    marginTop: 10.5,
    marginBottom: 23,
    marginRight:175,
    fontWeight: 'bold',
    
  },
  }
);  