import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNavigation from './screens/MainNavigation';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';

const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Register" component={SignUp} />
        <Stack.Screen name="MainNavigation" component={MainNavigation} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App;
