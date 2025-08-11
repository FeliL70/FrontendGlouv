import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BotonRojo2({ texto, onPress, style }) {
  return (
    <TouchableOpacity style={styles.boton} onPress={onPress}>
      <Text style={[styles.texto, style]}>{texto}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: '#C92828',
    borderRadius: 60,
    height:50,
    width: 224,
    marginBottom: 20,
    justifyContent: 'center', 
  },
  texto: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
});