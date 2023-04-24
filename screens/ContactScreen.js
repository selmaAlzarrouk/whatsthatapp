import React, { Component } from "react";
import { ActivityIndicator, View, StyleSheet, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { FlatList } from "react-native-web";
import ContactList from "../components/ContactList";

import { getContactList } from "../api/apiController";
import { render } from "react-dom";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class ContactsScreen extends Component {
    constructor(props) {
        super(props);


        this.state = {
            // this boolean is Trrue becuase I set
            //contact data has been fetched or not
            //its the checker for the api 
            isLoading: true,
            contactData: [],  //this holds the contact data
            query: ``,
            userList: []

        };
    }

    componentDidMount() {
        //called when the screen is focused, it is called once  
        //when the screen is focused by the user
        console.log("Screen reached");
        this.getData();
        // below I want to grab the Contact List data so : 
        getContactList()
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    contactData: responseJson
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    componentWillUnmount() {
        //called when screen is unfocused
        this.unsubscribe();
    }

//Will add a user to the logged in users list of contacts
    async addContact() { //perfromes fetch req for users
        return fetch(`http://localhost:3333/api/1.0.0/user/{user_id}/contact`, {
            method: `POST`,
            headers: {
                'x-authorization': await AsyncStorage.getItem('whatsthat_session_token'),
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    userList: responseJson,

                });
            })
            .catch((error) => {
                console.log(error);

            })
    }
    // this will deal with the search of users 
    async getData() { //perfromes fetch req for users
        return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.query}`, {
            method: `GET`,
            headers: {
                'x-authorization': await AsyncStorage.getItem('whatsthat_session_token'),
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    userList: responseJson,

                });
            })
            .catch((error) => {
                console.log(error);

            })
    }
    queryHandler = (searchQuery) => {
        this.setState({ query: searchQuery })
        console.log(this.state.query
        );
    }

    searchUsers = () =>{
        this.getData();
    };

    render() {
        return (
            //everything inside here
            <View>
                <TextInput
                    placeholder="search here"
                    value={this.state.query}
                    onChangeText={this.queryHandler}
                />
                <Button title="Search" onPress={this.searchUsers} />
                <FlatList
                    data={this.state.userList}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.given_name}{item.family_name}{item.email}</Text>
                        </View>
                    )}
                    keyExtractor={({ id }, index) => id ? id.toString() : index.toString()}
                />
            </View>

        )

    }
}