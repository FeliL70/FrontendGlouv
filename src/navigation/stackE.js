import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TorneosListScreen from '../screens/TorneosListScreen';
import CrearTorneoScreen from '../screens/CrearTorneoScreen';
import UnirseTorneoScreen from '../screens/UnirseTorneoScreen';
import MisTorneosScreen from '../screens/MisTorneosScreen';

const StackE = createNativeStackNavigator();

export default function StackENavigator() {
  return (
    <StackE.Navigator screenOptions={{ headerShown: false }}>
      <StackE.Screen name="Torneos" component={TorneosListScreen} />
      <StackE.Screen name="CrearTorneo" component={CrearTorneoScreen} />
      <StackE.Screen name="UnirseTorneo" component={UnirseTorneoScreen} />
      <StackE.Screen name="MisTorneos" component={MisTorneosScreen} />
    </StackE.Navigator>
  );
}
