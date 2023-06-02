/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
// UI react Native elements library:
import { Input, Button, ListItem } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { View, Text } from 'react-native';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createChat } from '../api/apiController';

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      chatName: '',
      error: '',
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
          const err = 'Server Error';
          throw err;
        }
      })
      .then((responseJson) => {
        this.setState({ chats: responseJson });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  createChatHandler = (newChatInstance) => {
    this.setState({ chatName: newChatInstance });
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
        <Text>
          {this.state.error}
        </Text>
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
