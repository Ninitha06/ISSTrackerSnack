import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageBackground,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';

import axios from 'axios';

export default class UpdatesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      blogs: [],
      reports: [],
    };
  }

  getArticles = () => {
    axios
      .get('https://spaceflightnewsapi.net/api/v2/reports')
      .then((response) => {
        this.setState({
          articles: response.data,
        });

        this.getReports();
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  componentDidMount() {
    this.getArticles();
  }

  getReports = () => {
    axios
      .get('https://spaceflightnewsapi.net/api/v2/reports')
      .then((response) => {
        this.setState({
          reports: response.data,
        });
        this.getBlogs();
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  getBlogs = () => {
    axios
      .get('https://spaceflightnewsapi.net/api/v2/blogs')
      .then((response) => {
        this.setState({
          blogs: response.data,
        });
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  addFlag = (arr, value) => {
    for (var i = 0; i < arr.length; i++) {
      arr[i].type = value;
    }
    return arr;
  };

  renderItem = ({ item }) => {
    let size = 100;
    let url;
    if (item.type == 'Reports') {
      url = require('../images/iss_icon.png');
    } else {
      url = require('../images/blog_icon.png');
    }
    if (item.type == 'Article') {
      //imageUrl is new field in v2 instead of featured_image in v1
      return (
        <TouchableOpacity
          style={styles.listContainer}
          onPress={() =>
            Linking.openURL(item.url).catch((error) =>
              console.log('Couldnt load page ' + error)
            )
          }>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.iconContainer}>
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: size, height: size }}
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.listContainer}
          onPress={() =>
            Linking.openURL(item.url).catch((err) =>
              console.error("Couldn't load page", err)
            )
          }>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.iconContainer}>
            <Image source={url} style={{ width: size, height: size }}></Image>
          </View>
        </TouchableOpacity>
      );
    }
  };

  render() {
    let articles = this.addFlag(this.state.articles, 'Article');
    let blogs = this.addFlag(this.state.blogs, 'Blogs');
    let reports = this.addFlag(this.state.reports, 'Reports');

   

    let events = articles.concat(blogs).concat(reports);
    //publishedAt is new field in v2 instead of published_date in v1
    events = events.sort(function (a, b) {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });
    if (events.length === 0) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 30 }}>Loading...</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea}>
            <ImageBackground
              source={require('../images/bg.png')}
              style={styles.bgImage}>
              <View style={styles.titleBar}>
                <Text style={styles.titleText}>Updates</Text>
              </View>
              <View>
                <FlatList
                  data={events}
                  keyExtractor={(index, item) => index.toString()}
                  renderItem={this.renderItem}
                />
              </View>
            </ImageBackground>
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
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
  },
  bgImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  titleBar: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
  },
  listContainer: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    borderRadius: 10,
    padding: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
