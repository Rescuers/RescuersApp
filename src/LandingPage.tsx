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
import Geocoder from 'react-native-geocoder';
import { getCurrentLocation, getLocationFromPosition } from './GeocodeService';
import { isGoogleMapsInstalled, PermissionsHelper } from './PermissionHelper';
import { showLocation } from 'react-native-map-link';

export interface LandingPageProps {
  result?: ResultModel
}

export interface LandingPageState {
  results: ResultModel[]
}

export interface ResultModel {
  id: number,
  location: string,
  latitude: number,
  longitude: number,
  category: string,
  objectType: string,
  time: string,
  status: string,
  imageUrl: any
}

/**
 * Model of position object.
 */
export interface GeoPosition {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
};

/**
 * contains success status and address from the native platform geocode service * 
 */
export interface GeoServiceResponse {
  isSuccess: boolean,
  address?: GeoLocationAddress,
  error: any
}

/**
 * Model for returned address from native platform geocode service
 */
export interface GeoLocationAddress {
  position: { lat: number, lng: number },
  formattedAddress: string
  feature: string | null
  streetNumber: string | null,
  streetName: string | null,
  postalCode: string | null,
  locality: string | null,
  country: string,
  countryCode: string,
  adminArea: string | null
  subAdminArea: string | null,
  subLocality: string | null
}


export default class LandingPage extends Component<LandingPageProps, LandingPageState> {
  constructor(props: LandingPageProps, state: LandingPageState) {
    super(props, state);
    this.state = {
      results: []
    }
  }

  onNotificationReceive = async (data: any) => {

    let geoServiceResponse = await this.fetchLocation(data);
    let imageUrl = await this.fetchImageUrl(data);

    let result: ResultModel = {
      id: Math.floor((Math.random() * 1000) + 1),
      location: geoServiceResponse.isSuccess ? geoServiceResponse.address.formattedAddress : "",
      latitude: geoServiceResponse.isSuccess ? geoServiceResponse.address.position.lat : -1,
      longitude: geoServiceResponse.isSuccess ? geoServiceResponse.address.position.lng : -1,
      category: 'Floods',
      objectType: "Person",
      time: new Date().toLocaleString(),
      status: "Open",
      imageUrl: imageUrl
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




  onRoute = async (item: ResultModel) => {

    const permission = await PermissionsHelper.requestPermission("location", "Enable Location Services", "Please go to settings and enable location services");
    if (!permission) {
      Alert.alert("No internet", 'Please check your network connection and try again.'
        , [{ text: 'OK', onPress: () => { } }], { cancelable: false });
      return;
    }
    getCurrentLocation().then((response: any) => {
      if (response.isSuccess) {
        console.log('response.address', response.address)
        const { lat, lng } = response.address.position;
        isGoogleMapsInstalled().then((isInstalled) => {
          if (isInstalled) {
            showLocation({
              latitude: item.latitude,
              longitude: item.longitude,
              sourceLatitude: lat,
              sourceLongitude: lng,
              app: 'google-maps'
            })
          }
          else {
            Alert.alert('Route', 'Unable to route, Please try again.', [{ text: 'OK', onPress: () => { } }], { cancelable: false })
          }

        })
      } else {
        Alert.alert('Route', "Failed to fetch current location, Please try again.", [{
          text: 'OK', onPress: () => {
          }
        }], { cancelable: false })
      }
    }).catch((error: any) => { });
  }

  private async fetchImageUrl(data: any) {
    let imageUrl = undefined
    if (!data || !data.imageUrl) {
      return imageUrl
    }
    try {
      let ref = fabfirebaseapp.storage().ref(data.imageUrl);
      imageUrl = await ref.getDownloadURL();
    }
    catch (error) {
    }
    return imageUrl;
  }

  private async fetchLocation(data: any) {
    let values: string[] = data.location.split(',');
    if (!values || values.length < 2) {
      return { isSuccess: false, address: undefined, error: undefined }
    }
    let geoServiceResponse = await getLocationFromPosition({
      coords: {
        latitude: parseInt(values[0]),
        longitude: parseInt(values[1])
      }
    });
    return geoServiceResponse;
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>

          <View style={{ backgroundColor: '#2F95D6', borderRadius: 7 }}>
            <TouchableOpacity onPress={() => {
              this.onNotificationReceive({
                imageUrl: "f08f2747-ad3f-4b24-a316-0a2a7410858b.jpg",
                location: "17.402963,78.376705"
              } as ResultModel)
            }}>
              <Text style={{ fontSize: 25, color: 'white', alignSelf: 'center' }}>{'Rescuers'}</Text>
            </TouchableOpacity>
          </View>
          {
            this.state.results.length > 0 ?
              <FlatList
                data={this.state.results}
                renderItem={({ item }) => {
                  console.log('imageURL', item.imageUrl);

                  return (<View style={styles.item}>
                    <View style={{ flexDirection: 'row', paddingVertical: 3, alignItems: 'center', paddingRight: 5 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.onRoute(item)} style={{ flexDirection: 'row' }}>
                          <Image style={{ width: 20, height: 20, resizeMode: 'contain', alignSelf: 'center' }} source={require('../images/icon_location.png')} />
                          <Text numberOfLines={2} style={styles.textStyle}>{item.location}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                      <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../images/icon_time.png')} />
                      <Text style={styles.textStyle}>{item.time}</Text>
                    </View>
                    {/* <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
                  <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../images/icon_objectType.png')} />
                  <Text style={styles.textStyle}>{item.objectType}</Text>
                </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, paddingRight: 5 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={[styles.statusIndicator, { backgroundColor: item.status == 'closed' ? 'green' : 'yellow' }]}></View>
                        <Text style={[styles.textStyle, { marginHorizontal: 15 }]}>{item.status}</Text>
                      </View>
                      <TouchableOpacity onPress={() => this.onPress(item)} style={{ alignSelf: 'center' }}>
                        <View>
                          <Image style={{ width: 20, height: 20, resizeMode: 'cover', }}
                            source={require('../images/icon_delete.png')} />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Image style={{ width: '100%', height: 200 }} resizeMode='stretch'
                      source={{ uri: item.imageUrl }} />
                  </View>)

                }}
                keyExtractor={item => item.id.toString()}
              /> :
              <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{ fontSize: 25, textAlignVertical: 'center', textAlign: 'center' }}>{'No rescues tasks assigned. You will receive notification and please stay tuned.'}</Text>
              </View>
          }

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