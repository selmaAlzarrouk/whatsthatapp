/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { Button, ListItem, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

import { getContactList } from '../api/apiController';

export default class UsersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      userList: [],
      message: '',
      user_id: 0,
      offset: 0,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      console.log('Screen reached');
      this.getData();
      getContactList()
        .then((responseJson) => {
          this.setState({
            contactData: responseJson,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async addContact() {
    try {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${this.state.user_id}/contact`, {
        method: 'post',
        headers: {
          'x-authorization': token,
        },
      });

      if (response.status === 200) {
        this.setState({ message: 'Added to Contacts' });
        return;
      } else if (response.status === 400) {
        throw 'You can\'t add yourself as a contact';
      } else if (response.status === 401) {
        throw 'Unauthorized';
      } else if (response.status === 404) {
        throw 'Not Found';
      } else if (response.status === 500) {
        throw 'Server Error';
      }
    } catch (error) {
      this.setState({ message: error });
    }
  }

  async getData() {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.query}&limit=5&offset=${this.state.offset}`, {
        method: 'GET',
        headers: {
          'x-authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });

      if (response.status === 200) {
        const responseJson = await response.json();
        this.setState({
          userList: responseJson,
        });
      } else {
        throw 'Error fetching data';
      }
    } catch (error) {
      console.log(error);
    }
  }

  addingContactHandler = (id) => {
    this.setState({ user_id: id }, () => {
      this.addContact();
    });
  };

  fetchNewPage = () => {
    const newOffset = this.state.offset + 5;
    this.setState({ offset: newOffset }, () => this.getData());
  };

  fetchPreviousPage = () => {
    const newOffset = this.state.offset - 5;
    this.setState({ offset: newOffset }, () => this.getData());
  };

  queryHandler = (searchQuery) => {
    this.setState({ query: searchQuery });
  };

  searchUsers = () => {
    this.getData();
  };

  renderUserItem = ({ item }) => (
    <ListItem bottomDivider>
      <Icon name="person" />
      <ListItem.Content>
        <ListItem.Title>{`${item.given_name} ${item.family_name}`}</ListItem.Title>
        <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
      </ListItem.Content>
      <Button
        title="Add to Contact"
        onPress={() => this.addingContactHandler(item.user_id)}
        buttonStyle={{ backgroundColor: '#007bff' }}
        titleStyle={{ fontSize: 14 }}
      />
    </ListItem>
  );

  render() {
    return (
      <View>
        <TextInput
          placeholder="Search here"
          value={this.state.query}
          onChangeText={this.queryHandler}
        />
        <Button title="Search" onPress={this.searchUsers} />

        <FlatList
          data={this.state.userList}
          renderItem={this.renderUserItem}
          keyExtractor={({ id }, index) => (id ? id.toString() : index.toString())}
        />

        <View style={styles.paginationContainer}>
          <TouchableOpacity onPress={this.fetchPreviousPage}>
            <Text style={styles.paginationButton}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.fetchNewPage}>
            <Text style={styles.paginationButton}>Next</Text>
          </TouchableOpacity>
        </View>
        <Text>{this.state.message}</Text>
      </View>
    );
  }
}

const styles = {
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  paginationButton: {
    fontSize: 16,
    color: '#007bff',
  },
};
