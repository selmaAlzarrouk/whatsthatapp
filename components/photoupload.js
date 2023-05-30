/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import {  Text, View, TouchableOpacity} from 'react-native';
import {  Camera, CameraType, onCameraReady, CameraPictureOptions,} from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, Icon } from 'react-native-elements';

export default function CameraUtils() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  const takePicture = async () => {
    if (camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => sendToServer(data),
      };

      await camera.takePictureAsync(options);
    }
  };

  const sendToServer = async (data) => {
    const res = await fetch(data.base64);
    const blob = await res.blob();

    return fetch(`http://localhost:3333/api/1.0.0/user/${await AsyncStorage.getItem('id')}/photo`, {
      method: 'post',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
      },
      body: blob,
    })
      .then((response) => {
        if (response.status === 200) {
          return;
        }
        if (response.status === 400) {
          const err = 'Bad Request!';
          throw err;
        }
        if (response.status === 401) {
          // User is unauthorised - return to login screen
          this.props.navigation.navigate('Login');
        }
        if (response.status === 403) {
          const err = 'You do not have the correct privilages to perform this action!';
          throw err;
        }
        if (response.status === 404) {
          const err = '404 Not Found';
          throw err;
        } else {
          const err = 'Server Error! Please try again later!';
          throw err;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={{ height: '100vh' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
          Edit Your Photo:
        </Text>
      <Camera type={type} ref={(ref) => setCamera(ref)}>
        <View style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
        }}
        >
          <TouchableOpacity onPress={takePicture} style={{ backgroundColor: '#007bff', width: 400, height: 200,alignItems: 'center', justifyContent:'center'}}>
            <Ionicons name="camera" size="large" style={{alignSelf:'center', fontSize:200}} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
