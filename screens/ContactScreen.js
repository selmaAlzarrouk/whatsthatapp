import React, { Component } from 'react';
import {
  ActivityIndicator, View, StyleSheet, Text, TextInput, TouchableOpacity, Button,
} from 'react-native';
import { FlatList } from 'react-native-web';
import { render } from 'react-dom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactList from '../components/ContactList';
import { getContactLisData, getContactList, blockContact } from '../api/apiController';
// import { Settings } from '@material-ui/icons';

// import { getContactLisData } from "../api/apiController";
import { deleteContact } from '../api/apiController';

export default class ContactsScreen extends Component {
  constructor(props) {
    super(props);
    /* */ this.state = {
      contactArr: [],
      message: '',

    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.getData();
      console.log('Contact Screen Reached!');
    });
  }

  componentWillUnmount() {
    // called when screen is unfocused
    this.unsubscribe();
  }

  async getData() {
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch('http://localhost:3333/api/1.0.0/contacts', {
      method: 'GET',
      headers: {
        'x-authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw ' Unauthorised';
        } else {
          throw 'Server Error';
        }
      })
      .then((responseJson) => {
        this.setState({ contactArr: responseJson });
      })
      .catch((error) => {
        // failure(error);
        console.log(error);
      });
  }

  deleteContactHandler = (id) => {
    deleteContact(
      id,
      (() => {
        this.getData();
        this.setState({ message: 'Contact has been deleted' });
      }),
    );
  };

  blockContactHandler = (id) => {
    blockContact(
      id,
      (() => {
        this.setState({ message: 'Contact has been Blocked' });
        this.getData();
      }),
      ((error) => {
        this.setState({ message: error });
      }),
    );
  };

  render() {
    console.log('ScreenReached');
    return (

    // everything inside here
      <View>
        <Text>Hello World!!!</Text>

        <FlatList
          data={this.state.contactArr}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item.first_name}
                {' '}
                {item.last_name}
              </Text>
              <TouchableOpacity onPress={() => this.deleteContactHandler(item.user_id)}>
                <Text>Delete Contact</Text>

              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.blockContactHandler(item.user_id)}>
                <Text>Block Contact</Text>
              </TouchableOpacity>

            </View>
          )}
          keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
        />
        <Text>{this.state.message}</Text>

      </View>

    );
  }
}
