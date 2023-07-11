/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Icon, ListItem, ThemeProvider, Switch,
} from 'react-native-elements';

import {
  addUsertoChat,
  getContactLisData,
  getSingleChat,
  deleteUserinChat,
} from '../../api/apiController';

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

export default class ChatGroupManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatData: [],
      contactData: [],
      error: '',
      theme: 'light',
    };
  }

  componentDidMount() {
    this.getChatData();
    this.getContactData();
  }

  async getChatData() {
    getSingleChat(await AsyncStorage.getItem('chatID'), (response) => {
      this.setState({ chatData: response });
    });
  }

  async getContactData() {
    getContactLisData(
      (response) => {
        this.setState({ contactData: response });
      },
      (err) => {
        this.setState({ error: err });
      },
    );
  }

  addUser = async (userId) => {
    addUsertoChat(
      await AsyncStorage.getItem('chatID'),
      userId,
      () => {
        this.getChatData();
        this.getContactData();
      },
      () => {},
    );
  };

  deleteUser = async (userId) => {
    deleteUserinChat(
      await AsyncStorage.getItem('chatID'),
      userId,
      () => {
        this.getChatData();
        this.getContactData();
      },
      () => {},
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
        <ScrollView>
          <View
            style={[styles.contain, { backgroundColor: bgColour }]}
            accessible
            accessibilityLabel="Chat Group Management"
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack(null)}
              accessible
              accessibilityLabel="Go Back"
            >
              <Ionicons
                name="arrow-back"
                size={24}
                accessible
                accessibilityLabel="Back Icon"
              />
            </TouchableOpacity>
            <Text
              style={{ color: textColour }}
              accessible
              accessibilityLabel="Error Message"
            >
              {this.state.error}
            </Text>
            <View style={styles.section}>
              <Text
                style={[styles.subheading, { color: textColour }]}
                accessible
                accessibilityLabel="Members In Chats"
              >
                Members In Chats
              </Text>
              <FlatList
                data={this.state.chatData.members}
                renderItem={({ item }) => (
                  <ListItem
                    bottomDivider
                    accessible
                    accessibilityRole="listitem"
                  >
                    <ListItem.Content>
                      <ListItem.Title
                        style={{ color: textColour }}
                        accessible
                        accessibilityLabel={`${item.first_name} ${item.last_name}`}
                      >
                        {`${item.first_name} ${item.last_name}`}

                      </ListItem.Title>
                      <ListItem.Subtitle
                        style={{ color: textColour }}
                        accessible
                        accessibilityLabel={item.email}
                      >
                        {item.email}
                      </ListItem.Subtitle>

                      <TouchableOpacity
                        onPress={() => this.deleteUser(item.user_id)}
                        style={styles.actContainer}
                        accessible
                        accessibilityLabel={`Delete Contact for ${item.first_name}`}
                      >
                        <Icon
                          name="trash"
                          type="font-awesome"
                          color="red"
                          style={styles.icon}
                        />
                        <Text style={[styles.deleteTxt, { color: textColour }]}>
                          Delete Contact
                        </Text>
                      </TouchableOpacity>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                )}
                keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
              />
            </View>
            <View style={styles.section}>
              <Text
                style={[styles.subheading, { color: textColour }]}
                accessible
                accessibilityLabel="Friend List"
              >
                Friend List
              </Text>
              <FlatList
                data={this.state.contactData}
                renderItem={({ item }) => (
                  <ListItem
                    bottomDivider
                    accessible
                    accessibilityRole="listitem"
                  >
                    <ListItem.Content>
                      <ListItem.Title
                        style={{ color: textColour }}
                        accessible
                        accessibilityLabel={`${item.first_name} ${item.last_name}`}
                      >
                        {`${item.first_name} ${item.last_name}`}

                      </ListItem.Title>
                      <ListItem.Subtitle
                        style={{ color: textColour }}
                        accessible
                        accessibilityLabel={item.email}
                      >
                        {item.email}
                      </ListItem.Subtitle>

                      <TouchableOpacity
                        onPress={() => this.addUser(item.user_id)}
                        style={styles.actContainer}
                        accessible
                        accessibilityLabel={`Add Contact for ${item.first_name}`}
                      >
                        <Icon
                          name="user-plus"
                          type="font-awesome"
                          color="green"
                          style={styles.icon}
                        />
                        <Text style={[styles.addText, { color: textColour }]}>
                          Add Contact
                        </Text>
                      </TouchableOpacity>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                )}
                keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
              />
            </View>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={this.toggleTheme}
            accessible
            accessibilityLabel="Toggle Dark Mode"
          />
        </ScrollView>
      </ThemeProvider>
    );
  }
}
