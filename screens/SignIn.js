/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userLogsin } from '../api/apiController';

const validator = require('email-validator');

validator.validate('test@gmail.com'); // true
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: 342E7,
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
class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'anya@gmail.com',
      password: 'Hello123!',
      error: '',

    };
  }

  // Email Handler - this will change the value of the email state
  emailHandler = (newEmail) => {
    this.setState({
      email: newEmail,
    });
  };

  passwordHandler = (pass) => {
    this.setState({
      password: pass,
    });
  };

  signInRequest = () => {
    const data = {
      email: this.state.email,
      password: this.state.password,

    };

    userLogsin(
      data,
      (async (responseJson) => {
        await AsyncStorage.setItem('whatsthat_session_token', responseJson.token);
        await AsyncStorage.setItem('id', responseJson.id);
        this.props.navigation.navigate('MainNavigation');
      }),
      ((err) => this.setState({ error: err })),
    );
  };

  // handle sign-in logic here
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <Image
          style={styles.logo}
          // eslint-disable-next-line global-require
          source={require('../assets/whatsThatLogo.png')}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={this.state.email}
          onChangeText={this.emailHandler}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={this.state.password}
          onChangeText={this.passwordHandler}
        />
        <Text style={styles.errorMessage}>{this.state.error}</Text>
        <Button title="Sign In" onPress={this.signInRequest} />
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default SignIn;
