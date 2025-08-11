import { View, Text, StyleSheet, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react';

import Header from '../components/header';
import BotonRojo2 from '../components/botonRojo2';


import { useAuth } from '../context/AuthContext';

export default function perfilScreen() {
  
    const navigation = useNavigation();

    const [fotoURL, setFotoURL] = useState(null);
    const [fotoFondoURL, setFotoFondoURL] = useState(null);
    const [nombre, setNombre] = useState(''); 
    const [fechaDeNacimiento, setFechaDeNacimiento] = useState('');
    const [email, setEmail] = useState(''); 
    const [descripcion, setDescripcion] = useState(''); 
  
    const { user } = useAuth();

    useEffect(() => {
  const cargarFoto = async () => {
    try {
      const res = await fetch(`https://wealthy-albacore-eminently.ngrok-free.app/api/perfil?id=${user.id}`);
      const data = await res.json();

      if (res.ok) {
        setFotoURL(data.fotoDePerfil || null);
        setNombre(data.nombreCompleto || '');
        setFotoFondoURL(data.fotoDeFondo || null);
        setFechaDeNacimiento(data.fechaDeNacimiento || '');
        setEmail(data.email || '');
        setDescripcion(data.descripcion || '');
      } else {
        console.error("Error cargando perfil:", data.error);
      }
    } catch (err) {
      console.error("Error de red:", err);
    }
  };

  cargarFoto();
}, []);

    return (
      
      <View style={{backgroundColor: '#272727', flex: 1}}>

         <Header titulo="Perfil"/>    
         <View style={styles.perfilScreen}>  

          {fotoFondoURL && (
        <Image
          source={{ uri: fotoFondoURL }}
          style={styles.banner}
        />
      )}

                <Image style={{ width: 125, height: 125, borderRadius: 100, alignSelf: 'flex-start',  marginTop: -20, marginLeft: 35, borderWidth: 2, borderColor: 'red',   }}
                  source={{ uri: fotoURL }}/>

                <Text style={styles.nombre}>{nombre}</Text>

                  <View style={{ height: 65 }} />

          <Text style={styles.fecha}>Fecha de nacimiento: </Text>
            <Text style = {{color: 'white', fontSize: 30, alignSelf: 'flex-start', marginLeft: 25, fontWeight: 'bold'}}>
            {fechaDeNacimiento}</Text>

<View style={{ height: 25 }} />

                  <Text style={styles.fecha}>Email: </Text>
            <Text style = {{color: 'white', fontSize: 30, alignSelf: 'flex-start', marginLeft: 25, fontWeight: 'bold'}}>
            {email}</Text>

<View style={{ height: 25 }} />

            <Text style={styles.fecha}>Descripción: </Text>
            <Text style = {{color: 'white', fontSize: 18, alignSelf: 'flex-start', marginLeft: 25}}>
            {descripcion}</Text>
            
                 <View style={{ height: 123 }} />

                 <BotonRojo2 texto="Eliminar mi cuenta" onPress={() => {}}/>
                 </View>

      </View>
    );
  }

  const styles = StyleSheet.create({
    perfilScreen: {
     justifyContent: 'center',
     alignItems: 'center',
    },
    nombre: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    marginTop: -75, marginRight: 100,
  },
  banner: {
    width: '100%',
    height: 125,
    resizeMode: 'cover',
  },
  fecha: {
    color: 'white',
    fontSize: 14,
     alignSelf: 'flex-start',
     marginLeft: 25,
  }
  });
