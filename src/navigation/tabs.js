import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import StackANavigator from './stackA';
import StackBNavigator from './stackB';
import StackCNavigator from './stackC';
import StackDNavigator from './stackD';
import StackENavigator from './stackE';

import { Ionicons } from '@expo/vector-icons';
import logoTab from '../../assets/logoTab.png';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator 
         initialRouteName="Conectar Glouv"
    screenOptions={{ headerShown: false}}>

<Tab.Screen 
        name="Calendario" 
        component={StackCNavigator}
        options={{
          tabBarIcon: () => (
            <Ionicons name="calendar" size={24} color={"black"} />
          ),
        }}
      />

      <Tab.Screen 
        name="Entrenamientos" 
        component={StackANavigator}
        options={{
          tabBarIcon: () => (
            <Ionicons name="flash" size={24} color={"black"} />
          ),
        }}
      />

      <Tab.Screen name="Conectar Glouv" component={StackBNavigator}
      options={{
        tabBarIcon: () => (
            <Image
    source={logoTab}
    style={{ width: 36, height: 36 }}
    resizeMode="contain"
  />
        ),
      }} />

      

      <Tab.Screen 
        name="Torneos" 
        component={StackENavigator}
        options={{
          tabBarIcon: () => (
            <Ionicons name="trophy" size={24} color={"black"} />
          ),
        }}
      />

      <Tab.Screen 
        name="Perfil" 
        component={StackDNavigator}
        options={{
          tabBarIcon: () => (
            <Ionicons name="person" size={24} color={"black"} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}