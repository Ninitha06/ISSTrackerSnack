import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
  Image,
  ImageBackground
} from 'react-native';

import axios from 'axios';

export default class MeteorScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meteors: [],
    };
  }

  keyExtractor = (item, index) => {
    index.toString();
  };

  getMeteors = () => {
    axios
      .get(
        'https://api.nasa.gov/neo/rest/v1/feed?api_key=cLyvDnQL6WG4EzQmdUKi4ONmfOYQ9kVrlzjcNKyT'
      )
      .then((response) => {
        this.setState({ meteors: response.data.near_earth_objects });
      })
      .catch((error) => Alert.alert(error.message));
  };

  componentDidMount() {
    this.getMeteors();
  }

  renderItem = ({ item }) => {
    let meteor = item;
    let bgImg, speed, size;
    if (meteor.threat_score <= 30) {
      bgImg = require('../images/meteor_bg1.png');
      speed = require('../images/meteor_speed1.gif');
      size = 100;
    } else if (meteor.threat_score <= 75) {
      bgImg = require('../images/meteor_bg2.png');
      speed = require('../images/meteor_speed2.gif');
      size = 150;
    } else {
      bgImg = require('../images/meteor_bg3.png');
      speed = require('../images/meteor_speed3.gif');
      size = 200;
    }

    console.log(Dimensions.get("window").width)
    
    console.log(Dimensions.get("window").height)

    return (
      <View>
        <ImageBackground source={bgImg} style={styles.bgImage} >
          <View style={styles.gifContainer}>
            <Image
              source={speed}
              style={{ width: size, height: size, alignSelf: 'center' }}
            />
            <View>
              <Text style={[styles.cardTitle,{marginTop : 340, textAlign : 'center'}]}>{item.name}</Text>
              <Text style={[styles.cardText,{marginTop : 20, marginLeft : 50}]}>
                Closest to Earth :{' '}
                {item.close_approach_data[0].close_approach_date_full}
              </Text>
              <Text style={[styles.cardText,{marginTop : 5, marginLeft : 50}]}>
                Minimum Diameter :{' '}
                {item.estimated_diameter.kilometers.estimated_diameter_min}
              </Text>
              <Text style={[styles.cardText,{marginTop : 5, marginLeft : 50}]}>
                Maximum Diameter :{' '}
                {item.estimated_diameter.kilometers.estimated_diameter_max}
              </Text>
              <Text style={[styles.cardText,{marginTop : 5, marginLeft : 50}]}>
                Velocity (KM/H) :{' '}
                {
                  item.close_approach_data[0].relative_velocity
                    .kilometers_per_hour
                }
              </Text>
              <Text style={[styles.cardText,{marginTop : 5, marginLeft : 50}]}>
                Missing Earth By :{' '}
                {item.close_approach_data[0].miss_distance.kilometers}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  render() {
    if (Object.keys(this.state.meteors).length === 0) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Text style={{ fontSize: 30 }}>Loading... </Text>
        </View>
      );
    } else {
      let meteor_arr = Object.keys(this.state.meteors).map((meteor_date) => {
        return this.state.meteors[meteor_date];
      });

      let meteors = [].concat.apply([], meteor_arr);
      // console.log(meteors)
      // console.log(meteors[0].links)

      meteors.forEach(function (element) {
        let diameter =
          (element.estimated_diameter.kilometers.estimated_diameter_min +
            element.estimated_diameter.kilometers.estimated_diameter_max) /
          2;
        let threatScore =
          (diameter / element.close_approach_data[0].miss_distance.kilometers) *
          1000000000;

        //console.log(diameter / element.close_approach_data[0].miss_distance.kilometers);
        element.threat_score = threatScore;
      });

      meteors.sort(function (a, b) {
        return b.threat_score - a.threat_score;
      });

      meteors = meteors.slice(0, 5);

      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea}>
            <FlatList
              data={meteors}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              horizontal={true}
            />
          </SafeAreaView>
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
  bgImage : {
    resizeMode : 'cover',
    width : Dimensions.get("window").width,
    height : Dimensions.get("window").height
  },
  gifContainer : {
    justifyContent : 'center',
    alignItems : 'center',
    flex : 1
  },
  cardTitle : {
    fontSize : 20,
    marginBottom : 10,
    color : 'white',
    fontWeight : 'bold'
  },
  cardText : {
    color : 'white'
  }
});
