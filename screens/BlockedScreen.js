/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import { FlatList } from 'react-native-web';
// import { Settings } from '@material-ui/icons';

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
      this.setState({ blockedArr: responseJson }, () => { console.log(this.state.blockedArr); });
    }));
  }

  unblockContactHandler = (id) => {
    unblockContact(
      id,
      (() => {
        this.getData();
        this.setState({ message: 'Contact has been deleted' });
      }),
    );
  };

  render() {
    return (

      <View>

        <FlatList
          data={this.state.blockedArr}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item.first_name}
                {' '}
                {item.last_name}
              </Text>
              <TouchableOpacity onPress={() => this.unblockContactHandler(item.user_id)}>
                <Text>Unblock Contact</Text>

              </TouchableOpacity>

            </View>
          )}
          keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
        />
        <Text>{this.state.message}</Text>

      </View>

    );
  }
}
