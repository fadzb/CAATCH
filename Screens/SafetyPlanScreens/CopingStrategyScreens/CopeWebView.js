// webview screen for coping strategy urls

import React from 'react';
import { StyleSheet, WebView } from 'react-native';

export default class CopeWebView extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('url'),
    };
  };

  render() {
    return <WebView source={{ uri: this.props.navigation.getParam('url') }} />;
  }
}
