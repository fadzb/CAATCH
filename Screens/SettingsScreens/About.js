import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  WebView,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Icons } from '../../Constants/Icon';
import { AppColors, TabStyles } from '../../Styles/TabStyles';

export default class About extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'About',
    };
  };
  // static property called navigationOptions that belongs to all screen components

  render() {
    return (
      <View style={TabStyles.stackContainer}>
        <Text>test</Text>
      </View>
    );
  }
}

const aboutStyle = StyleSheet.create({});
