/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, TextInput,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-elements';
import { PatchChatName } from '../api/apiController';

export default class editChatName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatName: '',
      message: '',
    };
  }

  componentDidMount() {
    this.prepopEditForm();
  }

  updateChatNameHandler = (updateChatName) => {
    this.setState({
      chatName: updateChatName,
    });
  };

  async prepopEditForm() {
    const prevChatName = await AsyncStorage.getItem('editChatName');

    this.setState({ chatName: prevChatName });
  }

  async editChatName() {
    PatchChatName(
      await AsyncStorage.getItem('chatID'),
      { name: this.state.chatName },
      (() => {
        this.setState({ message: 'Chat Name Updated!' });
      }),
      ((err) => {
        this.setState({ message: err });
      }),
    );
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Edit Chat Name..."
          value={this.state.chatName}
          onChangeText={this.updateChatNameHandler}
        />

        <Button
          title="Edit Chat Name"
          onPress={() => this.editChatName()}
        />
        <Text>{this.state.message}</Text>
      </View>
    );
  }
}
