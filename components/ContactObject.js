import React from "react";
import { render } from "react-dom";
import { View,Text, TouchableOpacity } from "react-native";

const ContactObject =({contact, navigation})=>{
    console.log("The Contact_id is:"+ contact.user_id);
   
   
     return(
        <View style ={styles.contactsLine}>
        <Text>{contact.first_name} {contact.last_name}</Text>
        <View style ={styles.deleteButton}>
        <TouchableOpacity onPress={()=> navigation.navigate("Contact Profile",{id: contact.user_id })}>
    <View style={styles.button}> 
      <Text style ={styles.buttonText}>Profile</Text>
      
      </View>
        </TouchableOpacity>
     
    </View>
    </View>
     
     
    );
}
export default ContactObject;
