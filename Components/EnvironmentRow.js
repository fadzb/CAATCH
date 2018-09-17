import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Dimensions, FlatList, Alert } from 'react-native';
import { Icons } from '../Constants/Icon';
import Icon from 'react-native-vector-icons/Ionicons';
import { PressableIcon } from '../Components/PressableIcon';
import Swipeable from 'react-native-swipeable';

export default class EnvironmentRow extends React.Component {
  onPressDelete = () => {
    this.props.deleteFunction();

    this.swipeable.recenter();
    // recenter swipeable once delete button is pressed
  };

  rightButtons = [
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <PressableIcon iconName={Icons.delete + '-outline'} size={35} onPressFunction={this.onPressDelete} color="red" />
    </View>,
  ];
  // delete button that appears on swipe

  render() {
    return (
      <Swipeable onRef={(ref) => (this.swipeable = ref)} rightButtons={this.rightButtons}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 18 }}>
          <View style={environmentRowStyle.circleView}>
            <Icon name={Icons.dividerArrow} size={20} />
          </View>
          <Text style={{ fontSize: 15, flex: 1 }}>{this.props.description}</Text>
        </View>
      </Swipeable>
    );
  }
}

const environmentRowStyle = StyleSheet.create({
  circleView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});
