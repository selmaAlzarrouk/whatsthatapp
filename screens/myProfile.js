import React, { Component } from "react";
import { ActivityIndicator, View, StyleSheet, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { FlatList } from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getContactAccount } from "../api/apiController";
import { Button } from '@rneui/base';
import { PatchUserData } from "../api/apiController";
import { userLogout } from "../api/apiController";
import { getAccountPhoto } from "../api/apiController";

export default class MyProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: [],
            firstname: "",
            lastname: "",
            email: "",
            message: "",
            profilePhoto: [],

        };
        this.GeneratePatchData = this.GeneratePatchData.bind(this); //this types thiw binds to this period 
        this.sessionLogout = this.sessionLogout.bind(this);
    }
    firstnameHandler = (updateFirstname) => {
        this.setState({
            firstname: updateFirstname
        })
        console.log(this.state.firstname);
    }

    lastnameHandler = (updateLastname) => {
        this.setState({
            lastname: updateLastname
        })
    }

    emailHandler = (updateEmail) => {
        this.setState({
            email: updateEmail
        })
    }



    polyfillUpdateForm() {
        const updateFirstname = this.state.userInfo.first_name;
        const updateLastname = this.state.userInfo.last_name;
        const updateEmail = this.state.userInfo.email;

        this.setState({ firstname: updateFirstname })
        this.setState({ lastname: updateLastname })
        this.setState({ email: updateEmail })

    }
    async GeneratePatchData() {
        const dataToSend = {};
        //the json gets sent to the server
        //the value stored in the first name state compae it OG data  if not the same then just add the new value into this const dataToSend
        if (this.state.firstname !== this.state.userInfo.first_name) {
            dataToSend.first_name = this.state.firstname;
        }
        if (this.state.lastname !== this.state.userInfo.last_name) {
            dataToSend.last_name = this.state.lastname;
        }
        if (this.state.email !== this.state.userInfo.email) {
            dataToSend.first_name = this.state.email;
        }
        console.log(dataToSend);
        PatchUserData(await AsyncStorage.getItem('id'),
            dataToSend,
            (() => {
                this.setState({ message: "Hurray your updated credentials has been updated" })
                this.getData();
            }));
    }
    async sessionLogout() {
        userLogout(
            (() => {
                console.log("This is working");
                this.props.navigation.navigate("SignIn");
            }),
            ((err) => {
                this.setState({message: err})
            })
        );
    }

    async getAccountPicture() {
        getAccountPhoto(await AsyncStorage.getItem('id'), ((responseblob) => {
            this.setState({
                profilePhoto: window.URL.createObjectURL(responseblob),
            
            }, ()=>{console.log(responseblob)})
        }));
    }


    async getData() {
        getContactAccount(await AsyncStorage.getItem('id'), ((respJson) => {
            this.setState({
                userInfo: respJson
            }, () => { this.polyfillUpdateForm() })
        }));
    }

    async componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getData();
            this.getAccountPicture();
        })
    }
    componentWillUnmount() {

    }


    render() {
        return (

            <View>
                <Text>My Profile Info: </Text>
                <Image source={{uri: this.state.profilePhoto}} style={{width: 150, height: 150}}/>
                <Text>{this.state.userInfo.first_name}</Text>
                <Text>{this.state.userInfo.last_name}</Text>
                <Text>{this.state.userInfo.email}</Text>

                <Text>update First name</Text>
                <TextInput value={this.state.firstname} onChangeText={this.firstnameHandler} />
                <Text>update Fname</Text>
                <TextInput value={this.state.lastname} onChangeText={this.lastnameHandler} />
                <TextInput value={this.state.email} onChangeText={this.emailHandler} />


                <Button radius={'large'} type="solid" onPress={this.GeneratePatchData}>
                    Save

                </Button>
                <Text>{this.state.message}</Text>
                <Button radius={'large'} type="solid" onPress={this.sessionLogout}>
                    Logout

                </Button>

            </View>

        )

    }
}

