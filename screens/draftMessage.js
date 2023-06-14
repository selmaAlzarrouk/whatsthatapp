/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View, Text, TouchableOpacity, TextInput,
} from 'react-native';

// Styles
const draftstyles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  btnStyle: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  draftList: {
    alignItems: 'center',
  },
  draftItem: {
    fontSize: 18,
    marginBottom: 10,
  },
};

class draftChatMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatId: props.route.params.chatId,
      chatName: props.route.params.chatName,
      draftMsg: '',
      error: '',
    };
  }

  handleonPress = async () => {
    const { draftMsg } = this.state;
    if (draftMsg.trim().length === 0) {
      this.setState({ error: 'cannot be empty the message' });
      return;
    }
    this.saveDraftMessageHandler();
  };

  saveDraftMessageHandler = async () => {
    try {
      const {
        chatName, chatId, draftMsg,
      } = this.state;
      if (draftMsg.trim().length === 0) {
        this.setState({ error: 'cannot be empty the message' });
      }

      const jsonString = await AsyncStorage.getItem('draftMsgKey');
      const draftMsgs = jsonString ? JSON.parse(jsonString) : [];

      // grabs the last draftId used
      let finalDraftID = 0;
      if (draftMsgs.length > 0) {
        const finalDraft = draftMsgs[draftMsgs.length - 1];
        finalDraftID = finalDraft.draftId;
        console.log(`finalDraftID${finalDraftID}`);
      }
      console.log(`chatId${chatId}`);
      // this will give new draft id by +1 to the last draft id used
      const updatedDraftId = finalDraftID + 1;

      draftMsgs.push({
        chatId,
        draftId: updatedDraftId,
        message: draftMsg,

      });
      await AsyncStorage.setItem('draftMsgKey', JSON.stringify(draftMsgs));
      this.setState({ error: 'This Draft Message has been save!!' });
      this.setState({ draftMsg: '' });
      this.props.navigation.navigate('draftListScreen');
    } catch (error) {
      this.setState({ error: 'Sorry this draft message has not saved try again!' });
    }
  };

  render() {
    const {
      draftMsg,
      chatName,
      error,
    } = this.state;
    return (
      <View>
        <Text>DRAFTS:</Text>
        <Text>
          Draft a message for:
          {' '}
          {chatName}
        </Text>
        <TextInput
          style={draftstyles.textInput}
          value={draftMsg}
          onChangeText={(newDraftMessage) => this.setState({ draftMsg: newDraftMessage })}
          placeholder="Please Enter your draft message..."
          multiline
        />

        <Text style={draftstyles.errorMessage}>{error}</Text>
        <View style={draftstyles.buttonContainer}>

          <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
            <Ionicons name="arrow-back" size="large" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleonPress()}>
            <View style={draftstyles.button}>
              <Text style={draftstyles.buttonText}> save Draft</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('draftListScreen')}>
            <View style={draftstyles.button}>
              <Text style={draftstyles.buttonText}> My Draft List</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>

    );
  }
}
export default draftChatMessage;
