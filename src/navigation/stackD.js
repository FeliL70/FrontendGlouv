import { createNativeStackNavigator } from '@react-navigation/native-stack';
import perfilScreen from '../screens/perfilScreen';

const StackD = createNativeStackNavigator();

export default function StackDNavigator() {

  return (
    <StackD.Navigator screenOptions={{ headerShown: false}}>
      <StackD.Screen name="Perfil" component={perfilScreen} />
    </StackD.Navigator>
  );
}