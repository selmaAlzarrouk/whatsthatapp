import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
// here ive imported the create stack navi function to my app ! 
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();  // here i am declaring a new stack navi !
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SignIn'>
        <Stack.Screen name = "SignIn" component={SignIn} />
        <Stack.Screen name = "Register" component={SignUp} />
        </Stack.Navigator>
   
    </NavigationContainer>
  );
};        

export default App;





// implement Navigation stack 
//  implement Styling   - tailwind css 
//  

