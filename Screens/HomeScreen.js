import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight, Dimensions, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../Constants/Icon';

import { TabStyles } from '../Styles/TabStyles';
import { HomeScreenTileRow } from '../Components/HomeScreenTileRow';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
    headerTitle: 'Home',
  };
  // static property called navigationOptions that belongs to all screen components

  render() {
    return (
      <View style={TabStyles.container}>
        <Image
          resizeMode={'cover'}
          style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height / 3 }}
          source={require('../Media/Images/HD-Peaceful-Image.jpg')}
        />
        <View style={homeStyle.tileContainer}>
          <HomeScreenTileRow
            name1="My Stats"
            iconName1={Icons.stats + '-outline'}
            onPress1={() => this.props.navigation.navigate('chart')}
            name2="Schedule"
            iconName2={Icons.calendar + '-outline'}
            onPress2={() => this.props.navigation.navigate('schedule')}
            third={true}
            name3="Reports"
            iconName3={Icons.report + '-outline'}
          />
          <HomeScreenTileRow
            name2="Diary"
            iconName2={Icons.diary + '-outline'}
            onPress2={() => this.props.navigation.navigate('Diary')}
            name1="Plan"
            iconName1={Icons.plan + '-outline'}
            onPress1={() => this.props.navigation.navigate('Plan')}
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
