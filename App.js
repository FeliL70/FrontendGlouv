import { NavigationContainer } from '@react-navigation/native';

import MyTabs from './src/navigation/tabs';
import AuthStack from './src/navigation/AuthStack';
import { AuthProvider, useAuth } from './src/context/AuthContext';

function MainApp() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user ? <MyTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
