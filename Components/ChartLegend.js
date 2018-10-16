import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

export const ChartLegend = (props) => {
  return (
    <View style={legendStyle.container}>
      {props.data.map((d, i) => (
        <LegendItem key={i.toString()} name={d.name} color={d.color} />
      ))}
    </View>
  );
};

const LegendItem = (props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={[legendStyle.point, { backgroundColor: props.color }]} />
      <Text style={{ fontSize: 13 }}>{props.name}</Text>
    </View>
  );
};

const legendStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 5,
  },

  point: {
    height: 15,
    width: 15,
    borderRadius: 15 / 2,
    marginRight: 3,
  },
});
