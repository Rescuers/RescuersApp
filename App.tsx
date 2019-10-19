/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Alert,
  AsyncStorage,
} from 'react-native';

import firebase, { RNFirebase } from 'react-native-firebase';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Sound from "react-native-sound";
import LandingPage from './src/LandingPage';

let landingPageRef: LandingPage = undefined;

const MainNavigator = createStackNavigator({
  LandingPage: { screen: LandingPage }
},
  {
    initialRouteName: 'LandingPage',
  });



export default class App extends Component {

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    }
    else {
      this.requestPermission();
    };
  }

  //2
  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }
  notificationListener: () => any;
  notificationOpenedListener: () => any;
  messageListener: () => any;

  componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();

    // Enable playback in silence mode
    Sound.setCategory('Playback');
  }

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    console.log("fcmToken", fcmToken);
  }

  createNotificationListeners = async () => {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      console.log("Inside notificationListener::", notification);
      this.onNotificationRecieve(notification);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      console.log("Inside notificationOpenedListener:", notificationOpen);
      this.onNotificationRecieve(notificationOpen.notification);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      console.log("Inside notificationOpen:", notificationOpen);
      this.onNotificationRecieve(notificationOpen.notification);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log("Inside messageListener::", message);
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  onNotificationRecieve(notification: RNFirebase.notifications.Notification) {

    this.playSound();

    let data = {}
    if (notification.data) {
      data = JSON.parse(notification.data['post_pk'])
      console.log('from notification.data', data)
    } else if (notification.body) {
      data = JSON.parse(notification.body)
      console.log('from notification.body', data)
    }
    if (landingPageRef) {
      landingPageRef.onNotificationReceive(data)
    }
  }

  private playSound() {
    try {
      var alertSound = new Sound('alert.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        //console.log('duration in seconds: ' + alertSound.getDuration() + 'number of channels: ' + alertSound.getNumberOfChannels());

        // Play the sound with an onEnd callback
        alertSound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          }
          else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      });

      // Stop the sound and rewind to the beginning
      alertSound.stop(() => {
        // Note: If you want to play a sound after stopping and rewinding it,
        // it is important to call play() in a callback.
        // alertSound.play();
      });

      // Release the audio player resource
      alertSound.release()
    }
    catch (error) {
      console.log('error occured when playing the alert sound.')
    }
  }


  render() {

    const AppContainer = createAppContainer(MainNavigator);

    return (
      <LandingPage ref={(_landingPageRef: any) => {
        landingPageRef = _landingPageRef
      }} />
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "lightgray",
  },
  body: {
    backgroundColor: "white",
  }

});
