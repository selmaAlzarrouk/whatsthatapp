/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
// UI react Native elements library:
import { FontAwesome } from '@expo/vector-icons';
import { Input, Button, ListItem } from 'react-native-elements';
import {
  ActivityIndicator, View, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import { TextInput, FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactList from '../components/ContactList';
import { getContactLisData, createChat, getListChats } from '../api/apiController';

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chats: [],
      chatName: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.getData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async getData() {
    console.log('Get Chats lol');
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch('http://localhost:3333/api/1.0.0/chat', {
      method: 'get',
      headers: {
        'x-authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          const error = 'unauthorised';
          throw error;
        } else {
          throw 'Server Error';
        }
      })
      .then((responseJson) => {
        this.setState({ chats: responseJson });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  createChatHandler = (newChatInstance) => {
    this.setState({ chatName: newChatInstance });
    console.log(this.state.chatName);
  };

  createChat = () => {
    createChat(
      this.state.chatName,
      (() => { this.getData(); }),
    );
  };

  singleChatSelect = async (chatID) => {
    await AsyncStorage.setItem('chatID', chatID);
    this.props.navigation.navigate('SingleChat');
  };

  render() {
    return (
      <View>
        <Input
          placeholder="Create new chat"
          value={this.state.chatName}
          onChangeText={this.createChatHandler}
          leftIcon={<FontAwesome name="comment" size={24} color="black" />}
          containerStyle={{ marginBottom: 16 }}
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
        <Button
          title="Create Chat"
          onPress={this.createChat}
          buttonStyle={{ backgroundColor: '#007bff', marginBottom: 16 }}
        />
        <FlatList
          data={this.state.chats}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => this.singleChatSelect(item.chat_id)}
              bottomDivider
              chevron
            >
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.creator.first_name}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
          keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
        />
      </View>
    );
  }
}
