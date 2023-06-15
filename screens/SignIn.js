/* eslint-disable global-require */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  TouchableOpacity, Image, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Input, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userLogsin } from '../api/apiController';

const validator = require('email-validator');

validator.validate('test@gmail.com'); // true
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text h4 style={{ marginBottom: 20 }}>
          Sign In
        </Text>
        <Image
          style={{ width: 145, height: 145 }}
          source={require('../assets/whatsThatLogo.png')}
        />

        <Input
          placeholder="Email"
          leftIcon={{ type: 'ionicon', name: 'mail' }}
          value={this.state.email}
          onChangeText={this.emailHandler}
          inputStyle={{ fontSize: 20 }}
          containerStyle={{ marginBottom: 12 }}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          leftIcon={{ type: 'ionicon', name: 'lock-closed' }}
          value={this.state.password}
          onChangeText={this.passwordHandler}
          inputStyle={{ fontSize: 20 }}
          containerStyle={{ marginBottom: 12 }}
        />
        <Text style={{ textAlign: 'center', color: 'red', marginBottom: 10 }}>
          {this.state.error}
        </Text>
        <Button
          title="Sign In"
          buttonStyle={{ marginVertical: 10, marginHorizontal: 50 }}
          onPress={this.signInRequest}
        />
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Ionicons name="person-add" size={15} color="black" style={{ marginRight: 6 }} />
            <Text>Click here if you dont  account to Register</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default SignIn;
