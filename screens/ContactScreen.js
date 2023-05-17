import React, { Component } from "react";
import { ActivityIndicator, View, StyleSheet, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { FlatList } from "react-native-web";
import ContactList from "../components/ContactList";
//import { Settings } from '@material-ui/icons';

import { getContactList } from "../api/apiController";
import { render } from "react-dom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getContactLisData } from "../api/apiController";


export default class ContactsScreen extends Component {

    constructor(props) {
        super(props);
      /* */  this.state = {

            
        };
    }
    componentDidMount() {
        getContactLisData( (() => {
            this.setState({ message: "Hurray your updated credentials has been updated" })
            this.getData();
        }))
        
        }
       
    componentWillUnmount() {
        //called when screen is unfocused
        this.unsubscribe();
    }

    render() {
        return (
            //everything inside here
            <View>
               
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

