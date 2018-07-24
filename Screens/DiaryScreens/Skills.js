import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../../Constants/Icon';
import SkillRow from '../../Components/SkillRow';

import { TabStyles } from '../../Styles/TabStyles';
import { readDatabase } from '../../Util/DatabaseHelper';

export default class Skills extends React.Component {
  static navigationOptions = {
    title: 'Skills',
  };
  // static property called navigationOptions that belongs to all screen components

  constructor(props) {
    super(props);

    this.state = {
      skills: [],
    };
  }

  componentDidMount() {
    readDatabase('*', 'Skill', this.getSkills);
  }

  getSkills = (skills) => {
    this.setState({ skills: skills });
  };

  renderItem = ({ item }) => (
    <View style={skillStyle.listContainer}>
      <SkillRow name={item.skillName} />
    </View>
  );

  render() {
    return (
      <View style={skillStyle.viewContainer}>
        <FlatList
          data={this.state.skills} // comes from mapStateToProps below
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const skillStyle = StyleSheet.create({
  listContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },

  viewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
