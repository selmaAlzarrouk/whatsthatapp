/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyProfile from './myProfile';
import UsersScreen from './UsersScreen';
import BlockedScreen from './BlockedScreen';
import ContactsScreen from './ContactScreen';
import ChatScreen from './ChatScreen';
import singleChatScreen from './singleChatScreen';
import editChatName from './editChatName';
import EditMessage from './EditMessage';
import chatGroupManagement from './chatGroupManagement';
import photoScreen from './photoScreen';
import draftChatMessage from './draftMessage';
import draftListScreen from './draftListScreen';
import editDrafts from './editDrafts';

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
      <ProfileStack.Screen name="Photo" component={photoScreen} />
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
      <ChatStack.Screen name="editChat" component={editChatName} />
      <ChatStack.Screen name="editMessage" component={EditMessage} />
      <ChatStack.Screen name="editMembers" component={chatGroupManagement} />
      <ChatStack.Screen name="draftChatMessage" component={draftChatMessage} />
      <ChatStack.Screen name="draftListScreen" component={draftListScreen} />
      <ChatStack.Screen name="editDrafts" component={editDrafts} />
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

  render() {
    return (

      <Tab.Navigator
        initialRouteName="Contacts"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Contacts') {
              iconName = 'account-box'; // Change to the appropriate icon name from MaterialCommunityIcons
            } else if (route.name === 'Chats') {
              iconName = 'chat';
            } else if (route.name === 'Profile') {
              iconName = 'account';
            } else if (route.name === 'Users') {
              iconName = 'person-add';
            } else if (route.name === 'Blocked') {
              iconName = 'block-helper';
            }
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'white',
          inactiveTintColor: 'black',
          style: {
            backgroundColor: '#007bff',
          },
          labelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
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
