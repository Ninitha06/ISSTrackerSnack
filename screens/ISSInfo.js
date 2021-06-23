import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';

import axios from 'axios';

export default class ISSInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      locationData: {},
    };
  }

  getISSInfo = () => {
    axios
      .get('https://api.wheretheiss.at/v1/satellites/25544')
      .then((response) => {
        console.log(response.data);
        this.setState({ locationData: response.data });
      });
  };

  componentDidMount() {
    this.getISSInfo();
    try {
      setInterval(() => {
        this.getISSInfo();
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    if (Object.keys(this.state.locationData).length === 0) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <View style = {styles.cardContainer}>
          <Text style={styles.text}>Latitute : {this.state.locationData.latitude}</Text>
          <Text style={styles.text}>Longitude : {this.state.locationData.longitude}</Text>
          <Text style={styles.text}>Altitude(KM) : {this.state.locationData.altitude}</Text>
          <Text style={styles.text}>Velocity(KM/HR) : {this.state.locationData.velocity}</Text>
        </View>
      );
    }
  }
}


const styles = StyleSheet.create({
  cardContainer : {
    flex : 0.2,
    padding : 30,
    backgroundColor : 'white',
    borderTopRightRadius : 30,
    borderTopLeftRadius : 30,
    marginTop : -10
  },
  text : {
    fontSize : 15,
    fontWeight :  'bold',
  }
});
