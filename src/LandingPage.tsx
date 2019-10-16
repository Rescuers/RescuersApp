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

export interface LandingPageProps {
    result: ResultModel
}

export interface LandingPageState {
    results: ResultModel[]
}

export interface ResultModel {
  location: string,
  category: string,
  objectType: string,
  time: string,
  status: string
}

const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      location: 'First Item',
      category: 'Floods',
      objectType: 'person',
      time : '12/11/2019 10:10AM',
      status: 'closed'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      location: 'Second Item',
      category: 'Floods',
      objectType: 'person',
      time : '12/11/2019 10:10AM',
      status: 'open'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      location: 'Third Item',
      category: 'Floods',
      objectType: 'person',
      time : '11/12/2019 10:10AM',
      status: 'closed'
    },
  ];

export default class LandingPage extends Component<LandingPageProps, LandingPageState> {
    constructor(props: LandingPageProps, state: LandingPageState) {
        super(props, state);
        this.state = {
          results : []
        }
    }

     onPress = () => {
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
                    //TODO: delete the item from list
                  }
              },
          ],
          { cancelable: false },
      );
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
              data={DATA}
              renderItem={({ item }) => {
                  return (<View style={styles.item}>
                    <View style={{flexDirection: 'row', paddingVertical: 3}}>
                      <Image style={{width: 20, height: 20, resizeMode: 'contain'}} source={require('../images/icon_location.png')}/>
                      <Text style={styles.textStyle}>{item.location}</Text>
                    </View>
                    {/* <View style={{flexDirection: 'row', paddingVertical: 3}}>
                      <Image style={{width: 20, height: 20, resizeMode: 'contain'}} source={require('../images/icon_category.png')}/>
                      <Text style={styles.textStyle}>{item.category}</Text>
                    </View> */}
                    <View style={{flexDirection: 'row', paddingVertical: 3}}>
                      <Image style={{width: 20, height: 20, resizeMode: 'contain'}} source={require('../images/icon_time.png')}/>
                      <Text style={styles.textStyle}>{item.time}</Text>
                    </View>
                    <View style={{flexDirection: 'row', paddingVertical: 3}}>
                      <Image style={{width: 20, height: 20, resizeMode: 'contain'}} source={require('../images/icon_objectType.png')}/>
                      <Text style={styles.textStyle}>{item.objectType}</Text>
                    </View>
                     <View style={{flexDirection: 'row', paddingVertical: 3, paddingHorizontal: 5, alignSelf: 'flex-end'}}>
                      <Text style={[styles.textStyle,{ marginHorizontal : 15 },  { backgroundColor: item.status == 'closed' ? 'green': 'yellow'}]}>{item.status}</Text>
                      <TouchableOpacity onPress={this.onPress}>
                        <View>
                          <Image style={{ width: 25, height: 25, resizeMode: 'cover' }}
                            source={require('../images/icon_delete.png')} />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Image style={{width: '100%', height: 150}} resizeMode='stretch' source={require('../images/flood_image.png')}/>
                  </View>)
                  
              }}
              keyExtractor={item => item.id}
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
      borderColor : 'lightblue',
      borderWidth : 1
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
  });