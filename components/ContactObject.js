import React from "react";
import { View,Text, TouchableOpacity,StyleSheet } from "react-native";

const ContactObject =({contact, navigation})=>{
    console.log("The Contact_id is:"+ contact.user_id);
   
   
     return(
        <View style ={styles.contactsLine}>
        <Text>{contact.first_name} {contact.last_name}</Text>
        <View style ={styles.deleteButton}>
        <TouchableOpacity onPress={()=> navigation.navigate("ContactAccountScreen",{id: contact.user_id })}>
    <View style={styles.button}> 
      <Text style ={styles.buttonText}>Profile</Text>
      
      </View>
        </TouchableOpacity>
     
    </View>
    </View>
     
     
    );
}






const styles = StyleSheet.create({

  deleteButton:{



  },
buttonText:{




  },
  contactsLine: {
      //css styles here
          flex: 1,
        justifyContent: 'center',
      alignItems: 'center',
    
    }  
    
  }
  )
export default ContactObject;
