import React, { Component } from "react";
import { ActivityIndicator, View, StyleSheet, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { FlatList } from "react-native-web";
import ContactList from "../components/ContactList";
//import { Settings } from '@material-ui/icons';

import { getContactList } from "../api/apiController";
import { render } from "react-dom";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default class ContactsScreen extends Component {

    constructor(props) {
        super(props);
      /* */  this.state = {
            // this boolean is Trrue becuase I set
            //contact data has been fetched or not
            //its the checker for the api 
            isLoading: true,
            contactData: [],  //this holds the contact data
            query: ``,
            limit: 20,
            offset: 0,
            userList: [],
            message: '',
            user_id : 0
        };
    }
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', ()=>{
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
        })
        //called when the screen is focused, it is called once  
        //when the screen is focused by the user
     
    }
    componentWillUnmount() {
        //called when screen is unfocused
        this.unsubscribe();
    }




/**
 * 
 * @returns 
 */
/* I AM HERE : 
    //Will add a user to the logged in users list of contacts
    //  basically pass in an argument into the this.addContact function
    async addContact() { //perfromes fetch req for users
        return fetch('http://localhost:3333/api/1.0.0/user/{user_id}/contact', {
            method: 'post',
            headers: {
                'x-authorization': await AsyncStorage.getItem('whatsthat_session_token'),
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // code to add the contact
                this.setState({ message: 'Added to Contacts' })
                
            })
            .catch((error) => {
                console.log(error);

            })
    }
    */
    async addContact() {
        
        try {
            const token = await AsyncStorage.getItem('whatsthat_session_token');
            const response = await fetch('http://localhost:3333/api/1.0.0/user/'+this.state.user_id+'/contact', {
                method: 'post',
                headers: {
                    'x-authorization': token,
                },
            });
    
            if (response.status === 200) {
                const responseJson = await response.json();
                // code to add the contact
                this.setState({ message: 'Added to Contacts' })
            } else if (response.status === 400) {
                throw 'You can\'t add yourself as a contact';
            } else if (response.status === 401) {
                throw 'Unauthorized';
            } else if (response.status === 404) {
                throw 'Not Found';
            } else if (response.status === 500) {
                throw 'Server Error';
            } else {
                throw 'Something went wrong';
            }
        } catch (error) {
            console.log(error);
        }
    }


    addingContactHandler = (id) => {
        this.setState({ user_id: id }, () => {
            this.addContact();
        });
    };

    fetchNewPage = ()=>{
        const newOffset = this.state.offset +3;
        this.setState({offset : newOffset },() => this.getData());

    
     }

     fetchPreviousPage = ()=>{
        const newOffset = this.state.offset-3;  
        this.setState({offset : newOffset },() => this.getData());  
     }

    // this will deal with the search of users 
    async getData() { //perfromes fetch req for users
        //The search function sends a fetch request to a local server at URL endpoint
        //passing the search query as a parameter in the URL :>
        return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.query}&limit=3&offset=${this.state.offset}`, {
            method: `GET`,
            headers: {
                //request is authenticated with a session token retrieved from the device's AsyncStorage. 

                'x-authorization': await AsyncStorage.getItem('whatsthat_session_token'),
            },
        })
            .then((response) => response.json())
            //The response is expected to be in JSON format and is stored in the component's state 
            //under the userList key.
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

    //queryHandler function updates the state with latest search query entered in the text input field,
    //then the searchUsers function calls the getData function to fetch the results.
    queryHandler = (searchQuery) => {
        this.setState({ query: searchQuery })
        console.log(this.state.query
        );
    }
    searchUsers = () => {
        this.getData();
    };
    //the component renders a FlatList to display the list of users returned by the search query.
    // The FlatList component receives the userList array as data and iterates through it to render each user's details.
    // Each user is rendered as a View containing their given name, family name, and email.
    // The keyExtractor function extracts the unique id field 
    //from each user object or uses the index as a fallback if the id field is not available.
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
                            <Text>{item.given_name}  {item.family_name}</Text>
                            <Text>{item.email}</Text>

                            <TouchableOpacity onPress={() => this.addingContactHandler(item.user_id)}>
                            <Text>Add  to Contact</Text>
                            </TouchableOpacity>
                            <Text>{this.state.message}</Text>
                        </View>
                    )}
                    keyExtractor={({ id }, index) => id ? id.toString() : index.toString()}
                />

                <TouchableOpacity onPress={this.fetchPreviousPage}>
                <Text>Previous</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={this.fetchNewPage}>
                <Text>Next</Text>
                </TouchableOpacity>


            </View>

        )

    }
}

