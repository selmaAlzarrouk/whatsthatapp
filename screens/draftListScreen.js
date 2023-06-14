/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  View, Text, ActivityIndicator, TouchableOpacity, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

// Styles
const draftListstyles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  btnStyle: {
    backgroundColor: 'blue',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  draftList: {
    alignItems: 'center',
  },
  draftItem: {
    fontSize: 18,
    marginBottom: 10,
  },
  timestampText: {
    fontSize: 12,
    color: '#000',
    marginTop: 4,
  },
};

class draftListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drafts: [],
      isLoading: true,
      error: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.getDrafts();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getDrafts = async () => {
    try {
      const draftsObject = await AsyncStorage.getItem('draftMsgKey');
      if (draftsObject) {
        const draftArr = JSON.parse(draftsObject);
        this.setState({ drafts: draftArr, isLoading: false });
      } else {
        this.setState({ drafts: [], isLoading: false });
      }
    } catch (err) {
      console.log('Error getting drafts', err);
    }
  };

  deleteDraftMsg = async (draftID) => {
    try {
      const { drafts } = this.state;
      const updatedDrafts = drafts.filter((draft) => draft.draftID !== draftID);
      await AsyncStorage.setItem('draftMsgKey', JSON.stringify(updatedDrafts));
      this.setState({ drafts: updatedDrafts });
    } catch (err) {
      console.log('Error deleting draft', err);
    }
  };

  render() {
    const { drafts, isLoading } = this.state;

    if (isLoading) {
      return (
        <View style={draftListstyles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={draftListstyles.container}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
          <Ionicons name="arrow-back" size={32} />
        </TouchableOpacity>
        <Text>List of your Drafts</Text>
        <FlatList
          data={drafts}
          renderItem={({ item }) => (
            <View>
              <Text style={draftListstyles.timestampText}>
                {moment(item.timestamp).format('DD/MM/YYYY, h:mm a')}
              </Text>
              <Text>{item.chatName}</Text>
              <Text>{item.message}</Text>
              <View>
                <TouchableOpacity
                  style={draftListstyles.btnStyle}
                  onPress={() => this.deleteDraftMsg(item.draftID)}
                >
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={draftListstyles.btnStyle}
                  onPress={() => this.props.navigation.navigate('editDrafts', {
                    message: item.message,
                    draftId: item.draftID,
                  })}
                >
                  <Ionicons name="create" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={({ draftID }, index) => (draftID ? draftID.toString() : index.toString())}
        />
      </View>
    );
  }
}

export default draftListScreen;
