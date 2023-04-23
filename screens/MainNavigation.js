import React, {Component} from "react";
import ContactsScreen from "./ContactScreen";
import ContactAccountScreen from "./ContactScreen";
// Tab and stack nav 
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createMaterialTopTabNavigator();
const ContactStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();
function ContactStackNavigator(){
    return (
        <ContactStack.Navigator
            initialRouteName="Contacts"
            screenOptions={{ headerShown: false }}>
               
            <ContactStack.Screen name="ContactsScreen" component={ContactsScreen} />
            <ContactStack.Screen name="ContactAccountScreen" component={ContactAccountScreen} />
        </ContactStack.Navigator>
    )
}


function ProfileStackNavigator(){
    //my Profile  stack code here 
}
function ChatStackNavigator(){
    //my chat stack code here 
} export default class MainNavigation extends Component {

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
                    <Tab.Screen name="Contacts" component={ContactStackNavigator} />
                    <Tab.Screen name="Chats" component={ChatStackNavigator} />
                    <Tab.Screen name="Profile" component={ProfileStackNavigator} />

                </Tab.Navigator>
           

        );
}
}


