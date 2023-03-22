import React, { Component, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';

var validator = require("email-validator");
validator.validate("test@gmail.com"); //true

//Here is my functional component called SignIn. 
//It uses the useState hook to manage the state of  email and password inputs.
//The  handleSignIn function is used to deal with  sign-in logic, such as calling an API to authenticate the user.
class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      submitted: false,
      error: ""

    }
  }

  //Email Handler - this will change the value of the email state
  emailHandler = (newEmail) =>{
    this.setState({
      email: newEmail
    })
    console.log("email: " + this.state.email)
  }

  passwordHandler = (pass) =>{
    this.setState({
      password: pass
    })
    console.log("password: " + this.state.password)
  }
  // handle sign-in logic here
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
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


        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Need an account? Click here</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
}
}
