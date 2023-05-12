import React, { Component, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { userLogsin } from '../api/apiController';



var validator = require("email-validator");
validator.validate("test@gmail.com"); //true

//<ApplicationProvider {...eva} theme={theme}>
  // Your SignIn component code here 


class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "lemon@lime.com",
      password: "Lemonlime123!",
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


  signInRequest = () =>{
    const data = {
        email:this.state.email,
      password: this.state.password,
      
    };
    userLogsin(data)
    .then(() => {
      this.setState({"submitted": false})
      this.setState({"error": ""})
      this.props.navigation.navigate("MainNavigation")
    })
    .catch((error) =>{
      this.setState({"submitted": false})
      this.setState({"error": error});


    });   
  
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
  button: {
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: 342E7 },
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