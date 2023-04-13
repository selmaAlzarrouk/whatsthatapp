import React, { Component, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, FlatList } from 'react-native';
import { ScrollView } from 'react-native-web';


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
    const validator =
      require("email-validator");
   //const password_regex = new password_regex(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/);
    const REGEX_PASS = new RegExp(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/);

    if (!(this.state.email &&
      this.state.password &&
      this.state.firstname &&
      this.state.lastname &&
      this.state.confirmpassword)) {
      console.log("User you must Fill in all the feilds to continue");
    }
    else if (!validator.validate(this.state.email)) {
      console.log("Email must be in a valid formate to proceed");
    }
    else if (!(REGEX_PASS.test(this.state.password))) {
     console.log("User the password isnt strong enough");
     }else{
      //this will point to the  signupRequest  that deals with the request
      this.signupRequest();
    }
  }

  firstnameHandler = (fn) =>{
    this.setState({
      firstname: fn
    })
   
  }
  lastnameHandler = (ln) =>{
    this.setState({
      lastname: ln
    })
   
  }

  passwordHandler = (pass) =>{
    this.setState({
      password: pass
    })
    console.log("password: " + this.state.password)
  }
  emailHandler = (newEmail) =>{
    this.setState({
      email: newEmail
    })
    console.log("email: " + this.state.email)
  }

  confirmpasswordHandler = (cpass) =>{
    this.setState({
      confirmpassword: cpass
    })
    console.log("password: " + this.state.password)
  }

  //makes the request to the api , handles the response of when a user signs up 
  signupRequest = () =>{
    const data = {

      first_name :this.state.firstname,
      last_name :this.state.lastname,
      email:this.state.email,
      password: this.state.password,
      
    };
    fetch('http://localhost:3333/api/1.0.0/user',{
      method: 'post',
      headers:{
        'content-type': 'application/json',
       },
       body: JSON.stringify(data),
    })
    //handling the response 
    .then((response)=>{
      if(response.status ==400){
        this.setState({error: "Bad Request, Please try again follow the registation form thank you"});
      }else if(response.status ==500){
        this.setState({error: "Hmmm something went wrong here , server has failed!"});
    }else{
        this.props.navigation.navigate('SignIn');
    }
}) 

  
  }

  
  // handle sign-up logic here
  render() {
    return (

      <ScrollView>
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
          value={this.state.password}
          onChangeText={this.passwordHandler}
        />
          <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={this.state.confirmpassword}
          onChangeText={this.confirmpasswordHandler}
        />
       
        <Button title="Sign Up" onPress={this._validateInputs} />
      </ScrollView>
    ); 
  };
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