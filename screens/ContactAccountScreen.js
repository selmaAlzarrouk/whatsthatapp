import React, { Component } from "react";
import { View, Text} from "react-native";
import { getContactAccount } from "../api/apiController";

export default class ContactAccountScreen extends Component {
    constructor(props) {
        super(props);


        this.state = {
            isLoading: true,
            id: props.route.params.id,
            contactProfile: [] 
              };
    }

    componentDidMount() {
      getContactAccount(this.state.id)
      .then((respJson) => {
        console.log(respJson);
        this.setState({
          isLoading: false,
          contactProfile: respJson,
        });
       // this.handleFetchPicture(this.state.id);
      })
      .catch((er) => {
        console.log(er);
      })        
    }
    
    componentWillUnmount(){
        //called when screen is unfocused
    }
       
    render() {
      return (
        <View style={styles.contactsProfileContainer}>
          <Text>{contactProfile.first_name} {contactProfile.last_name}</Text>
          <Text>{contactProfile.email}</Text>
        </View>
      );
    }
    
   
}