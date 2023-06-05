/* eslint-disable react/prop-types */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, TextInput, FlatList, Text, TouchableOpacity,
} from 'react-native';
import { Button, ListItem, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

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
      this.getData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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
        const error = 'Error fetching data';
        throw error;
      }
    } catch (error) {
      this.setState({ message: error });
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
    this.getData(() => {
      if (this.state.userList.length === 0) {
        this.setState({ message: 'No users' });
      } else {
        this.setState({ message: '' });
      }
    });
  };

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
      } if (response.status === 400) {
        const error = 'You can\'t add yourself as a contact';
        throw error;
      } else if (response.status === 401) {
        const err = 'Unauthorized';
        throw err;
      } else if (response.status === 404) {
        const e = 'Not Found';
        throw e;
      } else if (response.status === 500) {
        const error = 'Server Error';
        throw error;
      }
    } catch (error) {
      this.setState({ message: error });
    }
  }

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
        <Text>{this.state.error}</Text>
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
