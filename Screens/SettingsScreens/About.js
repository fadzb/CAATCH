import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Button,
  TextInput,
  WebView,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
  Linking,
} from 'react-native';
import { Icons } from '../../Constants/Icon';
import { AppColors, TabStyles } from '../../Styles/TabStyles';

const infoVideoUrl = 'https://www.youtube.com';
// to be updated when info video is recorded

const connectingForLifeUrl =
  'https://www.hse.ie/eng/services/list/4/mental-health-services/connecting-for-life/strategy-implementation/local-action-plans/connectgalwaymayoroscommon.html';

export default class About extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'About',
    };
  };
  // static property called navigationOptions that belongs to all screen components

  render() {
    return (
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <View style={{ overflow: 'hidden', borderRadius: 10, marginVertical: 20, alignItems: 'center' }}>
          <Image
            source={require('../../Media/Images/SafePlanLogoWithoutBackground.png')}
            style={{ width: 80, height: 80 }}
          />
          <Text style={aboutStyle.logoText}>
            Safe<Text style={{ color: AppColors.orange }}>Plan</Text>
          </Text>
        </View>
        <View style={aboutStyle.textContainer}>
          <Text style={{ paddingVertical: 20, fontSize: 16, color: AppColors.blue }}>
            SafePlan was developed in conjunction with the HSE's{' '}
            <Text
              style={aboutStyle.urlText}
              onPress={() => Linking.openURL(connectingForLifeUrl).catch((err) => console.log(err))}
            >
              Connecting for Life
            </Text>{' '}
            programme.
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
              {'School of Computer Science, NUI Galway\nSchool of Psychology, NUI Galway'}
            </Text>
          </View>
          <View style={aboutStyle.paraContainer}>
            <Text style={aboutStyle.headText}>Information Video</Text>
            <Text
              style={aboutStyle.urlText}
              onPress={() => Linking.openURL(infoVideoUrl).catch((err) => console.log(err))}
            >
              www.youtube.com
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const aboutStyle = StyleSheet.create({
  textContainer: {
    alignSelf: 'flex-start',
    marginHorizontal: 20,
  },

  paraContainer: {
    marginVertical: 20,
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

  logoText: {
    fontSize: 22,
    fontFamily: 'EncodeSansExpanded_medium',
    paddingTop: 10,
    color: AppColors.blue,
  },

  urlText: {
    textDecorationLine: 'underline',
    color: AppColors.orange,
    fontSize: 16,
  },
});
