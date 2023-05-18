import React, {Component} from "react";
import {  ActivityIndicator, View,StyleSheet,Text,TouchableOpacity } from "react-native";
import ContactList from "../components/ContactList";
import { getContactLisData } from "../api/apiController";
import { createChat } from "../api/apiController";
import { TextInput } from "react-native-web";
import { FlatList } from "react-native-web";
import { getListChats } from "../api/apiController";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            chats: [],
            chatName: "",
        };
    }

    createChatHandler = (newChatInstance) => {
        this.setState({ chatName : newChatInstance})
        console.log(this.state.chatName );
        
    }
    createChat = () => {
       createChat(this.state.chatName,
        (()=>{this.getData()}))
    };

    componentDidMount() {
        this.getData();
    }

    componentWillUnmount(){
      
    }

    async getData(){
        console.log("Get Chats lol")
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        return fetch(`http://localhost:3333/api/1.0.0/chat`, {
            method: `get`,
            headers: {
                'x-authorization': token
            }
        })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
                
            } else if (response.status === 401) {
                throw " Unauthorised"
            } else  {
                throw "Server Error"
            }
        })
        .then((responseJson) => {
            this.setState({chats: responseJson})
        })
        .catch((error) => {
            console.log(error)
        });
    }
   
    render() {
        return(
          <View>
                <TextInput
                    placeholder="create new chat"
                    value={this.state.query}
                    onChangeText={this.createChatHandler}
                />
                <TouchableOpacity onPress={this.createChat}>
                    <Text>Create chat</Text>
                </TouchableOpacity>
                <FlatList   
                    data={this.state.chats}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.name}</Text>
                            <Text>{item.creator.first_name}</Text>
                                
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