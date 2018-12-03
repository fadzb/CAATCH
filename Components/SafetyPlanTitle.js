import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { Icons } from '../Constants/Icon';
import Icon from 'react-native-vector-icons/Ionicons';

export const SafetyPlanTitle = (props) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text
      style={{
        fontSize: Platform.OS === 'ios' ? 17 : 20,
        color: 'white',
        fontWeight: Platform.OS === 'ios' ? '600' : '500',
        paddingRight: 5,
      }}
    >
      {props.title}
    </Text>
    <Icon name={Icons.info} size={25} color={'white'} onPress={props.onPress} />
  </View>
);
