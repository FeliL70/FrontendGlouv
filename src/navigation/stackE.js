import { createNativeStackNavigator } from '@react-navigation/native-stack';
import torneosScreen from '../screens/torneosScreen';

const StackE = createNativeStackNavigator();

export default function StackENavigator() {

  return (
    <StackE.Navigator screenOptions={{ headerShown: false}}>
      <StackE.Screen name="Torneos" component={torneosScreen} />
    </StackE.Navigator>
  );
}