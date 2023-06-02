/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem } from 'react-native-elements';

import {
  addUsertoChat, getContactLisData, getSingleChat, deleteUserinChat,
} from '../api/apiController';

export default class chatGroupManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatData: [],
      contactData: [],
      error: '',
    };
  }

  componentDidMount() {
    this.getChatData();
    this.getContactData();
  }

  async getChatData() {
    getSingleChat(
      await AsyncStorage.getItem('chatID'),
      ((response) => { this.setState({ chatData: response }); }),
    );
  }

  async getContactData() {
    getContactLisData(
      ((response) => { this.setState({ contactData: response }); }),
      ((err) => { this.setState({ error: err }); }),
    );
  }

  addUser = async (userId) => {
    addUsertoChat(
      await AsyncStorage.getItem('chatID'),
      userId, (
        () => {
          this.getChatData();
          this.getContactData();
        }),
      (() => {}),
    );
  };

  deletUser = async (userId) => {
    deleteUserinChat(
      await AsyncStorage.getItem('chatID'),
      userId, (
        () => {
          this.getChatData();
          this.getContactData();
        }),
      (() => {}),
    );
  };

  render() {
    return (
      <View>
        <Text>{this.state.error}</Text>
        <FlatList
          data={this.state.chatData.members}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => this.deleteContactHandler(item.user_id)}
              bottomDivider
            >
              <ListItem.Content>
                <ListItem.Title>{`${item.first_name} ${item.last_name}`}</ListItem.Title>
                <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
                <TouchableOpacity onPress={() => this.deletUser(item.user_id)}>
                  <Text style={{ color: 'red' }}>Delete Contact</Text>
                </TouchableOpacity>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
          keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
        />
        <Text>Friend List</Text>
        <FlatList
          data={this.state.contactData}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => this.deleteContactHandler(item.user_id)}
              bottomDivider
            >
              <ListItem.Content>
                <ListItem.Title>{`${item.first_name} ${item.last_name}`}</ListItem.Title>
                <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
                <TouchableOpacity onPress={() => this.addUser(item.user_id)}>
                  <Text style={{ color: 'green' }}>Add Contact</Text>
                </TouchableOpacity>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
          keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
        />
      </View>
    );
  }
}
