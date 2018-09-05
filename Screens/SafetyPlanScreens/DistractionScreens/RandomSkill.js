import React from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { safetyPlanPrePops } from '../../../Constants/Prepopulated';
import { TabStyles } from '../../../Styles/TabStyles';
import { SafetyPlanConstants } from '../../../Constants/Constants';

export default class RandomSkill extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Random Skill',
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      skills: [],
      text: '',
      unseenSkills: [],
    };
  }

  componentDidMount() {
    this.updateSkills(safetyPlanPrePops);
  }

  updateSkills = (skills) => {
    this.setState(
      { skills: skills.filter((item) => item.category === SafetyPlanConstants.randomSkill).map((skill) => skill.name) },
      () => {
        this.setState({ unseenSkills: [...this.state.skills] }, this.populateText);
      }
    );
  };
  // update checklist with random skills from pre-populated array

  populateText = () => {
    const maxIndex = this.state.unseenSkills.length - 1;

    if (maxIndex !== 0) {
      const randIndex = Math.round(Math.random() * maxIndex);

      this.setState({ text: this.state.unseenSkills[randIndex] }, () =>
        this.setState((prevState) => ({ unseenSkills: prevState.unseenSkills.filter((sk, i) => i !== randIndex) }))
      );
    } else {
      this.setState({ text: this.state.unseenSkills[0] }, () =>
        this.setState({ unseenSkills: [...this.state.skills] })
      );
    }
  };
  // remove skill at random index from unseenSkills array for next button press. When unseen array is empty re-populate with elements from skills array

  render() {
    return (
      <View style={TabStyles.stackContainer}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TouchableOpacity style={randomSkillStyle.button} onPress={this.populateText}>
            <Text style={randomSkillStyle.skillText}>{this.state.text}</Text>
          </TouchableOpacity>
        </View>
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
