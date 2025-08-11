import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import {useNavigation } from '@react-navigation/native'


import Imagen from '../../assets/GlouvChico.png'
import BotonRojo2 from '../components/botonRojo2';
import Separador from '../components/separador';

export default function LoginScreen() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const { setUser } = useAuth();

const handleLogin = async () => {
  try {
    const response = await fetch(`https://wealthy-albacore-eminently.ngrok-free.app/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      setUser(result.usuario);
    } else {
      Alert.alert('Error', result.error || 'Email o contraseña incorrectos');
    }
  } catch (err) {
    console.error('Error en login:', err);
    Alert.alert('Error', 'Error de conexión');
  }
};

const navigation = useNavigation();
  
  return (
    <View style={{backgroundColor: '#272727', flex: 1}}>
<View style={styles.loginScreen}>
    <View style={{ height: 25 }} />
    <Image source = {Imagen} />
      <Text style={styles.text}>Iniciar Sesión con Glouv</Text>

        <Text style={{fontSize: 13, marginBottom: 10, color: 'white', marginRight:200,}}>Correo electronico</Text>
      <TextInput placeholder="Ingresar correo electronico" value={email} onChangeText={setEmail} style={styles.input} />
        <Text style={{fontSize: 13, marginBottom: 10, color: 'white', marginRight:225,}}>Contraseña</Text>
      <TextInput
        placeholder="Ingresar contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
<View style={{ height: 25 }} />
      <BotonRojo2 texto="Iniciar Sesión" style={{color: 'black', fontSize: 13,}} onPress={handleLogin} />
     
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
  <Text style={{ color: 'white' }}>¿No tienes cuenta? </Text>
  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
    <Text style={{ color: '#FF3B30', fontWeight: 'bold' }}>Registrate</Text>
  </TouchableOpacity>
</View>
                 <Separador colorS="white" mB= {22.5} mT= {22.5}/>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  
 text: {
    color: 'white',
    fontSize: 25,
    marginTop: -50,
    marginBottom: 50,
    fontWeight: 'bold',
 },

 
  loginScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: { paddingLeft: 20, height:50, width: 332, borderColor: '#fff', marginBottom: 25, borderRadius: 60, backgroundColor: '#D9D9D9', },
});