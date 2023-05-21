import React, { Component } from 'react';
import {
  ActivityIndicator, View, StyleSheet, Text, TextInput, TouchableOpacity, Button,
} from 'react-native';
import { FlatList } from 'react-native-web';
import { render } from 'react-dom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactList from '../components/ContactList';
import { getSingleChat, getContactList, PatchChatName } from '../api/apiController';
// import { Settings } from '@material-ui/icons';
import { sendMessage } from '../api/apiController';
import { deleteMessage } from '../api/apiController';


export default class singleChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chatData: [],
      message: '',
      user_id: 0,
      error: '',
    };

    this.editMsg = this.editMsg.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  }

  componentWillUnmount() {

  }

  async getData() {
    getSingleChat(
      await AsyncStorage.getItem('chatID'),
      ((response) => { this.setState({ chatData: response }); }),
    );
  }

  messageHandler = (newMessage) => {
    this.setState({ message: newMessage });
    console.log(this.state.message);
  };

  sendMessage = async () => {
    sendMessage(
      await AsyncStorage.getItem('chatID'),
      this.state.message,
      (() => { this.getData(); }),
    );
  };

  editMsg = async (messageID) => {
    await AsyncStorage.setItem('messageID', messageID);
    this.props.navigation.navigate("editMessage");
  }

  
  deleteMsg = async (messageID) => {
      deleteMessage(await AsyncStorage.getItem('chatID'),messageID,
      (()=>{this.getData()}),
      ((err) => {
        this.setState({ error: err });
      }))
      
  }

  render() {
    return (
    // everything inside here
      <View>
        <Text>
          {' '}
          Welcome to
          {' '}
          {this.state.chatData.name}
        </Text>
        <Button
          title="Edit Chat Name"
          onPress={() => { this.props.navigation.navigate('editChat'); }}
        />
        <Button
          title="Edit Group Members"
          onPress={() => { this.props.navigation.navigate('editMembers'); }}
        />
        <TextInput
          placeholder="new Message"
          value={this.state.message}
          onChangeText={this.messageHandler}
        />
        <TouchableOpacity onPress={this.sendMessage}>
          <Text>sEND Message</Text>
        </TouchableOpacity>

        <FlatList
          data={this.state.chatData.messages}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item.message}
                {' '}
                {item.author.first_name}
                {item.timestamp}
              </Text>
              <TouchableOpacity onPress={() => this.deleteMsg(item.message_id)}>
                <Text>Delete Message</Text>

              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.editMsg(item.message_id)}>
                <Text>Edit Message</Text>
              </TouchableOpacity>

            </View>
          )}
          keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
        />

      </View>

    );
  }
}
