import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, WebView, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EmbeddedTweet from '../Components/TwitterTimeline';

import { styles } from '../Styles/TabStyles';

export default class TwitterScreen extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => <Ionicons name={`logo-twitter`} size={25} color={tintColor} />,
  };
  // static property called navigationOptions that belongs to all screen components

  render() {
    return (
      <View style={styles.container}>
        <EmbeddedTweet url="https://twitter.com/AppCaatch/lists/CAATCH" style={NewsStyle.webview}></EmbeddedTweet>
      </View>
    );
  }
}

const NewsStyle = StyleSheet.create({
  webview: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});
