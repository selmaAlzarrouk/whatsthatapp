/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  View, Text, ActivityIndicator, TouchableOpacity, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { Button } from 'react-native-elements';

class draftListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drafts: [],
      isLoading: true,
      message: '',
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
      const drafts = await AsyncStorage.getItem('draftMsgKey');
      const navigation = this.props;
      const message = this.state;
      const draftArr = JSON.parse(drafts) || [];
      const removedIndex = draftArr.findIndex((item) => item.draftId === draftID);
      if (removedIndex !== -1) {
        draftArr.splice(removedIndex, 1); // removes ele from arr
        await AsyncStorage.setItem('draftMsgKey', JSON.stringify(draftArr));
        this.setState({ drafts: draftArr }); // so here ill update state with the modified draft
        this.setState({ message: 'Hurray youve deleted draft' });
        console.log(draftID, 'IAM MEOW');
        navigation.navigation.navigate('draftListScreen');
      }
    } catch (err) {
      console.log('Error deleting draft', err);
    }
  };

  render() {
    const { drafts, isLoading } = this.state;

    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
          <Ionicons name="arrow-back" size={32} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>List of your Drafts</Text>
        <FlatList
          data={drafts}
          renderItem={({ item }) => (
            <View>
              <Text>{item.chatName}</Text>
              <Text style={{ fontSize: 12, color: '#000', marginTop: 4 }}>
                {moment(item.timestamp).format('DD/MM/YYYY, h:mm a')}
              </Text>
              <Text>{item.chatName}</Text>
              <Text>{item.message}</Text>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Button
                  title="Delete"
                  buttonStyle={{ backgroundColor: 'red', marginRight: 10 }}
                  onPress={() => this.deleteDraftMsg(item.draftId)}
                  icon={<Ionicons name="trash" size={24} color="white" />}
                />
                <Button
                  title="Edit"
                  buttonStyle={{ backgroundColor: 'black' }}
                  onPress={() => this.props.navigation.navigate('editDrafts', {
                    message: item.message,
                    draftId: item.draftId,
                  })}
                  icon={<Ionicons name="create" size={24} color="white" />}
                />
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
