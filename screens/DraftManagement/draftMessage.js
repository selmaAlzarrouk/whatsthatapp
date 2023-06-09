/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Input, ThemeProvider, Switch, Button,
} from 'react-native-elements';
import moment from 'moment';
import { TimePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context';

class draftChatMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatId: props.route.params.chatId,
      chatName: props.route.params.chatName,
      draftMsg: '',
      error: '',
      theme: 'light',
      visible: false,
      hours: 12,
      minutes: 14,
    };
  }

  onDismiss = () => {
    this.setState({ visible: false });
  };

  onConfirm = ({ hours, minutes }) => {
    const selectedTime = new Date();
    selectedTime.setHours(hours);
    selectedTime.setMinutes(minutes);
    this.setState({
      visible: false, hours, minutes, selectedTime,
    });
  };

  toggleTheme = () => {
    this.setState((prevState) => ({
      theme: prevState.theme === 'light' ? 'dark' : 'light',
    }));
  };

  handleonPress = async () => {
    const { draftMsg } = this.state;
    if (draftMsg.trim().length === 0) {
      this.setState({ error: 'Message cannot be empty' });
      return;
    }
    this.saveDraftMessageHandler();
  };

  /* It saves a draft message to AsyncStorage.
  Then it checks if a selected time is available.
  If not, it displays an error message.
  If a selected time is available, it checks if the draft message is empty.
  If not, it retrieves the existing draft messages from AsyncStorage, generates a new draft ID,
  adds the new draft message to the list, and saves the updated list back to AsyncStorage.
  It also displays a success message and navigates to the draft list screen.
  If theres an error during the process, itll displays an error message.
*/
  saveDraftMessageHandler = async () => {
    const {
      selectedTime, chatName, chatId, draftMsg,
    } = this.state;
    if (selectedTime) {
      try {
        console.log(selectedTime);
        if (draftMsg.trim().length === 0) {
          this.setState({ error: 'Message cannot be empty' });
          return;
        }
        const jsonString = await AsyncStorage.getItem('draftMsgKey');
        const draftMsgs = jsonString ? JSON.parse(jsonString) : [];

        let finalDraftID = 0;
        if (draftMsgs.length > 0) {
          const finalDraft = draftMsgs[draftMsgs.length - 1];
          finalDraftID = finalDraft.draftId;
        }

        const updatedDraftId = finalDraftID + 1;

        draftMsgs.push({
          chatName,
          chatid: chatId,
          draftId: updatedDraftId,
          message: draftMsg,
          timeScheduel: selectedTime,
          timestamp: moment().toISOString(),
        });

        await AsyncStorage.setItem('draftMsgKey', JSON.stringify(draftMsgs));

        this.setState({
          error: 'This Draft Message has been saved!',
          draftMsg: '',
        });

        this.props.navigation.navigate('draftListScreen');
      } catch (error) {
        this.setState({ error: 'Sorry, this draft message could not be saved. Please try again.' });
      }
    } else {
      try {
        if (draftMsg.trim().length === 0) {
          this.setState({ error: 'Message cannot be empty' });
          return;
        }
        const jsonString = await AsyncStorage.getItem('draftMsgKey');
        const draftMsgs = jsonString ? JSON.parse(jsonString) : [];

        let finalDraftID = 0;
        if (draftMsgs.length > 0) {
          const finalDraft = draftMsgs[draftMsgs.length - 1];
          finalDraftID = finalDraft.draftId;
        }

        const updatedDraftId = finalDraftID + 1;

        draftMsgs.push({
          chatName,
          chatId,
          draftId: updatedDraftId,
          message: draftMsg,
          timestamp: moment().toISOString(),
        });

        await AsyncStorage.setItem('draftMsgKey', JSON.stringify(draftMsgs));

        this.setState({
          error: 'This Draft Message has been saved!',
          draftMsg: '',
        });

        this.props.navigation.navigate('draftListScreen');
      } catch (error) {
        this.setState({ error: 'Sorry, this draft message could not be saved. Please try again.' });
      }
    }
  };

  render() {
    const {
      draftMsg, chatName, error, theme,
    } = this.state;
    const bgColour = theme === 'dark' ? '#000000' : '#f2f2f2';
    const textColour = theme === 'dark' ? '#ffffff' : '#000000';
    const { visible, hours, minutes } = this.state;

    return (
      <View style={{
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColour,
      }}
      >
        <ThemeProvider useDark={theme === 'dark'}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
            <Ionicons name="arrow-back" size={32} color={textColour} />
          </TouchableOpacity>
          <Text style={{
            fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: textColour,
          }}
          >
            DRAFTS:
          </Text>
          <Text style={{ color: textColour }}>
            Draft a message for:
            {' '}
            {chatName}
          </Text>
          <Input
            inputStyle={{ marginBottom: 20, color: textColour }}
            value={draftMsg}
            onChangeText={(newDraftMessage) => this.setState({ draftMsg: newDraftMessage })}
            placeholder="Please enter your draft message..."
            multiline
          />

          <Text style={{ marginBottom: 20, color: 'red' }}>{error}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button title="Save Draft" onPress={() => this.handleonPress()} />
            <Button
              title="My Draft List"
              onPress={() => this.props.navigation.navigate('draftListScreen')}
            />
          </View>

          <SafeAreaProvider>
            <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
              <Button onPress={() => this.setState({ visible: true })} uppercase={false} mode="outlined" />
              <TimePickerModal
                visible={visible}
                onDismiss={this.onDismiss}
                onConfirm={this.onConfirm}
                hours={hours}
                minutes={minutes}
              />
            </View>
          </SafeAreaProvider>
          <Switch value={theme === 'dark'} onValueChange={this.toggleTheme} />
        </ThemeProvider>
      </View>
    );
  }
}
export default draftChatMessage;
