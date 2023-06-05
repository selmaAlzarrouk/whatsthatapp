/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  StyleSheet, Text, TextInput, Image, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@rneui/base';
import {
  getContactAccount, getAccountPhoto, PatchUserData, userLogout,
} from '../api/apiController';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 150,
    height: 150,
    marginBottom: 16,
    borderRadius: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginTop: 16,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 5,
    width: '80%',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  logoutButton: {
    backgroundColor: '#007bff',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: 'green',
  },
});

export default class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: [],
      firstname: '',
      lastname: '',
      email: '',
      message: '',
      profilePhoto: [],

    };
    this.GeneratePatchData = this.GeneratePatchData.bind(this);
    this.sessionLogout = this.sessionLogout.bind(this);
  }

  async getData() {
    getContactAccount(await AsyncStorage.getItem('id'), ((respJson) => {
      this.setState({
        userInfo: respJson,
      }, () => { this.polyfillUpdateForm(); });
    }));
  }

  emailHandler = (updateEmail) => {
    this.setState({
      email: updateEmail,
    });
  };


  async sessionLogout() {
    userLogout(
      (() => {
        this.props.navigation.navigate('SignIn');
      }),
      ((err) => {
        this.setState({ message: err });
      }),
    );
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
      this.getAccountPicture();
    });
  }

  componentWillUnmount() {

  }

  async getAccountPicture() {
    getAccountPhoto(await AsyncStorage.getItem('id'), ((responseblob) => {
      this.setState({
        profilePhoto: window.URL.createObjectURL(responseblob),
      }, () => { console.log(responseblob); });
    }));
  }

  lastnameHandler = (updateLastname) => {
    this.setState({
      lastname: updateLastname,
    });
  };

  firstnameHandler = (updateFirstname) => {
    this.setState({
      firstname: updateFirstname,
    });
  };

  async GeneratePatchData() {
    const dataToSend = {};
    if (this.state.firstname !== this.state.userInfo.first_name) {
      dataToSend.first_name = this.state.firstname;
    }
    if (this.state.lastname !== this.state.userInfo.last_name) {
      dataToSend.last_name = this.state.lastname;
    }
    if (this.state.email !== this.state.userInfo.email) {
      dataToSend.first_name = this.state.email;
    }

    PatchUserData(
      await AsyncStorage.getItem('id'),
      dataToSend,
      (() => {
        this.setState({ message: 'Hurray your updated credentials has been updated' });
        this.getData();
      }),
    );
  }

  polyfillUpdateForm() {
    const updateFirstname = this.state.userInfo.first_name;
    const updateLastname = this.state.userInfo.last_name;
    const updateEmail = this.state.userInfo.email;

    this.setState({ firstname: updateFirstname });
    this.setState({ lastname: updateLastname });
    this.setState({ email: updateEmail });
  }

  render() {
    const {
      firstname, lastname, email, userInfo, profilePhoto, message,
    } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>My Profile Info:</Text>
        {profilePhoto && (
        <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
        )}
        <Button
          title="EditPhoto"
          onPress={() => this.props.navigation.navigate('Photo')}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.saveButton}
        />
        <Text style={styles.info}>{userInfo.first_name}</Text>
        <Text style={styles.info}>{userInfo.last_name}</Text>
        <Text style={styles.info}>{userInfo.email}</Text>

        <Text style={styles.label}>Update First Name:</Text>
        <TextInput
          style={styles.input}
          value={firstname}
          onChangeText={this.firstnameHandler}
        />
        <Text style={styles.label}>Update Last Name:</Text>
        <TextInput
          style={styles.input}
          value={lastname}
          onChangeText={this.lastnameHandler}
        />
        <Text style={styles.label}>Update Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={this.emailHandler}
        />

        <Button
          title="Save"
          onPress={() => this.GeneratePatchData()}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.saveButton}
        />

        <Text style={styles.message}>{message}</Text>

        <Button
          title="Logout"
          onPress={() => this.sessionLogout()}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    );
  }
}
