import React, { Component, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, FlatList } from 'react-native';
import { signupUser } from '../api/apiClient';


class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
      submitted: false,
      error: ""
    }
  }
  _validateInputs = () => {
    var validator =
      require("email-validator");
    const REGEX_PASS = new
      RegExp("^(?=.*?[A-Z])(?=.*?[a-z)(?=.*?[0-9])(?[#?!@$%^&*-]).{8,}$")

<<<<<<< Updated upstream
    if (!(this.state.email &&
      this.state.password &&
      this.state.firstname &&
      this.state.lastname &&
      this.state.confirmpassword)) {
      return "User you must Fill in all the feilds to continue";
    }
    if (!validator.validate(this.state.email)) {
      return "Email must be in a valid formate to proceed";
    }
    if (REGEX_PASS.test(this.state.password)) {
      return "User the password isnt strong enough";
    }
  }

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
  // handle sign-up logic here
  render() {
    return (

      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../assets/WhatsthatAppLogo.png')}
        />
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="First name"
          value={this.state.firstname}
          onChangeText={this.firstnameHandler} 
        />
      
      <TextInput
          style={styles.input}
          placeholder="Last name"
          value={this.state.lastname}
          onChangeText={this.lastnameHandler} 
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
          value={this.state.confirmpassword}
          onChangeText={this.passwordHandler}
        />
          <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={this.state.confirmpassword}
          onChangeText={this.passwordHandler}
        />
       
        <Button title="Sign Up" onPress={signupUser} />
      </View>
    ); 
  };
}
=======
  
          // handle sign-up logic here

     
            render(){
              return (

              <View style={styles.container}>
              <Image
                style={styles.logo}
                source={require('../assets/WhatsthatAppLogo.png')}
              />
              <Text style={styles.title}>Sign Up</Text>
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
              <Button title="Sign Up" onPress={handleSignUp} />
            </View>
          );
        }
      
    
      }

>>>>>>> Stashed changes
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

export default SignUp;