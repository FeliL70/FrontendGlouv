import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Header({ titulo, showBack = false}) {

  const navigation = useNavigation();

   return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
        )}
        <Text style={styles.text}>{titulo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#272727',
    },

  header: {
    height: 100,
    width: '100%',
    paddingBottom: 14,
    backgroundColor: '#272727',

    justifyContent: 'flex-end',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 8,
    shadowOpacity: 0.8,

    
  },
  text: {
    position: 'absolute',
    textAlign:'center',
    marginBottom: 10,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 10,    
    padding: 12,
  },
});