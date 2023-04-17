import React, {Component} from "react";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator, View,StyleSheet,Text } from "react-native";
import ContactList from "../components/ContactList";
import { getContactList } from "../api/apiController";
import { render } from "react-dom";

export default class ContactsScreen extends Component {
    constructor(props) {
        super(props);


        this.state = {
            // this boolean is Trrue becuase I set
            //contact data has been fetched or not
            //its the checker for the api 
            isLoading: true,
            contactData: []  //this holds the contact data
           
        };
    }

    componentDidMount() {
        //called when the screen is focused, it is called once  
        //when the screen is focused by the user

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

    componentWillUnmount(){
        //called when screen is unfocused
    }
   

    render() {
      
      <View>
        <ContactList contacts = {this.state.contactData}navigation = {this.props.navigation}/>
        </View>
            
    }
}