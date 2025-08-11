import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen';
import RegisterScreen from '../screens/registerScreen';
import InicioScreen from '../screens/InicioScreen';
const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Inicio" component={InicioScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}