import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConectarGlouvScreen from '../screens/conectarGlouvScreen';

const StackB = createNativeStackNavigator();

export default function StackBNavigator() {

  return (
    <StackB.Navigator screenOptions={{ headerShown: false}}>
      <StackB.Screen name="Conectar Glouv" component={ConectarGlouvScreen} />
    </StackB.Navigator>
  );
}