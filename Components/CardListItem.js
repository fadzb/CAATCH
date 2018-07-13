import React from 'react';
import { View } from 'react-native';
import { CardItem, Text, Icon, Right } from 'native-base';
import PropTypes from 'prop-types';

export const CardListItem = (props) => {
  return (
    <View style={props.containerStyle}>
      <CardItem button onPress={props.onPress}>
        <Icon active name="ios-warning-outline" />
        <Text>{props.name}</Text>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </CardItem>
    </View>
  );
};

CardListItem.propTypes = {
  name: PropTypes.string,
  onPress: PropTypes.func,
};
