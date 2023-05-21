import React, {Component} from "react";
import {  ActivityIndicator, View,StyleSheet,Text,TouchableOpacity } from "react-native";
import ContactList from "../components/ContactList";
import { getContactLisData } from "../api/apiController";


export default class ContactChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // this boolean is Trrue becuase I set
            //contact data has been fetched or not
            //its the checker for the api 
            isLoading: true,
            chats: []  //this holds the contact data
           
        };
    }
    componentDidMount() {
        //called when the screen is focused, it is called once  
        //when the screen is focused by the user
        console.log("Screen reached");
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
      
    }
   
    render() {
        return(
          
          <View>
          <ContactList contacts={this.state.getContactLisData} navigation={this.props.navigation}/>
          </View>
          
        )
        
      }
   
}