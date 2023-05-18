import React, {Component} from "react";

import MyProfile from "./myProfile";
import UsersScreen from "./UsersScreen";
import BlockedScreen from "./BlockedScreen";
import ContactsScreen from "./ContactScreen";
import ChatScreen from "./ChatScreen";
// Tab and stack nav 
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Tab = createMaterialTopTabNavigator();
const ContactStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();


function ProfileStackNavigator(){
    return(
        <ProfileStack.Navigator
    initialRouteName="Account"
    screenOptions={{ headerShown: false }}>
     <ProfileStack.Screen name="Account" component={MyProfile} />
    </ProfileStack.Navigator>
    )

   
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
    }
  
    //ContactStack
   
    render() {
        return (
            
                <Tab.Navigator
                    initialRouteName="Contacts"
                    screenOptions={{
                        tabBarOptions: {
                            style: { backgroundColor: 'red' },
                            activeTintColor: 'white', // Set the text color of the active tab
                            inactiveTintColor: 'gray'
                        },
                    }}>
                    <Tab.Screen name="Contacts" component={ContactsScreen} />
                    <Tab.Screen name="Chats" component={ChatScreen} />
                    <Tab.Screen name="Profile" component={ProfileStackNavigator} />
                    <Tab.Screen name="Users" component={UsersScreen} />
                    <Tab.Screen name="Blocked" component={BlockedScreen} />

                </Tab.Navigator>
           

        );
}
}


