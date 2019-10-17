/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import * as fabfirebaseapp from 'react-native-firebase';

export interface LandingPageProps {
  result?: ResultModel
}

export interface LandingPageState {
  results: ResultModel[]
}

export interface ResultModel {
  id: number
  location: string,
  category: string,
  objectType: string,
  time: string,
  status: string,
  imageURL: any
}


export default class LandingPage extends Component<LandingPageProps, LandingPageState> {
  constructor(props: LandingPageProps, state: LandingPageState) {
    super(props, state);
    this.state = {
      results: [ {
        id: 3,
        location: 'Second Item',
        category: 'Floods',
        objectType: 'person',
        time : new Date().toLocaleString(),
        status: 'open',
        imageURL: '../images/flood_image.png'
      }]
    }
  }

  onNotificationReceive = (data: any) => {
    let displayDate = new Date().toLocaleString();

    let result: ResultModel = {
      id: Math.floor((Math.random() * 1000) + 1),
      location: data.location,
      category: data.category,
      objectType: data.objectType,
      time: displayDate,
      status: data.status,
      imageURL: data.imageURL
    }

    console.log('result', result)
    if (result.location) {
      let results = this.state.results;
      results.push(result)
      this.setState({ results: results ? results : [] })
    }
  }

  onPress = (item) => {
    Alert.alert(
      "Confirm",
      "Do you really want to delete?",
      [
        {
          text: "Cancel",
          style: 'cancel',
        },
        {
          text: "Ok",
          onPress: async () => {
            let results = this.state.results.filter(obj => obj.id !== item.id);
            this.setState({ results })
          }
        },
      ],
      { cancelable: false },
    );
  }

 componentDidMount() {
    //   const ref = fabfirebaseapp.storage().ref("https://storage.googleapis.com/ems-4-bce4c.appspot.com/new_cool_image.jpg");
    //   console.log('ref', ref)
    //   ref.getDownloadURL().then(data => {
    //      console.log('data', data)
    //   }).catch(error => {
    //     console.log('error', error)
    //  })
 }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>

          <View style={{ backgroundColor: '#2F95D6', borderRadius: 7 }}>
            <Text style={{ fontSize: 25, color: 'white', alignSelf: 'center' }}>{'Rescuers'}</Text>
          </View>

          <FlatList
            data={this.state.results}
            renderItem={({ item }) => {
              return (<View style={styles.item}>
                <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                  <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../images/icon_location.png')} />
                  <Text style={styles.textStyle}>{item.location}</Text>
                </View>
                {/* <View style={{flexDirection: 'row', paddingVertical: 3}}>
                      <Image style={{width: 20, height: 20, resizeMode: 'contain'}} source={require('../images/icon_category.png')}/>
                      <Text style={styles.textStyle}>{item.category}</Text>
                    </View> */}
                <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                  <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../images/icon_time.png')} />
                  <Text style={styles.textStyle}>{item.time}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                  <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../images/icon_objectType.png')} />
                  <Text style={styles.textStyle}>{item.objectType}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, paddingRight: 5 }}>
                  <View style={{ flexDirection: 'row'}}>
                    <View style={[styles.statusIndicator, { backgroundColor: item.status == 'closed' ? 'green' : 'yellow' }]}></View>
                    <Text style={[styles.textStyle, { marginHorizontal: 15 }]}>{item.status}</Text>
                  </View>
                  <TouchableOpacity onPress={() => this.onPress(item)} style={{ alignSelf: 'center'}}>
                    <View>
                      <Image style={{ width: 25, height: 25, resizeMode: 'cover', }}
                        source={require('../images/icon_delete.png')} />
                    </View>
                  </TouchableOpacity>
                </View>
                <Image style={{ width: '100%', height: 150 }} resizeMode='stretch' source={{uri: item.imageURL}} />
              </View>)

            }}
            keyExtractor={item => item.id.toString()}
          />
        </SafeAreaView>
      </>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  item: {
    padding: 2,
    marginVertical: 2,
    marginHorizontal: 2,
    borderColor: 'lightblue',
    borderWidth: 1
  },
  title: {
    fontSize: 32,
  },
  imageStyle: {
    backgroundColor: 'lightblue',
    height: 100,
    width: 100,
    resizeMode: 'contain'
  },
  textStyle: {
    padding: 2,
    marginLeft: 2,
    fontSize: 15,
    color: '#000',
    maxWidth: "100%",
  },
  rowItem: {
    flexDirection: 'row',
  },
  checkMarkIconStyle: {
    resizeMode: 'contain',
    width: 25,
    height: 25
  },
  statusIndicator: {
    borderRadius: 20,
    height: 20,
    width: 20,
    backgroundColor: 'rgb(255,255,255)',
    marginTop: 4,
}
});