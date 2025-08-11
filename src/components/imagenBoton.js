import { TouchableOpacity, Image, StyleSheet, Text,View } from 'react-native';

export default function ImagenBoton({ imagenDeBoton, texto, onPress, desc }) {
  return (
     <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imagenDeBoton }} style={styles.imagen} />
        <View style={styles.textoContainer}>
          <Text style={styles.texto}>{texto}</Text>
          <Text style={styles.desc}>{desc}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    width: 345,
    height: 230,
  },
  imagen: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  textoContainer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
  texto: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  desc: {
    color: '#D9D9D9',
    fontSize: 14,
    marginTop: 5,
  },
});