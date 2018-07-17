import React from 'react';
import { View } from 'react-native';
import { CardItem, Text, Icon, Right } from 'native-base';
import PropTypes from 'prop-types';

export const CardListItem = (props) => {
  return (
    <View style={props.containerStyle}>
      <CardItem button onPress={props.onPress}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Icon active name={props.iconName} />
          <Text>{props.name}</Text>
          <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', paddingRight: 10 }}>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </View>
        </View>
      </CardItem>
    </View>
  );
};

CardListItem.propTypes = {
  name: PropTypes.string,
  onPress: PropTypes.func,
};
