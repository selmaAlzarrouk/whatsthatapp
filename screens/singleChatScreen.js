/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity,
  FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { Button, Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import {
  getSingleChat, deleteMessage, sendMessage,
} from '../api/apiController';
// import { Settings } from '@material-ui/icons';

// Styles
const singleChatStyling = {
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  buttonTitle: {
    fontSize: 16,
  },
  messageContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatBubbleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  chatBubble: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '70%', // Adjust this value to your preference
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timestampText: {
    fontSize: 12,
    color: '#000',
    marginTop: 4,
  },
  currentUserBubble: {
    // goesleft design chat bubble
    backgroundColor: '#0078fe',
    padding: 10,
    marginLeft: '45%',
    borderRadius: 20,

    marginTop: 5,
    marginRight: '5%',
    maxWidth: '50%',
    alignSelf: 'flex-end',
  },
  otherUserBubble: {
    // goes Right design chat bubble
    backgroundColor: '#dedede',
    padding: 10,
    marginTop: 5,
    marginLeft: '5%',
    maxWidth: '50%',
    alignSelf: 'flex-start',
    borderRadius: 30,
  },
  currentUserMessageText: {
    color: '#FFF',
  },
  otherUserMessageText: {
    color: '#000',
  },
};

export default class singleChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.unsubscribe();
  }

  async getData() {
    const chatID = await AsyncStorage.getItem('chatID');
    const uid = parseInt(await AsyncStorage.getItem('id'), 10);

    getSingleChat(chatID, (response) => {
      this.setState({
        chatData: response,
        user_id: uid,
      });
    });
  }

  messageHandler = (newMessage) => {
    this.setState({ message: newMessage });
  };

  sendMessage = async () => {
    const newState = this.state;
    sendMessage(
      await AsyncStorage.getItem('chatID'),
      newState.message,
      (() => { this.getData(); }),
    );
  };

  editMsg = async (messageID, message) => {
    await AsyncStorage.setItem('messageID', messageID);
    await AsyncStorage.setItem('Message', message);
    this.props.navigation.navigate('editMessage');
  };

  deleteMsg = async (messageID) => {
    deleteMessage(
      await AsyncStorage.getItem('chatID'),
      messageID,
      (() => { this.getData(); }),
      ((err) => {
        this.setState({ error: err });
      }),
    );
  };

  determineStyle = (id) => {
    if (id === this.state.user_id) {
      return singleChatStyling.currentUserBubble;
    }

    return singleChatStyling.otherUserBubble;
  };

  chatModification = (id, messageId, Message) => {
    if (id === this.state.user_id) {
      return (
        <View>
          <TouchableOpacity
            style={singleChatStyling.iconButton}
            onPress={() => this.deleteMsg(messageId)}
          >
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            style={singleChatStyling.iconButton}
            onPress={() => this.editMsg(messageId, Message)}
          >
            <Ionicons name="create" size={24} color="black" />
          </TouchableOpacity>
        </View>
      );
    }
    return (<View><Text> </Text></View>);
  };

  editChatName = async (editChatName) => {
    await AsyncStorage.setItem('editChatName', editChatName);

    this.props.navigation.navigate('editChat');
  };

  render() {
    return (
      <View style={singleChatStyling.container}>
        <Text style={singleChatStyling.welcomeText}>
          Welcome to
          {' '}
          {this.state.chatData.name}
        </Text>
        <Text>
          {' '}
          {this.state.error}
        </Text>
        <View style={singleChatStyling.buttonContainer}>
          <Button
            title="Edit Chat Name"
            onPress={() => { this.editChatName(this.state.chatData.name); }}
            buttonStyle={singleChatStyling.button}
            titleStyle={singleChatStyling.buttonTitle}
          />
          <Button
            title="Edit Group Members"
            onPress={() => { this.props.navigation.navigate('editMembers'); }}
            buttonStyle={singleChatStyling.button}
            titleStyle={singleChatStyling.buttonTitle}
          />
         

        <FlatList
          data={this.state.chatData.messages}
          renderItem={({ item }) => (
            <View>
              <View style={this.determineStyle(item.author.user_id)}>
                <Text>{item.message}</Text>
                <Text style={singleChatStyling.timestampText}>
                  {moment(item.timestamp).format('DD/MM/YYYY, h:mm a')}
                  {' '}
                </Text>
              </View>
              <View>
                {this.chatModification(item.author.user_id, item.message_id, item.message)}
              </View>
            </View>
          )}
          keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
        />

        <Input
          placeholder="New Message"
          value={this.state.message}
          onChangeText={this.messageHandler}
          rightIcon={(
            <TouchableOpacity onPress={this.sendMessage}>
              <Ionicons name="send" size={27} color="blue" />
            </TouchableOpacity>

          )}
        />
      </View>
    );
  }
}
