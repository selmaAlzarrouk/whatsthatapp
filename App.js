import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';

const App = () => {
  return (
    <View style={styles.container}>
      <SignUp />
      <SignIn />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8bdb6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;





