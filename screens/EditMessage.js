/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, ThemeProvider, Switch } from "react-native-elements";
import { editMessage } from "../api/apiController";

export default class EditMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      error: "",
      theme: "light",
    };
  }

  componentDidMount() {
    this.prepopForm();
  }

  editMessageHandler = (patchMessage) => {
    this.setState({
      message: patchMessage,
    });
  };

  async prepopForm() {
    const prevMsg = await AsyncStorage.getItem("Message");

    this.setState({ message: prevMsg });
  }

  async patchMessage() {
    editMessage(
      await AsyncStorage.getItem("chatID"),
      await AsyncStorage.getItem("messageID"),
      { message: this.state.message },
      () => {
        this.setState({ error: "Message Updated!" });
      },
      (err) => {
        this.setState({ error: err });
      }
    );
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
    return (
      <ThemeProvider useDark={theme === "dark"}>
        <View style={{ backgroundColor: bgColour }}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
            <Ionicons name="arrow-back" size={24} color={textColour} />
          </TouchableOpacity>
          <TextInput
            placeholder="Edit message..."
            value={this.state.message}
            onChangeText={this.editMessageHandler}
            style={{ color: textColour }}
          />
          <Button
            title="Edit Message"
            onPress={() => this.patchMessage()}
            buttonStyle={{ backgroundColor: '#007bff', marginBottom: 30 }}
            titleStyle={{ color: textColour }}
          />
          <Text style={{ color: textColour }}>{this.state.error}</Text>
          <Switch value={theme === "dark"} onValueChange={this.toggleTheme} />
        </View>
      </ThemeProvider>
    );
  }
}
