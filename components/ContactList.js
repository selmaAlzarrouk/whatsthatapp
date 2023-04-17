import React from 'react';
import { View,StyleSheet,FlatList } from 'react-native';
import ContactObject from './ContactObject';

const ContactList = ({ contacts, navigation}) => {

    return(
    <View style= {styles.contsContainer}>
    
    
    <FlatList
     data={contacts}
      renderItem={({item})  =>
      <ContactObject
    contact={item}
    navigation={navigation}
    />}
    keyExtractor={({id}, index) => id ? id.toString() : index.toString()}
     />
</View>
);
}
export default ContactList;
