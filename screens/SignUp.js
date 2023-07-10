/* eslint-disable global-require */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Input, Button } from 'react-native-elements';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmpassword: '',
      error: '',
    };
  }

  validateInputs = () => {
    // eslint-disable-next-line global-require
    const validator = require('email-validator');
    const expression = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    const REGEX_PASS = new RegExp(expression);

    if (!(this.state.email
            && this.state.password
            && this.state.firstname
            && this.state.lastname
            && this.state.confirmpassword)) {
      return 'User you must Fill in all the feilds to continue';
    }

    if (!validator.validate(this.state.email)) {
      return 'Email must be in a valid formate to proceed';
    }
    if (!REGEX_PASS.test(this.state.password)) {
      return "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long";
    }
    return '';
  };

  firstnameHandler = (fn) => {
    this.setState({
      firstname: fn,
    });
  };

  lastnameHandler = (ln) => {
    this.setState({
      lastname: ln,
    });
  };

  passwordHandler = (pass) => {
    this.setState({
      password: pass,
    });
  };

  emailHandler = (newEmail) => {
    this.setState({
      email: newEmail,
    });
  };

  confirmpasswordHandler = (cpass) => {
    this.setState({
      confirmpassword: cpass,
    });
  };

  // makes the request to the api , handles the response of when a user signs up

  signupRequest = () => {
    const error = this.validateInputs();
    if (error) {
      this.setState({ error });
      return;
    }

    const data = {

      first_name: this.state.firstname,
      last_name: this.state.lastname,
      email: this.state.email,
      password: this.state.password,

    };

    fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    // handling the response
      .then((response) => {
        if (response.status === 201) {
          this.props.navigation.navigate('SignIn'); // CREATED account DO !!
        }
        if (response.status === 400) {
          this.setState({ error: 'Bad Request, Please try again follow the registation form thank you' });
        } else if (response.status === 500) {
          this.setState({ error: 'Hmmm something went wrong here , server has failed!' });
        }
      });
  };

  // handle sign-up logic here
  render() {
    return (
      <ScrollView>
        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
          <Ionicons name="arrow-back" size={32} />
        </TouchableOpacity>
        <Image
          style={{
            width: 145, height: 145, alignSelf: 'center', marginTop: 30,
          }}
          source={require('../assets/whatsThatLogo.png')}
        />
        <Text style={{
          textAlign: 'center', marginTop: 10, marginBottom: 20, fontSize: 24,
        }}
        >
          Sign Up
        </Text>
        <Input
          placeholder="First name"
          leftIcon={{ type: 'ionicon', name: 'person' }}
          value={this.state.firstname}
          onChangeText={this.firstnameHandler}
          inputStyle={{ fontSize: 16 }}
          containerStyle={{ marginBottom: 10 }}
        />
        <Input
          placeholder="Last name"
          leftIcon={{ type: 'ionicon', name: 'person' }}
          value={this.state.lastname}
          onChangeText={this.lastnameHandler}
          inputStyle={{ fontSize: 16 }}
          containerStyle={{ marginBottom: 10 }}
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
        <Input
          placeholder="Confirm Password"
          secureTextEntry
          leftIcon={{ type: 'ionicon', name: 'lock-closed' }}
          value={this.state.confirmpassword}
          onChangeText={this.confirmpasswordHandler}
          inputStyle={{ fontSize: 20 }}
          containerStyle={{ marginBottom: 12 }}
        />
        <Button
          title="Sign Up"
          buttonStyle={{ marginVertical: 20, marginHorizontal: 50 }}
          onPress={this.signupRequest}
        />
        <Text style={{ textAlign: 'center', color: 'red', marginTop: 10 }}>
          {this.state.error}
        </Text>
      </ScrollView>
    );
  }
}

export default SignUp;
