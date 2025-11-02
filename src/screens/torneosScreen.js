import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/header';

export default function TorneosScreen() {
  return (
    <View style={{ backgroundColor: '#272727', flex: 1 }}>
      <Header titulo="Torneos" />
      <View style={styles.container}>
        <Text style={styles.text}>Próximamente</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});