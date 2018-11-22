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
import { Icons } from '../Constants/Icon';
import Communications from 'react-native-communications';
import openMap from 'react-native-open-maps';
import Icon from 'react-native-vector-icons/Ionicons';

import { TabStyles, themeStyles } from '../Styles/TabStyles';

const width = Dimensions.get('window').width;
const samaritansNum = '116123';

const iconSize = width / 6.5;

const CrisisTile = (props) => (
  <View style={{ height: Dimensions.get('window').height / 4.5 }}>
    <TouchableOpacity onPress={props.onPress} style={[crisisStyle.button, themeStyles.tiles]}>
      <Text style={{ fontSize: 20, paddingVertical: 7 }}>{props.buttonHeader}</Text>
      <Icon name={props.iconName} size={props.size} color={props.color} />
    </TouchableOpacity>
  </View>
);
// component for each tile on crisis screen

export default class CrisisScreen extends React.Component {
  static navigationOptions = {
    title: 'Crisis',
  };
  // static property called navigationOptions that belongs to all screen components

  goToMaps = () => {
    // Expo.Permissions.askAsync(Expo.Permissions.LOCATION)
    //     .then(res => {
    //         if(res.status !== 'granted') {
    //             console.error("Location permission not granted!");
    //
    //             openMap({zoom: 2, provider: 'google', query: 'Urgent Care'});
    //             return;
    //         }
    //
    //         Expo.Location.getCurrentPositionAsync({enableHighAccuracy: false}).then(location => openMap({
    //             latitude: location.coords.latitude, longitude: location.coords.longitude, zoom: 18, provider: 'google', query: 'Urgent Care'
    //         }));
    //     });

    openMap({ provider: 'google', query: 'Urgent Care' });
  };
  // opens google map app with 'urgent care' as search query

  render() {
    return (
      <View style={TabStyles.stackContainer}>
        <View style={crisisStyle.viewContainer}>
          <CrisisTile
            iconName={Icons.contacts + '-outline'}
            size={iconSize}
            buttonHeader={'Call Samaritans'}
            onPress={() => Communications.phonecall(samaritansNum, true)}
          />
          <CrisisTile
            iconName={Icons.location + '-outline'}
            size={iconSize}
            buttonHeader={'Find Urgent Care'}
            onPress={this.goToMaps}
          />
        </View>
      </View>
    );
  }
}

const crisisStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
    marginHorizontal: 60,
  },

  tileView: {
    alignSelf: 'stretch',
    borderRadius: 12,
    marginHorizontal: 25,
    marginBottom: 25,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    paddingVertical: 20,
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginHorizontal: 15,
  },

  button: {
    flex: 1,
    //borderWidth: 2,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'space-evenly',
  },
});
