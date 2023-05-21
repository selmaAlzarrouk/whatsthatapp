/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyProfile from './myProfile';
import UsersScreen from './UsersScreen';
import BlockedScreen from './BlockedScreen';
import ContactsScreen from './ContactScreen';
import ChatScreen from './ChatScreen';
import singleChatScreen from './singleChatScreen';
import editChatName from './editChatName';
import EditMessage from './EditMessage';
import { editMessage } from '../api/apiController';
// Tab and stack nav

const Tab = createMaterialTopTabNavigator();
const ProfileStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
      initialRouteName="Account"
      screenOptions={{ headerShown: false }}
    >
      <ProfileStack.Screen name="Account" component={MyProfile} />
    </ProfileStack.Navigator>
  );
}

function ChatsStackNavigator() {
  return (
    <ChatStack.Navigator
      initialRouteName="Chat"
      screenOptions={{ headerShown: false }}
    >
      <ChatStack.Screen name="Chat" component={ChatScreen} />
      <ChatStack.Screen name="SingleChat" component={singleChatScreen} />
      <ChatStack.Screen name="editChat" component={editChatName}/>
      <ChatStack.Screen name="editMessage" component={EditMessage}/>
    </ChatStack.Navigator>
  );
}

export default class MainNavigation extends Component {
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  // ContactStack

  render() {
    return (

      <Tab.Navigator
        initialRouteName="Contacts"
        screenOptions={{
          tabBarOptions: {
            style: { backgroundColor: 'red' },
            activeTintColor: 'white', // Set the text color of the active tab
            inactiveTintColor: 'gray',
          },
        }}
      >
        <Tab.Screen name="Contacts" component={ContactsScreen} />
        <Tab.Screen name="Chats" component={ChatsStackNavigator} />
        <Tab.Screen name="Profile" component={ProfileStackNavigator} />
        <Tab.Screen name="Users" component={UsersScreen} />
        <Tab.Screen name="Blocked" component={BlockedScreen} />

      </Tab.Navigator>

    );
  }
}
