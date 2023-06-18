/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Switch, ThemeProvider } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { PatchChatName } from "../api/apiController";

export default class editChatName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatName: "",
      message: "",
      theme: "light",
    };
  }

  componentDidMount() {
    this.prepopEditForm();
  }

  updateChatNameHandler = (updateChatName) => {
    this.setState({
      chatName: updateChatName,
    });
  };

  async prepopEditForm() {
    const prevChatName = await AsyncStorage.getItem("editChatName");

    this.setState({ chatName: prevChatName });
  }

  async editChatName() {
    PatchChatName(
      await AsyncStorage.getItem("chatID"),
      { name: this.state.chatName },
      () => {
        this.setState({ message: "Chat Name Updated!" });
      },
      (err) => {
        this.setState({ message: err });
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
          <View>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack(null)}
            >
              <Ionicons name="arrow-back" size={24} color={textColour} />
            </TouchableOpacity>
            <TextInput
              placeholder="Edit Chat Name..."
              value={this.state.chatName}
              onChangeText={this.updateChatNameHandler}
              style={{ color: textColour }}
            />

            <Button
              title="Edit Chat Name"
              onPress={() => this.editChatName()}
            />
            <Text  style={{ color: textColour }}>{this.state.message}</Text>
            <Switch value={theme === "dark"} onValueChange={this.toggleTheme} />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
