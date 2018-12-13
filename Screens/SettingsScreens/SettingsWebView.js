// webview screen for Settings urls

import React from 'react';
import { StyleSheet, WebView } from 'react-native';

export default class SettingsWebView extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('url'),
        }
    };

    render() {
        return(
            <WebView
                source={{uri: this.props.navigation.getParam('url')}}
            />
        )
    }
}
