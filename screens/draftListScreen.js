/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { Button, Switch, ThemeProvider } from 'react-native-elements';

class draftListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drafts: [],
      isLoading: true,
      message: '',
      theme: 'light',
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
      const removedIndex = draftArr.findIndex(
        (item) => item.draftId === draftID,
      );
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

  // my toggleThememethod its the toggler between dark and light !
  toggleTheme = () => {
    this.setState((prevState) => ({
      theme: prevState.theme === 'light' ? 'dark' : 'light',
    }));
  };

  render() {
    const { theme } = this.state;
    const bgColour = theme === 'dark' ? ' #007bff' : '#f2f2f2';
    const textColour = theme === 'dark' ? '#ffffff' : '#000000';
    const { drafts, isLoading } = this.state;

    if (isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View
        style={{ flex: 1, alignItems: 'center', backgroundColor: bgColour }}
      >
        <ThemeProvider useDark={this.state.theme === 'dark'}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
            <Ionicons name="arrow-back" size={32} color={textColour} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 20,
              color: textColour,
            }}
          >
            List of your Drafts
          </Text>
          <FlatList
            data={drafts}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}
                >
                  {item.chatName}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    marginTop: 4,
                  }}
                >
                  {moment(item.timestamp).format('DD/MM/YYYY, h:mm a')}
                </Text>
                <Text
                  style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}
                >
                  {item.message}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Button
                    title="Delete"
                    buttonStyle={{ backgroundColor: 'red', marginRight: 10 }}
                    onPress={() => this.deleteDraftMsg(item.draftId)}
                    icon={<Ionicons name="trash" size={24} color="white" />}
                  />
                  <Button
                    title="Edit"
                    buttonStyle={{ backgroundColor: textColour }}
                    titleStyle={{ color: bgColour }}
                    onPress={() => this.props.navigation.navigate('editDrafts', {
                      message: item.message,
                      draftId: item.draftId,
                    })}
                    icon={<Ionicons name="create" size={24} color="white" />}
                  />
                  <Button
                    title="Schedule"
                    buttonStyle={{ backgroundColor: 'green', marginRight: 10 }}
                    onPress={() =>this.props.navigation.navigate('ScheduledMessage', {
                      message: item.message,
                      draftId: item.draftId,
                                           
                    })}
                    icon={<Ionicons name="time" size={24} color="white" />}
                  />


                </View>
              </View>
            )}
            keyExtractor={({ draftID }, index) => (draftID ? draftID.toString() : index.toString())}
          />
          <Switch
            value={this.state.theme === 'dark'}
            onValueChange={this.toggleTheme}
          />
        </ThemeProvider>
      </View>
    );
  }
}

export default draftListScreen;