/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
} from 'react-native';

// import { Settings } from '@material-ui/icons';
// UI react native cwk 10%
import {
  Icon, ListItem, ThemeProvider, Switch,
} from 'react-native-elements';

import { getBlockedContacts, unblockContact } from '../../api/apiController';

export default class BlockedScreen extends Component {
  constructor(props) {
    super(props);
    /* */ this.state = {
      blockedArr: [],
      message: '',
      theme: 'light',
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
    getBlockedContacts((responseJson) => {
      this.setState({ blockedArr: responseJson });
    });
  }

  unblockContactHandler = (id) => {
    unblockContact(id, () => {
      this.getData();
      this.setState({ message: 'Contact has been unblocked' });
    });
  };

  toggleTheme = () => {
    this.setState((prevState) => ({
      theme: prevState.theme === 'light' ? 'dark' : 'light',
    }));
  };

  render() {
    const { theme } = this.state;
    const bgColour = theme === 'dark' ? '#000000' : '#ffffff';
    const textColour = theme === 'dark' ? '#ffffff' : '#000000';

    return (
      <ThemeProvider useDark={theme === 'dark'}>
        <View>
          <Text>Blocked Contacts:</Text>

          <FlatList
            style={{ backgroundColor: bgColour }}
            data={this.state.blockedArr}
            renderItem={({ item }) => (
              <ListItem bottomDivider>
                <Icon name="lock" type="font-awesome" color="green" />
                <ListItem.Content>
                  <ListItem.Title>{`${item.first_name} ${item.last_name}`}</ListItem.Title>
                  <TouchableOpacity
                    onPress={() => this.unblockContactHandler(item.user_id)}
                  >
                    <Text style={[{ color: 'green' }, { color: textColour }]}>Unblock Contact</Text>
                  </TouchableOpacity>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            )}
            keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
          />
          <Text>{this.state.message}</Text>
          <Switch value={theme === 'dark'} onValueChange={this.toggleTheme} />
        </View>
      </ThemeProvider>
    );
  }
}
