import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import {useNavigation } from '@react-navigation/native'

import BotonRojo2 from '../components/botonRojo2'
import Imagen from '../../assets/GlouvChico.png'
import Separador from '../components/separador';


export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();

  const handleRegister = async () => {
  if (!email || !nombre || !password) {
    Alert.alert('Error', 'Completá todos los campos');
    return;
  }

  try {
    const res = await fetch(`https://wealthy-albacore-eminently.ngrok-free.app/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nombre, password }),
    });

    const result = await res.json();

    if (res.ok) {
      Alert.alert('Éxito', `Bienvenido, ${result.usuario.nombre}`);
      setUser(result.usuario);
    } else {
      Alert.alert('Error', result.error || 'No se pudo registrar');
    }
  } catch (err) {
    console.error('Error inesperado:', err);
    Alert.alert('Error', 'Error de conexión con el servidor');
  }
};

const navigation = useNavigation();

  return (
    <View style={{backgroundColor: '#272727', flex: 1}}>
    <View style={styles.registerScreen}>
        <View style={{ height: 25 }} />
            <Image source = {Imagen} />
      <Text style={styles.text}>Registrarse con Glouv</Text>
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <BotonRojo2 texto="Registrarse" style={{color: 'black', fontSize: 13,}} onPress={handleRegister} />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
  <Text style={{ color: 'white' }}>¿Ya tenés cuenta? </Text>
  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
    <Text style={{ color: '#FF3B30', fontWeight: 'bold' }}>Iniciar sesión</Text>
  </TouchableOpacity>
</View>
 <Separador colorS="white" mB= {22.5} mT= {22.5}/>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  registerScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 25,
    marginTop: -50,
    marginBottom: 50,
    fontWeight: 'bold',
 },
 input: { paddingLeft: 20, height:50, width: 332, borderColor: '#fff', marginBottom: 25, borderRadius: 60, backgroundColor: '#D9D9D9', },
  
});
