// alternative home screen with background image covering whole screen

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableHighlight,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Image from 'react-native-scalable-image';
import { Icons } from '../Constants/Icon';
import { Constants } from 'expo';

import { TabStyles } from '../Styles/TabStyles';
import { HomeScreenTileRow } from '../Components/HomeScreenTileRow';

export default class HomeScreenv2 extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Ionicons
        name={Icons.home + `${focused ? '' : '-outline'}`}
        // if icon is not pressed use outline
        size={25}
        color={tintColor}
      />
    ),
  };
  // static property called navigationOptions that belongs to all screen components

  render() {
    return (
      <View style={homeStyle.container}>
        <ImageBackground
          resizeMode={'cover'}
          style={{ flex: 1, justifyContent: 'flex-end' }}
          source={require('../Media/Images/HD-Peaceful-Image.jpg')}
        >
          <View style={homeStyle.tileContainer}>
            <HomeScreenTileRow
              name1="My Stats"
              iconName1={Icons.stats + '-outline'}
              name2="Reports"
              iconName2={Icons.report + '-outline'}
              third={true}
              name3="My Stats"
              iconName3={Icons.stats + '-outline'}
            />
            <HomeScreenTileRow
              name1="Diary"
              iconName1={Icons.diary + '-outline'}
              onPress1={() => this.props.navigation.navigate('Diary')}
              name2="Plan"
              iconName2={Icons.plan + '-outline'}
              onPress2={() => this.props.navigation.navigate('Plan')}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const homeStyle = StyleSheet.create({
  tileContainer: {
    height: Dimensions.get('window').height / 2,
    flexDirection: 'column',
    alignSelf: 'stretch',
    margin: 10,
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Constants.statusBarHeight,
  },
});
