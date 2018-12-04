import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import store from '../Redux/store';
import { updateSleepRating, updateMoodRating } from '../Redux/actions';
import { AppColors } from '../Styles/TabStyles';

const ratings = [
  { name: 'Awful', icon: 'emoticon-sad' },
  { name: 'Not good', icon: 'emoticon-neutral' },
  { name: 'Okay', icon: 'emoticon-happy' },
  { name: 'Really good', icon: 'emoticon' },
  { name: 'Fantastic', icon: 'emoticon-excited' },
];

export default class ButtonRating extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pressedIndex: 2,
    };
  }

  handlePress = (index) => {
    this.setState({ pressedIndex: index });

    if (this.props.title === 'Sleep Scale') {
      store.dispatch(updateSleepRating(index + 1));
    } else if (this.props.title === 'Mood Scale') {
      store.dispatch(updateMoodRating(index + 1));
    }
  };

  render() {
    return (
      <View style={{ marginBottom: 15, marginLeft: 15, marginRight: 15 }}>
        <Text style={buttonRatingStyle.headText}>{this.props.title}</Text>
        <View style={buttonRatingStyle.container}>
          {ratings.map((item, i) => (
            <View style={{ alignItems: 'center' }} key={i.toString()}>
              <Icon
                name={item.icon}
                type={'material-community'}
                color={this.state.pressedIndex === i ? AppColors.orange : '#B3B3B3'}
                size={Dimensions.get('window').width / 6}
                onPress={() => this.handlePress(i)}
              />
              {/*<Text style={{fontSize: 15}} >{item.name}</Text>*/}
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const buttonRatingStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
    color: AppColors.grey,
  },
});
