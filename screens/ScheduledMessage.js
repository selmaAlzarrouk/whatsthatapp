import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimePicker } from 'react-time-picker';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import { TouchableOpacity } from 'react-native-web';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  section: {
    marginBottom: 20,
  },
  MainContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePicker: {
    width: '100%',
    marginBottom: 10,
  },
  timePicker: {
    width: '100%',
    fontSize: 20,
    height: 200,
  },
  buttonText: {

  },
  errorMsg: {
    color: 'red',
  },
});

class ScheduledMessage extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const startDate = getFormatedDate(today.setDate(today.getDate() + 1), 'YYYY/MM/DD');
    this.state = {
      error: '',
      date: '',
      time: '00:00',
      startDate,
    };
    this.dateAlterHandler = this.dateAlterHandler.bind(this);
    this.timeAlterHandler = this.timeAlterHandler.bind(this);
  }

  // handle saving ability of that now schedled draft
  handleSaveScheduledDraft = async (draftId) => {
    try {
      const {
        draftMessage,
        chatId,
        chatName,
        date,
        time,
        startDate,
      } = this.state;

      // Retrieve existing draft messages from AsyncStorage
      const jsonString = await AsyncStorage.getItem('draftMsgKey');
      const draftMessages = jsonString ? JSON.parse(jsonString) : [];

      // Find the draft by draftId
      const draftIndex = draftMessages.findIndex((draft) => draft.draftId === draftId);
      console.log('draftId:', draftId);
      if (draftIndex === -1) {
        this.setState({ error: 'Draft not found.' });
        return;
      }

      const draft = draftMessages[draftIndex];

      // Toggle the isScheduled value
      draft.isScheduled = !draft.isScheduled;

      if (!draft.isScheduled) {
        // Clear the date and time if the draft is unscheduled
        draft.date = '';
        draft.time = '';
      } else {
        // Check if date and time are empty
        if (!date || !time) {
          this.setState({ error: 'Please set a date and time.' });
          return;
        }

        // Check if the selected date is in the past
        if (startDate > date) {
          this.setState({ error: 'Please pick a valid date, it must not have passed.' });
          return;
        }

        // Set the new date and time values
        draft.date = date;
        draft.time = time;
      }

      // Update the draft message with the modified values
      draft.message = draftMessage;
      draft.chatId = chatId;
      draft.chatName = chatName;

      // Save updated draft messages array in AsyncStorage
      await AsyncStorage.setItem('draftMsgKey', JSON.stringify(draftMessages));

      // Show success message
      this.setState({ error: 'Draft message saved successfully.' });

      // Clear input field
      this.setState({ draftMessage: '' });
    } catch (error) {
      // Show error message
      this.setState({ error: `Failed to save draft message. Please try again.${error}` });
    }
  };

  dateAlterHandler(propDate) {
    this.setState({ date: propDate });
  }

  timeAlterHandler(propTime) {
    this.setState({ time: propTime });
  }

  render() {
    const {
      startDate,
      date,
      time,
      error,
      draftId,
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.MainContainer}>
          <DatePicker
            mode="calendar"
            minimumDate={startDate}
            selected={date}
            onDateChange={this.dateAlterHandler}
          />

          <TimePicker
            onChange={this.timeAlterHandler}
            value={time}
            disableClock
            clearIcon={null}
          />
        </View>
        <Text style={styles.errorMsg}>{error}</Text>

        <TouchableOpacity onPress={() => this.handleSaveScheduledDraft(draftId)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Schedule:</Text>
          </View>
        </TouchableOpacity>

      </View>
    );
  }
}

export default ScheduledMessage;
