import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SnapSlider from 'react-native-snap-slider';

export default class FeelingRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
    };
  }

  componentDidMount() {
    this.setState({
      options: this.getSliderOptions(this.props.feeling),
    });
  }

  getSliderOptions = (feeling) => {
    let arr = [];

    for (let i = 0; i <= feeling.scale; i++) {
      arr.push({ value: i, label: i.toString() });
    }

    return arr;
  };

  slidingComplete = (itemSelected) => {
    console.log('slidingComplete');
    console.log('item selected ' + this.refs.slider.state.item);
    console.log('item selected(from callback)' + itemSelected);
    console.log('value ' + this.state.options[this.refs.slider.state.item].value);
  };

  render() {
    return (
      <View style={feelingRowStyle.viewContainer}>
        <Text style={feelingRowStyle.text}>{this.props.feeling.diaryName}</Text>
        <SnapSlider
          ref="slider"
          containerStyle={feelingRowStyle.snapsliderContainer}
          style={feelingRowStyle.snapslider}
          itemWrapperStyle={feelingRowStyle.snapsliderItemWrapper}
          itemStyle={feelingRowStyle.snapsliderItem}
          items={this.getSliderOptions(this.props.feeling)}
          labelPosition="bottom"
          defaultItem={0}
          onSlidingComplete={this.slidingComplete}
        />
      </View>
    );
  }
}

const feelingRowStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    marginLeft: 20,
    marginRight: 20,
  },
  text: {
    paddingBottom: 15,
    fontSize: 15,
  },
  snapsliderContainer: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    marginLeft: 10,
    marginRight: 10,
  },
  snapslider: {
    borderWidth: 0,
  },
  snapsliderItemWrapper: {
    borderWidth: 0,
    marginLeft: 5,
    marginRight: 5,
  },
  snapsliderItem: {
    borderWidth: 0,
  },
});
