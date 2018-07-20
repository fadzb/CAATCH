// webview screen for Safety Plan urls

import React from 'react';
import { StyleSheet, WebView } from 'react-native';

export default class PlanWebView extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('url'),
    };
  };

  render() {
    return <WebView source={{ uri: this.props.navigation.getParam('url') }} />;
  }
}
