/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
// UI react native Elements :
import {
  Icon, ListItem, ThemeProvider, Switch,
} from 'react-native-elements';
import {
  ScrollView, Text, TouchableOpacity, FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { blockContact, deleteContact } from '../../api/apiController';

export default class ContactsScreen extends Component {
  constructor(props) {
    super(props);
    /* */ this.state = {
      contactArr: [],
      message: '',
      error: '',
      theme: 'light',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.getData();
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
        }
        if (response.status === 401) {
          const err = 'unauthorised';
          throw err;
        } else {
          const e = 'Server Error';
          throw e;
        }
      })
      .then((responseJson) => {
        this.setState({ contactArr: responseJson });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  deleteContactHandler = (id) => {
    deleteContact(id, () => {
      this.getData();
      this.setState({ message: 'Contact has been deleted' });
    });
  };

  blockContactHandler = (id) => {
    blockContact(
      id,
      () => {
        this.setState({ message: 'Contact has been Blocked' });
        this.getData();
      },
      (error) => {
        this.setState({ message: error });
      },
    );
  };

  toggleTheme = () => {
    this.setState((prevState) => ({
      theme: prevState.theme === 'light' ? 'dark' : 'light',
    }));
  };

  render() {
    const { theme } = this.state;
    const bgColour = theme === 'dark' ? '#000000' : '#ffffff';
    const textColour = theme === 'dark' ? '#ffffff' : '#000000';
    return (
      <ThemeProvider useDark={theme === 'dark'}>
        <ScrollView Style={[{ backgroundColor: bgColour }]}>
          <Text>My Contact List</Text>
          <Text style={[{ color: textColour }]}>{this.state.error}</Text>
          <FlatList
            data={this.state.contactArr}
            renderItem={({ item }) => (
              <ListItem
                onPress={() => this.deleteContactHandler(item.user_id)}
                bottomDivider
              >
                <ListItem.Content>
                  <ListItem.Title>{`${item.first_name} ${item.last_name}`}</ListItem.Title>
                  <ListItem.Subtitle style={[{ color: textColour }]}>
                    {item.email}
                  </ListItem.Subtitle>
                  <TouchableOpacity
                    onPress={() => this.blockContactHandler(item.user_id)}
                  >
                    <Icon name="lock" type="font-awesome" color="red" />
                    <Text style={{ color: 'red' }}>Block Contact</Text>
                  </TouchableOpacity>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            )}
            keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
          />
          <Text>{this.state.message}</Text>

          <Switch value={theme === 'dark'} onValueChange={this.toggleTheme} />
        </ScrollView>
      </ThemeProvider>
    );
  }
}
