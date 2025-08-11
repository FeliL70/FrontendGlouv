import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BotonRojo({ texto, onPress, blanco, style }) {
  return (
    <TouchableOpacity style={[styles.boton, blanco ? styles.botonBlanco : styles.botonRojo, style]}
     onPress={onPress}>
      <Text style={[styles.texto, blanco ? styles.textoRojo : styles.textoBlanco, style]}> {texto} </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: '#C92828',
    borderRadius: 60,
    height:50,
    width: 332,
    marginBottom: 20,
    justifyContent: 'center', 
  },
  botonRojo: { backgroundColor: '#C92828' },
  botonBlanco: { backgroundColor: 'white' },     
  texto: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textoBlanco: { color: 'white' },                 
  textoRojo: { color: 'black' },
});