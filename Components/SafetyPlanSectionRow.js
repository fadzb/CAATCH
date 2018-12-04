import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Thumbnail } from 'native-base';
import PropTypes from 'prop-types';
import Swipeable from 'react-native-swipeable';
import { Icons } from '../Constants/Icon';
import Icon from 'react-native-vector-icons/Ionicons';
import { VideoThumbnail } from './VideoThumbnail';

import { PressableIcon } from './PressableIcon';
import { AppColors } from '../Styles/TabStyles';

// Component used for rows in the various SP section lists. Can display a thumbnail, icon or circleView(See contacts)

export class SafetyPlanSectionRow extends React.Component {
  onPressDelete = () => {
    this.props.deleteFunction();

    this.swipeable.recenter();
    // recenter swipeable once delete button is pressed
  };

  onPressEdit = () => {
    this.props.editFunction();

    this.swipeable.recenter();
    // recenter swipeable once delete button is pressed
  };

  rightButtons = [
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <PressableIcon
        iconName={Icons.edit + '-outline'}
        size={40}
        onPressFunction={this.onPressEdit}
        color={AppColors.blue}
      />
    </View>,

    <View style={{ flex: 1, justifyContent: 'center' }}>
      <PressableIcon iconName={Icons.delete + '-outline'} size={40} onPressFunction={this.onPressDelete} color="red" />
    </View>,
  ];
  // delete button that appears on swipe

  render() {
    return (
      <Swipeable onRef={(ref) => (this.swipeable = ref)} rightButtons={this.rightButtons}>
        <View style={sectionRowStyle.container}>
          <TouchableHighlight underlayColor="#FDEDEC" style={sectionRowStyle.button} onPress={this.props.onPress}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              {this.props.thumbnail !== undefined && <Thumbnail source={this.props.thumbnail} />}
              {this.props.videoThumbnail !== undefined && (
                <VideoThumbnail
                  source={this.props.videoThumbnail}
                  containerStyle={sectionRowStyle.videoThumbnailView}
                  videoDisplayStyle={sectionRowStyle.videoDisplay}
                />
              )}
              {this.props.icon !== undefined && (
                <View style={sectionRowStyle.iconContainer}>
                  <Icon name={this.props.icon} size={56} color={AppColors.orange} />
                </View>
              )}
              {this.props.circleView !== undefined && (
                <View style={sectionRowStyle.circleView}>
                  <Text style={{ fontSize: 20, color: AppColors.orange }}>{this.props.circleView}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text numberOfLines={2} ellipsizeMode={'tail'} style={sectionRowStyle.buttonText}>
                  {this.props.name}
                </Text>
              </View>
              {this.props.rightIcon === 1 && (
                <View>
                  <Icon name={this.props.rightIconName} size={25} color={this.props.rightIconColor} />
                </View>
              )}
            </View>
          </TouchableHighlight>
        </View>
      </Swipeable>
    );
  }
}

SafetyPlanSectionRow.propTypes = {
  name: PropTypes.string,
  deleteFunction: PropTypes.func,
};
// Defining prop types for this component

const sectionRowStyle = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: AppColors.orange,
    marginLeft: 30,
    marginRight: 30,
    paddingTop: 12,
    paddingBottom: 12,
  },

  container: {
    flex: 1,
    //height: 80,
  },
  // need to wrap button in View in order to stretch to full width of screen using flexDirection

  buttonText: {
    fontSize: 18,
    paddingLeft: 20,
    color: AppColors.blue,
  },

  circleView: {
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: AppColors.orange,
  },

  videoThumbnailView: {
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: AppColors.orange,
  },

  videoDisplay: {
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
  },

  iconContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
