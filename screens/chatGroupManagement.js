/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  StyleSheet,
  View, Text, TouchableOpacity, ScrollView,
} from 'react-native';

import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, ListItem } from 'react-native-elements';

import {
  addUsertoChat, getContactLisData, getSingleChat, deleteUserinChat,
} from '../api/apiController';

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  deleteTxt: {
    color: 'red',
  },
  addText: {
    color: 'green',
  },
});
export default class chatGroupManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatData: [],
      contactData: [],
      error: '',
    };

    this.deleteUser = this.deleteUser.bind(this);
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

  deleteUser = async (userId) => {
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
      <ScrollView>
        <View style={styles.contain}>
          <Text>{this.state.error}</Text>
          <View style={styles.section}>
            <Text style={styles.subheading}>Members In Chats</Text>
            <FlatList
              data={this.state.chatData.members}
              renderItem={({ item }) => (
                <ListItem
                  bottomDivider
                >
                  <ListItem.Content>
                    <ListItem.Title>{`${item.first_name} ${item.last_name}`}</ListItem.Title>
                    <ListItem.Subtitle>{item.email}</ListItem.Subtitle>

                    <TouchableOpacity
                      onPress={() => this.deleteUser(item.user_id)}
                      style={styles.actContainer}
                    >
                      <Icon name="trash" type="font-awesome" color="red" style={styles.icon} />
                      <Text style={styles.deleteTxt}>Delete Contact</Text>
                    </TouchableOpacity>

                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              )}
              keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.subheading}>Friend List</Text>
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

                    <TouchableOpacity onPress={() => this.addUser(item.user_id)} style={styles.actContainer}>
                      <Icon name="user-plus" type="font-awesome" color="green" style={styles.icon} />
                      <Text style={styles.addText}>Add Contact</Text>
                    </TouchableOpacity>

                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              )}
              keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
