import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Image from 'react-native-scalable-image';
import { Icons } from '../Constants/Icon';

import { TabStyles } from '../Styles/TabStyles';
import { HomeScreenTileRow } from '../Components/HomeScreenTileRow';

export default class HomeScreen extends React.Component {
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
      <View style={TabStyles.container}>
        <Image
          width={Dimensions.get('window').width} // height will be calculated automatically
          source={require('../Media/Images/HD-Peaceful-Image.jpg')}
        />
        <View style={homeStyle.tileContainer}>
          <HomeScreenTileRow
            name1="My Stats"
            iconName1={Icons.stats + '-outline'}
            name2="Plan"
            iconName2={Icons.plan + '-outline'}
            onPress2={() => this.props.navigation.navigate('Plan')}
          />
          <HomeScreenTileRow
            name1="Diary"
            iconName1={Icons.diary + '-outline'}
            onPress1={() => this.props.navigation.navigate('Diary')}
            name2="Reports"
            iconName2={Icons.report + '-outline'}
          />
        </View>
      </View>
    );
  }
}

const homeStyle = StyleSheet.create({
  banner: {
    //justifyContent: "flex-start"
  },

  tileContainer: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    margin: 10,
  },
});
