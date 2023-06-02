/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-elements';
import { editMessage } from '../api/apiController';

export default class EditMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      error: '',
    };
  }

  componentDidMount() {
    this.prepopForm();
  }

  editMessageHandler = (patchMessage) => {
    this.setState({
      message: patchMessage,
    });
  };

  async prepopForm() {
    const prevMsg = await AsyncStorage.getItem('Message');

    this.setState({ message: prevMsg });
  }

  async patchMessage() {
    editMessage(
      await AsyncStorage.getItem('chatID'),
      await AsyncStorage.getItem('messageID'),
      { message: this.state.message },
      (() => {
        this.setState({ error: 'Message Updated!' });
      }),
      ((err) => {
        this.setState({ error: err });
      }),
    );
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Edit message..."
          value={this.state.message}
          onChangeText={this.editMessageHandler}
        />

        <Button
          title="Edit Message"
          onPress={() => this.patchMessage()}
        />
        <Text>{this.state.error}</Text>
      </View>
    );
  }
}
