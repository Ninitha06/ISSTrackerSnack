import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';

import axios from 'axios';

import MapView, { Marker } from 'react-native-maps';

import ISSInfo from './ISSInfo';

export default class ISSlocationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationData: {},
    };
  }

  getISSLocation = () => {
    axios
      .get('https://api.wheretheiss.at/v1/satellites/25544')
      .then((response) => {
        this.setState({ locationData: response.data });
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  componentDidMount() {
    this.getISSLocation();
  }
  render() {
    if (Object.keys(this.state.locationData).length === 0) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Text style={{ color: 'black', fontSize: 30 }}>Loading... </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <ImageBackground
            source={require('../images/bg.png')}
            style={styles.bgImage}>
            <View style={styles.titleBar}>
              <Text style={styles.titleText}>ISS Location</Text>
            </View>
            <View style={styles.refreshContainer}>
              <TouchableOpacity 
              style={{ width: '100%', height: "100%",marginLeft : 150}}
                onPress={() => this.getISSLocation()}>
                <Image source={require('../images/refresh_icon.png')} style={{height : 50, width : 50}}/>
              </TouchableOpacity>
            </View>
            <View style={styles.mapContainer}>
              <MapView
                region={{
                  latitude: this.state.locationData.latitude,
                  longitude: this.state.locationData.longitude,
                  latitudeDelta: 100,
                  longitudeDelta: 100,
                }}
                style={styles.map}
              />
              <Marker
                coordinate={{
                  latitude: this.state.locationData.latitude,
                  longitude: this.state.locationData.longitude,
                }}>
                <Image
                  source={require('../images/iss_icon.png')}
                  style={{ height: 50, width: 50 }}
                />
              </Marker>
            </View>
            <ISSInfo />
          </ImageBackground>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  droidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  bgImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  titleBar: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapContainer: {
    flex: 0.6,
  },
  refreshContainer : {
    flex : 0.15,
    justifyContent : 'center',
    alignItems : 'center'
  }
});
