import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Slider from 'react-native-slider';
import store from '../Redux/store';
import { updateFeelingRating } from '../Redux/actions';

export default class FeelingRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      value: 0,
      width: 0,
      scale: 0,
    };
  }

  componentDidMount() {
    this.setState({
      options: this.getSliderOptions(this.props.feeling),
      scale: this.props.feeling.scale,
    });
  }

  getSliderOptions = (feeling) => {
    let arr = [];

    for (let i = 0; i <= feeling.scale; i++) {
      arr.push({ value: i, label: i.toString() });
    }

    return arr;
  };
  //create array of objects for each rating in feeling

  tapSliderHandler = (evt) => {
    const pressPosition = evt.nativeEvent.locationX;

    this.setState({ value: Math.round(((pressPosition - sliderMargin) / this.state.width) * this.state.scale) }, () =>
      store.dispatch(updateFeelingRating({ id: this.props.feeling.diaryId, rating: this.state.value }))
    );
  };
  //enable pressing on slider. Taking 10 from pixel position as that is length of border. Pass rating to global redux store on callback

  valueChangeHandler = (val) => {
    this.setState({ value: val });

    store.dispatch(updateFeelingRating({ id: this.props.feeling.diaryId, rating: val }));
  };

  onLayout = (e) => {
    this.setState({
      width: e.nativeEvent.layout.width,
    });
  };
  //retrieves width of view containing slider component

  render() {
    return (
      <View style={feelingRowStyle.viewContainer}>
        <Text style={feelingRowStyle.text}>{this.props.feeling.diaryName}</Text>
        <View onLayout={this.onLayout} ref="slider">
          <TouchableWithoutFeedback onPressIn={this.tapSliderHandler}>
            <Slider
              minimumValue={0}
              maximumValue={this.props.feeling.scale}
              step={1}
              value={this.state.value}
              onValueChange={this.valueChangeHandler}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {this.state.options.map((m, i) => (
            <View style={{ height: 20, width: 20, alignItems: 'center' }} key={i.toString()}>
              <Text style={{ fontSize: 15 }}>{i.toString()}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const sliderMargin = 10;

const feelingRowStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    marginLeft: sliderMargin,
    marginRight: sliderMargin,
  },
  text: {
    paddingBottom: 15,
    fontSize: 15,
  },
});
