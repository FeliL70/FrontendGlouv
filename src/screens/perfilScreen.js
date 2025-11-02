import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import Header from '../components/header';
import BotonRojo2 from '../components/botonRojo2';
import { useAuth } from '../context/AuthContext';

export default function PerfilScreen() {
  const navigation = useNavigation();

  const [fotoURL, setFotoURL] = useState(null);
  const [fotoFondoURL, setFotoFondoURL] = useState(null);
  const [nombre, setNombre] = useState('');
  const [fechaDeNacimiento, setFechaDeNacimiento] = useState('');
  const [email, setEmail] = useState('');
  const [descripcion, setDescripcion] = useState('');

 const { user, setUser } = useAuth();

  useEffect(() => {
    const cargarFoto = async () => {
      try {
        const res = await fetch(
          `https://wealthy-albacore-eminently.ngrok-free.app/api/perfil?id=${user.id}`
        );
        const data = await res.json();

        if (res.ok) {
          setFotoURL(data.fotoDePerfil || null);
          setNombre(data.nombreCompleto || '');
          setFotoFondoURL(data.fotoDeFondo || null);
          setFechaDeNacimiento(data.fechaDeNacimiento || '');
          setEmail(data.email || '');
          setDescripcion(data.descripcion || '');
        } else {
          console.error('Error cargando perfil:', data.error);
        }
      } catch (err) {
        console.error('Error de red:', err);
      }
    };

    cargarFoto();
  }, [user.id]);

  return (
    <View style={{ backgroundColor: '#272727', flex: 1 }}>
      <Header titulo="Perfil" />
      <View style={styles.perfilScreen}>
        {fotoFondoURL && (
          <Image source={{ uri: fotoFondoURL }} style={styles.banner} />
        )}

        <Image
          style={styles.fotoPerfil}
          source={{ uri: fotoURL }}
        />

        <Text style={styles.nombre}>{nombre}</Text>

        <View style={{ height: 65 }} />

        <Text style={styles.fecha}>Fecha de nacimiento: </Text>
        <Text style={styles.textoDato}>{fechaDeNacimiento}</Text>

        <View style={{ height: 25 }} />

        <Text style={styles.fecha}>Email: </Text>
        <Text style={styles.textoDato}>{email}</Text>

        <View style={{ height: 25 }} />

        <Text style={styles.fecha}>Descripción: </Text>
        <Text style={styles.descripcion}>{descripcion}</Text>

        <View style={{ height: 123 }} />

        {/* 🔹 BOTÓN DE CERRAR SESIÓN */}
       <BotonRojo2
  texto="Cerrar sesión"
  onPress={() => {
    setUser(null); // solo pone user en null
  }}
/>
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
    marginTop: -75,
    marginRight: 100,
  },
  banner: {
    width: '100%',
    height: 125,
    resizeMode: 'cover',
  },
  fotoPerfil: {
    width: 125,
    height: 125,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginTop: -20,
    marginLeft: 35,
    borderWidth: 2,
    borderColor: 'red',
  },
  fecha: {
    color: 'white',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginLeft: 25,
  },
  textoDato: {
    color: 'white',
    fontSize: 30,
    alignSelf: 'flex-start',
    marginLeft: 25,
    fontWeight: 'bold',
  },
  descripcion: {
    color: 'white',
    fontSize: 18,
    alignSelf: 'flex-start',
    marginLeft: 25,
  },
});
