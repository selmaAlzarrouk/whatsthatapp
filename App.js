import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import MainNavigation from './screens/MainNavigation';
// here ive imported the create stack navi function to my app ! 
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AuthenticationStack = createNativeStackNavigator();  // here i am declaring a new stack navi !
const App = () => {
  return (
    <NavigationContainer>
      <AuthenticationStack.Navigator initialRouteName='SignIn'>
        <AuthenticationStack.Screen name = "SignIn" component={SignIn} />
        <AuthenticationStack.Screen name = "Register" component={SignUp} />
        <AuthenticationStack.Screen name = "MainNavigation" component={MainNavigation} />
        </AuthenticationStack.Navigator>

    </NavigationContainer>
  );
};

export default App;





// implement Navigation stack 
//  implement Styling   - tailwind css 
//