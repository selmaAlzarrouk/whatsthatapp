import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image  } from 'react-native';
 //Here is my functional component called SignIn. 
 //It uses the useState hook to manage the state of  email and password inputs.
 //The  handleSignIn function is used to deal with  sign-in logic, such as calling an API to authenticate the user.
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // handle sign-in logic here
  };
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/WhatsthatAppLogo.png')}
      />
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
});

export default SignIn;