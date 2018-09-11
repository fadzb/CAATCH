import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, WebView, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../Constants/Icon';
import { PressableIcon } from '../Components/PressableIcon';
import Image from 'react-native-scalable-image';
import Communications from 'react-native-communications';

import { TabStyles } from '../Styles/TabStyles';

const width = Dimensions.get('window').width;
const samaritansNum = '116123';

export default class CrisisScreen extends React.Component {
  static navigationOptions = {
    title: 'Crisis',
  };
  // static property called navigationOptions that belongs to all screen components

  render() {
    return (
      <View style={TabStyles.stackContainer}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Image source={require('../Media/Images/samaritans.jpg')} width={width} />
          <View style={crisisStyle.rowContainer}>
            <PressableIcon
              iconName={Icons.contacts + '-outline'}
              size={width / 3}
              onPressFunction={() => Communications.phonecall(samaritansNum, true)}
              buttonStyle={crisisStyle.buttons}
            />
            <PressableIcon
              iconName={Icons.message + '-outline'}
              size={width / 3}
              onPressFunction={() => Communications.text(samaritansNum, '')}
              buttonStyle={crisisStyle.buttons}
            />
          </View>
        </View>
      </View>
    );
  }
}

const crisisStyle = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-evenly',
  },

  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
});
