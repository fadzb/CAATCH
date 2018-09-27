import React from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Button } from 'react-native';
import { safetyPlanPrePops } from '../../../Constants/Prepopulated';
import { TabStyles } from '../../../Styles/TabStyles';
import { SafetyPlanConstants } from '../../../Constants/Constants';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Ionicons';

export default class RandomSkill extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Distraction',
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      skills: [],
      text: {},
      randomSkills: [],
    };
  }

  componentDidMount() {
    this.updateSkills(safetyPlanPrePops);
  }

  updateSkills = (skills) => {
    this.setState({ skills: skills.filter((item) => item.category === SafetyPlanConstants.randomSkill) }, () => {
      this.setState({ randomSkills: [...this.state.skills].sort(() => 0.5 - Math.random()) });
    });
  };
  // update checklist with random skills from pre-populated array. Sort array in random order and set as randomSkills state

  renderItem = ({ item, index }) => (
    <View
      style={{
        flex: 1,
        borderWidth: 2,
        borderRadius: 10,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginVertical: 70,
        paddingVertical: 20,
      }}
    >
      <Icon name={item.icon} size={80} />
      <Text style={{ paddingHorizontal: 25, fontSize: 18, textAlign: 'center' }}>{item.name}</Text>
    </View>
  );

  render() {
    return (
      <View style={TabStyles.stackContainer}>
        <Carousel
          //ref={'carousel'}
          data={this.state.randomSkills}
          renderItem={this.renderItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width * 0.7}
          removeClippedSubviews={false}
        />
      </View>
    );
  }
}

const randomSkillStyle = StyleSheet.create({
  iconContainer: {
    width: Dimensions.get('window').height / 20,
    height: Dimensions.get('window').height / 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  skillText: {
    fontSize: 22,
  },

  button: {
    padding: 100,
    marginRight: 10,
    marginLeft: 10,
  },
});
