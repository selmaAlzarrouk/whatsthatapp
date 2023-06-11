import React, { Component } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { TimePickerModal } from 'react-native-paper-dates';
import * as z from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SendChatMessage } from '../apiCalls';

class ScheduleMessageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      scheduleTime: null,
    };
  }

  handleSaveDraftMessage = () => {
    const { onSave, onCloseModal } = this.props;
    const { scheduleTime } = this.state;
    onSave(scheduleTime);
    onCloseModal();
  };

  onDismiss = () => {
    this.setState({ visible: false });
  };

  onConfirm = ({ hours, minutes }) => {
    const selectedTime = new Date();
    selectedTime.setHours(hours);
    selectedTime.setMinutes(minutes);
    this.setState({ scheduleTime: selectedTime, visible: false });
  };

  SendScheduledMessages = () => {
    const {
      setError,
      setUnauthorized,
      setForbidden,
      setNotFound,
      setServerError,
      getChatMessages,
    } = this.props;

    const messageSchema = z.string().min(1).max(1000);

    useEffect(() => {
      const interval = setInterval(async () => {
        const existingDrafts = await AsyncStorage.getItem('@drafts');
        const parsedDrafts = existingDrafts ? JSON.parse(existingDrafts) : [];
        const now = new Date(); // get current date and time
        parsedDrafts.forEach(async (draft) => {
          if (draft.timeSchedule && new Date(draft.timeSchedule) <= now) {
            console.log('executing 1st');
            const messageData = {
              message: messageSchema.parse(draft.sendMessages),
            };
            // send message
            await SendChatMessage(
              messageData,
              draft.chatId,
              setError,
              setUnauthorized,
              setForbidden,
              setNotFound,
              setServerError,
            );
            setSendMessages('');
            setErrorMessage('');
            getChatMessages();

            // remove the draft from AsyncStorage
            const filteredDrafts = parsedDrafts.filter(
              (item) => item.messageId !== draft.messageId,
            );
            await AsyncStorage.setItem(
              '@drafts',
              JSON.stringify(filteredDrafts),
            );
          } else if (draft.timeSchedule - now <= 0) {
            console.log('executing 2nd');
            const messageData = {
              message: messageSchema.parse(draft.sendMessages),
            };
            // send message
            await SendChatMessage(
              messageData,
              draft.chatId,
              setError,
              setUnauthorized,
              setForbidden,
              setNotFound,
              setServerError,
            );
            setSendMessages('');
            setErrorMessage('');
            getChatMessages();

            // remove the draft from AsyncStorage
            const filteredDrafts = parsedDrafts.filter(
              (item) => item.messageId !== draft.messageId
            );
            await AsyncStorage.setItem(
              '@drafts',
              JSON.stringify(filteredDrafts)
            );
          }
        });
      }, 60000); // check every minute

      return () => clearInterval(interval);
    }, []);

    return null;
  };

  render() {
    const { showModal, onCloseModal } = this.props;
    const { visible } = this.state;

    this.SendScheduledMessages();

    return (
      <Modal visible={showModal} animationType="slide">
        <View style={styles.container}>
          <TouchableOpacity onPress={onCloseModal}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ visible: true })}>
            <Text style={styles.scheduleText}>Schedule</Text>
          </TouchableOpacity>
          <TimePickerModal
            visible={visible}
            onDismiss={this.onDismiss}
            onConfirm={this.onConfirm}
            hours={12}
            minutes={0}
            label="Select time"
            cancelLabel="Cancel"
            confirmLabel="Ok"
            animationType="fade"
          />
          <TouchableOpacity onPress={this.handleSaveDraftMessage}>
            <Text style={styles.saveText}>Save Draft</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  closeText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  scheduleText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'blue',
  },
  saveText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'green',
  },
};

export default ScheduleMessageModal;