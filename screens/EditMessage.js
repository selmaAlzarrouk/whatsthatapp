import React, { Component } from 'react';
import {
  ActivityIndicator, View, StyleSheet, Text, TextInput, TouchableOpacity, Image,
} from 'react-native';
import { FlatList } from 'react-native-web';
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
  componentDidMount(){
  this.prepopForm();
  }
  async  prepopForm() {
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

  editMessageHandler = (patchMessage) => {
    this.setState({
      message: patchMessage,
    });
  };

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
