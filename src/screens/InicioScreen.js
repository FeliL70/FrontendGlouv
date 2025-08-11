import { View, StyleSheet, Image} from 'react-native';
import {useNavigation } from '@react-navigation/native'

import Imagen from '../../assets/GlouvGrande.png'
import BotonRojo from '../components/botonRojo';

export default function InicioScreen() {

    const navigation = useNavigation();
  return (

    <View style={{backgroundColor: '#272727', flex: 1}}>

                <View style={styles.InicioScreen}>

                  <View style={{ height: 180 }} />
                  <Image source={Imagen} />
                  <View style={{ height: 150 }} />
                  <BotonRojo texto="Iniciar sesión" onPress={() => navigation.navigate('Login')} />
                    <BotonRojo style={styles.boton2} texto="Registrarse" onPress={() => navigation.navigate('Register')} />
    
                </View>
        </View>
  );
}

const styles = StyleSheet.create({
     InicioScreen: {
    justifyContent: 'center',
    alignItems: 'center',
     },
     boton2:
     {
 backgroundColor: '#D9D9D9',
 color: 'black'
     }
});