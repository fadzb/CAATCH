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
  Image,
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
        <View style={{ overflow: 'hidden', borderRadius: 10, marginVertical: 20 }}>
          <Image source={require('../../Media/Images/SafePlanLogo.png')} style={{ width: 80, height: 80 }} />
        </View>
        <View style={aboutStyle.textContainer}>
          <Text style={{ paddingVertical: 20, fontSize: 16, color: AppColors.blue }}>
            SafePlan was developed in conjunction with the HSE's "Connecting for Life" programme.
          </Text>
          <View style={aboutStyle.paraContainer}>
            <Text style={aboutStyle.headText}>Developer</Text>
            <Text style={aboutStyle.paraText}>Conor O'Grady</Text>
          </View>
          <View style={aboutStyle.paraContainer}>
            <Text style={aboutStyle.headText}>Design Team</Text>
            <Text style={aboutStyle.paraText}>
              Dr. Jim Duggan, Karen Young, Dr. Ruth Melia, Dr. John Bogue, Mary O'Sullivan
            </Text>
          </View>
          <View style={aboutStyle.paraContainer}>
            <Text style={aboutStyle.paraText}>
              {'NUI Galway School of Computer Science\nNUI Galway School of Psychology'}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const aboutStyle = StyleSheet.create({
  textContainer: {
    alignSelf: 'flex-start',
    marginHorizontal: 20,
  },

  paraContainer: {
    marginVertical: 15,
  },

  headText: {
    color: AppColors.grey,
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
    fontSize: 16,
    paddingBottom: 5,
  },

  paraText: {
    color: AppColors.blue,
    fontSize: 16,
  },
});
