import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EntrenamientosScreen from '../screens/entrenamientosScreen';
import DetalleEntrenamientoScreen from '../screens/detalleEntrenamientoScreen';
import EntrenamientosTotalesScreen from '../screens/entrenamientosTotalesScreen';
import temporizadorScreen from '../screens/temporizadorScreen';
import cronometroScreen from '../screens/cronometroScreen'
const StackA = createNativeStackNavigator();

export default function StackANavigator() {

  return (
    <StackA.Navigator screenOptions={{ headerShown: false}}>
      <StackA.Screen name="Entrenamientos" component={EntrenamientosScreen} />
       <StackA.Screen name="detalleEntrenamiento" component={DetalleEntrenamientoScreen} />
       <StackA.Screen name="entrenamientosTotales" component={EntrenamientosTotalesScreen} />
       <StackA.Screen name="temporizador" component={temporizadorScreen} />
       <StackA.Screen name="cronometro" component={cronometroScreen} />
    </StackA.Navigator>
  );
}