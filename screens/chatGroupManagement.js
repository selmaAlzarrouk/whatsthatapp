import React, { Component } from 'react';
import {
  ActivityIndicator, View, StyleSheet, Text, TextInput, TouchableOpacity, Image,
} from 'react-native';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PatchChatName } from '../api/apiController';
import { Button } from 'react-native-elements';
import { ListItem } from 'react-native-elements';
import { addUsertoChat,getContactLisData,getSingleChat,deleteUserinChat } from '../api/apiController';

export default class chatGroupManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
        chatData: [],
        contactData: [],
    };
  }

  componentDidMount(){
    this.getChatData();
    this.getContactData();
  }

  async getChatData() {
    getSingleChat(
      await AsyncStorage.getItem('chatID'),
      ((response) => { this.setState({ chatData: response }); }),
    );
  }

  async getContactData() {
    getContactLisData(
        ((response)=>{this.setState({contactData: response})}),
        ((err)=>{this.setState({error: err})})
    )
  }
  
  addUser = async(user_id) =>{
     addUsertoChat(await AsyncStorage.getItem('chatID'), user_id, (()=>{
      this.getChatData();
    this.getContactData()}),
    (()=>{}))
  }

  deletUser = async(user_id) =>{
    deleteUserinChat(await AsyncStorage.getItem('chatID'), user_id, (()=>{
     this.getChatData();
   this.getContactData()}),
   (()=>{}))
 }

  render() {
    return (
      <View>
        <FlatList
          data={this.state.chatData.members}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => this.deleteContactHandler(item.user_id)}
              bottomDivider
            >
              <ListItem.Content>
                <ListItem.Title>{`${item.first_name} ${item.last_name}`}</ListItem.Title>
                <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
                <TouchableOpacity onPress={() => this.blockContactHandler(item.user_id)}>
                  <Text style={{ color: 'red' }}>Block Contact</Text>
                </TouchableOpacity>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
          keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
        />
        <Text>Friend List</Text>
        <FlatList
          data={this.state.contactData}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => this.deleteContactHandler(item.user_id)}
              bottomDivider
            >
              <ListItem.Content>
                <ListItem.Title>{`${item.first_name} ${item.last_name}`}</ListItem.Title>
                <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
                <TouchableOpacity onPress={() => this.addUser(item.user_id)}>
                  <Text style={{ color: 'green' }}>Add Contact</Text>
                </TouchableOpacity>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
          keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
        />
      </View>
    );
  }
}
