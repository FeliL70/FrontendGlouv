import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import BotonRojo2 from '../components/botonRojo2';
import Imagen from '../../assets/GlouvChico.png';
import Separador from '../components/separador';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { setUser } = useAuth();
  const navigation = useNavigation();

  const validateEmail = (value) => {
    if (!value.includes('@')) {
      setEmailError('El correo electrónico debe contener una arroba (@)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value) => {
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isLongEnough = value.length >= 8;

    if (!isLongEnough || !hasUppercase || !hasNumber) {
      let msg = 'La contraseña debe tener:';
      if (!isLongEnough) msg += '\n• Al menos 8 caracteres';
      if (!hasUppercase) msg += '\n• Una letra mayúscula';
      if (!hasNumber) msg += '\n• Al menos un número';
      setPasswordError(msg);
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handleRegister = async () => {
    if (!email || !nombre || !password) {
      setEmailError(!email ? 'El correo electrónico es obligatorio' : '');
      setPasswordError(!password ? 'La contraseña es obligatoria' : '');
      return;
    }

    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    if (!emailValid || !passwordValid) return;

    try {
      const res = await fetch(`https://wealthy-albacore-eminently.ngrok-free.app/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombre, password }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(`Bienvenido, ${result.usuario.nombre}`);
        setUser(result.usuario);
      } else {
        alert(result.error || 'No se pudo registrar');
      }
    } catch (err) {
      console.error('Error inesperado:', err);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <View style={{ backgroundColor: '#272727', flex: 1 }}>
      <View style={styles.registerScreen}>
        <View style={{ height: 25 }} />
        <Image source={Imagen} />
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
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            validatePassword(text);
          }}
          style={styles.input}
          secureTextEntry
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <BotonRojo2
          texto="Registrarse"
          style={{ color: 'black', fontSize: 13 }}
          onPress={handleRegister}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white' }}>¿Ya tenés cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: '#FF3B30', fontWeight: 'bold' }}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>

        <Separador colorS="white" mB={22.5} mT={22.5} />
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
  input: {
    paddingLeft: 20,
    height: 50,
    width: 332,
    borderColor: '#fff',
    marginBottom: 8,
    borderRadius: 60,
    backgroundColor: '#D9D9D9',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 15,
    textAlign: 'left',
    width: 332,
  },
});
