/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, ThemeProvider, Switch } from "react-native-elements";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class editDrafts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatName: props.route.params.chatName,
      message: props.route.params.message,
      draftId: props.route.params.draftId,
      error: "",
      theme: "light",
    };
  }

  editDraftMessageHandler = (patchMessage) => {
    this.setState({
      message: patchMessage,
    });
  };
  // deals with EDITING
  async patchDraftMessage() {
    try {
      const { message, draftId } = this.state;
      const { navigation } = this.props;

     // console.log("Before AsyncStorage.getItem():", draftId);

      const draftsObject = await AsyncStorage.getItem("draftMsgKey");
     // console.log("After AsyncStorage.getItem():", draftsObject);

      const editedDrafts = JSON.parse(draftsObject);
     // console.log("After JSON.parse():", editedDrafts);

      const draftIndex = editedDrafts.findIndex(
        (draft) => draft.draftId === draftId
      );
      //console.log("After findIndex():", draftIndex);

      if (draftIndex > -1) {
        //console.log("Inside if (draftIndex > -1) block:", message);
        editedDrafts[draftIndex].message = message;
      }

      //console.log("After message update:", editedDrafts);

      //console.log("Before AsyncStorage.setItem():", editedDrafts);
      await AsyncStorage.setItem("draftMsgKey", JSON.stringify(editedDrafts));

      const storedValue = await AsyncStorage.getItem("draftMsgKey");
      //console.log("After AsyncStorage.setItem():", storedValue);

     // console.log("Successful");
     // console.log("Before navigation.navigate():", draftId);
      navigation.navigate("draftListScreen", { updatedDraftId: draftId });
    } catch (err) {
      //console.log("Error editing drafts", err);
      this.setState({ error: "Error updating the draft. Sorry." });
    }
  }
  toggleTheme = () => {
    this.setState((prevState) => ({
      theme: prevState.theme === "light" ? "dark" : "light",
    }));
  };

  render() {
    const { theme } = this.state;
    const bgColour = theme === "dark" ? "#000000" : "#ffffff";
    const textColour = theme === "dark" ? "#ffffff" : "#000000";
    const { navigation } = this.props;
    const { message, error, chatName } = this.state;

    return (
      <ThemeProvider>
      <View>
        <Text>{chatName}</Text>
        <TouchableOpacity onPress={() => navigation.goBack(null)}>
          <Ionicons name="arrow-back" size={32} />
        </TouchableOpacity>
        <TextInput
          placeholder="Edit draft message..."
          value={message}
          onChangeText={this.editDraftMessageHandler}
        />

        <Button title="Edit Draft" onPress={() => this.patchDraftMessage()} />
        <Text>{error}</Text>
      </View>
      <Switch value={theme === "dark"} onValueChange={this.toggleTheme} />
      </ThemeProvider>
      
    
    );
  }
}
