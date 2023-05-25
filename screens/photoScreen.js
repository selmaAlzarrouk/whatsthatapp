/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { View } from 'react-native';
import CameraUtils from '../components/photoupload';

class photoScreen extends Component {
  render() {
    return (
      <View>
        <CameraUtils />
      </View>
    );
  }
}
export default photoScreen;
