/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import { FlatList } from 'react-native-web';
// import { Settings } from '@material-ui/icons';
// UI react native cwk 10%
import { Icon, ListItem } from 'react-native-elements';

import {
  getBlockedContacts, unblockContact,
} from '../api/apiController';

export default class BlockedScreen extends Component {
  constructor(props) {
    super(props);
    /* */ this.state = {

      blockedArr: [],
      message: '',

    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  }

  componentWillUnmount() {
    // called when screen is unfocused
    this.unsubscribe();
  }

  getData() {
    getBlockedContacts(((responseJson) => {
      this.setState({ blockedArr: responseJson });
    }));
  }

  unblockContactHandler = (id) => {
    unblockContact(
      id,
      (() => {
        this.getData();
        this.setState({ message: 'Contact has been unblocked' });
      }),
    );
  };

  render() {
    return (
      <View>
        <Text>Blocked Contacts:</Text>

        <FlatList
          data={this.state.blockedArr}
          renderItem={({ item }) => (
            <ListItem
              bottomDivider
            >
              <Icon name="lock" type="font-awesome" color="green" />
              <ListItem.Content>
                <ListItem.Title>{`${item.first_name} ${item.last_name}`}</ListItem.Title>
                <TouchableOpacity onPress={() => this.unblockContactHandler(item.user_id)}>
                  <Text style={{ color: 'green' }}>Unblock Contact</Text>
                </TouchableOpacity>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
          keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
        />
        <Text>{this.state.message}</Text>
      </View>
    );
  }
}
