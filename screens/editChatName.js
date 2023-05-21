import React, { Component } from 'react';
import {
  ActivityIndicator, View, StyleSheet, Text, TextInput, TouchableOpacity, Image,
} from 'react-native';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PatchChatName } from '../api/apiController';
import { Button } from 'react-native-elements';

export default class editChatName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatName: '',
      message: '',
    };
  }

  async editChatName() {
    PatchChatName(
      await AsyncStorage.getItem('chatID'),
      { name: this.state.chatName },
      (() => {
        console.log('This is working');
        this.setState({message: 'Chat Name Updated!'})
      }),
      ((err) => {
        this.setState({ message: err });
      }),
    );
  }

  updateChatNameHandler = (updateChatName) => {
    this.setState({
      chatName: updateChatName,
    });
    console.log(this.state.chatName);
  };

  render() {
    return (
      <View>
        <TextInput
        placeholder='Edit Chat Name...'
          value={this.state.chatName}
          onChangeText={this. updateChatNameHandler}
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
